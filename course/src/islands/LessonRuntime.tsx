import { AnimatePresence, LazyMotion, domAnimation, m } from "motion/react";
import { useEffect, useMemo, useReducer, useRef } from "react";
import type { BaseMode, Lesson, Scene } from "../../contracts/course";
import { cashFlows } from "../domain/cashflows";
import { priceFromYield } from "../domain/discounting";
import { commandFromKey } from "../runtime/keyboard";
import { positionFromDeepLink } from "../runtime/navigation";
import { readProgress, writeProgress } from "../runtime/persistence";
import { createInitialState, runtimeReducer, type Scenario } from "../runtime/reducer";
import { resolveDelivery, scopedScenes, videoMinutes } from "../runtime/delivery-profile";
import { BondObject } from "../visual/BondObject";
import { BondCloud } from "../visual/BondCloud";
import { CashflowTimeline } from "../visual/CashflowTimeline";
import { DiscountLens } from "../visual/DiscountLens";
import { FormulaBuilder } from "../visual/FormulaBuilder";
import { ReinvestmentField } from "../visual/ReinvestmentField";
import { YieldCurve } from "../visual/YieldCurve";

type Props = { lesson: Lesson; baseUrl: string };

const sceneCopy: Record<string, { lead: string; statement: string; result?: string }> = {
  "l1-challenge": { lead: "Entregas 100 € hoy", statement: "No compras una empresa. Compras un contrato de pagos.", result: "Capital hoy → pagos futuros" },
  "l1-financing": { lead: "Estado o empresa", statement: "El emisor recibe capital de inversores y asume una obligación de pago.", result: "Financiación de actividad real" },
  "l1-bridge": { lead: "Ya conozco los pagos", statement: "Pero un euro futuro no vale lo mismo que un euro hoy.", result: "Siguiente: descuento" },
  "l1-contract-check": { lead: "Contrato ≠ mercado", statement: "Cupón, base, principal y vencimiento son contractuales. El precio se observa hoy.", result: "104 = 4 de cupón + 100 de principal" },
  "l1-depth": { lead: "Coinciden aquí", statement: "N y FV valen 100 € en el ejemplo, pero cumplen funciones distintas.", result: "N calcula cupón · FV devuelve principal" },
  "l2-time-value": { lead: "100 € hoy", statement: "Puede invertirse antes que 100 € recibido dentro de cinco años.", result: "El tiempo exige descuento" },
  "l2-pv-price": { lead: "Cada flujo aporta valor", statement: "El precio no es otro flujo: es la suma hoy de todas las contribuciones de PV.", result: "Σ PV = P" },
  "l2-bridge": { lead: "Puedo usar rₜ distintos", statement: "Para comparar bonos necesito una tasa única que reproduzca el precio observado.", result: "Siguiente: YTM" },
  "l2-depth": { lead: "Dos objetos distintos", statement: "La spot curve descuenta cada plazo. Una tasa plana es solo un caso particular.", result: "rₜ no es automáticamente YTM" },
  "l3-challenge": { lead: "Mismo bono, dos cifras", statement: "YTM resume una TIR; CAGR sin reinversión anualiza riqueza terminal al 0%.", result: "4,00% vs 3,71%" },
  "l3-zero-bridge": { lead: "Cupón cero", statement: "Sin cobros intermedios no existe riesgo de reinversión de cupones.", result: "YTM = CAGR al mantener hasta T" },
  "l3-exit": { lead: "Distinción crítica", statement: "Calcular YTM no requiere reinvertir. Realizar esa rentabilidad compuesta sí.", result: "Convención ≠ garantía" },
  "l3-depth": { lead: "Cálculo", statement: "P y cash flows bastan para resolver y.", result: "Realización: depende de la reinversión" },
  "l4-bridge": { lead: "Ya leo precio, YTM y curva", statement: "Aún no sé cuánto cambia P cuando cambia y.", result: "Bloque 2: sensibilidad y duration" },
  "l4-exit": { lead: "Tres objetos", statement: "Punto = bono observado. Línea = ajuste. Benchmark = referencia más líquida.", result: "No son sinónimos" },
  "l4-depth": { lead: "Curva de YTMs observadas", statement: "Organiza bonos por vida residual y rendimiento. No es la spot curve usada en L2.", result: "Tipos separados, usos separados" }
};

function EditorialStatement({ scene, stage }: { scene: Scene; stage: number }) {
  const copy = sceneCopy[scene.id] ?? { lead: scene.title, statement: scene.teacher.objective, result: scene.teacher.bridge };
  return <div className="editorial-statement" data-essential>
    <span className="statement-index">0{stage + 1}</span>
    <p>{copy.lead}</p>
    <h3>{stage === 0 ? copy.statement : copy.result ?? copy.statement}</h3>
    <div className="statement-line" aria-hidden="true" />
  </div>;
}

function RepricingVisual({ scenario, stage, onScenario }: { scenario: Scenario; stage: number; onScenario: (patch: Partial<Scenario>) => void }) {
  const coupons = [0.07, 0.04, 0.03];
  return <div className="repricing-visual" data-essential>
    <div className="repricing-bonds">
      {coupons.map((rate, index) => {
        const flows = cashFlows({ notional: 100, faceValue: 100, annualCouponRate: rate, maturityYears: 5 });
        const price = priceFromYield({ flows, annualEffectiveYield: scenario.yield });
        const state = price > 100.005 ? "PRIMA" : price < 99.995 ? "DESCUENTO" : "PAR";
        return <article key={rate} className={stage === index || stage >= 2 ? "active" : ""}>
          <small>Bono {String.fromCharCode(65 + index)}</small><strong>Cupón {(rate * 100).toFixed(0)}%</strong><span className="tabular">P = {price.toFixed(2)} €</span><b>{state}</b>
        </article>;
      })}
    </div>
    <div className="market-yield"><span>Nivel exigido ~5Y</span><strong>{(scenario.yield * 100).toFixed(1)}%</strong><input aria-label="Yield de mercado" type="range" min="0.01" max="0.08" step="0.0025" value={scenario.yield} onChange={(event) => onScenario({ yield: Number(event.currentTarget.value) })} /></div>
    <p className="takeaway">El cupón no cambia. El mercado ajusta el precio.</p>
  </div>;
}

function CouponComparison({ stage }: { stage: number }) {
  const items = [
    { coupon: "8%", price: "117,81", wealth: "140", cagr: "3,51%" },
    { coupon: "1%", price: "86,64", wealth: "105", cagr: "3,92%" },
    { coupon: "0%", price: "82,19", wealth: "100", cagr: "4,00%" }
  ];
  return <div className="coupon-comparison" data-essential>{items.map((item, index) => <article key={item.coupon} className={stage === index || stage >= 2 ? "active" : ""}><span>Cupón</span><strong>{item.coupon}</strong><dl><div><dt>Precio</dt><dd>{item.price} €</dd></div><div><dt>Riqueza 0%</dt><dd>{item.wealth} €</dd></div><div><dt>CAGR</dt><dd>{item.cagr}</dd></div></dl><small>YTM común 4,00%</small></article>)}</div>;
}

function SceneVisual({ scene, stage, scenario, onScenario }: { scene: Scene; stage: number; scenario: Scenario; onScenario: (patch: Partial<Scenario>) => void }) {
  const component = scene.stages[Math.min(stage, scene.stages.length - 1)]?.component ?? "ConceptNote";
  if (["BondObject", "BondAnatomy", "BondBuilder"].includes(component)) return <BondObject stage={stage} scenario={scenario} onScenario={component === "BondBuilder" ? onScenario : undefined} />;
  if (["CashflowTimeline"].includes(component)) return <CashflowTimeline stage={stage} scenario={scenario} />;
  if (["DiscountLens", "RateLab", "SinglePvLab", "TimeValueChallenge"].includes(component)) return <DiscountLens stage={stage} scenario={scenario} onScenario={component.includes("Lab") ? onScenario : undefined} />;
  if (["FormulaBuilder", "DiscountedCashflows", "PriceAssembly", "DcfLab", "YtmSolver", "TerminalWealth"].includes(component)) return <FormulaBuilder stage={stage} scenario={scenario} />;
  if (["ReinvestmentField", "ReinvestmentLab"].includes(component)) return <ReinvestmentField stage={stage} scenario={scenario} onScenario={component === "ReinvestmentLab" ? onScenario : undefined} />;
  if (["CouponComparison", "CouponStructureLab"].includes(component)) return <CouponComparison stage={stage} />;
  if (["BondGenerations", "ResidualLife", "BondCloud"].includes(component)) return <BondCloud stage={stage} scenario={scenario} />;
  if (["Repricing", "PricingLab"].includes(component)) return <RepricingVisual stage={stage} scenario={scenario} onScenario={onScenario} />;
  if (["YieldCurve", "CurveExplorer", "CurveQuiz"].includes(component)) return <YieldCurve stage={stage} scenario={scenario} />;
  return <EditorialStatement scene={scene} stage={stage} />;
}

function SceneFrame({ scene, stage, scenario, onScenario, study = false, reviewed = false, onReview }: { scene: Scene; stage: number; scenario: Scenario; onScenario: (patch: Partial<Scenario>) => void; study?: boolean; reviewed?: boolean; onReview?: () => void }) {
  return <article id={scene.id} className={`scene-frame ${study ? "study-scene" : ""}`} data-scene={scene.id} data-route={scene.route} data-stage={scene.stages[stage]?.id}>
    <header className="scene-heading">
      <div><span className="eyebrow">{scene.type.replaceAll("-", " ")} · {scene.durationMinutes} min</span><h2>{scene.title}</h2></div>
      <span className="stage-count tabular">{String(stage + 1).padStart(2, "0")} / {String(scene.stages.length).padStart(2, "0")}</span>
    </header>
    <div className="scene-stage" data-essential><SceneVisual scene={scene} stage={stage} scenario={scenario} onScenario={onScenario} /></div>
    {study && <div className="study-note"><p><strong>Idea clave.</strong> {scene.teacher.objective} <span>{scene.teacher.commonError}</span></p><button className="study-review" aria-pressed={reviewed} onClick={onReview}>{reviewed ? "Revisado ✓" : "Marcar como revisado"}</button></div>}
  </article>;
}

export default function LessonRuntime({ lesson, baseUrl }: Props) {
  const initial = useMemo(() => {
    const delivery = resolveDelivery({ search: window.location.search, viewportWidth: window.innerWidth });
    const scenes = scopedScenes(lesson, delivery.mode, false);
    const stored = readProgress(window.localStorage, lesson.id);
    const deepLink = positionFromDeepLink(scenes, window.location.search);
    return createInitialState({ mode: delivery.mode, requestedMode: delivery.requestedMode, position: deepLink ?? stored?.position, visited: stored?.visited, lessonId: lesson.id, scenes });
  }, [lesson]);
  const [state, dispatch] = useReducer(runtimeReducer, initial);
  const delivery = resolveDelivery({ search: typeof window === "undefined" ? "" : window.location.search, viewportWidth: typeof window === "undefined" ? 1440 : window.innerWidth });
  const scenes = useMemo(() => scopedScenes(lesson, state.mode, state.optionalEnabled), [lesson, state.mode, state.optionalEnabled]);
  const current = scenes[Math.min(state.sceneIndex, scenes.length - 1)] ?? scenes[0]!;
  const stage = Math.min(state.stageIndex, current.stages.length - 1);
  const requiredStateKeys = state.mode === "estudio"
    ? scenes.map((scene) => `${lesson.id}:${scene.id}:${scene.stages.at(-1)?.id}`)
    : scenes.flatMap((scene) => scene.stages.map((item) => `${lesson.id}:${scene.id}:${item.id}`));
  const totalStates = requiredStateKeys.length;
  const visited = new Set(state.visited);
  const visitedStates = requiredStateKeys.filter((key) => visited.has(key)).length;
  const progress = Math.min(100, Math.round((visitedStates / Math.max(1, totalStates)) * 100));
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const locked = state.mode !== "estudio";
    document.body.classList.toggle("runtime-locked", locked);
    return () => document.body.classList.remove("runtime-locked");
  }, [state.mode]);

  useEffect(() => {
    writeProgress(window.localStorage, lesson.id, { sceneIndex: state.sceneIndex, stageIndex: state.stageIndex }, state.visited);
    const params = new URLSearchParams(window.location.search);
    params.set("mode", state.requestedMode);
    params.set("scene", current.id);
    params.set("stage", current.stages[stage]?.id ?? "");
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }, [current, lesson.id, stage, state.requestedMode, state.sceneIndex, state.stageIndex, state.visited]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const command = commandFromKey(event);
      if (!command) return;
      event.preventDefault();
      if (command === "next") dispatch({ type: "NEXT", scenes, lessonId: lesson.id });
      if (command === "previous") dispatch({ type: "PREVIOUS", scenes, lessonId: lesson.id });
      if (command === "reset") dispatch({ type: "RESET", scenes, lessonId: lesson.id });
      if (command === "escape") dispatch({ type: "CLOSE_TEACHER" });
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lesson.id, scenes]);

  useEffect(() => {
    const resize = () => {
      const next = resolveDelivery({ search: window.location.search, viewportWidth: window.innerWidth });
      if (next.mode !== state.mode) dispatch({ type: "SET_MODE", mode: next.mode, requestedMode: next.requestedMode });
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [state.mode]);

  const setMode = (mode: BaseMode) => {
    const fallback = window.innerWidth <= 900 && mode !== "estudio";
    dispatch({ type: "SET_MODE", mode: fallback ? "estudio" : mode, requestedMode: mode });
  };
  const updateScenario = (patch: Partial<Scenario>) => dispatch({ type: "SCENARIO", patch });
  const capture = delivery.capture;

  return <LazyMotion features={domAnimation} strict>
    <main className={`lesson-runtime mode-${state.mode} ${capture ? "is-capture" : ""}`} data-mode={state.mode} data-requested-mode={state.requestedMode} data-mobile-fallback={delivery.mobileFallback}>
      {!capture && <header className="runtime-bar">
        <a href={baseUrl} className="runtime-brand" aria-label="Volver al mapa"><span>B–04</span><b>Fixed Income Foundations</b></a>
        <nav aria-label="Perfil de entrega">{(["aula", "estudio", "video"] as BaseMode[]).map((mode) => <button key={mode} className={state.requestedMode === mode ? "active" : ""} onClick={() => setMode(mode)}>{mode}</button>)}</nav>
        <div className="runtime-meta"><span className="tabular">{progress}%</span>{delivery.mobileFallback && <small>Fallback estudio</small>}<a href={`${baseUrl}checkpoint/`}>Checkpoint</a></div>
      </header>}

      <div id="recordable-canvas" className="recordable-canvas">
        {state.mode === "estudio" ? <div className="study-flow">
          <section className="study-intro"><span className="eyebrow">{lesson.kicker}</span><h1>{lesson.title}</h1><p>{lesson.thesis}</p>{delivery.mobileFallback && <small>Aula/vídeo se adapta a estudio vertical en esta pantalla.</small>}</section>
          {scenes.map((scene, sceneIndex) => {
            const finalStageIndex = scene.stages.length - 1;
            const key = `${lesson.id}:${scene.id}:${scene.stages[finalStageIndex]?.id}`;
            return <SceneFrame key={scene.id} scene={scene} stage={finalStageIndex} scenario={state.scenario} onScenario={updateScenario} study reviewed={visited.has(key)} onReview={() => dispatch({ type: "JUMP", scenes, lessonId: lesson.id, position: { sceneIndex, stageIndex: finalStageIndex } })} />;
          })}
          <section className="study-bridge"><span>Bridge</span><strong>{lesson.bridge.known}</strong><i>→</i><strong>{lesson.bridge.gap}</strong><i>→</i><strong>{lesson.bridge.next}</strong></section>
        </div> : <AnimatePresence mode="wait">
          <m.div key={`${current.id}:${stage}`} className="active-scene" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .42, ease: [.22, 1, .36, 1] }}>
            <SceneFrame scene={current} stage={stage} scenario={state.scenario} onScenario={updateScenario} />
          </m.div>
        </AnimatePresence>}
      </div>

      {!capture && state.mode !== "estudio" && <footer className="runtime-controls" aria-label="Navegación de la lección">
        <button onClick={() => dispatch({ type: "PREVIOUS", scenes, lessonId: lesson.id })} aria-label="Estado anterior">←</button>
        <div className="scene-rail" aria-label="Escenas">{scenes.map((scene, index) => <button key={scene.id} className={index === state.sceneIndex ? "active" : ""} onClick={() => dispatch({ type: "JUMP", scenes, lessonId: lesson.id, position: { sceneIndex: index, stageIndex: 0 } })}><span>{String(index + 1).padStart(2, "0")}</span><b>{scene.title}</b></button>)}</div>
        <button onClick={() => dispatch({ type: "NEXT", scenes, lessonId: lesson.id })} aria-label="Estado siguiente">→</button>
        <button onClick={() => dispatch({ type: "RESET", scenes, lessonId: lesson.id })} aria-label="Reiniciar escena">↺</button>
        {delivery.professor && <button onClick={(event) => { previousFocus.current = event.currentTarget; dispatch({ type: "TOGGLE_TEACHER" }); }} aria-expanded={state.teacherOpen}>Profe</button>}
      </footer>}

      {!capture && state.mode === "estudio" && <div className="study-toolbar"><button className="button secondary" onClick={() => dispatch({ type: "TOGGLE_OPTIONAL" })}>{state.optionalEnabled ? "Ocultar OPTIONAL" : "Mostrar OPTIONAL"}</button><span>VIDEO · {videoMinutes(lesson)} min</span></div>}

      {delivery.professor && state.teacherOpen && !capture && <aside className="teacher-drawer" aria-label="Guía docente"><button aria-label="Cerrar guía docente" onClick={() => { dispatch({ type: "CLOSE_TEACHER" }); requestAnimationFrame(() => previousFocus.current?.focus()); }}>×</button><span className="eyebrow">Guía docente · {current.durationMinutes} min</span><h2>{current.title}</h2><dl><div><dt>Objetivo</dt><dd>{current.teacher.objective}</dd></div><div><dt>Antes del reveal</dt><dd>{current.teacher.askBeforeReveal}</dd></div><div><dt>Interacción</dt><dd>{current.teacher.interaction}</dd></div><div><dt>Error frecuente</dt><dd>{current.teacher.commonError}</dd></div><div><dt>Bridge</dt><dd>{current.teacher.bridge}</dd></div></dl></aside>}
    </main>
  </LazyMotion>;
}
