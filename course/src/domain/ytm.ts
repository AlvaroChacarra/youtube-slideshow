import { assertPositive, type TimedCashFlow } from "./bond";
import { priceFromYield } from "./discounting";

export type YtmSolution = Readonly<{ yield: number; iterations: number; priceResidual: number }>;

export function solveYtm(input: { price: number; flows: readonly TimedCashFlow[] }): YtmSolution {
  assertPositive("price", input.price);
  if (input.flows.some((flow) => flow.amount < 0)) throw new RangeError("V1 YTM solver requires non-negative future flows");
  const objective = (yieldValue: number) => priceFromYield({ flows: input.flows, annualEffectiveYield: yieldValue }) - input.price;
  let low = -1 + 1e-10;
  let high = 0.1;
  let highValue = objective(high);
  while (highValue > 0 && high < 1e6) {
    high = high * 2 + 0.1;
    highValue = objective(high);
  }
  if (!Number.isFinite(highValue) || highValue > 0) throw new RangeError("unable to bracket YTM");
  let mid = 0;
  let residual = Number.POSITIVE_INFINITY;
  for (let iteration = 1; iteration <= 128; iteration += 1) {
    mid = (low + high) / 2;
    residual = objective(mid);
    if (Math.abs(residual) <= 1e-10 || high - low <= 1e-12) {
      return Object.freeze({ yield: mid, iterations: iteration, priceResidual: residual });
    }
    if (residual > 0) low = mid;
    else high = mid;
  }
  return Object.freeze({ yield: mid, iterations: 128, priceResidual: residual });
}
