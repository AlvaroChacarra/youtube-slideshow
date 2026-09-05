import {
  ArrowRight,
  Landmark,
  LockKeyhole,
  FileText,
  CalendarClock,
  ChartNoAxesCombined,
  UsersRound,
} from "lucide-react";
import {
  Build,
  Formula,
  MiniFlows,
  RangeControl,
  NumberValue,
  EquationStep,
} from "./primitives";
import { couponCase, euro, percent, texNumber } from "./model";
import { CurveThumbnail } from "./BondCurve";
import { CouponJourney } from "./CouponJourney";

export function ReturnsComparison({
  step,
  rate,
  onRate,
  selected = 1,
  onSelect = () => {},
}: {
  step: number;
  rate: number;
  onRate: (n: number) => void;
  selected?: number;
  onSelect?: (n: number) => void;
}) {
  const g = step >= 3 ? rate : 0;
  const result = couponCase(0.04, 0.04, g);
  return (
    <div className="returns-comparison">
      <div className="comparison-header">
        Caso base · 5 años · cupón 4% · precio 100 €
      </div>
      <section className="return-panel ytm-panel">
        <span className="panel-overline">LA TASA IMPLÍCITA</span>
        <h2>YTM</h2>
        <p>
          Una tasa que reconcilia
          <br />
          precio y flujos.
        </p>
        <Formula>{"100 = \\sum_{t=1}^{5} \\frac{CF_t}{(1+y)^t}"}</Formula>
        <strong className="hero-number">
          4<span>,00%</span>
        </strong>
        <MiniFlows coupon={4} />
        <span className="panel-foot">
          Se calcula a partir de precio y pagos.
        </span>
      </section>
      <section className="return-panel wealth-panel">
        <span className="panel-overline">EL RESULTADO COMPUESTO</span>
        <h2>
          CAGR
          <sub>
            {g === 0 ? "sin reinversión" : `reinversión al ${percent(g, 1)}`}
          </sub>
        </h2>
        <CouponJourney
          step={step}
          rate={g}
          selected={selected}
          onSelect={onSelect}
        />
        <Build at={1} step={step}>
          <div className="wealth-accumulation">
            <span>Suma de las contribuciones al año 5</span>
            <strong>
              <NumberValue value={result.wealth} /> €
            </strong>
          </div>
        </Build>
        <Build at={2} step={step}>
          <Formula>{`\\left(\\frac{${texNumber(result.wealth)}}{100}\\right)^{1/5}-1`}</Formula>
          <strong className="hero-number">
            <NumberValue value={result.cagr * 100} />
            <span>%</span>
          </strong>
        </Build>
        <Build at={3} step={step}>
          <RangeControl
            label="Reinversión de cupones · g"
            value={rate}
            onChange={onRate}
            max={0.08}
          />
        </Build>
      </section>
    </div>
  );
}

export function CouponComparison({
  step,
  active,
  onSelect,
}: {
  step: number;
  active: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="coupon-comparison">
      <div className="comparison-header">
        5 años · principal 100 € · pagos anuales · YTM común = 4%
      </div>
      <div className="mobile-comparison">
        <table>
          <caption>Comparar los tres bonos</caption>
          <thead>
            <tr>
              <th scope="col">Cupón</th>
              {[0.08, 0.01, 0].map((c, i) => (
                <th scope="col" key={c}>
                  <button
                    onClick={() => onSelect(i)}
                    aria-pressed={active === i}
                  >
                    {c * 100}%
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Precio €</th>
              {[0.08, 0.01, 0].map((c) => (
                <td key={c}>{euro(couponCase(c).price)}</td>
              ))}
            </tr>
            {step >= 2 && (
              <tr>
                <th scope="row">Riqueza €</th>
                {[0.08, 0.01, 0].map((c) => (
                  <td key={c}>{euro(couponCase(c).wealth, 0)}</td>
                ))}
              </tr>
            )}
            {step >= 3 && (
              <tr>
                <th scope="row">CAGR</th>
                {[0.08, 0.01, 0].map((c) => (
                  <td key={c}>{percent(couponCase(c).cagr)}</td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
        <p>Selecciona un cupón para recorrer su cálculo.</p>
      </div>
      {[0.08, 0.01, 0].map((c, i) => {
        const r = couponCase(c);
        return (
          <section className="coupon-column" data-active={active === i} key={c}>
            <div className="coupon-column-head">
              <span>{["A", "B", "C"][i]}</span>
              <h2>
                Cupón <b>{c * 100}%</b>
              </h2>
            </div>
            <div className="coupon-price">
              <span>Precio hoy</span>
              <strong>
                {euro(r.price)} <small>€</small>
              </strong>
            </div>
            <Build at={1} step={step}>
              <MiniFlows coupon={c * 100} />
              <EquationStep number="01" label="Descontar al 4%">
                <Formula>
                  {c === 0
                    ? "P = \\frac{100}{1{,}04^5}"
                    : `\\begin{gathered}P=\\frac{${c * 100}}{1{,}04}+\\frac{${c * 100}}{1{,}04^2}+\\frac{${c * 100}}{1{,}04^3}\\\\+\\frac{${c * 100}}{1{,}04^4}+\\frac{${100 + c * 100}}{1{,}04^5}\\end{gathered}`}
                </Formula>
              </EquationStep>
            </Build>
            <Build at={2} step={step}>
              <EquationStep number="02" label="Acumular al 0%">
                <span className="wealth-sum">
                  {c === 0
                    ? "100"
                    : `${c * 100} + ${c * 100} + ${c * 100} + ${c * 100} + ${100 + c * 100}`}{" "}
                  = <b>{r.wealth} €</b>
                </span>
              </EquationStep>
            </Build>
            <Build at={3} step={step}>
              <EquationStep number="03" label="Anualizar la riqueza">
                <Formula>{`\\left(\\frac{${r.wealth}}{${texNumber(r.price)}}\\right)^{1/5}-1`}</Formula>
                <strong className="cagr-result">{percent(r.cagr)}</strong>
              </EquationStep>
            </Build>
          </section>
        );
      })}
    </div>
  );
}

const generations = [
  { id: "E1", coupon: 2.4, age: 5.2, residual: 4.8 },
  { id: "E2", coupon: 3.1, age: 4.8, residual: 5.2 },
  { id: "E3", coupon: 3.6, age: 4.4, residual: 5.6 },
];
export function BondGenerations({ step }: { step: number }) {
  return (
    <div className="generations">
      <div className="market-context">
        <span className="spain-flag" />
        España · Bonos y Obligaciones del Estado{" "}
        <small>Nuevo ejemplo · emisiones ilustrativas</small>
      </div>
      <div className="generation-timeline">
        <div className="generation-scale">
          <span>EMISIÓN</span>
          <span>FECHA DE VALORACIÓN</span>
          <span>VENCIMIENTO</span>
        </div>
        <Build at={2} step={step} className="today-marker">
          <b>Hoy</b>
          <i />
        </Build>
        {generations.map((b, i) => (
          <Build
            at={i === 0 ? 0 : 1}
            step={step}
            className="generation-row"
            key={b.id}
          >
            <div className="generation-identity">
              <span className={`bond-letter generation-${i}`}>{b.id}</span>
              <div>
                <strong>Cupón {euro(b.coupon, 1)}%</strong>
                <small>
                  <LockKeyhole /> Fijo desde la emisión
                </small>
              </div>
            </div>
            <div className="generation-rail">
              <div
                className={`life-bar generation-${i}`}
                style={{
                  left: `${((6 - b.age) / 12) * 100}%`,
                  width: `${(10 / 12) * 100}%`,
                }}
              >
                <span className="issue-dot" />
                <b>10 años originales</b>
                <span className="maturity-dot" />
              </div>
              <span
                className="issue-age"
                style={{ left: `${((6 - b.age) / 12) * 100}%` }}
              >
                Hace {euro(b.age, 1)} años
              </span>
              <Build at={2} step={step}>
                <div
                  className="residual-bar"
                  style={{ width: `${(b.residual / 12) * 100}%` }}
                />
                <span className="residual-label">
                  {euro(b.residual, 1)} años por delante
                </span>
              </Build>
            </div>
          </Build>
        ))}
      </div>
      <Build at={3} step={step} className="generation-conclusion">
        <CalendarClock />
        <p>
          <strong>Una misma zona: ~5Y.</strong>
          <span>
            Tres referencias distintas. Tres cupones que permanecen fijos.
          </span>
        </p>
        <div className="residual-cluster">
          {generations.map((b) => (
            <span key={b.id}>
              <b>{b.id}</b>
              {euro(b.residual, 1)}Y
            </span>
          ))}
        </div>
      </Build>
    </div>
  );
}

export function PriceDiscovery({
  step,
  rate,
  onRate,
}: {
  step: number;
  rate: number;
  onRate: (n: number) => void;
}) {
  return (
    <div className="price-discovery">
      <div className="comparison-header">
        Nuevo ejemplo · tres bonos a 5 años · principal 100 € · pagos anuales
      </div>
      <Build at={1} step={step} className="market-rate">
        <RangeControl
          label="Rendimiento exigido común · YTM"
          value={rate}
          onChange={onRate}
          min={0.01}
          max={0.08}
        />
        <p>Explora: al exigir más rendimiento, el precio baja.</p>
      </Build>
      <div className="pricing-columns">
        {[0.07, 0.04, 0.03].map((c, i) => {
          const r = couponCase(c, rate);
          const status =
            Math.abs(r.price - 100) < 0.005
              ? "A la par"
              : r.price > 100
                ? "Con prima"
                : "Con descuento";
          return (
            <section className="pricing-bond" key={c}>
              <div className="pricing-contract">
                <FileText />
                <span>BONO {["A", "B", "C"][i]}</span>
                <h2>
                  {euro(c * 100, 0)}
                  <small>%</small>
                </h2>
                <p>
                  Cupón contractual <LockKeyhole />
                </p>
              </div>
              <MiniFlows coupon={c * 100} />
              <Build at={1} step={step}>
                <Formula>{`P = \\sum_{t=1}^{5}\\frac{CF_t}{(1+${texNumber(rate, 3)})^t}`}</Formula>
              </Build>
              <Build at={2} step={step}>
                <div className="price-meter">
                  <i className="par-line" />
                  <span className="par-label">100 € · par</span>
                  <div
                    className="price-level"
                    style={{ width: `${(r.price / 135) * 100}%` }}
                  />
                  <strong>
                    <NumberValue value={r.price} /> <small>€</small>
                  </strong>
                </div>
                <span
                  className={`price-status ${status === "A la par" ? "at-par" : ""}`}
                >
                  {status}
                </span>
              </Build>
            </section>
          );
        })}
      </div>
      <Build at={3} step={step} className="price-to-point">
        <span>Precio + flujos</span>
        <ArrowRight />
        <strong>YTM {percent(rate, 1)}</strong>
        <ArrowRight />
        <span>
          Punto <b>(5Y; {percent(rate, 1)})</b>
        </span>
      </Build>
    </div>
  );
}

export { BondCurve as MarketCurve } from "./BondCurve";

export function RecapFoundations({ step }: { step: number }) {
  return (
    <div className="recap-bands">
      <section className="recap-band">
        <div className="recap-topic">
          <span>01</span>
          <h2>El contrato</h2>
          <p>Qué se promete.</p>
        </div>
        <div className="recap-contract">
          <div className="recap-exchange">
            <Landmark />
            <span>Emisor</span>
            <div>
              <b>← Capital hoy</b>
              <b>Pagos futuros →</b>
            </div>
            <UsersRound />
            <span>Inversor</span>
          </div>
          <div className="recap-terms">
            <span>
              c <b>4%</b>
            </span>
            <span>
              N <b>100 €</b>
            </span>
            <span>
              Principal <b>100 €</b>
            </span>
            <span>
              Plazo <b>5 años</b>
            </span>
            <span>
              Frecuencia <b>Anual</b>
            </span>
          </div>
          <Build at={1} step={step}>
            <MiniFlows coupon={4} showToday />
            <p className="recap-small">
              Cupón = 4% × 100 € = 4 € · Último pago = 4 + 100 = 104 €
            </p>
          </Build>
        </div>
      </section>
      <Build at={2} step={step} className="recap-band">
        <div className="recap-topic">
          <span>02</span>
          <h2>El valor</h2>
          <p>Qué representa hoy.</p>
        </div>
        <div className="recap-valuation">
          <Formula display>
            {"P_0 = \\sum_{t=1}^{n}\\frac{CF_t}{(1+r_t)^t}"}
          </Formula>
          <div className="recap-price-equation">
            <Formula display>
              {
                "\\frac{4}{1+r_1}+\\frac{4}{(1+r_2)^2}+\\frac{4}{(1+r_3)^3}+\\frac{4}{(1+r_4)^4}+\\frac{104}{(1+r_5)^5}"
              }
            </Formula>
          </div>
          <p>
            <strong>100 €</strong> cuando todas las tasas son 4%.
          </p>
        </div>
      </Build>
    </div>
  );
}

export function RecapMarket({ step }: { step: number }) {
  return (
    <div className="recap-bands recap-final">
      <section className="recap-band">
        <div className="recap-topic">
          <span>03</span>
          <h2>El rendimiento</h2>
          <p>Separar tasa y resultado.</p>
        </div>
        <div className="recap-returns">
          <div>
            <span>YTM</span>
            <strong>4,00%</strong>
            <p>Implícita en precio y flujos.</p>
            <Formula>{"100=\\sum_{t=1}^{5}\\frac{CF_t}{(1+y)^t}"}</Formula>
          </div>
          <div>
            <span>CAGR sin reinversión</span>
            <strong>3,71%</strong>
            <p>120 € al final de cinco años.</p>
            <Formula>{"(120/100)^{1/5}-1"}</Formula>
          </div>
          <p className="zero-coupon-note">
            Cupón cero: no hay cobros intermedios que reinvertir.
          </p>
        </div>
      </section>
      <Build at={1} step={step} className="recap-band">
        <div className="recap-topic">
          <span>04</span>
          <h2>El mercado</h2>
          <p>Comparar y ordenar.</p>
        </div>
        <div className="recap-market-path">
          <div className="recap-chain">
            <span>
              <LockKeyhole />
              <b>Cupón</b>
              <small>Se fija al emitir.</small>
            </span>
            <ArrowRight />
            <span>
              <FileText />
              <b>Precio</b>
              <small>Se negocia.</small>
            </span>
            <ArrowRight />
            <span>
              <ChartNoAxesCombined />
              <b>YTM</b>
              <small>Se infiere de precio + flujos.</small>
            </span>
          </div>
          <Build at={2} step={step}>
            <div className="recap-curve-summary">
              <CurveThumbnail />
              <p>
                <b>Un punto = (vida residual, YTM)</b>
                <span>La nube contiene bonos. La línea resume la nube.</span>
                <span>Benchmark: referencia líquida de un plazo.</span>
              </p>
            </div>
          </Build>
        </div>
      </Build>
    </div>
  );
}
