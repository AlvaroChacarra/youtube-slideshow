import type { VisualProps } from "../types";
import { useFinancialTimeline } from "../useFinancialTimeline";

const bonds = [
  { id: "A", issued: "2018", coupon: "7%", original: "10Y", residual: "≈5Y", price: "113,36" },
  { id: "B", issued: "2021", coupon: "4%", original: "7Y", residual: "≈5Y", price: "100,00" },
  { id: "C", issued: "2023", coupon: "3%", original: "5Y", residual: "≈5Y", price: "95,55" }
];

export function BondCloud({ stage }: VisualProps) {
  const root = useFinancialTimeline(stage);
  return (
    <div className="bond-cloud" ref={root} data-essential>
      <div className="country-label" data-motion>🇪🇸 España · Bonos y Obligaciones del Estado</div>
      <div className="generation-axis" aria-hidden="true"><span>Emisión</span><span>Pasa el tiempo →</span><span>Hoy</span></div>
      <div className="bond-generation-grid">
        {bonds.map((bond) => <article key={bond.id} data-motion className={stage >= 2 ? "compressed" : ""}>
          <span className="mini-seal">{bond.id}</span>
          <small>Emitido {bond.issued} · {bond.original}</small>
          <strong>Cupón {bond.coupon}</strong>
          <div><span>Vida residual</span><b>{bond.residual}</b></div>
          {stage >= 2 && <div><span>Precio hoy</span><b>{bond.price} €</b></div>}
        </article>)}
      </div>
      <p className="takeaway" data-motion>El cupón queda fijo. La vida residual cae y varias generaciones convergen en la misma zona.</p>
    </div>
  );
}
