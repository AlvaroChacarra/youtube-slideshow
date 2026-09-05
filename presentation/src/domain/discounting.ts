import { assertFinite, type SpotRateCurve, type TimedCashFlow } from "./bond";

export function presentValue(input: { amount: number; annualEffectiveRate: number; timeYears: number }): number {
  assertFinite("amount", input.amount);
  assertFinite("annualEffectiveRate", input.annualEffectiveRate);
  assertFinite("timeYears", input.timeYears);
  if (input.annualEffectiveRate <= -1) throw new RangeError("annualEffectiveRate must be greater than -1");
  if (input.timeYears < 0) throw new RangeError("timeYears must be non-negative");
  const value = input.amount / (1 + input.annualEffectiveRate) ** input.timeYears;
  if (!Number.isFinite(value)) throw new RangeError("present value is not finite");
  return value;
}

function validateFlows(flows: readonly TimedCashFlow[]): void {
  if (!flows.length) throw new RangeError("flows must not be empty");
  const times = new Set<number>();
  for (const flow of flows) {
    if (!Number.isFinite(flow.amount) || flow.amount < 0) throw new RangeError("flow amount must be finite and non-negative");
    if (!Number.isFinite(flow.timeYears) || flow.timeYears <= 0) throw new RangeError("flow time must be positive");
    if (times.has(flow.timeYears)) throw new RangeError("flow times must be unique");
    times.add(flow.timeYears);
  }
}

export function priceFromSpotRates(input: { flows: readonly TimedCashFlow[]; spotCurve: SpotRateCurve }): number {
  validateFlows(input.flows);
  const byTime = new Map(input.spotCurve.rates.map((rate) => [rate.timeYears, rate.annualEffectiveRate]));
  if (byTime.size !== input.spotCurve.rates.length) throw new RangeError("spot rates must have unique times");
  return input.flows.reduce((total, flow) => {
    const rate = byTime.get(flow.timeYears);
    if (rate === undefined) throw new RangeError(`missing spot rate for ${flow.timeYears}Y`);
    return total + presentValue({ amount: flow.amount, annualEffectiveRate: rate, timeYears: flow.timeYears });
  }, 0);
}

export function priceFromYield(input: { flows: readonly TimedCashFlow[]; annualEffectiveYield: number }): number {
  validateFlows(input.flows);
  assertFinite("annualEffectiveYield", input.annualEffectiveYield);
  if (input.annualEffectiveYield <= -1) throw new RangeError("annualEffectiveYield must be greater than -1");
  return input.flows.reduce((total, flow) => total + presentValue({ amount: flow.amount, annualEffectiveRate: input.annualEffectiveYield, timeYears: flow.timeYears }), 0);
}
