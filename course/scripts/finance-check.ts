import fixtures from "../contracts/numerical-fixtures.json" with { type: "json" };
import { cashFlows, couponPayment } from "../src/domain/cashflows";
import { priceFromSpotRates, priceFromYield } from "../src/domain/discounting";
import { realizedCagr, terminalWealth } from "../src/domain/reinvestment";
import { solveYtm } from "../src/domain/ytm";

const tolerance = fixtures.tolerances.internal;
const close = (actual: number, expected: number, label: string) => {
  if (Math.abs(actual - expected) >= tolerance) throw new Error(`${label}: ${actual} != ${expected}`);
};
const canonical = fixtures.canonicalBond;
const flows = cashFlows({ notional: canonical.notional, faceValue: canonical.faceValue, annualCouponRate: canonical.couponRate, maturityYears: canonical.maturityYears });
close(couponPayment({ notional: 100, annualCouponRate: 0.04 }), 4, "coupon payment");
if (flows.map((flow) => flow.amount).join(",") !== canonical.cashFlows.join(",")) throw new Error("cash flow fixture mismatch");
close(priceFromYield({ flows, annualEffectiveYield: canonical.yield }), 100, "par price");
close(priceFromSpotRates({ flows, spotCurve: { kind: "spot-rate-curve", rates: flows.map((flow) => ({ timeYears: flow.timeYears, annualEffectiveRate: 0.04 })) } }), 100, "spot price");
close(terminalWealth({ flows, horizonYears: 5, annualEffectiveReinvestmentRate: 0 }), 120, "terminal wealth");
close(realizedCagr({ initialPrice: 100, terminalWealth: 120, horizonYears: 5 }), canonical.realizedCagrWithoutReinvestment, "CAGR");
close(solveYtm({ price: 100, flows }).yield, 0.04, "YTM");
for (const item of [...fixtures.sameYtmComparison, ...fixtures.repricing]) {
  const itemFlows = cashFlows({ notional: 100, faceValue: 100, annualCouponRate: item.couponRate, maturityYears: 5 });
  close(priceFromYield({ flows: itemFlows, annualEffectiveYield: item.yield }), item.price, `price ${item.couponRate}`);
}
console.log("FINANCE PASS — canonical fixtures and numerical tolerances green");
