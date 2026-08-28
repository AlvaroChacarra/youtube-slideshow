import { couponPayment } from "../../domain/cashflows";
import type { VisualProps } from "../types";

export function BondObject({ scenario, stage, onScenario, compact = false }: VisualProps) {
  const coupon = couponPayment({ notional: scenario.notional, annualCouponRate: scenario.couponRate });
  return (
    <div className={`bond-composition ${compact ? "compact" : ""}`} data-essential>
      <div className="bond-certificate" aria-label="Bono canónico B-04 a cinco años">
        <div className="bond-seal">B–04</div>
        <p className="bond-overline">Instrumento de deuda · pagos anuales</p>
        <h3>BONO <span>{scenario.maturityYears} AÑOS</span></h3>
        <dl>
          <div><dt>Emisor</dt><dd>Estado o empresa</dd></div>
          <div className={stage >= 1 ? "active" : ""}><dt>Coupon rate</dt><dd className="tabular">{(scenario.couponRate * 100).toFixed(1)}%</dd></div>
          <div className={stage >= 2 ? "active" : ""}><dt>Notional · N</dt><dd className="tabular">{scenario.notional.toFixed(0)} €</dd></div>
          <div className={stage >= 2 ? "active" : ""}><dt>Face value · FV</dt><dd className="tabular">{scenario.faceValue.toFixed(0)} €</dd></div>
          <div className={stage >= 3 ? "active" : ""}><dt>Vencimiento · T</dt><dd className="tabular">{scenario.maturityYears} años</dd></div>
        </dl>
        <div className="bond-signature">Cupón anual <strong>{coupon.toFixed(2)} €</strong></div>
      </div>
      <aside className="observed-price">
        <span>Observado hoy · no contractual</span>
        <strong className="tabular">P = 100,00 €</strong>
      </aside>
      {onScenario && <div className="inline-controls" aria-label="Parámetros del bono">
        <label>Cupón <output>{(scenario.couponRate * 100).toFixed(1)}%</output><input aria-label="Coupon rate" type="range" min="0" max="0.1" step="0.005" value={scenario.couponRate} onChange={(event) => onScenario({ couponRate: Number(event.currentTarget.value) })} /></label>
        <label>Notional <output>{scenario.notional} €</output><input aria-label="Notional" type="range" min="50" max="200" step="10" value={scenario.notional} onChange={(event) => onScenario({ notional: Number(event.currentTarget.value) })} /></label>
      </div>}
    </div>
  );
}
