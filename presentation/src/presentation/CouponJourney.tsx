import { Build, Formula, NumberValue } from "./primitives";
import { euro, canonicalFlows } from "./model";
import { useElementSize } from "../visuals/useElementSize";

/** Each row keeps the contractual amount separate from its contribution at T. */
export function CouponJourney({
  step,
  rate,
  selected,
  onSelect,
}: {
  step: number;
  rate: number;
  selected: number;
  onSelect: (period: number) => void;
}) {
  const { ref, width } = useElementSize(470);
  const height =
    width < 360 ? 130 : Math.min(130, Math.max(96, 96 + (width - 360) * 0.18));
  const left = 43,
    right = width - 68;
  const x = (t: number) => left + ((t - 1) / 4) * (right - left);
  const selectedFlow = canonicalFlows.find((f) => f.period === selected)!;
  const years = 5 - selected;
  return (
    <Build at={1} step={step} className="coupon-journey">
      <div className="journey-heading">
        <span>SEGUIR UN COBRO</span>
        <b>Hasta el año 5</b>
      </div>
      <div ref={ref}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="group"
          aria-label="Cada cobro se conserva y crece durante los años restantes hasta el vencimiento"
        >
          {[1, 2, 3, 4, 5].map((t) => (
            <g key={t}>
              <path d={`M${x(t)} 22V${height - 10}`} className="journey-grid" />
              <text x={x(t)} y={12} textAnchor="middle">
                {t}Y
              </text>
            </g>
          ))}
          {canonicalFlows.map((f, i) => {
            const yy = 29 + i * ((height - 40) / 4);
            const terminal = f.amount * (1 + rate) ** (5 - f.period);
            return (
              <g
                key={f.period}
                data-entity={`cashflow-${f.period}`}
                role="button"
                tabIndex={0}
                aria-label={`Seguir cobro del año ${f.period}: ${f.amount} euros, ${5 - f.period} años hasta vencimiento, ${euro(terminal)} euros finales`}
                aria-pressed={selected === f.period}
                className={
                  selected === f.period
                    ? "journey-flow selected"
                    : "journey-flow"
                }
                onClick={() => onSelect(f.period)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(f.period);
                  }
                }}
              >
                <rect
                  x={0}
                  y={yy - 8}
                  width={width}
                  height={(height - 40) / 4}
                  fill="transparent"
                />
                <path
                  className="journey-path"
                  pathLength={1}
                  d={`M${x(f.period)} ${yy}H${right}`}
                />
                <circle
                  className={
                    f.period === 5 ? "journey-principal" : "journey-coupon"
                  }
                  cx={x(f.period)}
                  cy={yy}
                  r={selected === f.period ? 5 : 3.5}
                />
                <text x={x(f.period) - 10} y={yy + 4} textAnchor="end">
                  {f.amount} €
                </text>
                <text x={right + 12} y={yy + 4} className="journey-result">
                  {euro(terminal)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="journey-reading" data-selected-flow={selected}>
        <span>
          {selected === 5
            ? "Último pago · cupón + principal"
            : `Cupón del año ${selected}`}{" "}
          ·{" "}
          {years === 0
            ? "sin reinversión posterior"
            : `${years} año${years > 1 ? "s" : ""} hasta T`}{" "}
          · g = {euro(rate * 100, 1)}% de reinversión
        </span>
        <Formula>{`${selectedFlow.amount}(1+g)^{${years}}`}</Formula>
        <span>
          = <NumberValue value={selectedFlow.amount * (1 + rate) ** years} /> €
        </span>
      </div>
    </Build>
  );
}
