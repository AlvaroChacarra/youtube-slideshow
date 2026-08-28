import type { Lesson } from "../course";
import { deliveryProfiles, routesFromScenes, scene } from "./_helpers";

const scenes = [
  scene({ id: "l3-recall", title: "Recall: DCF", type: "recall", route: "LIVE", phase: "presentation", durationMinutes: 2, sourceRefs: ["09-miniblock-3-cover", "10-ytm-vs-cagr"], concepts: ["valuation.price", "valuation.present_value"], component: "DiscountedCashflows", stageLabels: ["Flujos", "Precio"] }),
  scene({ id: "l3-challenge", title: "4,00% vs 3,71%", type: "hero-challenge", route: "LIVE", phase: "presentation", durationMinutes: 2, sourceRefs: ["10-ytm-vs-cagr"], concepts: ["yield.ytm", "return.realized_cagr"], component: "YieldChallenge", stageLabels: ["Dos cifras", "Dos preguntas"] }),
  scene({ id: "l3-solve-ytm", title: "Resolver YTM", type: "mathematical-state", route: "LIVE", phase: "presentation", durationMinutes: 4, sourceRefs: ["10-ytm-vs-cagr"], concepts: ["yield.ytm"], component: "YtmSolver", stageLabels: ["Precio", "Tasa única", "Raíz"] }),
  scene({ id: "l3-wealth", title: "Riqueza terminal", type: "financial-object", route: "LIVE", phase: "presentation", durationMinutes: 4, sourceRefs: ["10-ytm-vs-cagr"], concepts: ["return.terminal_wealth", "return.realized_cagr"], component: "TerminalWealth", stageLabels: ["Cupones aparte", "120 €", "CAGR"] }),
  scene({ id: "l3-reinvestment", title: "La reinversión", type: "concept-simulator", route: "LIVE", phase: "presentation", durationMinutes: 4, sourceRefs: ["10-ytm-vs-cagr", "11-same-ytm-different-cagr"], concepts: ["return.reinvestment", "yield.ytm"], component: "ReinvestmentField", stageLabels: ["Cobro", "Reinvierte", "Compone"] }),
  scene({ id: "l3-compare-cagr", title: "Mismo YTM, distinto CAGR", type: "concept-simulator", route: "LIVE", phase: "presentation", durationMinutes: 3, sourceRefs: ["11-same-ytm-different-cagr"], concepts: ["yield.ytm", "return.realized_cagr", "return.reinvestment"], component: "CouponComparison", stageLabels: ["8%", "1%", "0%"] }),
  scene({ id: "l3-zero-bridge", title: "Zero coupon + bridge", type: "bridge", route: "LIVE", phase: "presentation", durationMinutes: 1, sourceRefs: ["11-same-ytm-different-cagr"], concepts: ["yield.ytm", "return.realized_cagr"], component: "Bridge", stageLabels: ["Sin cupones", "Coinciden", "Mercado"] }),
  scene({ id: "l3-reinvestment-lab", title: "Reinvestment Lab", type: "guided-exercise", route: "LIVE", phase: "guided", durationMinutes: 10, sourceRefs: ["10-ytm-vs-cagr"], concepts: ["return.reinvestment", "return.terminal_wealth", "return.realized_cagr"], component: "ReinvestmentLab", stageLabels: ["Elige tasa", "Acumula", "Compara"] }),
  scene({ id: "l3-coupon-lab", title: "Coupon Structure Lab", type: "guided-exercise", route: "LIVE", phase: "guided", durationMinutes: 7, sourceRefs: ["11-same-ytm-different-cagr"], concepts: ["yield.ytm", "return.realized_cagr"], component: "CouponStructureLab", stageLabels: ["Selecciona cupón", "Mantén YTM", "Lee CAGR"] }),
  scene({ id: "l3-exit", title: "Exit Check", type: "diagnostic-quiz", route: "LIVE", phase: "guided", durationMinutes: 3, sourceRefs: ["10-ytm-vs-cagr", "11-same-ytm-different-cagr"], concepts: ["yield.ytm", "return.reinvestment"], component: "YieldQuiz", stageLabels: ["Responde", "Justifica"] }),
  scene({ id: "l3-depth", title: "YTM: cálculo vs realización", type: "recap", route: "REQUIRED", phase: "consolidation", durationMinutes: 8, sourceRefs: ["10-ytm-vs-cagr"], concepts: ["yield.ytm", "return.reinvestment"], component: "ConceptNote", stageLabels: ["Cálculo", "Realización"] })
];

export const lesson03: Lesson = {
  id: "lesson-03", slug: "ytm-reinversion-y-retorno", title: "YTM, reinversión y retorno realizado", kicker: "Lección 03 · Rendimiento",
  thesis: "YTM permite comparar bonos; el retorno realizado depende también de cómo se reinvierten los cupones.",
  requires: { concepts: ["valuation.price", "valuation.present_value", "bond.cashflows"], notation: ["notation.P", "notation.CF_t", "notation.T"] },
  requirement_routes: { concepts: { "valuation.price": "LIVE", "valuation.present_value": "LIVE", "bond.cashflows": "LIVE" }, notation: { "notation.P": "LIVE", "notation.CF_t": "LIVE", "notation.T": "LIVE" } },
  introduces: [
    ...["yield.ytm", "return.terminal_wealth", "return.realized_cagr", "return.reinvestment"].map((id) => ({ id, kind: "concept" as const, route: "LIVE" as const, scene: id === "yield.ytm" ? "l3-solve-ytm" : id === "return.reinvestment" ? "l3-reinvestment" : "l3-wealth" })),
    { id: "notation.y", kind: "notation", route: "LIVE", scene: "l3-solve-ytm" } as const
  ],
  introduction_routes: { "yield.ytm": "LIVE", "return.terminal_wealth": "LIVE", "return.realized_cagr": "LIVE", "return.reinvestment": "LIVE", "notation.y": "LIVE" },
  recalls: [{ id: "valuation.price", scene: "l3-recall" }, { id: "valuation.present_value", scene: "l3-recall" }], routes: routesFromScenes(scenes),
  objectives: [
    { id: "l3-infer-ytm", route: "LIVE", statement: "Inferir la tasa única consistente con precio y cash flows", concepts: ["yield.ytm"], notation: ["notation.y"] },
    { id: "l3-distinguish-return", route: "LIVE", statement: "Separar YTM de CAGR realizado bajo una política de reinversión", concepts: ["return.reinvestment", "return.realized_cagr"], notation: ["notation.y"] }
  ],
  load: { livePresentationMinutes: 20, guidedMinutes: 20, requiredAutonomousMinutes: 8, optionalMinutes: 0 }, scenes,
  bridge: { known: "Sé comparar un bono mediante YTM", gap: "El mercado contiene muchos bonos distintos", next: "Necesito precio, YTM y curva", target: "lesson-04" },
  used_later: [{ id: "yield.ytm", target: "lesson-04", route: "LIVE" }, { id: "return.reinvestment", target: "checkpoint", route: "LIVE" }],
  financialClaims: ["ytm.calculation_no_reinvestment", "ytm.realization_requires_reinvestment", "ytm.same_not_same_cagr"],
  misconceptions: ["ytm_guaranteed_return", "ytm_calculation_needs_reinvestment", "same_ytm_same_cagr", "zero_coupon_reinvestment"], deliveryProfiles
};
