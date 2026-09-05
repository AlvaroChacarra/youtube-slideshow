export type IllustrativeBondPoint = Readonly<{
  id: string;
  maturityYears: number;
  ytm: number;
  benchmark: boolean;
  illustrative: true;
  segment: "short" | "long";
}>;

export type ObservedYtmCurve = Readonly<{
  kind: "illustrative-ytm-curve";
  points: readonly Readonly<{ maturityYears: number; ytm: number }>[];
  illustrative: true;
}>;

function mulberry32(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BENCHMARKS = [2, 3, 5, 7, 10, 15, 30, 50] as const;

export function generateIllustrativeBondCloud(input: { seed: number; count?: 30 }): readonly IllustrativeBondPoint[] {
  const count = input.count ?? 30;
  if (count !== 30) throw new RangeError("V1 cloud uses exactly 30 observations");
  const random = mulberry32(input.seed);
  const buckets = [
    { count: 20, min: 0.25, max: 10 },
    { count: 5, min: 10.1, max: 20 },
    { count: 3, min: 20.1, max: 35 },
    { count: 2, min: 35.1, max: 50 }
  ];
  const maturities = buckets.flatMap((bucket) => Array.from({ length: bucket.count }, () => bucket.min + random() * (bucket.max - bucket.min)));
  // Keep the eight labelled benchmark maturities inside the 30 observations.
  // They are illustrative contracts, not extra points sampled from the fitted line.
  [0,1,2,3,4,20,25,29].forEach((index,i)=>{maturities[index]=BENCHMARKS[i]!;});
  const points = maturities.map((maturityYears, index) => {
    const baseline = 0.021 + 0.017 * (1 - Math.exp(-maturityYears / 5)) + 0.0015 * Math.sin(maturityYears / 4);
    const noise = (random() - 0.5) * (maturityYears < 10 ? 0.006 : 0.003);
    return {
      id: `ILL-${String(index + 1).padStart(2, "0")}`,
      maturityYears,
      ytm: Math.max(0.005, baseline + noise),
      benchmark: BENCHMARKS.some((value) => value === maturityYears),
      illustrative: true as const,
      segment: maturityYears <= 2 ? "short" as const : "long" as const
    };
  });
  return Object.freeze(points.sort((a, b) => a.maturityYears - b.maturityYears));
}

function solveLinear(matrix: number[][], vector: number[]): number[] {
  const size = vector.length;
  const augmented = matrix.map((row, index) => [...row, vector[index] ?? 0]);
  for (let column = 0; column < size; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < size; row += 1) if (Math.abs(augmented[row]?.[column] ?? 0) > Math.abs(augmented[pivot]?.[column] ?? 0)) pivot = row;
    [augmented[column], augmented[pivot]] = [augmented[pivot]!, augmented[column]!];
    const divisor = augmented[column]?.[column] ?? 0;
    if (Math.abs(divisor) < 1e-14) throw new RangeError("curve fit is singular");
    for (let j = column; j <= size; j += 1) augmented[column]![j] = (augmented[column]?.[j] ?? 0) / divisor;
    for (let row = 0; row < size; row += 1) {
      if (row === column) continue;
      const factor = augmented[row]?.[column] ?? 0;
      for (let j = column; j <= size; j += 1) augmented[row]![j] = (augmented[row]?.[j] ?? 0) - factor * (augmented[column]?.[j] ?? 0);
    }
  }
  return augmented.map((row) => row[size] ?? 0);
}

export function fitIllustrativeCurve(input: { points: readonly IllustrativeBondPoint[]; sampleCount?: number; smoothingPenalty?: number }): ObservedYtmCurve {
  if (input.points.length < 4) throw new RangeError("at least four observations are required");
  const lambda = input.smoothingPenalty ?? 1e-8;
  const order = 3;
  const matrix = Array.from({ length: order }, () => Array(order).fill(0) as number[]);
  const vector = Array(order).fill(0) as number[];
  for (const point of input.points) {
    const x = point.maturityYears / 50;
    // A level, decaying short-end component and gentle long-end slope avoid
    // the unstable end behaviour of an unconstrained cubic on sparse tenors.
    const basis = [1, Math.exp(-10*x), x];
    for (let row = 0; row < order; row += 1) {
      vector[row] = (vector[row] ?? 0) + (basis[row] ?? 0) * point.ytm;
      for (let column = 0; column < order; column += 1) matrix[row]![column] = (matrix[row]?.[column] ?? 0) + (basis[row] ?? 0) * (basis[column] ?? 0);
      matrix[row]![row] = (matrix[row]?.[row] ?? 0) + lambda;
    }
  }
  const coefficients = solveLinear(matrix, vector);
  const sampleCount = input.sampleCount ?? 101;
  const points = Array.from({ length: sampleCount }, (_, index) => {
    const maturityYears = (50 * index) / (sampleCount - 1);
    const x = maturityYears / 50;
    const basis = [1, Math.exp(-10*x), x];
    const ytm = coefficients.reduce((sum, coefficient, i) => sum + coefficient * basis[i]!, 0);
    return Object.freeze({ maturityYears, ytm });
  });
  return Object.freeze({ kind: "illustrative-ytm-curve", points: Object.freeze(points), illustrative: true });
}
