export type AnnualBulletBond = Readonly<{
  notional: number;
  faceValue: number;
  annualCouponRate: number;
  maturityYears: number;
  paymentsPerYear?: 1;
}>;

export type TimedCashFlow = Readonly<{
  period: number;
  timeYears: number;
  coupon: number;
  principal: number;
  amount: number;
}>;

export type TimedRate = Readonly<{ timeYears: number; annualEffectiveRate: number }>;
export type SpotRateCurve = Readonly<{ kind: "spot-rate-curve"; rates: readonly TimedRate[] }>;

export function assertFinite(name: string, value: number): void {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite`);
}

export function assertPositive(name: string, value: number): void {
  assertFinite(name, value);
  if (value <= 0) throw new RangeError(`${name} must be greater than zero`);
}

export function validateAnnualBulletBond(bond: AnnualBulletBond): void {
  assertPositive("notional", bond.notional);
  assertPositive("faceValue", bond.faceValue);
  assertFinite("annualCouponRate", bond.annualCouponRate);
  if (bond.annualCouponRate < 0) throw new RangeError("annualCouponRate must be non-negative");
  assertPositive("maturityYears", bond.maturityYears);
  if (!Number.isInteger(bond.maturityYears)) throw new RangeError("V1 requires integer maturityYears");
  if ((bond.paymentsPerYear ?? 1) !== 1) throw new RangeError("V1 supports annual payments only");
}
