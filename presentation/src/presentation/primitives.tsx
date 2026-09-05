import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Landmark, ShieldCheck, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';

import { euro } from './model';

export { Formula, Build, NumberValue, RangeControl } from '../visuals/Primitives';
import { Formula } from '../visuals/Primitives';

// Exchange labels while the stable outline/rail continues its spatial journey.
function useContentMode(mode:boolean,motion:boolean,ref:RefObject<HTMLDivElement|null>,selector:string){
  const [displayed,setDisplayed]=useState(mode);
  useLayoutEffect(()=>{
    const targets=ref.current?.querySelectorAll(selector);if(!targets)return;
    if(!motion||displayed===mode){setDisplayed(mode);gsap.set(targets,{opacity:1});return;}
    const timeline=gsap.timeline().to(targets,{opacity:0,duration:.1}).call(()=>setDisplayed(mode)).to(targets,{opacity:1,duration:.2});
    return()=>{timeline.kill();gsap.set(targets,{opacity:1});};
  },[mode,motion]);
  return displayed;
}

export function BondActor({mode,step,motion}:{mode: 'cover'|'financing'|'anatomy'|'valuation'|'hidden';step:number;motion:boolean}) {
  const el=useRef<HTMLDivElement>(null);
  const shown=mode!=='hidden';
  const detailed=useContentMode(mode==='anatomy'||mode==='cover',motion,el,'.certificate-rim');
  const pos=mode==='cover'?{left:'70%',top:'43%',width:'26%',height:'42%',rotation:-6}:
    mode==='financing'?{left:'50%',top:'53%',width:'25%',height:'23%',rotation:0}:
    mode==='anatomy'?{left:'25%',top:'52%',width:'32%',height:'52%',rotation:0}:
    {left:'10.5%',top:'43%',width:'10%',height:'13%',rotation:0};
  useLayoutEffect(()=>{
    if(!el.current)return;
    const tween=gsap.to(el.current,{...pos,x:0,y:0,xPercent:-50,yPercent:-50,autoAlpha:shown?1:0,duration:motion?(shown?.8:.18):0,ease:'power3.inOut',overwrite:true});
    return ()=>{tween.kill();};
  },[mode,motion,shown]);
  return <div ref={el} className={`bond-actor ${detailed?'detailed':'compact'} ${mode==='financing'?'navy-certificate':''}`} data-entity="canonical-bond" aria-hidden={!shown} inert={!shown}>
    <div className="certificate-rim"><div className="certificate-seal"><Landmark aria-hidden="true"/></div>
      <div className="certificate-name">BONO{detailed&&<span>5 AÑOS</span>}</div>
      {detailed&&<><div className="certificate-rule"/><div className="certificate-fields">
        <div className={step===1?'emphasis':''}><span>Emisor</span><b>Estado o empresa</b></div>
        <div className={step===2?'emphasis':''}><span>Cupón anual</span><b>4%</b></div>
        <div className={step===1?'emphasis':''}><span>Notional · N</span><b>100 €</b></div>
        <div className={step===1?'emphasis':''}><span>Principal · FV</span><b>100 €</b></div>
        <div><span>Vencimiento · T</span><b>5 años</b></div>
        <div><span>Frecuencia</span><b>Anual</b></div>
      </div><div className="certificate-foot"><ShieldCheck aria-hidden="true"/> Condiciones contractuales</div></>}
    </div>
  </div>;
}

export function CashflowSpine({mode,step,motion,selected,onSelect}:{mode:'anatomy'|'theory'|'example'|'returns'|'hidden';step:number;motion:boolean;selected:number;onSelect:(n:number)=>void}) {
  const el=useRef<HTMLDivElement>(null);
  const shown=mode!=='hidden'&&(mode!=='anatomy'||step>=3);
  const positions={
    anatomy:{left:'47%',top:'67%',width:'47%',height:'12%'},
    theory:{left:'19%',top:'35%',width:'72%',height:'17%'},
    example:{left:'19%',top:'33%',width:'72%',height:'17%'},
    returns:{left:'8%',top:'68%',width:'34%',height:'9%'},
    hidden:{left:'19%',top:'35%',width:'72%',height:'17%'},
  };
  useLayoutEffect(()=>{
    if(!el.current)return;
    const tween=gsap.to(el.current,{...positions[mode],autoAlpha:shown?1:0,duration:motion?(shown?.65:.15):0,ease:'power3.inOut',overwrite:true});
    return()=>{tween.kill();};
  },[mode,shown,motion]);
  const symbolic=useContentMode(mode==='theory',motion,el,'.cash-amount,.cash-date,.maturity-label');
  return <div ref={el} className={`flow-spine ${mode==='anatomy'?'small-rail':''} ${mode==='returns'?'return-rail':''}`} data-entity="canonical-cashflows" aria-hidden={!shown} inert={!shown}>
    {mode==='anatomy'&&<div className="flow-origin"><span>Hoy</span><b>−100 €</b></div>}
    <div className="flow-track">{[1,2,3,4,5].map(t=><button key={t} id={`cashflow-${t}`} className={`cashflow ${t===5?'principal-flow':''} ${selected===t?'selected':''}`} aria-label={symbolic?`Flujo del periodo ${t===5?'n':t}`:`Flujo año ${t}: ${t===5?'104':'4'} euros`} aria-pressed={selected===t} onClick={()=>onSelect(t)}>
      <span className="cash-amount">{symbolic?(t===3?'⋯':t===4?<Formula>{'CF_{n-1}'}</Formula>:t===5?<><Formula>{'CF_n'}</Formula><small>incluye principal</small></>:<Formula>{`CF_${t}`}</Formula>):<>{t===5?'104':'4'}<small>€</small></>}</span>
      <span className="cash-stem"/><span className="cash-node"/>
      <span className="cash-date">{symbolic?(t===3?'':t===4?'t = n − 1':t===5?'t = n':`t = ${t}`):`${t} año${t>1?'s':''}`}</span>
      {t===5&&<span className="maturity-label">Vencimiento</span>}
    </button>)}</div>
  </div>;
}

export function MiniFlows({coupon,showToday=false}:{coupon:number;showToday?:boolean}) {
  return <div className="mini-flows">{showToday&&<div><b>−100</b><span>Hoy</span></div>}{[1,2,3,4,5].map(t=><div key={t} className={t===5?'last':''}><b>{euro(t===5?100+coupon:coupon,0)}</b><i/><span>{t}Y</span></div>)}</div>;
}
export function EquationStep({number,label,children}:{number:string;label:string;children:ReactNode}) {
  return <div className="equation-step"><span className="step-number">{number}</span><div><h3>{label}</h3>{children}</div></div>;
}
export function SmallFact({label,children}:{label:string;children:ReactNode}) {return <div className="small-fact"><span>{label}</span><b>{children}</b></div>;}
export function Outcome({children}:{children:ReactNode}) {return <div className="outcome"><ArrowUpRight aria-hidden="true"/><span>{children}</span></div>;}
