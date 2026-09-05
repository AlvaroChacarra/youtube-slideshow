import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Grid2X2, BookOpen, RotateCcw, Maximize, X, Check, HelpCircle } from 'lucide-react';
import gsap from 'gsap';
import { slides, glossary, chapters } from './content';
import { clampPosition, movePosition, euro, type Position } from './model';
import { BondActor, CashflowSpine } from './primitives';
import { Cover, Roadmap, Financing, Anatomy, DiscountTheory, DiscountExample } from './Foundations';
import { ReturnsComparison, CouponComparison, BondGenerations, PriceDiscovery, MarketCurve, RecapFoundations, RecapMarket } from './Markets';

const counts=slides.map(s=>s.steps.length);
export default function Presentation(){
  const [pos,setPos]=useState<Position>({slide:0,step:0});const remembered=useRef<number[]>(slides.map(()=>0));
  const [motion,setMotion]=useState(false);const [capture,setCapture]=useState(false);const [rate,setRate]=useState(.04);const [reinvestment,setReinvestment]=useState(0);const [marketYield,setMarketYield]=useState(.04);const [flow,setFlow]=useState(5);
  const [modal,setModal]=useState<'index'|'notes'|'help'|null>(null);const [answer,setAnswer]=useState(false);const [ready,setReady]=useState(false);
  const [curvePoint,setCurvePoint]=useState<string|null>(null);
  const stage=useRef<HTMLElement>(null);const dialog=useRef<HTMLDialogElement>(null);
  const current=slides[pos.slide]!;
  useEffect(()=>{if(ready){window.scrollTo({top:0,behavior:'instant'});stage.current?.focus({preventScroll:true});}},[pos.slide,ready]);
  useEffect(()=>{
    const q=new URLSearchParams(location.search);const p=clampPosition(Number(q.get('slide')||1)-1,Number(q.get('step')||0),counts);setPos(p);remembered.current[p.slide]=p.step;
    setCapture(q.get('capture')==='1');setMotion(q.get('motion')!=='0'&&!matchMedia('(prefers-reduced-motion: reduce)').matches);setReady(true);
    const media=matchMedia('(prefers-reduced-motion: reduce)');const changed=()=>setMotion(!media.matches&&new URLSearchParams(location.search).get('motion')!=='0');media.addEventListener('change',changed);return()=>media.removeEventListener('change',changed);
  },[]);
  useEffect(()=>{if(!ready)return;const u=new URL(location.href);u.searchParams.set('slide',String(pos.slide+1));u.searchParams.set('step',String(pos.step));if(capture)u.searchParams.set('capture','1');else u.searchParams.delete('capture');try{history.replaceState(null,'',u);}catch{/* Some local HTML viewers restrict History API. */}remembered.current[pos.slide]=pos.step;setAnswer(false);document.title=`${pos.slide+1}. ${current.title} · Fundamentos de los bonos`;},[pos,capture,ready,current.title]);
  useEffect(()=>{const onPop=()=>{const q=new URLSearchParams(location.search);setPos(clampPosition(Number(q.get('slide')||1)-1,Number(q.get('step')||0),counts));};addEventListener('popstate',onPop);return()=>removeEventListener('popstate',onPop);},[]);
  function move(dir:1|-1){setPos(p=>movePosition(p,dir,counts));}
  function jump(slide:number){setPos(clampPosition(slide,remembered.current[slide]??0,counts));setModal(null);}
  function reset(){setPos({slide:pos.slide,step:0});if(pos.slide===5)setRate(.04);if(pos.slide===6)setReinvestment(0);if(pos.slide===9)setMarketYield(.04);if(pos.slide===10)setCurvePoint(null);setFlow(5);setAnswer(false);}
  useEffect(()=>{const key=(e:KeyboardEvent)=>{
    if(e.defaultPrevented||e.isComposing||e.ctrlKey||e.metaKey||e.altKey)return;
    if((e.target as HTMLElement)?.closest('input,textarea,select,[contenteditable="true"]')||dialog.current?.open)return;
    if(e.key===' '&&(e.target as HTMLElement)?.closest('button,[role="button"]'))return;
    if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();move(1);}else if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();move(-1);}
    else if(e.key==='Home'){e.preventDefault();setPos({slide:0,step:0});}else if(e.key==='End'){e.preventDefault();setPos({slide:12,step:counts[12]!-1});}
    else if(e.key.toLowerCase()==='n')setModal('notes');else if(e.key.toLowerCase()==='i')setModal('index');else if(e.key.toLowerCase()==='c')setCapture(v=>!v);else if(e.key.toLowerCase()==='r')reset();else if(e.key==='Escape')setCapture(false);
  };addEventListener('keydown',key);return()=>removeEventListener('keydown',key);},[pos]);
  useEffect(()=>{if(modal&&!dialog.current?.open)dialog.current?.showModal();if(!modal&&dialog.current?.open)dialog.current?.close();},[modal]);
  useLayoutEffect(()=>{if(!stage.current)return;const tweens=Array.from(stage.current.querySelectorAll<HTMLElement>('.build')).map(el=>gsap.to(el,{autoAlpha:el.dataset.visible==='true'?1:0,y:el.dataset.visible==='true'?0:8,duration:motion?.42:0,ease:'power2.out',overwrite:true}));return()=>tweens.forEach(t=>t.kill());},[pos,motion]);
  useLayoutEffect(()=>{if(!stage.current||!motion)return;const tween=gsap.fromTo(stage.current.querySelector('.slide-header'),{opacity:.2,y:8},{opacity:1,y:0,duration:.45});return()=>{tween.kill();};},[pos.slide,motion]);
  useLayoutEffect(()=>{
    const body=stage.current?.querySelector('.slide-body');if(!body)return;
    if(!motion){gsap.set(body,{opacity:1,y:0});return;}
    const tween=gsap.fromTo(body,{opacity:0,y:6},{opacity:1,y:0,duration:.4,delay:pos.slide>=2&&pos.slide<=6?.72:.18,ease:'power2.out'});
    return()=>{tween.kill();};
  },[pos.slide,motion]);
  let caption=current.captions[pos.step]??'';
  if(pos.slide===5&&pos.step===2&&rate!==.04)caption=`Con r₅ = ${euro(rate*100,1)}% y las otras tasas al 4%, el precio cambia. Los pagos contractuales se mantienen.`;
  return <div className={`presentation ${capture?'capture':''}`} data-ready={ready} data-motion={motion}>
    <main ref={stage} tabIndex={-1} className={`stage slide-${pos.slide}`} data-slide={pos.slide+1} data-step={pos.step} aria-label={`Slide ${pos.slide+1} de 13: ${current.title}`}>
      {[0,2].includes(pos.slide)&&<div className="skyline" style={{backgroundImage:`url(${import.meta.env.OFFLINE_SKYLINE||`${import.meta.env.BASE_URL}assets/financial-skyline.webp`})`}} aria-hidden="true"/>}
      <div className="stage-topline"><span className="block-mark">01</span><span>FIXED INCOME <i/> FUNDAMENTOS</span><span className="author-mark">ÁLVARO LÓPEZ CHACARRA</span></div>
      {pos.slide!==0&&<header className="slide-header"><span className="eyebrow">{current.eyebrow}</span><h1>{current.title}</h1></header>}
      <div className="slide-body">
        {pos.slide===0&&<Cover/>}{pos.slide===1&&<Roadmap onJump={jump}/>}{pos.slide===2&&<Financing step={pos.step}/>}{pos.slide===3&&<Anatomy step={pos.step}/>}
        {pos.slide===4&&<DiscountTheory step={pos.step} selected={flow}/>}{pos.slide===5&&<DiscountExample step={pos.step} rate={rate} onRate={setRate} selected={flow}/>}
        {pos.slide===6&&<ReturnsComparison step={pos.step} rate={reinvestment} onRate={setReinvestment}/>}{pos.slide===7&&<CouponComparison step={pos.step}/>}
        {pos.slide===8&&<BondGenerations step={pos.step}/>}{pos.slide===9&&<PriceDiscovery step={pos.step} rate={marketYield} onRate={setMarketYield}/>}
        {pos.slide===10&&<MarketCurve step={pos.step} chosen={curvePoint} onChoose={setCurvePoint}/>}{pos.slide===11&&<RecapFoundations step={pos.step}/>}{pos.slide===12&&<RecapMarket step={pos.step}/>}
      </div>
      <BondActor slide={pos.slide} step={pos.step} motion={motion}/><CashflowSpine slide={pos.slide} step={pos.step} motion={motion} selected={flow} onSelect={setFlow}/>
      {pos.slide>0&&<div className="slide-takeaway" aria-live="polite"><span className="takeaway-line"/><p>{caption}</p></div>}
      <div className="stage-bottomline"><div className="chapter-track">{chapters.map((c,i)=><span key={c.title} className={current.chapter===i?'active':''}>{c.title}</span>)}</div><span className="slide-count">{String(pos.slide+1).padStart(2,'0')} <i>/</i> 13</span></div>
    </main>
    <nav className="deck-controls" aria-label="Controles de la presentación"><div className="control-tools"><button onClick={()=>setModal('index')} aria-label="Índice del bloque" title="Índice · I"><Grid2X2/></button><button onClick={()=>setModal('notes')} aria-label="Notas y pregunta" title="Notas · N"><BookOpen/></button><button onClick={()=>setModal('help')} aria-label="Recordar conceptos y controles" title="Recordar"><HelpCircle/></button><button onClick={reset} aria-label="Reiniciar esta slide" title="Reiniciar · R"><RotateCcw/></button><button onClick={()=>setCapture(true)} aria-label="Vista limpia para grabar" title="Vista limpia · C"><Maximize/></button></div>
      <div className="step-navigation"><button className="nav-arrow" onClick={()=>move(-1)} disabled={pos.slide===0&&pos.step===0} aria-label="Paso anterior"><ArrowLeft/></button><div className="step-summary"><span>{current.steps[pos.step]}</span><div className="step-dots">{current.steps.map((s,i)=><button key={s} onClick={()=>setPos({...pos,step:i})} aria-label={`Paso ${i+1}: ${s}`} aria-current={i===pos.step?'step':undefined} className={i<=pos.step?'filled':''}/>)}</div></div><button className="nav-arrow next" onClick={()=>move(1)} disabled={pos.slide===12&&pos.step===counts[12]!-1} aria-label="Paso siguiente"><ArrowRight/></button></div>
    </nav>
    {capture&&<button className="exit-capture" onClick={()=>setCapture(false)}>Mostrar controles · C</button>}
    <dialog ref={dialog} className={`deck-dialog ${modal==='index'?'index-dialog':''}`} onClose={()=>setModal(null)} onClick={e=>{if(e.target===e.currentTarget)setModal(null);}} aria-label={modal==='index'?'Índice del bloque':modal==='notes'?'Notas y pregunta':'Recordar conceptos y controles'}>
      <button className="dialog-close" onClick={()=>setModal(null)} aria-label="Cerrar"><X/></button>
      {modal==='index'&&<><span className="eyebrow">Bloque 1 · 13 slides</span><h2>El recorrido completo.</h2><div className="index-list">{slides.map((s,i)=><button key={s.slug} onClick={()=>jump(i)} className={i===pos.slide?'current':''}><span>{String(i+1).padStart(2,'0')}</span><div><b>{s.title}</b><small>{s.eyebrow}</small></div><ArrowRight/></button>)}</div></>}
      {modal==='notes'&&<><span className="eyebrow">{current.eyebrow}</span><h2>{current.title}</h2><p className="speaker-note">{current.note}</p><div className="recall-question"><h3>Para comprobar comprensión</h3><p>{current.question}</p><button onClick={()=>setAnswer(v=>!v)}>{answer?'Ocultar respuesta':'Ver respuesta'}</button>{answer&&<p className="answer"><Check/>{current.answer}</p>}</div></>}
      {modal==='help'&&<><span className="eyebrow">Ayuda bajo demanda</span><h2>Recordar y continuar.</h2><div className="keyboard-guide"><span>← → <b>Avanzar por pasos</b></span><span>I <b>Índice</b></span><span>N <b>Notas</b></span><span>R <b>Reiniciar slide</b></span><span>C <b>Vista limpia</b></span><span>Esc <b>Volver</b></span></div>{glossary.map(([term,definition])=><details key={term}><summary>{term}</summary><p>{definition}</p></details>)}</>}
    </dialog>
  </div>;
}
