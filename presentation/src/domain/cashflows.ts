import { assertFinite, validateAnnualBulletBond, type AnnualBulletBond, type TimedCashFlow } from "./bond";

export function couponPayment(input: { notional: number; annualCouponRate: number; paymentsPerYear?: 1 }): number {
  assertFinite("notional", input.notional);
  assertFinite("annualCouponRate", input.annualCouponRate);
  if (input.notional <= 0) throw new RangeError("notional must be greater than zero");
  if (input.annualCouponRate < 0) throw new RangeError("annualCouponRate must be non-negative");
  if ((input.paymentsPerYear ?? 1) !== 1) throw new RangeError("V1 supports annual payments only");
  return input.notional * input.annualCouponRate;
}

export function cashFlows(bond: AnnualBulletBond): readonly TimedCashFlow[] {
  validateAnnualBulletBond(bond);
  const coupon = couponPayment(bond);
  return Array.from({ length: bond.maturityYears }, (_, index) => {
    const period = index + 1;
    const principal = period === bond.maturityYears ? bond.faceValue : 0;
    return Object.freeze({ period, timeYears: period, coupon, principal, amount: coupon + principal });
  });
}
