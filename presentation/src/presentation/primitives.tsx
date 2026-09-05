import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { Landmark, ShieldCheck, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import katex from 'katex';
import { euro } from './model';

export function Formula({ children, className='' }: {children:string;className?:string}) {
  return <span className={`formula ${className}`} dangerouslySetInnerHTML={{__html:katex.renderToString(children,{throwOnError:false,output:'htmlAndMathml',strict:'ignore'})}} />;
}
export function Build({ at, step, children, className='' }: {at:number;step:number;children:ReactNode;className?:string}) {
  const visible=step>=at;
  return <div className={`build ${className}`} data-build={at} data-visible={visible} aria-hidden={!visible} inert={!visible}>{children}</div>;
}
export function NumberValue({value,decimals=2,suffix=''}:{value:number;decimals?:number;suffix?:string}) {
  const element=useRef<HTMLSpanElement>(null);const previous=useRef(value);
  useEffect(()=>{
    const from=previous.current;previous.current=value;
    if(!element.current)return;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).get('motion')==='0'){element.current.textContent=euro(value,decimals)+suffix;return;}
    const obj={n:from};const tween=gsap.to(obj,{n:value,duration:.45,ease:'power2.out',onUpdate:()=>{if(element.current)element.current.textContent=euro(obj.n,decimals)+suffix;}});
    return ()=>{tween.kill();};
  },[value,decimals,suffix]);
  return <span ref={element} data-value={value} className="tabular">{euro(value,decimals)}{suffix}</span>;
}
export function RangeControl({label,value,onChange,min=0,max=.1,step=.005,sub}: {label:string;value:number;onChange:(n:number)=>void;min?:number;max?:number;step?:number;sub?:string}) {
  return <label className="range-control"><span>{label}<output>{euro(value*100,1)}%</output></span><input type="range" aria-label={label} min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.currentTarget.value))}/>{sub&&<small>{sub}</small>}</label>;
}

export function BondActor({slide,step,motion}:{slide:number;step:number;motion:boolean}) {
  const el=useRef<HTMLDivElement>(null);
  const shown=[0,2,3,4,5].includes(slide);
  const detailed=slide===3||slide===0;
  const pos=slide===0?{left:'70%',top:'43%',width:'26%',height:'42%',rotation:-6}:
    slide===2?{left:'50%',top:'53%',width:'25%',height:'23%',rotation:0}:
    slide===3?{left:'25%',top:'52%',width:'32%',height:'52%',rotation:0}:
    {left:'10.5%',top:'43%',width:'10%',height:'13%',rotation:0};
  useLayoutEffect(()=>{
    if(!el.current)return;
    const tween=gsap.to(el.current,{...pos,x:0,y:0,xPercent:-50,yPercent:-50,opacity:shown?1:0,duration:motion?.8:0,ease:'power3.inOut',overwrite:true});
    return ()=>{tween.kill();};
  },[slide,motion,shown]);
  return <div ref={el} className={`bond-actor ${detailed?'detailed':'compact'} ${slide===2?'navy-certificate':''}`} data-entity="canonical-bond" aria-hidden={!shown} inert={!shown}>
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

export function CashflowSpine({slide,step,motion,selected,onSelect}:{slide:number;step:number;motion:boolean;selected:number;onSelect:(n:number)=>void}) {
  const el=useRef<HTMLDivElement>(null);const shown=(slide===3&&step>=3)||slide===4||slide===5;
  const pos=slide===3?{left:'47%',top:'67%',width:'47%'}:{left:'19%',top:slide===5?'33%':'35%',width:'72%'};
  useLayoutEffect(()=>{if(!el.current)return;const tween=gsap.to(el.current,{...pos,opacity:shown?1:0,duration:motion?.7:0,ease:'power3.inOut',overwrite:true});return()=>{tween.kill();};},[slide,shown,motion]);
  const symbolic=slide===4;
  return <div ref={el} className={`flow-spine ${slide===3?'small-rail':''}`} data-entity="canonical-cashflows" aria-hidden={!shown} inert={!shown}>
    {slide===3&&<div className="flow-origin"><span>Hoy</span><b>−100 €</b></div>}
    <div className="flow-track">{[1,2,3,4,5].map(t=><button key={t} id={`cashflow-${t}`} className={`cashflow ${t===5?'principal-flow':''} ${selected===t?'selected':''}`} aria-label={symbolic?`Flujo del periodo ${t===5?'n':t}`:`Flujo año ${t}: ${t===5?'104':'4'} euros`} aria-pressed={selected===t} onClick={()=>onSelect(t)}>
      <span className="cash-amount">{symbolic?(t===3?'⋯':t===4?<Formula>{'C_{n-1}'}</Formula>:t===5?<><Formula>{'C_n'}</Formula><small>+ principal</small></>:<Formula>{`C_${t}`}</Formula>):<>{t===5?'104':'4'}<small>€</small></>}</span>
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
