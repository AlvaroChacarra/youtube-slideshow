import { cashFlows } from "../../domain/cashflows";
import type { VisualProps } from "../types";
import { useFinancialTimeline } from "../useFinancialTimeline";

export function CashflowTimeline({ scenario, stage }: VisualProps) {
  const flows = cashFlows({ notional: scenario.notional, faceValue: scenario.faceValue, annualCouponRate: scenario.couponRate, maturityYears: scenario.maturityYears });
  const root = useFinancialTimeline(stage);
  return (
    <div className="cashflow-visual" ref={root} data-essential>
      <div className="cashflow-origin" data-motion><span>HOY</span><strong className="tabular">−100 €</strong><small>precio observado</small></div>
      <div className="cashflow-line" aria-hidden="true" />
      <ol aria-label="Cash flows del bono">
        {flows.map((flow) => <li key={flow.period} className={flow.principal ? "terminal" : ""} data-motion>
          <span>{flow.period}Y</span>
          <strong className="tabular">+{flow.amount.toFixed(0)} €</strong>
          <small>{flow.principal ? `${flow.coupon.toFixed(0)} cupón + ${flow.principal.toFixed(0)} principal` : "solo cupón"}</small>
        </li>)}
      </ol>
    </div>
  );
}
