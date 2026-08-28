import { assertFinite, assertPositive, type TimedCashFlow } from "./bond";

export function terminalWealth(input: { flows: readonly TimedCashFlow[]; horizonYears: number; annualEffectiveReinvestmentRate: number }): number {
  assertPositive("horizonYears", input.horizonYears);
  assertFinite("annualEffectiveReinvestmentRate", input.annualEffectiveReinvestmentRate);
  if (input.annualEffectiveReinvestmentRate <= -1) throw new RangeError("reinvestment rate must be greater than -1");
  return input.flows.reduce((wealth, flow) => {
    if (flow.timeYears > input.horizonYears) throw new RangeError("horizon must not precede a cash flow");
    return wealth + flow.amount * (1 + input.annualEffectiveReinvestmentRate) ** (input.horizonYears - flow.timeYears);
  }, 0);
}

export function realizedCagr(input: { initialPrice: number; terminalWealth: number; horizonYears: number }): number {
  assertPositive("initialPrice", input.initialPrice);
  assertPositive("terminalWealth", input.terminalWealth);
  assertPositive("horizonYears", input.horizonYears);
  return (input.terminalWealth / input.initialPrice) ** (1 / input.horizonYears) - 1;
}
