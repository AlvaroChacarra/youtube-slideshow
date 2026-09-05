import { describe, expect, it } from "vitest";
import { cashFlows, couponPayment } from "../../src/domain/cashflows";
import { generateIllustrativeBondCloud, fitIllustrativeCurve } from "../../src/domain/curve";
import { presentValue, priceFromSpotRates, priceFromYield } from "../../src/domain/discounting";
import { realizedCagr, terminalWealth } from "../../src/domain/reinvestment";
import { solveYtm } from "../../src/domain/ytm";

const bond = { notional: 100, faceValue: 100, annualCouponRate: 0.04, maturityYears: 5 } as const;
const flows = cashFlows(bond);

describe("annual bullet bond", () => {
  it("separates coupon rate, payment, and final principal", () => {
    expect(couponPayment(bond)).toBe(4);
    expect(flows.map((flow) => flow.amount)).toEqual([4, 4, 4, 4, 104]);
    expect(flows.filter((flow) => flow.principal > 0)).toHaveLength(1);
    expect(flows.at(-1)?.principal).toBe(100);
  });

  it("prices at par when coupon equals yield", () => {
    expect(priceFromYield({ flows, annualEffectiveYield: 0.04 })).toBeCloseTo(100, 10);
    expect(priceFromSpotRates({ flows, spotCurve: { kind: "spot-rate-curve", rates: flows.map((flow) => ({ timeYears: flow.timeYears, annualEffectiveRate: 0.04 })) } })).toBeCloseTo(100, 10);
  });

  it("has price strictly decreasing in yield", () => {
    expect(priceFromYield({ flows, annualEffectiveYield: 0.02 })).toBeGreaterThan(priceFromYield({ flows, annualEffectiveYield: 0.04 }));
    expect(priceFromYield({ flows, annualEffectiveYield: 0.04 })).toBeGreaterThan(priceFromYield({ flows, annualEffectiveYield: 0.06 }));
  });

  it("round-trips yield through price", () => {
    for (const yieldValue of [-0.01, 0, 0.04, 0.12]) {
      const price = priceFromYield({ flows, annualEffectiveYield: yieldValue });
      expect(solveYtm({ price, flows }).yield).toBeCloseTo(yieldValue, 9);
    }
  });

  it("reconciles terminal wealth identities", () => {
    expect(terminalWealth({ flows, horizonYears: 5, annualEffectiveReinvestmentRate: 0 })).toBe(120);
    expect(realizedCagr({ initialPrice: 100, terminalWealth: 120, horizonYears: 5 })).toBeCloseTo(0.03713728933664817, 12);
    expect(terminalWealth({ flows, horizonYears: 5, annualEffectiveReinvestmentRate: 0.04 })).toBeCloseTo(100 * 1.04 ** 5, 10);
  });

  it("handles a zero coupon bond", () => {
    const zeroFlows = cashFlows({ ...bond, annualCouponRate: 0 });
    const price = priceFromYield({ flows: zeroFlows, annualEffectiveYield: 0.04 });
    expect(price).toBeCloseTo(82.19271067593518, 10);
    expect(realizedCagr({ initialPrice: price, terminalWealth: 100, horizonYears: 5 })).toBeCloseTo(0.04, 12);
  });

  it("rejects invalid domains", () => {
    expect(() => presentValue({ amount: 100, annualEffectiveRate: -1, timeYears: 1 })).toThrow();
    expect(() => cashFlows({ ...bond, maturityYears: 2.5 })).toThrow();
    expect(() => solveYtm({ price: 0, flows })).toThrow();
    expect(() => priceFromSpotRates({ flows, spotCurve: { kind: "spot-rate-curve", rates: [] } })).toThrow();
  });
});

describe("illustrative YTM curve", () => {
  it("is deterministic, stratified, and type-distinct from spot rates", () => {
    const cloud = generateIllustrativeBondCloud({ seed: 20260828 });
    expect(cloud).toEqual(generateIllustrativeBondCloud({ seed: 20260828 }));
    expect(cloud).toHaveLength(30);
    expect(cloud.filter((point) => point.maturityYears <= 10)).toHaveLength(20);
    expect(cloud.every((point) => point.illustrative && Number.isFinite(point.ytm))).toBe(true);
    expect(cloud.every((point) => point.segment === (point.maturityYears <= 2 ? "short" : "long"))).toBe(true);
    const curve = fitIllustrativeCurve({ points: cloud });
    expect(curve.kind).toBe("illustrative-ytm-curve");
    expect(curve.points).toHaveLength(101);
    expect(curve.points.every((point) => Number.isFinite(point.ytm))).toBe(true);
  });
});
