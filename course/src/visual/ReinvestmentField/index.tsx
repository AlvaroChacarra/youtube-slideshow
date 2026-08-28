import { cashFlows } from "../../domain/cashflows";
import { realizedCagr, terminalWealth } from "../../domain/reinvestment";
import type { VisualProps } from "../types";
import { useFinancialTimeline } from "../useFinancialTimeline";

export function ReinvestmentField({ scenario, stage, onScenario }: VisualProps) {
  const flows = cashFlows({ notional: scenario.notional, faceValue: scenario.faceValue, annualCouponRate: scenario.couponRate, maturityYears: scenario.maturityYears });
  const wealth = terminalWealth({ flows, horizonYears: scenario.maturityYears, annualEffectiveReinvestmentRate: scenario.reinvestmentRate });
  const priceAtYtm = scenario.couponRate === 0.04 && scenario.yield === 0.04 ? 100 : undefined;
  const cagr = realizedCagr({ initialPrice: priceAtYtm ?? 100, terminalWealth: wealth, horizonYears: scenario.maturityYears });
  const root = useFinancialTimeline(stage);
  return (
    <div className="reinvestment-field" ref={root} data-essential>
      <div className="reinvest-header" data-motion><span>Cupones cobrados</span><span>Viajan hasta T</span><span>Riqueza terminal</span></div>
      <div className="coupon-stream" aria-label="Acumulación de cupones">
        {flows.map((flow) => <div key={flow.period} className="coupon-particle" data-motion style={{ "--travel": `${(scenario.maturityYears - flow.period) * 12}px` } as React.CSSProperties}>
          <span>{flow.period}Y</span><strong>+{flow.coupon.toFixed(0)}</strong><small>{scenario.reinvestmentRate === 0 ? "cash 0%" : `× ${(1 + scenario.reinvestmentRate).toFixed(2)}^${scenario.maturityYears - flow.period}`}</small>
        </div>)}
      </div>
      <div className="wealth-result" data-motion><strong className="tabular">{wealth.toFixed(2)} €</strong><span>CAGR realizado · {(cagr * 100).toFixed(2)}%</span></div>
      {onScenario && <label className="rate-control">Reinversión <output>{(scenario.reinvestmentRate * 100).toFixed(1)}%</output><input aria-label="Tasa de reinversión" type="range" min="0" max="0.08" step="0.005" value={scenario.reinvestmentRate} onChange={(event) => onScenario({ reinvestmentRate: Number(event.currentTarget.value) })} /></label>}
    </div>
  );
}
