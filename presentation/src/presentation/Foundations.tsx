import { Landmark, Building2, UsersRound, Factory, Network, FileText, CircleDollarSign, ChartNoAxesCombined, Waypoints, LockKeyhole, CalendarDays } from 'lucide-react';
import { Build, Formula, RangeControl, NumberValue, MiniFlows } from './primitives';
import { chapters } from './content';
import { discountedFlows, euro } from './model';

export function Cover(){return <div className="cover-composition"><div className="cover-copy"><span className="cover-line"/><h1>Fundamentos<br/><em>de los bonos.</em></h1><p>Qué es un bono, cómo se valora<br/>y cómo encaja en la curva.</p><div className="cover-topics"><span><FileText/>Contrato</span><span><CircleDollarSign/>Valor</span><span><Waypoints/>Mercado</span></div></div><div className="cover-preview"><MiniFlows coupon={4} showToday/><svg viewBox="0 0 600 160" aria-label="Anticipo de la curva de tipos"><path d="M20 135H575 M20 135V15" className="axis"/><path d="M25 120C90 90 110 65 190 57S380 35 565 20" className="curve-line"/>{[[35,117],[78,96],[110,90],[143,66],[186,62],[240,45],[308,42],[388,28],[474,28],[552,18]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="3" className="cloud-point"/>)}</svg><span className="preview-label">Del contrato al mapa del mercado</span></div></div>;}
export function Roadmap({onJump}:{onJump:(n:number)=>void}){const icons=[Landmark,CircleDollarSign,ChartNoAxesCombined,Waypoints];return <div className="roadmap">{chapters.map((c,i)=>{const Icon=icons[i]!;return <button key={c.title} onClick={()=>onJump(c.slide)} className="station"><span className="station-icon"><Icon strokeWidth={1.2}/></span><span className="station-number">0{i+1}</span><h2>{c.full}</h2><span className="station-detail">{['Estructura','DCF y precio','Rendimiento','Mercado y curva'][i]}</span><span className="station-range">Temas {c.range}</span></button>})}</div>;}

export function Financing({step}:{step:number}) {return <div className="financing-map">
  <svg className="financing-lines" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="cyan-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="var(--cyan)"/></marker><marker id="lime-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="var(--lime)"/></marker></defs>
    <path d="M320 112V146Q320 163 340 163H455Q472 163 472 187" className="connector cyan" markerEnd="url(#cyan-arrow)"/>
    <path d="M680 112V146Q680 163 660 163H548Q530 163 530 187" className="connector cyan" markerEnd="url(#cyan-arrow)"/>
    <path data-visible={step>=1} d="M470 422V315" className="connector cyan flow-connection" markerEnd="url(#cyan-arrow)"/>
    <path data-visible={step>=2} d="M532 315V422" className="connector lime flow-connection" markerEnd="url(#lime-arrow)"/>
    <path data-visible={step>=3} d="M350 256H185Q170 256 170 281" className="connector cyan flow-connection" markerEnd="url(#cyan-arrow)"/>
    <path data-visible={step>=3} d="M650 256H815Q830 256 830 281" className="connector lime flow-connection" markerEnd="url(#lime-arrow)"/>
  </svg>
  <div className="map-node state-node"><Landmark/><h2>Estado</h2></div><div className="map-node company-node"><Building2/><h2>Empresa</h2></div>
  <Build at={1} step={step} className="investor-node"><div className="map-node"><UsersRound/><h2>Inversores</h2></div></Build>
  <Build at={1} step={step} className="capital-label"><span>Capital hoy</span></Build>
  <Build at={2} step={step} className="payment-label"><span>Pagos futuros</span></Build>
  <Build at={3} step={step} className="public-use"><Network/><span>Infraestructura<br/>Servicios públicos</span></Build>
  <Build at={3} step={step} className="private-use"><Factory/><span>Proyectos<br/>Crecimiento</span></Build>
</div>;}

export function Anatomy({step}:{step:number}) {return <div className="anatomy-composition"><Build at={1} step={step} className="anatomy-links"><svg viewBox="0 0 1132 389" preserveAspectRatio="none" aria-hidden="true"><path d="M451 204H477V43H561"/><path d="M451 234H500V79H561"/><circle cx="451" cy="204" r="3"/><circle cx="451" cy="234" r="3"/></svg></Build><div className="anatomy-definitions"><div className="contract-eyebrow"><LockKeyhole/>Lo que promete el contrato</div><Build at={1} step={step}><div className="definition-pair"><b>Notional</b><p>La base para calcular el cupón.</p><strong>100 €</strong></div><div className="definition-pair"><b>Principal</b><p>Lo que se devuelve al vencimiento.</p><strong>100 €</strong></div><div className="definition-pair"><b>Plazo y frecuencia</b><p>Cinco años. Un pago cada año.</p><CalendarDays/></div></Build>
  <Build at={2} step={step} className="coupon-calculation"><span>Del porcentaje al pago</span><Formula>{'C = c \\times N = 4\\% \\times 100 = \\mathbf{4\\,€}'}</Formula></Build>
  <div className="market-observation"><span>Precio observado hoy</span><strong>100 €</strong><small>Se negocia en el mercado</small></div>
  </div><Build at={3} step={step} className="principal-explanation"><b>104 €</b><span>= 4 € de cupón + 100 € de principal</span></Build></div>;}

export function DiscountTheory({step,selected}:{step:number;selected:number}) {const t=selected===5?'n':selected===4?'n-1':selected===3?'t':String(selected);return <div className="discount-theory">
  <Build at={1} step={step} className="discount-link"><svg viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true"><path d={`M${((19+72*(selected-.5)/5)-5.8)/88.4*1000} 0C${((19+72*(selected-.5)/5)-5.8)/88.4*1000} 70 500 20 500 95`} className="connector cyan"/></svg></Build>
  <Build at={1} step={step} className="single-discount"><span className="discount-action">Valor equivalente hoy</span><Formula display>{`PV(CF_{${t}}) = \\frac{CF_{${t}}}{(1+r_{${t}})^{${t}}}`}</Formula></Build>
  <Build at={2} step={step} className="price-formula"><span>Precio hoy</span><Formula display>{'P_0 = \\sum_{t=1}^{n} \\frac{CF_t}{(1+r_t)^t}'}</Formula></Build>
  <div className="symbol-legend"><span><Formula>{'CF_t'}</Formula> Pago futuro</span><span><Formula>{'r_t'}</Formula> Tasa para ese plazo</span><span><Formula>{'t'}</Formula> Años hasta el pago</span><span><Formula>{'n'}</Formula> Vencimiento</span></div>
</div>;}

export function DiscountExample({step,rate,onRate,selected}:{step:number;rate:number;onRate:(n:number)=>void;selected:number}) {const flows=discountedFlows(rate);const total=flows.reduce((s,f)=>s+f.pv,0);return <div className="discount-example"><div className="bond-summary"><span>5 años</span><span>Cupón 4% anual</span><span>N = FV = 100 €</span></div>
  <Build at={1} step={step} className="discount-terms">{flows.map(f=><div key={f.period} className={`discount-term ${selected===f.period?'selected':''}`}><span className="term-link"/><Formula display>{`\\frac{${f.amount}}{(1+r_${f.period})^{${f.period}}}`}</Formula><span className="term-rate">r{['₀','₁','₂','₃','₄','₅'][f.period]} = {euro(f.rate*100,1)}%</span><Build at={2} step={step}><b><NumberValue value={f.pv}/> <small>€</small></b></Build></div>)}</Build>
  <Build at={2} step={step} className="price-total"><div><span>Valor presente total</span><strong><NumberValue value={total}/> <small>€</small></strong></div><Formula>{'P_0 = \\sum_{t=1}^{5} PV(CF_t)'}</Formula></Build>
  <Build at={3} step={step} className="discount-lab"><RangeControl label="Tasa del año 5 · r₅" value={rate} onChange={onRate} min={0} max={.1} sub="r₁, r₂, r₃ y r₄ permanecen al 4%."/></Build>
  <div className="discount-convention">Tasas anuales efectivas · cálculo sin redondear; cada importe visible se redondea a céntimos.</div>
</div>;}
