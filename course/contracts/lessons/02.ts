import type { Lesson } from "../course";
import { deliveryProfiles, routesFromScenes, scene } from "./_helpers";

const scenes = [
  scene({ id: "l2-recall", title: "Recall: los cinco pagos", type: "recall", route: "LIVE", phase: "presentation", durationMinutes: 2, sourceRefs: ["06-miniblock-2-cover", "08-discounting-example"], concepts: ["bond.cashflows", "bond.final_cashflow"], component: "CashflowTimeline", stageLabels: ["Recupera", "Comprueba"] }),
  scene({ id: "l2-time-value", title: "100 hoy ≠ 100 futuro", type: "hero-challenge", route: "LIVE", phase: "presentation", durationMinutes: 3, sourceRefs: ["07-discounting-theory"], concepts: ["valuation.time_value"], component: "TimeValueChallenge", stageLabels: ["Compara", "Decide"] }),
  scene({ id: "l2-discount-lens", title: "Discount Lens", type: "concept-simulator", route: "LIVE", phase: "presentation", durationMinutes: 4, sourceRefs: ["07-discounting-theory"], concepts: ["valuation.discount_factor", "valuation.present_value", "valuation.spot_rates"], component: "DiscountLens", stageLabels: ["Futuro", "Descuenta", "Presente"] }),
  scene({ id: "l2-formula", title: "Construir la fórmula", type: "mathematical-state", route: "LIVE", phase: "presentation", durationMinutes: 4, sourceRefs: ["07-discounting-theory"], concepts: ["valuation.present_value", "valuation.price", "valuation.spot_rates"], component: "FormulaBuilder", stageLabels: ["Un flujo", "Cada flujo", "Suma"] }),
  scene({ id: "l2-dcf", title: "DCF del bono canónico", type: "mathematical-state", route: "LIVE", phase: "presentation", durationMinutes: 5, sourceRefs: ["08-discounting-example"], concepts: ["valuation.present_value", "bond.final_cashflow"], component: "DiscountedCashflows", stageLabels: ["Cash flows", "PVs", "Total"] }),
  scene({ id: "l2-pv-price", title: "PVs → precio", type: "financial-object", route: "LIVE", phase: "presentation", durationMinutes: 1, sourceRefs: ["08-discounting-example"], concepts: ["valuation.price"], component: "PriceAssembly", stageLabels: ["Agrupa", "Precio"] }),
  scene({ id: "l2-bridge", title: "Muchas tasas, una medida", type: "bridge", route: "LIVE", phase: "presentation", durationMinutes: 1, sourceRefs: ["08-discounting-example"], concepts: ["valuation.spot_rates", "valuation.price"], component: "Bridge", stageLabels: ["Sé", "Falta", "YTM"] }),
  scene({ id: "l2-rate-lab", title: "Rate Lab", type: "guided-exercise", route: "LIVE", phase: "guided", durationMinutes: 8, sourceRefs: ["07-discounting-theory"], concepts: ["valuation.discount_factor", "valuation.spot_rates"], component: "RateLab", stageLabels: ["Mueve tasa", "Observa PV", "Generaliza"] }),
  scene({ id: "l2-single-pv", title: "PV de un flujo aislado", type: "guided-exercise", route: "LIVE", phase: "guided", durationMinutes: 6, sourceRefs: ["07-discounting-theory"], concepts: ["valuation.present_value"], component: "SinglePvLab", stageLabels: ["Sustituye", "Calcula", "Comprueba"] }),
  scene({ id: "l2-dcf-lab", title: "DCF completo", type: "guided-exercise", route: "LIVE", phase: "guided", durationMinutes: 6, sourceRefs: ["08-discounting-example"], concepts: ["valuation.price", "bond.final_cashflow"], component: "DcfLab", stageLabels: ["Construye", "Descuenta", "Suma"] }),
  scene({ id: "l2-depth", title: "Spot curve vs tasa plana", type: "recap", route: "REQUIRED", phase: "consolidation", durationMinutes: 8, sourceRefs: ["07-discounting-theory"], concepts: ["valuation.spot_rates"], component: "ConceptNote", stageLabels: ["r_t", "Caso plano"] })
];

export const lesson02: Lesson = {
  id: "lesson-02", slug: "del-cash-flow-al-precio", title: "Del cash flow al precio", kicker: "Lección 02 · Valoración",
  thesis: "El precio de un bono es la suma del valor presente de cada uno de sus cash flows.",
  requires: { concepts: ["bond.cashflows", "bond.final_cashflow", "bond.coupon_payment"], notation: ["notation.C_t", "notation.FV", "notation.t", "notation.T"] },
  requirement_routes: { concepts: { "bond.cashflows": "LIVE", "bond.final_cashflow": "LIVE", "bond.coupon_payment": "LIVE" }, notation: { "notation.C_t": "LIVE", "notation.FV": "LIVE", "notation.t": "LIVE", "notation.T": "LIVE" } },
  introduces: [
    ...["valuation.time_value", "valuation.discount_factor", "valuation.present_value", "valuation.price", "valuation.spot_rates"].map((id) => ({ id, kind: "concept" as const, route: "LIVE" as const, scene: id === "valuation.time_value" ? "l2-time-value" : id === "valuation.price" ? "l2-pv-price" : "l2-formula" })),
    ...["notation.CF_t", "notation.r_t", "notation.P", "notation.n"].map((id) => ({ id, kind: "notation" as const, route: "LIVE" as const, scene: id === "notation.P" ? "l2-pv-price" : "l2-formula" }))
  ],
  introduction_routes: Object.fromEntries(["valuation.time_value", "valuation.discount_factor", "valuation.present_value", "valuation.price", "valuation.spot_rates", "notation.CF_t", "notation.r_t", "notation.P", "notation.n"].map((id) => [id, "LIVE"])),
  recalls: [{ id: "bond.cashflows", scene: "l2-recall" }, { id: "bond.final_cashflow", scene: "l2-recall" }], routes: routesFromScenes(scenes),
  objectives: [
    { id: "l2-discount-flow", route: "LIVE", statement: "Calcular el valor presente de un flujo", concepts: ["valuation.discount_factor", "valuation.present_value"], notation: ["notation.CF_t", "notation.r_t"] },
    { id: "l2-price-bond", route: "LIVE", statement: "Sumar contribuciones de PV para obtener precio", concepts: ["valuation.price"], notation: ["notation.P"] }
  ],
  load: { livePresentationMinutes: 20, guidedMinutes: 20, requiredAutonomousMinutes: 8, optionalMinutes: 0 }, scenes,
  bridge: { known: "Sé calcular precio con tasas por plazo", gap: "Necesito una única medida comparable", next: "Necesito YTM", target: "lesson-03" },
  used_later: [{ id: "valuation.price", target: "lesson-03", route: "LIVE" }, { id: "valuation.present_value", target: "lesson-03", route: "LIVE" }, { id: "valuation.price", target: "lesson-04", route: "LIVE" }],
  financialClaims: ["bond.face_value_only_at_maturity", "bond.price_is_present_value"],
  misconceptions: ["principal_every_period", "flat_rate_is_universal", "spot_rate_equals_ytm"], deliveryProfiles
};
