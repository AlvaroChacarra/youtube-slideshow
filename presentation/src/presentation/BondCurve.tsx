import { useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { Build } from './primitives';
import { euro, percent } from './model';
import { generateIllustrativeBondCloud, fitIllustrativeCurve } from '../domain/curve';
import { useElementSize } from '../visuals/useElementSize';

export const bondCloud = generateIllustrativeBondCloud({ seed: 42 });
export const fairCurve = fitIllustrativeCurve({ points: bondCloud });
const basePoint = bondCloud.find(p => p.maturityYears === 5)!;

export function CurveThumbnail() {
  const x = scaleLinear().domain([0, 50]).range([12, 212]);
  const y = scaleLinear().domain([.01, .05]).range([72, 6]);
  return <svg viewBox="0 0 220 86" role="img" aria-label="La misma nube y curva ilustrativas: YTM por vida residual, de 0 a 50 años">
    <path d="M12 6V72H214" className="chart-tick" />
    <path className="fair-line" d={fairCurve.points.map((p,i)=>`${i?'L':'M'}${x(p.maturityYears)},${y(p.ytm)}`).join(' ')} />
    {bondCloud.map(p=><circle key={p.id} cx={x(p.maturityYears)} cy={y(p.ytm)} r={1.8} className="cloud-point" />)}
  </svg>;
}

export function BondCurve({ step, chosen, onChoose }: { step: number; chosen: string | null; onChoose: (id: string) => void }) {
  const { ref, width } = useElementSize();
  const [focus, setFocus] = useState<10 | 50 | null>(null);
  const selected = bondCloud.find(p => p.id === chosen) ?? basePoint;
  const limit = selected.maturityYears > 10 ? 50 : focus ?? (width < 500 ? 10 : 50);
  const height = width < 500 ? 268 : 350;
  const left = 43, right = width - 18, top = 28, bottom = height - 48;
  const x = scaleLinear().domain([0, limit]).range([left, right]);
  const y = scaleLinear().domain([.01, .05]).range([bottom, top]);
  const visible = (step === 0 ? [selected] : bondCloud).filter(p => p.maturityYears <= limit);
  const curve = fairCurve.points.filter(p => p.maturityYears <= limit);
  function choose(id: string) { onChoose(id); }
  function setRange(range: 10 | 50) {
    setFocus(range);
    if (range === 10 && selected.maturityYears > 10) onChoose(basePoint.id);
  }
  return <div className="market-curve">
    <div className="market-context"><span className="spain-flag" />España · Curva de YTM <small>Nueva muestra · 30 bonos ilustrativos · no cotizaciones</small></div>
    <div className="curve-layout">
      <div className="curve-plot" ref={ref}>
        <div className="chart-range" aria-label="Tramo de la curva">
          <span>Escala lineal</span>
          <button aria-pressed={limit === 10} onClick={()=>setRange(10)}>Detalle 0–10Y</button>
          <button aria-pressed={limit === 50} onClick={()=>setRange(50)}>Completa 0–50Y</button>
        </div>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="group" aria-label={`Curva ilustrativa de YTM: cero a ${limit} años, escala lineal; rendimiento del uno al cinco por ciento.`}>
          {[.01,.02,.03,.04,.05].map(v=><g key={v}><path className="chart-grid" d={`M${left} ${y(v)}H${right}`} /><text x={left-10} y={y(v)+4} textAnchor="end">{v*100}%</text></g>)}
          {(limit===10?[0,2,4,6,8,10]:[0,10,20,30,40,50]).map(v=><g key={v}><path className="chart-tick" d={`M${x(v)} ${bottom}v5`} /><text x={x(v)} y={bottom+21} textAnchor="middle">{v}</text></g>)}
          <text x={(left+right)/2} y={height-5} textAnchor="middle">Vida residual · años</text><text x={left} y={15}>YTM anual</text>
          {step>=3&&<g><rect className="short-zone" x={x(0)} y={top} width={x(2)-x(0)} height={bottom-top} /><path className="short-boundary" d={`M${x(2)} ${top}V${bottom}`} /><text x={x(2)+5} y={bottom-8} className="short-label">2Y</text></g>}
          {step>=2&&<path className="fair-line" d={curve.map((p,i)=>`${i?'L':'M'}${x(p.maturityYears)},${y(p.ytm)}`).join(' ')} />}
          <path className="selected-guide" d={`M${left} ${y(selected.ytm)}H${x(selected.maturityYears)}V${bottom}`} />
          {visible.map(p=><g key={p.id} className="point-target" role="button" tabIndex={0} aria-label={`Bono ${p.id}, ${euro(p.maturityYears,1)} años, YTM ${percent(p.ytm)}`} aria-pressed={p.id===selected.id} onClick={()=>choose(p.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(p.id);}}}>
            <circle cx={x(p.maturityYears)} cy={y(p.ytm)} r={12} fill="transparent" />
            <circle className={`bond-point ${step>=3&&p.benchmark?'benchmark-point':''} ${p.id===selected.id?'selected-point':''}`} cx={x(p.maturityYears)} cy={y(p.ytm)} r={p.id===selected.id?6:4} />
          </g>)}
        </svg>
        <div className="chart-legend"><span><i className="point-key"/>Bono observado</span><Build at={2} step={step}><span><i className="line-key"/>Ajuste fair</span></Build><Build at={3} step={step}><span><i className="zone-key"/>Corto: 0–2Y</span></Build></div>
        {limit===10&&<div className="curve-overview"><span>Contexto completo · 0–50 años</span><svg viewBox={`0 0 ${width} 45`} aria-label="El detalle ocupa los primeros diez años de la curva completa"><rect x={left} y={3} width={(right-left)/5} height={30} className="overview-focus" /><path className="fair-line" d={fairCurve.points.map((p,i)=>`${i?'L':'M'}${left+p.maturityYears/50*(right-left)},${32-(p.ytm-.01)/.04*26}`).join(' ')} /><text x={left} y={44}>0</text><text x={left+(right-left)/5} y={44}>10</text><text x={right} y={44} textAnchor="end">50Y</text></svg></div>}
      </div>
      <aside className="curve-reading"><span className="panel-overline">LEER UN PUNTO</span><h2>{selected.id}</h2><div><span>Vida residual</span><strong>{euro(selected.maturityYears,1)}<small> años</small></strong></div><div><span>YTM</span><strong>{percent(selected.ytm)}</strong></div><p>El mismo bono conserva sus coordenadas al cambiar la vista.</p><label className="point-picker">Seleccionar bono<select value={selected.id} onChange={e=>choose(e.currentTarget.value)} aria-label="Bono de la nube">{bondCloud.map(p=><option key={p.id} value={p.id}>{euro(p.maturityYears,1)}Y · {percent(p.ytm)}{p.benchmark?' · benchmark':''}</option>)}</select></label><Build at={3} step={step}><div className="benchmark-list"><b>Referencias benchmark</b><span>2Y · 3Y · 5Y · 7Y<br/>10Y · 15Y · 30Y · 50Y</span><small>Puntos claros: ocho referencias de la nube.</small></div></Build></aside>
    </div>
  </div>;
}
