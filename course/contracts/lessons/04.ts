import type { Lesson } from "../course";
import { deliveryProfiles, routesFromScenes, scene } from "./_helpers";

const scenes = [
  scene({ id: "l4-recall", title: "Recall: YTM", type: "recall", route: "LIVE", phase: "presentation", durationMinutes: 2, sourceRefs: ["12-miniblock-4-cover", "14-coupon-price-ytm"], concepts: ["yield.ytm"], component: "YtmSolver", stageLabels: ["Precio + flujos", "YTM"] }),
  scene({ id: "l4-generations", title: "Generaciones de bonos", type: "financial-object", route: "LIVE", phase: "presentation", durationMinutes: 4, sourceRefs: ["13-why-many-bonds-same-tenor"], concepts: ["market.residual_maturity", "curve.tenor"], component: "BondGenerations", stageLabels: ["Nace 10Y", "Envejece", "Conviven"] }),
  scene({ id: "l4-residual-life", title: "Vida residual", type: "concept-simulator", route: "LIVE", phase: "presentation", durationMinutes: 3, sourceRefs: ["13-why-many-bonds-same-tenor"], concepts: ["market.residual_maturity"], component: "ResidualLife", stageLabels: ["Original", "Pasa tiempo", "Residual"] }),
  scene({ id: "l4-repricing", title: "Cupón fijo, precio variable", type: "concept-simulator", route: "LIVE", phase: "presentation", durationMinutes: 5, sourceRefs: ["14-coupon-price-ytm"], concepts: ["market.repricing", "yield.ytm", "valuation.price"], component: "Repricing", stageLabels: ["7% prima", "4% par", "3% descuento"] }),
  scene({ id: "l4-bonds-points", title: "Bonos → puntos", type: "market-map", route: "LIVE", phase: "presentation", durationMinutes: 2, sourceRefs: ["14-coupon-price-ytm", "15-yield-curve"], concepts: ["market.observed_bond", "curve.tenor"], component: "BondCloud", stageLabels: ["Bonos", "Coordenadas", "Puntos"] }),
  scene({ id: "l4-points-curve", title: "Puntos → curva", type: "market-map", route: "LIVE", phase: "presentation", durationMinutes: 2, sourceRefs: ["15-yield-curve"], concepts: ["market.observed_bond", "curve.fair"], component: "YieldCurve", stageLabels: ["Nube", "Ajuste", "Curva"] }),
  scene({ id: "l4-benchmarks", title: "Benchmarks", type: "market-map", route: "LIVE", phase: "presentation", durationMinutes: 1, sourceRefs: ["15-yield-curve"], concepts: ["curve.benchmark", "curve.tenor"], component: "YieldCurve", stageLabels: ["Anclajes", "No únicos"] }),
  scene({ id: "l4-bridge", title: "De nivel a sensibilidad", type: "bridge", route: "LIVE", phase: "presentation", durationMinutes: 1, sourceRefs: ["15-yield-curve"], concepts: ["curve.fair", "yield.ytm"], component: "Bridge", stageLabels: ["Sé", "Falta", "Duration"] }),
  scene({ id: "l4-pricing-lab", title: "Pricing Lab", type: "guided-exercise", route: "LIVE", phase: "guided", durationMinutes: 8, sourceRefs: ["14-coupon-price-ytm"], concepts: ["market.repricing", "yield.ytm"], component: "PricingLab", stageLabels: ["Fija cupón", "Mueve precio", "Iguala YTM"] }),
  scene({ id: "l4-curve-lab", title: "Curve Explorer", type: "guided-exercise", route: "LIVE", phase: "guided", durationMinutes: 8, sourceRefs: ["15-yield-curve"], concepts: ["curve.fair", "curve.benchmark", "curve.tenor"], component: "CurveExplorer", stageLabels: ["Lee punto", "Compara tenor", "Interpreta línea"] }),
  scene({ id: "l4-exit", title: "Exit Check", type: "diagnostic-quiz", route: "LIVE", phase: "guided", durationMinutes: 4, sourceRefs: ["13-why-many-bonds-same-tenor", "14-coupon-price-ytm", "15-yield-curve"], concepts: ["market.repricing", "curve.fair", "curve.benchmark"], component: "CurveQuiz", stageLabels: ["Responde", "Explica"] }),
  scene({ id: "l4-depth", title: "Curva observada vs spot curve", type: "recap", route: "REQUIRED", phase: "consolidation", durationMinutes: 8, sourceRefs: ["15-yield-curve"], concepts: ["curve.fair", "valuation.spot_rates"], component: "ConceptNote", stageLabels: ["YTM observada", "Spot discounting"] })
];

export const lesson04: Lesson = {
  id: "lesson-04", slug: "del-bono-individual-a-la-curva", title: "Del bono individual a la curva", kicker: "Lección 04 · Mercado",
  thesis: "El mercado ajusta el precio de cada bono; el YTM permite compararlos y la curva organiza esas observaciones por plazo.",
  requires: { concepts: ["yield.ytm", "bond.coupon_rate", "valuation.price"], notation: ["notation.y", "notation.P", "notation.T"] },
  requirement_routes: { concepts: { "yield.ytm": "LIVE", "bond.coupon_rate": "LIVE", "valuation.price": "LIVE" }, notation: { "notation.y": "LIVE", "notation.P": "LIVE", "notation.T": "LIVE" } },
  introduces: ["market.residual_maturity", "market.repricing", "market.observed_bond", "curve.fair", "curve.benchmark", "curve.tenor"].map((id) => ({ id, kind: "concept" as const, route: "LIVE" as const, scene: id === "market.residual_maturity" ? "l4-residual-life" : id === "market.repricing" ? "l4-repricing" : id === "curve.benchmark" ? "l4-benchmarks" : "l4-points-curve" })),
  introduction_routes: { "market.residual_maturity": "LIVE", "market.repricing": "LIVE", "market.observed_bond": "LIVE", "curve.fair": "LIVE", "curve.benchmark": "LIVE", "curve.tenor": "LIVE" },
  recalls: [{ id: "yield.ytm", scene: "l4-recall" }], routes: routesFromScenes(scenes),
  objectives: [
    { id: "l4-explain-repricing", route: "LIVE", statement: "Explicar por qué el cupón permanece fijo y el precio cambia", concepts: ["market.repricing", "yield.ytm"], notation: ["notation.P", "notation.y"] },
    { id: "l4-read-curve", route: "LIVE", statement: "Distinguir bono observado, benchmark y curva fair", concepts: ["market.observed_bond", "curve.benchmark", "curve.fair"], notation: ["notation.y"] }
  ],
  load: { livePresentationMinutes: 20, guidedMinutes: 20, requiredAutonomousMinutes: 8, optionalMinutes: 0 }, scenes,
  bridge: { known: "Sé leer precio, YTM y curva", gap: "No sé cuánto cambia el precio cuando cambia el yield", next: "Necesito sensibilidad y duration", target: "block-02" },
  used_later: [{ id: "market.repricing", target: "block-02", route: "LIVE" }, { id: "curve.fair", target: "block-03", route: "LIVE" }],
  financialClaims: ["market.coupon_fixed_price_moves", "curve.point_not_line", "curve.short_boundary"],
  misconceptions: ["coupon_changes_with_market", "original_equals_residual", "point_is_curve", "curve_is_observed_bond", "benchmark_only_bond"], deliveryProfiles
};
