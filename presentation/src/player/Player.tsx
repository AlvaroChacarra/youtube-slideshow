import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Grid2X2, BookOpen, RotateCcw, Maximize, X, Check, HelpCircle, MonitorUp, Circle, Download, Play, Square, Link, Camera } from 'lucide-react';
import gsap from 'gsap';
import type { DeckDefinition, Scenario, Snapshot, SceneContext } from './types';
import { clampPosition, movePosition, positionOf, snapshotOf, assertDeck } from './state';
import { parseSession, readSharedState, sessionStateAt, shareHash, type RecordedSession, type SessionEvent } from './session';
import { useWindowSync } from './useWindowSync';

export default function Player<S extends Scenario>({deck}:{deck:DeckDefinition<S>}){
  const [state,setState]=useState<Snapshot<S>>(()=>{assertDeck(deck);return snapshotOf(deck,{slide:0,step:0},deck.initialScenario);});
  const pos=positionOf(deck,state),current=deck.scenes[pos.slide]!;
  const counts=deck.scenes.map(s=>s.steps.length);
  const [ready,setReady]=useState(false),[motion,setMotion]=useState(false),[capture,setCapture]=useState(false),[presenter,setPresenter]=useState(false),[camera,setCamera]=useState(false);
  const [modal,setModal]=useState<'index'|'notes'|'help'|'session'|null>(null),[answer,setAnswer]=useState(false),[concept,setConcept]=useState<string|null>(null);
  const [notice,setNotice]=useState(''),[recording,setRecording]=useState(false),[playing,setPlaying]=useState(false);
  const [recorded,setRecorded]=useState<RecordedSession<S>|null>(null),[sessionText,setSessionText]=useState('');
  const stage=useRef<HTMLElement>(null),dialog=useRef<HTMLDialogElement>(null),returnFocus=useRef<HTMLElement|null>(null);
  const remembered=useRef<Record<string,string>>({});
  const recordStart=useRef(0),events=useRef<SessionEvent<S>[]>([]),raf=useRef(0),latest=useRef(state);latest.current=state;
  const sync=useWindowSync(deck,state,setState,ready,presenter);
  const commit=(next:Snapshot<S>)=>{positionOf(deck,next);setState(next);if(presenter)sync.command(next);};
  function stopPlayback(){cancelAnimationFrame(raf.current);setPlaying(false);}
  function go(next:Snapshot<S>){stopPlayback();commit(next);}
  function move(dir:1|-1){go(snapshotOf(deck,movePosition(pos,dir,counts),state.scenario));}
  function jump(id:string){const index=deck.scenes.findIndex(s=>s.id===id);if(index<0)return;const scene=deck.scenes[index]!;const step=Math.max(0,scene.steps.findIndex(s=>s.id===remembered.current[id]));go(snapshotOf(deck,{slide:index,step},state.scenario));closeDialog();}
  function update(patch:Partial<S>){go({...state,scenario:{...state.scenario,...patch}});}
  function reset(){go(snapshotOf(deck,{slide:pos.slide,step:0},deck.resetScene(current.id,state.scenario)));setAnswer(false);}
  function openDialog(kind:typeof modal,conceptId:string|null=null){returnFocus.current=document.activeElement as HTMLElement;setConcept(conceptId);setModal(kind);}
  function closeDialog(){setModal(null);setConcept(null);}
  const ctx:SceneContext<S>={sceneId:current.id,step:pos.step,motion,scenario:state.scenario,update,jump};
  const caption=current.caption?.(ctx)??current.steps[pos.step]!.caption;
  const nextPos=movePosition(pos,1,counts),nextScene=deck.scenes[nextPos.slide]!;

  useEffect(()=>{
    const q=new URLSearchParams(location.search);
    setPresenter(q.get('view')==='presenter');setCapture(q.get('capture')==='1');setCamera(q.get('camera')==='1');
    try{const shared=readSharedState(location.hash,deck);if(shared)setState(shared);else setState(snapshotOf(deck,clampPosition(Number(q.get('slide')||1)-1,Number(q.get('step')||0),counts),deck.initialScenario));}
    catch{setNotice('No se pudo recuperar el enlace. Se ha abierto el estado inicial.');}
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    const changed=()=>setMotion(!media.matches&&new URLSearchParams(location.search).get('motion')!=='0');changed();media.addEventListener('change',changed);setReady(true);
    return()=>{media.removeEventListener('change',changed);cancelAnimationFrame(raf.current);};
  },[deck]);
  useEffect(()=>{
    if(!ready)return;
    remembered.current[current.id]=state.stepId;setAnswer(false);
    const u=new URL(location.href);u.searchParams.set('slide',String(pos.slide+1));u.searchParams.set('step',String(pos.step));
    if(capture)u.searchParams.set('capture','1');else u.searchParams.delete('capture');
    // A previously shared hash must never override a later navigated scenario on reload.
    if(u.hash.startsWith('#state='))u.hash=shareHash(state);
    try{history.replaceState(null,'',u);}catch{/* Embedded file viewers may restrict history. */}
    document.title=`${pos.slide+1}. ${current.title} · ${deck.title}`;
  },[state,capture,ready,deck.title]);
  useEffect(()=>{if(ready&&!presenter){window.scrollTo({top:0,behavior:'instant'});stage.current?.focus({preventScroll:true});}},[current.id,ready,presenter]);
  useEffect(()=>{if(modal&&!dialog.current?.open)dialog.current?.showModal();if(!modal&&dialog.current?.open){dialog.current.close();returnFocus.current?.focus({preventScroll:true});}},[modal]);
  useEffect(()=>{
    const key=(e:KeyboardEvent)=>{
      if(e.defaultPrevented||e.isComposing||e.ctrlKey||e.metaKey||e.altKey||(e.target as HTMLElement)?.closest('input,textarea,select,[contenteditable="true"]')||dialog.current?.open)return;
      if(e.key===' '&&(e.target as HTMLElement)?.closest('button,[role="button"]'))return;
      if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();move(1);}else if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();move(-1);}
      else if(e.key==='Home'){e.preventDefault();go(snapshotOf(deck,{slide:0,step:0},state.scenario));}
      else if(e.key==='End'){e.preventDefault();go(snapshotOf(deck,{slide:counts.length-1,step:counts.at(-1)!-1},state.scenario));}
      else if(e.key.toLowerCase()==='n')openDialog('notes');else if(e.key.toLowerCase()==='i')openDialog('index');else if(e.key.toLowerCase()==='c')setCapture(v=>!v);else if(e.key.toLowerCase()==='r')reset();else if(e.key==='Escape'){setCapture(false);stopPlayback();}
    };addEventListener('keydown',key);return()=>removeEventListener('keydown',key);
  });
  useLayoutEffect(()=>{
    if(!stage.current)return;
    // One timeline owns the scene's reveal properties. Reversals kill it completely.
    const timeline=gsap.timeline();
    stage.current.querySelectorAll<HTMLElement>('.build').forEach(el=>timeline.to(el,{autoAlpha:el.dataset.visible==='true'?1:0,y:0,duration:motion?.3:0,ease:'power2.out'},0));
    return()=>{timeline.kill();};
  },[current.id,pos.step,motion,presenter]);
  useEffect(()=>{
    if(!recording)return;
    const last=events.current.at(-1);
    if(JSON.stringify(last?.state)!==JSON.stringify(state))events.current.push({at:Math.round(performance.now()-recordStart.current),state:structuredClone(state)});
  },[state,recording]);
  function startRecording(){stopPlayback();recordStart.current=performance.now();events.current=[{at:0,state:structuredClone(state)}];setRecorded(null);setRecording(true);setNotice('Grabando el recorrido y los escenarios.');}
  function stopRecording(){const result:RecordedSession<S>={format:'presentation-session',version:1,deckId:deck.id,deckVersion:deck.version,duration:Math.round(performance.now()-recordStart.current),events:events.current};setRecorded(result);setSessionText(JSON.stringify(result,null,2));setRecording(false);setNotice('Recorrido guardado en esta ventana. Puedes descargarlo o reproducirlo.');}
  function playSession(session:RecordedSession<S>){
    if(recording)return;stopPlayback();const started=performance.now();setPlaying(true);setModal(null);let previous='';
    const tick=()=>{const elapsed=performance.now()-started;const next=sessionStateAt(session,elapsed);const key=JSON.stringify(next);if(key!==previous){commit(next);previous=key;}
      if(elapsed<session.duration)raf.current=requestAnimationFrame(tick);else setPlaying(false);
    };tick();
  }
  function loadSession(){try{const parsed=parseSession(sessionText,deck);setRecorded(parsed);setNotice(`Sesión lista: ${parsed.events.length} estados, ${(parsed.duration/1000).toFixed(1)} segundos.`);}catch(error){setNotice(error instanceof Error?error.message:'Sesión no válida.');}}
  function downloadSession(){if(!recorded)return;const url=URL.createObjectURL(new Blob([JSON.stringify(recorded,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`${deck.id}-sesion.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  async function share(){const url=new URL(location.href);url.searchParams.delete('view');url.searchParams.delete('session');url.searchParams.delete('capture');url.hash=shareHash(state);try{await navigator.clipboard.writeText(url.href);setNotice('Enlace al estado actual copiado.');}catch{setSessionText(url.href);setNotice('Copia el enlace desde el campo de texto.');openDialog('session');}}
  const navigation=<div className="step-navigation"><button className="nav-arrow" onClick={()=>move(-1)} disabled={pos.slide===0&&pos.step===0} aria-label="Paso anterior"><ArrowLeft/></button><div className="step-summary"><span>{current.steps[pos.step]!.title}</span><div className="step-dots">{current.steps.map((s,i)=><button key={s.id} onClick={()=>go(snapshotOf(deck,{...pos,step:i},state.scenario))} aria-label={`Paso ${i+1}: ${s.title}`} aria-current={i===pos.step?'step':undefined} className={i<=pos.step?'filled':''}/>)}</div></div><button className="nav-arrow next" onClick={()=>move(1)} disabled={pos.slide===counts.length-1&&pos.step===counts.at(-1)!-1} aria-label="Paso siguiente"><ArrowRight/></button></div>;

  return <div className={`presentation ${deck.className} ${capture?'capture':''} ${presenter?'presenter-mode':''} ${camera?'camera-layout':''}`} style={deck.theme} data-deck={deck.id} data-ready={ready} data-motion={motion}>
    {presenter?<main className="presenter-desk"><header><span className="eyebrow">VISTA DEL PONENTE</span><h1>{deck.title}</h1><p role="status">{sync.connected?'Público conectado':'Esperando conexión con la ventana de público'}</p></header><div className="presenter-grid"><section><span className="eyebrow">AHORA · {pos.slide+1}/{deck.scenes.length}</span><h2>{current.title}</h2><p className="presenter-step">{current.steps[pos.step]!.title}</p><p className="presenter-takeaway">{caption}</p><h3>Notas de exposición</h3><p>{current.note}</p><h3>Comprobar comprensión</h3><p>{current.question}</p><button onClick={()=>setAnswer(v=>!v)}>{answer?'Ocultar respuesta':'Ver respuesta'}</button>{answer&&<p className="answer">{current.answer}</p>}</section><aside><span className="eyebrow">SIGUIENTE</span><h2>{nextScene.title}</h2><p>{nextScene.steps[nextPos.step]!.title}</p><p>{nextScene.steps[nextPos.step]!.caption}</p>{deck.controls?.(ctx)}<details><summary>Escenario actual</summary><dl>{Object.entries(state.scenario).map(([key,value])=><div key={key}><dt>{key}</dt><dd>{String(value??'—')}</dd></div>)}</dl></details><button onClick={()=>openDialog('index')}>Ir a otra escena</button></aside></div></main>:
    <main ref={stage} tabIndex={-1} className={`stage ${current.className??''}`} data-slide={pos.slide+1} data-scene={current.id} data-step={pos.step} aria-label={`Slide ${pos.slide+1} de ${deck.scenes.length}: ${current.title}`}>
      {deck.backdrop?.(ctx)}
      <div className="stage-topline"><span className="block-mark">{deck.mark}</span><span>{deck.subtitle}</span><span className="author-mark">{deck.author}</span></div>
      {!current.cover&&<header className="slide-header"><span className="eyebrow">{current.eyebrow}</span><h1>{current.title}</h1></header>}
      <div className="slide-body">{current.render(ctx)}</div>{deck.overlay?.(ctx)}
      {!current.cover&&<div className="slide-takeaway" aria-live="polite"><span className="takeaway-line"/><p>{caption}</p></div>}
      <div className="stage-bottomline"><div className="chapter-track">{deck.chapters.map((c,i)=><span key={c.sceneId} className={current.chapter===i?'active':''}>{c.title}</span>)}</div><span className="slide-count">{String(pos.slide+1).padStart(2,'0')} <i>/</i> {String(deck.scenes.length).padStart(2,'0')}</span></div>
      {camera&&<div className="camera-safe" aria-label="Área reservada para cámara">Cámara</div>}
    </main>}
    {!capture&&<div className="context-concepts" aria-label="Conceptos de esta escena">{[...new Set([...current.prerequisiteIds,...current.conceptIds])].map(id=><button key={id} onClick={()=>openDialog('help',id)}>{deck.concepts.find(c=>c.id===id)!.title}</button>)}</div>}
    <nav className="deck-controls" aria-label="Controles de la presentación"><div className="control-tools"><button onClick={()=>openDialog('index')} aria-label="Índice del bloque" title="Índice · I"><Grid2X2/></button><button onClick={()=>openDialog('notes')} aria-label="Notas y pregunta" title="Notas · N"><BookOpen/></button><button onClick={()=>openDialog('help')} aria-label="Recordar conceptos y controles"><HelpCircle/></button><button onClick={reset} aria-label="Reiniciar esta slide"><RotateCcw/></button>{!presenter&&<><button onClick={()=>setCapture(true)} aria-label="Vista limpia para grabar"><Maximize/></button><button onClick={()=>{if(sync.open())setCapture(true);}} aria-label="Abrir vista del ponente"><MonitorUp/></button></>}<button onClick={()=>openDialog('session')} aria-label="Sesión y grabación"><Circle className={recording?'recording':''}/></button></div>{navigation}</nav>
    {capture&&<button className="exit-capture" onClick={()=>setCapture(false)}>Mostrar controles · C</button>}
    {(playing||recording)&&<button className="session-stop" onClick={playing?stopPlayback:stopRecording}><Square/>{playing?'Detener reproducción':'Detener grabación'}</button>}
    {sync.error&&<p className="player-notice" role="alert">{sync.error}</p>}
    <dialog ref={dialog} className={`deck-dialog ${modal==='index'?'index-dialog':''}`} onClose={()=>{setModal(null);returnFocus.current?.focus({preventScroll:true});}} onClick={e=>{if(e.target===e.currentTarget)closeDialog();}} aria-label={modal==='index'?'Índice del bloque':modal==='notes'?'Notas y pregunta':modal==='session'?'Sesión y grabación':'Recordar conceptos y controles'}>
      <button className="dialog-close" onClick={closeDialog} aria-label="Cerrar"><X/></button>
      {modal==='index'&&<><span className="eyebrow">{deck.title} · {deck.scenes.length} slides</span><h2>El recorrido completo.</h2><div className="index-list">{deck.scenes.map((s,i)=><button key={s.id} onClick={()=>jump(s.id)} className={s.id===current.id?'current':''}><span>{String(i+1).padStart(2,'0')}</span><div><b>{s.title}</b><small>{s.eyebrow}</small></div><ArrowRight/></button>)}</div></>}
      {modal==='notes'&&<><span className="eyebrow">{current.eyebrow}</span><h2>{current.title}</h2><p className="speaker-note">{current.note}</p><div className="recall-question"><h3>Para comprobar comprensión</h3><p>{current.question}</p><button onClick={()=>setAnswer(v=>!v)}>{answer?'Ocultar respuesta':'Ver respuesta'}</button>{answer&&<p className="answer"><Check/>{current.answer}</p>}</div></>}
      {modal==='help'&&<><span className="eyebrow">Ayuda contextual</span><h2>{concept?deck.concepts.find(c=>c.id===concept)!.title:'Recordar y continuar.'}</h2>{!concept&&<div className="keyboard-guide"><span>← → <b>Avanzar por pasos</b></span><span>I <b>Índice</b></span><span>N <b>Notas</b></span><span>R <b>Reiniciar</b></span><span>C <b>Vista limpia</b></span><span>Esc <b>Volver</b></span></div>}{deck.concepts.filter(c=>!concept||c.id===concept).map(c=><details key={c.id} open={Boolean(concept)}><summary>{c.title}</summary><p>{c.explanation}</p>{c.inputs&&<p><b>Entradas:</b> {c.inputs}</p>}{c.output&&<p><b>Resultado:</b> {c.output}</p>}<small>Introducido en: {deck.scenes.find(s=>s.id===c.introducedAt)!.title}</small></details>)}</>}
      {modal==='session'&&<><span className="eyebrow">Presentar y reproducir</span><h2>Tu sesión.</h2><p>Conserva pasos, tiempos y escenarios. El archivo de sesión permite repetir la explicación; el audio y la cámara se graban con tu software de vídeo.</p><div className="session-actions"><button onClick={recording?stopRecording:startRecording}><Circle/>{recording?'Terminar recorrido':'Grabar recorrido'}</button><button disabled={!recorded||recording} onClick={()=>recorded&&playSession(recorded)}><Play/>Reproducir</button><button disabled={!recorded} onClick={downloadSession}><Download/>Descargar sesión</button><button onClick={share}><Link/>Copiar enlace al estado</button><button onClick={()=>setCamera(v=>!v)} aria-pressed={camera}><Camera/>{camera?'Quitar área de cámara':'Reservar área de cámara'}</button></div><label className="session-import">Importar una sesión JSON<textarea value={sessionText} onChange={e=>setSessionText(e.currentTarget.value)} rows={5} spellCheck={false}/></label><button onClick={loadSession}>Cargar sesión</button><p className="session-notice" role="status">{notice}</p></>}
    </dialog>
  </div>;
}
