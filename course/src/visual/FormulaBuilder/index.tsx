import { cashFlows } from "../../domain/cashflows";
import { priceFromYield } from "../../domain/discounting";
import type { VisualProps } from "../types";
import { MathFormula } from "../MathFormula";
import { useFinancialTimeline } from "../useFinancialTimeline";

export function FormulaBuilder({ scenario, stage }: VisualProps) {
  const flows = cashFlows({ notional: scenario.notional, faceValue: scenario.faceValue, annualCouponRate: scenario.couponRate, maturityYears: scenario.maturityYears });
  const price = priceFromYield({ flows, annualEffectiveYield: scenario.yield });
  const root = useFinancialTimeline(stage);
  const expression = stage === 0 ? "PV_t = \\frac{CF_t}{(1+r_t)^t}" : stage === 1 ? "P = \\sum_{t=1}^{n} \\frac{CF_t}{(1+r_t)^t}" : "P = \\frac{4}{1.04}+\\frac{4}{1.04^2}+\\frac{4}{1.04^3}+\\frac{4}{1.04^4}+\\frac{104}{1.04^5}";
  return (
    <div className="formula-stage" ref={root} data-essential>
      <div data-motion><MathFormula expression={expression} label="Fórmula de valor presente del bono" /></div>
      <div className="formula-legend" data-motion><span><i className="cyan-dot" /> CF<sub>t</sub> · flujo en t</span><span>r<sub>t</sub> · spot aplicable al flujo</span><span>n · periodos de cupón</span></div>
      <div className="price-result" data-motion><span>Suma de contribuciones</span><strong className="tabular">P = {price.toFixed(2)} €</strong></div>
    </div>
  );
}
