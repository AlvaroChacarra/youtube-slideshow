import { presentValue } from "../../domain/discounting";
import type { VisualProps } from "../types";

export function DiscountLens({ scenario, onScenario }: VisualProps) {
  const future = 100;
  const pv = presentValue({ amount: future, annualEffectiveRate: scenario.yield, timeYears: 5 });
  return (
    <div className="discount-lens" data-essential>
      <div className="amount future"><span>Dentro de 5 años</span><strong className="tabular">100,00 €</strong></div>
      <div className="lens" aria-label={`Descontar al ${(scenario.yield * 100).toFixed(1)} por ciento`}><span>r</span><strong>{(scenario.yield * 100).toFixed(1)}%</strong></div>
      <div className="amount present"><span>Valor hoy</span><strong className="tabular">{pv.toFixed(2)} €</strong></div>
      {onScenario && <label className="rate-control">Tasa de descuento <output>{(scenario.yield * 100).toFixed(1)}%</output><input aria-label="Tasa de descuento" type="range" min="-0.01" max="0.1" step="0.005" value={scenario.yield} onChange={(event) => onScenario({ yield: Number(event.currentTarget.value) })} /></label>}
    </div>
  );
}
