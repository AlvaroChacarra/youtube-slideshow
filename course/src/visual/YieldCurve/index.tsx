import { scaleLinear } from "d3-scale";
import { curveMonotoneX, line } from "d3-shape";
import { fitIllustrativeCurve, generateIllustrativeBondCloud } from "../../domain/curve";
import type { VisualProps } from "../types";
import { useFinancialTimeline } from "../useFinancialTimeline";

const WIDTH = 920;
const HEIGHT = 430;
const MARGIN = { top: 28, right: 32, bottom: 52, left: 58 };
const benchmarks = [2, 3, 5, 7, 10, 15, 30, 50];

export function YieldCurve({ stage }: VisualProps) {
  const cloud = generateIllustrativeBondCloud({ seed: 20260828 });
  const curve = fitIllustrativeCurve({ points: cloud });
  const x = scaleLinear().domain([0, 50]).range([MARGIN.left, WIDTH - MARGIN.right]);
  const y = scaleLinear().domain([0.01, 0.05]).range([HEIGHT - MARGIN.bottom, MARGIN.top]);
  const path = line<{ maturityYears: number; ytm: number }>().x((point) => x(point.maturityYears)).y((point) => y(point.ytm)).curve(curveMonotoneX)(curve.points) ?? "";
  const root = useFinancialTimeline(stage, "[data-curve-motion]");
  return (
    <div className="curve-composition" ref={root} data-essential>
      <div className="curve-definitions">
        <p data-curve-motion><span>01</span><strong>Punto</strong><small>Bono observado</small></p>
        <p data-curve-motion><span>02</span><strong>Línea</strong><small>Curva fair ajustada</small></p>
        <p data-curve-motion><span>03</span><strong>Benchmark</strong><small>Referencia más líquida</small></p>
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby="curve-title curve-desc">
        <title id="curve-title">Curva ilustrativa de YTMs observadas</title>
        <desc id="curve-desc">Treinta bonos ilustrativos, concentrados en cero a diez años, con separación de corto plazo exactamente en dos años y curva fair ajustada.</desc>
        <rect x={x(0)} y={MARGIN.top} width={x(2) - x(0)} height={HEIGHT - MARGIN.top - MARGIN.bottom} className="short-zone" />
        <line x1={x(2)} x2={x(2)} y1={MARGIN.top} y2={HEIGHT - MARGIN.bottom} className="boundary" />
        <text x={x(1)} y={MARGIN.top + 18} textAnchor="middle" className="zone-label">CORTO 0–2Y</text>
        <text x={x(12)} y={MARGIN.top + 18} textAnchor="middle" className="zone-label long">LARGO &gt;2Y</text>
        {[0.01, 0.02, 0.03, 0.04, 0.05].map((tick) => <g key={tick}><line x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={y(tick)} y2={y(tick)} className="grid-line" /><text x={MARGIN.left - 10} y={y(tick) + 4} textAnchor="end" className="axis-label">{(tick * 100).toFixed(0)}%</text></g>)}
        {benchmarks.map((tick) => <g key={tick}><line x1={x(tick)} x2={x(tick)} y1={HEIGHT - MARGIN.bottom} y2={HEIGHT - MARGIN.bottom + 7} className="tick" /><text x={x(tick)} y={HEIGHT - MARGIN.bottom + 25} textAnchor="middle" className="axis-label">{tick}Y</text>{stage >= 2 && <path d={`M ${x(tick)-6} ${HEIGHT-MARGIN.bottom+34} l 6 -4 l 6 4 l -2 7 l -8 0 z`} className="benchmark-star" data-curve-motion />}</g>)}
        {cloud.map((point) => <circle key={point.id} cx={x(point.maturityYears)} cy={y(point.ytm)} r={stage === 0 ? 5 : 4} className="bond-point" data-curve-motion />)}
        {stage >= 1 && <path d={path} className="fair-curve" data-curve-motion />}
        <text x={(MARGIN.left + WIDTH - MARGIN.right) / 2} y={HEIGHT - 8} textAnchor="middle" className="axis-title">Vencimiento / vida residual</text>
        <text transform={`translate(16 ${(MARGIN.top + HEIGHT - MARGIN.bottom) / 2}) rotate(-90)`} textAnchor="middle" className="axis-title">YTM</text>
      </svg>
      <p className="illustrative-note">Datos ilustrativos · curva de YTMs observadas, no spot curve</p>
    </div>
  );
}
