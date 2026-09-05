// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import { MiniFlows, NumberValue } from "../../src/presentation/primitives";
import { couponCase, euro } from "../../src/presentation/model";

const host = document.createElement("div");
document.body.append(host);
const root = createRoot(host);
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
afterEach(() => vi.useRealTimers());
it("commits each financial result and its displayed value together, including rapid reversals", async () => {
  vi.useFakeTimers();
  for (const g of [0, 0.08, 0.04, 0, 0.075, 0]) {
    const r = couponCase(0.04, 0.04, g);
    await act(async () =>
      root.render(
        <div data-rate={g}>
          <NumberValue value={r.wealth} />
          <NumberValue value={r.cagr * 100} />
        </div>,
      ),
    );
    for (const element of host.querySelectorAll<HTMLElement>("[data-value]"))
      expect(element.textContent).toBe(euro(Number(element.dataset.value)));
    await act(async () => vi.advanceTimersByTime(30));
    expect(host.querySelector("[data-value]")!.textContent).toBe(
      euro(r.wealth),
    );
  }
});

it("renders the actual number of payments, fractional coupon and paid price", async () => {
  await act(async () =>
    root.render(
      <MiniFlows
        bond={{
          notional: 200,
          faceValue: 180,
          annualCouponRate: 0.01625,
          maturityYears: 3,
        }}
        price={195.5}
        showToday
      />,
    ),
  );
  expect(
    [...host.querySelectorAll(".mini-flows b")].map((x) => x.textContent),
  ).toEqual(["−195,50", "3,25", "3,25", "183,25"]);
  expect(
    [...host.querySelectorAll(".mini-flows span")].map((x) => x.textContent),
  ).toEqual(["Hoy", "1Y", "2Y", "3Y"]);
});
