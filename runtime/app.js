import { beatBetween, resolveScene, SLIDES, VARIANTS } from "./scene-config.js";
import { renderScene } from "./templates.js";

const params = new URLSearchParams(window.location.search);
const normalizeSlide = (value) => value === "4" || value === "slide-04" ? "slide-04" : "slide-02";
const normalizeVariant = (value) => VARIANTS.includes(value) ? value : "enhanced_immersive";

const sceneRoot = document.querySelector("#scene");
const statusRoot = document.querySelector("#motion-status");
const controls = {
  variant: document.querySelector("#variant-control"),
  slide: document.querySelector("#slide-control"),
  previous: document.querySelector("#previous-control"),
  next: document.querySelector("#next-control"),
  reset: document.querySelector("#reset-control"),
  readout: document.querySelector("#hold-readout")
};

const holdQuestions = {
  "s2-b1": "¿Qué instrumento concreto estamos observando?",
  "s2-b2": "¿Qué promete cada término del contrato?",
  "s2-b3": "¿Cómo se traduce el contrato en pagos?",
  "s2-e1": "Primero: ¿qué promesa económica contiene el papel?",
  "s2-e2": "Entrada: 100 € hoy a cambio de una obligación futura.",
  "s2-e3": "Rendimiento: 4% sobre 100 € produce 4 € cada año.",
  "s2-e4": "Salida: en 5Y conviven el último cupón y el principal.",
  "s2-e5": "La anatomía ya es una secuencia: −100, 4, 4, 4, 4, 104.",
  "s4-b1": "¿Qué pagos promete el bono?",
  "s4-b2": "¿Por qué el último flujo es 104 €?",
  "s4-b3": "¿Cómo se lleva cada flujo al presente?",
  "s4-b4": "La suma expandida conserva los cinco momentos.",
  "s4-e1": "Cinco pagos futuros; cinco momentos distintos.",
  "s4-e2": "El principal aparece una sola vez: dentro de 104 € en t = 5.",
  "s4-e3": "Un pago en t = 1 activa un único término de descuento.",
  "s4-e4": "El patrón se repite para los cuatro cupones.",
  "s4-e5": "El quinto término incorpora cupón y principal.",
  "s4-e6": "La valoración completa es la suma de cinco presentes."
};

const state = {
  variant: normalizeVariant(params.get("variant")),
  slideId: normalizeSlide(params.get("slide")),
  holdIndex: 0,
  reducedMotion: params.get("reducedMotion") === "1" || window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  capture: params.get("capture") === "1",
  motionScale: Number.isFinite(Number(params.get("motionScale"))) ? Math.max(0, Number(params.get("motionScale"))) : 1,
  activeBeat: null,
  isTransitioning: false,
  queuedTarget: null,
  animations: []
};

if (state.capture) document.body.classList.add("capture");

function sceneConfig() {
  return resolveScene(state.variant, state.slideId);
}

function currentHold() {
  return sceneConfig().holds[state.holdIndex];
}

function parseHolds(element, attribute) {
  return (element.getAttribute(attribute) || "").split(/\s+/).filter(Boolean);
}

function isVisibleIn(element, holdId) {
  const holds = parseHolds(element, "data-visible-holds");
  return holds.length === 0 || holds.includes(holdId);
}

function setSemanticState(holdId) {
  const previousClass = [...sceneRoot.classList].find((name) => name.startsWith("hold-"));
  if (previousClass) sceneRoot.classList.remove(previousClass);
  sceneRoot.classList.add(`hold-${holdId}`);
  sceneRoot.dataset.variant = state.variant;
  sceneRoot.dataset.slide = state.slideId;
  sceneRoot.dataset.hold = holdId;

  sceneRoot.querySelectorAll("[data-visible-holds]").forEach((element) => {
    const visible = isVisibleIn(element, holdId);
    element.dataset.runtimeVisible = String(visible);
    element.setAttribute("aria-hidden", String(!visible));
  });

  sceneRoot.querySelectorAll("[data-primary-holds]").forEach((element) => {
    element.dataset.runtimePrimary = String(parseHolds(element, "data-primary-holds").includes(holdId));
  });

  sceneRoot.querySelectorAll("[data-muted-holds]").forEach((element) => {
    element.dataset.runtimeMuted = String(parseHolds(element, "data-muted-holds").includes(holdId));
  });

  const question = sceneRoot.querySelector(".hold-question");
  if (question) question.textContent = holdQuestions[holdId] || "";
  fitAllText();
  updateControls();
}

function measureText(element) {
  const style = getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  const range = document.createRange();
  range.selectNodeContents(element);
  const contentRect = range.getBoundingClientRect();
  return {
    id: element.dataset.textId || element.id || null,
    fontSizePx: Number.parseFloat(style.fontSize),
    lineHeightPx: Number.parseFloat(style.lineHeight) || Number.parseFloat(style.fontSize) * 1.2,
    box: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
    content: { x: contentRect.x, y: contentRect.y, width: contentRect.width, height: contentRect.height },
    scrollWidth: element.scrollWidth,
    scrollHeight: element.scrollHeight,
    clipped: element.scrollWidth > element.clientWidth + .75 || element.scrollHeight > element.clientHeight + .75
  };
}

function fitText(element) {
  const declaredMin = Number(element.dataset.minFont || 12);
  const declaredMax = Number(element.dataset.maxFont || getComputedStyle(element).fontSize.replace("px", ""));
  const styledMax = Number.parseFloat(getComputedStyle(element).fontSize);
  const min = window.innerHeight <= 300 ? Math.min(declaredMin, 9.5) : window.innerWidth <= 700 ? Math.min(declaredMin, 15) : declaredMin;
  const responsiveMax = window.innerHeight <= 300 ? 20 : window.innerWidth <= 700 ? 36 : declaredMax;
  const max = Math.max(min, Math.min(declaredMax, responsiveMax, styledMax));
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) return;
  element.style.fontSize = `${max}px`;
  const availableWidth = element.clientWidth;
  const availableHeight = element.clientHeight || Number.POSITIVE_INFINITY;
  if (!availableWidth) return;
  let low = min;
  let high = max;
  for (let iteration = 0; iteration < 9; iteration += 1) {
    const candidate = (low + high) / 2;
    element.style.fontSize = `${candidate}px`;
    const fits = element.scrollWidth <= availableWidth + .5 && element.scrollHeight <= availableHeight + .5;
    if (fits) low = candidate;
    else high = candidate;
  }
  element.style.fontSize = `${Math.max(min, Math.floor(low * 10) / 10)}px`;
}

function fitAllText() {
  sceneRoot.querySelectorAll("[data-fit-text]").forEach(fitText);
}

function updateControls() {
  const config = sceneConfig();
  const hold = currentHold();
  controls.variant.value = state.variant;
  controls.slide.value = state.slideId;
  controls.previous.disabled = state.holdIndex === 0;
  controls.next.disabled = state.holdIndex === config.holds.length - 1;
  controls.readout.textContent = `${state.holdIndex + 1}/${config.holds.length} · ${hold.label}`;
  statusRoot.textContent = state.reducedMotion ? "reduced motion" : state.activeBeat?.beatId || "presenter paced";
}

function snapshotPersistent() {
  const snapshot = new Map();
  sceneRoot.querySelectorAll("[data-persistent-id][data-runtime-visible=\"true\"]").forEach((element) => {
    snapshot.set(element.dataset.persistentId, element.getBoundingClientRect());
  });
  return snapshot;
}

function enteringKeyframes(element, direction) {
  const id = element.dataset.motionId || "";
  const compact = innerWidth <= 700;
  if (compact) return [{ opacity: 0, transform: "scale(.97)" }, { opacity: 1, transform: "scale(1)" }];
  if (/timeline|cash-flow/.test(id)) return [{ opacity: 0, transform: "translateY(-14px) scale(.985)" }, { opacity: 1, transform: "translateY(0) scale(1)" }];
  if (/chapter|breakdown/.test(id)) return [{ opacity: 0, transform: `translateX(${direction > 0 ? 30 : -30}px)` }, { opacity: 1, transform: "translateX(0)" }];
  if (/formula|term|equation|rule/.test(id)) return [{ opacity: 0, transform: "translateY(-12px) scale(.96)" }, { opacity: 1, transform: "translateY(0) scale(1)" }];
  return [{ opacity: 0, transform: `translateY(${direction > 0 ? 12 : -12}px)` }, { opacity: 1, transform: "translateY(0)" }];
}

function animateElement(element, keyframes, options) {
  const animation = element.animate(keyframes, { fill: "both", ...options });
  state.animations.push(animation);
  return animation;
}

function settleAnimations() {
  for (const animation of state.animations) {
    try { animation.finish(); } catch { animation.cancel(); }
  }
  state.animations = [];
}

async function transitionTo(targetIndex) {
  const config = sceneConfig();
  const bounded = Math.max(0, Math.min(targetIndex, config.holds.length - 1));
  if (state.isTransitioning) {
    state.queuedTarget = bounded;
    settleAnimations();
    return;
  }
  if (bounded === state.holdIndex) return;

  const sourceIndex = state.holdIndex;
  const direction = bounded > sourceIndex ? 1 : -1;
  const beat = beatBetween(config, Math.min(sourceIndex, bounded), Math.max(sourceIndex, bounded));
  const sourceHold = config.holds[sourceIndex].holdId;
  const targetHold = config.holds[bounded].holdId;
  const duration = Math.round((beat?.durationMs || 620) * state.motionScale);

  state.isTransitioning = true;
  state.activeBeat = beat ? { ...beat, direction } : null;
  updateControls();

  if (state.reducedMotion || duration === 0) {
    state.holdIndex = bounded;
    setSemanticState(targetHold);
    const primary = sceneRoot.querySelector('[data-runtime-primary="true"]');
    if (primary && !state.capture) {
      await primary.animate([{ outlineColor: "rgba(66,217,212,.65)" }, { outlineColor: "rgba(66,217,212,0)" }], { duration: 120, fill: "none" }).finished.catch(() => {});
    }
  } else {
    const oldPersistent = snapshotPersistent();
    const exiting = [...sceneRoot.querySelectorAll(`[data-visible-holds~="${sourceHold}"][data-runtime-visible="true"]`)]
      .filter((element) => !isVisibleIn(element, targetHold));

    exiting.forEach((element, index) => {
      animateElement(element, [{ opacity: 1, transform: "translateY(0) scale(1)" }, { opacity: 0, transform: `translateY(${direction > 0 ? -10 : 10}px) scale(.985)` }], {
        duration: Math.max(150, duration * .32),
        delay: Math.min(index, 3) * 24,
        easing: "cubic-bezier(.4, 0, 1, 1)"
      });
    });

    await new Promise((resolve) => window.setTimeout(resolve, Math.max(80, duration * .22)));
    state.holdIndex = bounded;
    setSemanticState(targetHold);

    const enteringCandidates = [...sceneRoot.querySelectorAll(`[data-visible-holds~="${targetHold}"][data-runtime-visible="true"]`)]
      .filter((element) => !isVisibleIn(element, sourceHold));
    const entering = enteringCandidates.filter((element) => !enteringCandidates.some((candidate) => candidate !== element && candidate.contains(element)));
    entering.forEach((element, index) => {
      animateElement(element, enteringKeyframes(element, direction), {
        duration: Math.max(220, duration * .72),
        delay: Math.min(index, 6) * 38,
        easing: beat?.easing || "cubic-bezier(.22, 1, .36, 1)"
      });
    });

    sceneRoot.querySelectorAll("[data-persistent-id][data-runtime-visible=\"true\"]").forEach((element) => {
      const before = oldPersistent.get(element.dataset.persistentId);
      const after = element.getBoundingClientRect();
      if (!before || !after.width || !after.height) return;
      const dx = before.left - after.left;
      const dy = before.top - after.top;
      const sx = before.width / after.width;
      const sy = before.height / after.height;
      if (Math.abs(dx) + Math.abs(dy) + Math.abs(1 - sx) + Math.abs(1 - sy) < .8) return;
      animateElement(element, [
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, transformOrigin: "top left" },
        { transform: "translate(0, 0) scale(1, 1)", transformOrigin: "top left" }
      ], { duration, easing: beat?.easing || "cubic-bezier(.22, 1, .36, 1)" });
    });

    await Promise.allSettled(state.animations.map((animation) => animation.finished));
  }

  settleAnimations();
  state.activeBeat = null;
  state.isTransitioning = false;
  updateControls();

  if (state.queuedTarget !== null) {
    const queued = state.queuedTarget;
    state.queuedTarget = null;
    void transitionTo(queued);
  }
}

function navigate(delta) {
  const config = sceneConfig();
  let baseIndex = state.holdIndex;
  if (state.isTransitioning && state.activeBeat) {
    const destinationHold = state.activeBeat.direction > 0 ? state.activeBeat.targetHold : state.activeBeat.sourceHold;
    const destinationIndex = config.holds.findIndex((item) => item.holdId === destinationHold);
    if (destinationIndex >= 0) baseIndex = destinationIndex;
  }
  return transitionTo(baseIndex + delta);
}

function setHold(hold) {
  const config = sceneConfig();
  const index = typeof hold === "number" ? hold : config.holds.findIndex((item) => item.holdId === hold);
  if (index < 0 || index >= config.holds.length) throw new Error(`Unknown hold: ${hold}`);
  settleAnimations();
  state.isTransitioning = false;
  state.activeBeat = null;
  state.queuedTarget = null;
  state.holdIndex = index;
  setSemanticState(config.holds[index].holdId);
}

function setScene(variant, slideId, requestedHold) {
  state.variant = normalizeVariant(variant);
  state.slideId = normalizeSlide(slideId);
  const config = sceneConfig();
  const queryHold = requestedHold || params.get("hold");
  const resolvedIndex = queryHold ? config.holds.findIndex((item) => item.holdId === queryHold) : 0;
  state.holdIndex = resolvedIndex >= 0 ? resolvedIndex : 0;
  settleAnimations();
  sceneRoot.className = "scene";
  sceneRoot.innerHTML = renderScene(state.variant, state.slideId);
  setSemanticState(currentHold().holdId);
  requestAnimationFrame(fitAllText);
}

function sampleBeat(beatId, progress) {
  const config = sceneConfig();
  const beat = config.beats.find((candidate) => candidate.beatId === beatId);
  if (!beat) throw new Error(`Unknown beat: ${beatId}`);
  const t = Math.max(0, Math.min(1, Number(progress)));
  const revealStart = .22;
  const sourceIndex = config.holds.findIndex((item) => item.holdId === beat.sourceHold);
  const targetIndex = config.holds.findIndex((item) => item.holdId === beat.targetHold);
  state.holdIndex = t < revealStart ? sourceIndex : targetIndex;
  setSemanticState(t < revealStart ? beat.sourceHold : beat.targetHold);

  sceneRoot.querySelectorAll("[data-visible-holds]").forEach((element) => {
    element.style.removeProperty("opacity");
    element.style.removeProperty("transform");
    element.style.removeProperty("visibility");
    const inSource = isVisibleIn(element, beat.sourceHold);
    const inTarget = isVisibleIn(element, beat.targetHold);
    if (inSource && !inTarget) {
      if (t < revealStart) {
        const local = t / revealStart;
        element.dataset.runtimeVisible = "true";
        element.style.opacity = String(1 - local);
        element.style.transform = `translateY(${-10 * local}px) scale(${1 - .015 * local})`;
        element.style.visibility = "visible";
      }
    } else if (!inSource && inTarget) {
      if (t >= revealStart) {
        const local = (t - revealStart) / (1 - revealStart);
        const enteringAncestor = element.parentElement?.closest("[data-visible-holds]");
        const hasEnteringAncestor = Boolean(enteringAncestor && !isVisibleIn(enteringAncestor, beat.sourceHold) && isVisibleIn(enteringAncestor, beat.targetHold));
        const motionScale = (element.dataset.motionId || "").match(/timeline|cash-flow/) ? .985 : .96;
        const translateY = innerWidth <= 700 || hasEnteringAncestor ? 0 : -12 * (1 - local);
        const scale = hasEnteringAncestor ? 1 : motionScale + (1 - motionScale) * local;
        element.dataset.runtimeVisible = "true";
        element.style.opacity = String(local);
        element.style.transform = `translateY(${translateY}px) scale(${scale})`;
        element.style.visibility = "visible";
      }
    } else {
      element.style.removeProperty("opacity");
      element.style.removeProperty("transform");
      element.style.removeProperty("visibility");
    }
  });
  state.activeBeat = { ...beat, progress: t };
  statusRoot.textContent = `${beatId} · ${Math.round(t * 100)}%`;
  return getState();
}

function clearSample() {
  sceneRoot.querySelectorAll("[data-visible-holds]").forEach((element) => {
    element.style.removeProperty("opacity");
    element.style.removeProperty("transform");
    element.style.removeProperty("visibility");
  });
  state.activeBeat = null;
  setSemanticState(currentHold().holdId);
}

function getState() {
  return {
    variant: state.variant,
    slideId: state.slideId,
    holdIndex: state.holdIndex,
    holdId: currentHold().holdId,
    reducedMotion: state.reducedMotion,
    isTransitioning: state.isTransitioning,
    activeBeat: state.activeBeat,
    visiblePersistentIds: [...sceneRoot.querySelectorAll('[data-persistent-id][data-runtime-visible="true"]')].map((element) => element.dataset.persistentId)
  };
}

controls.previous.addEventListener("click", () => void navigate(-1));
controls.next.addEventListener("click", () => void navigate(1));
controls.reset.addEventListener("click", () => setHold(0));
controls.variant.addEventListener("change", (event) => setScene(event.target.value, state.slideId));
controls.slide.addEventListener("change", (event) => setScene(state.variant, event.target.value));

window.addEventListener("keydown", (event) => {
  if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); void navigate(1); }
  if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); void navigate(-1); }
  if (event.key === "Home" || event.key.toLowerCase() === "r") { event.preventDefault(); setHold(0); }
});

window.addEventListener("resize", () => requestAnimationFrame(fitAllText));

window.__LIENZO_RUNTIME__ = {
  getState,
  getSceneConfig: () => structuredClone(sceneConfig()),
  next: () => navigate(1),
  previous: () => navigate(-1),
  reset: () => setHold(0),
  setHold,
  setSlide: (slideId) => setScene(state.variant, slideId),
  setVariant: (variant) => setScene(variant, state.slideId),
  sampleBeat,
  clearSample,
  measureText: (target) => measureText(typeof target === "string" ? document.querySelector(target) : target),
  fitAllText,
  isReady: true
};

setScene(state.variant, state.slideId, params.get("hold"));
document.documentElement.dataset.runtimeReady = "true";
