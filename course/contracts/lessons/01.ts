import type { Lesson } from "../course";
import { deliveryProfiles, routesFromScenes, scene } from "./_helpers";

const scenes = [
  scene({ id: "l1-challenge", title: "¿Qué compras al entregar 100 €?", type: "hero-challenge", route: "LIVE", phase: "presentation", durationMinutes: 2, sourceRefs: ["03-miniblock-1-cover", "04-what-is-a-bond"], concepts: ["bond.contract"], component: "BondChallenge", stageLabels: ["Pregunta", "Contrato"] }),
  scene({ id: "l1-financing", title: "Capital hoy, pagos futuros", type: "financial-object", route: "LIVE", phase: "presentation", durationMinutes: 4, sourceRefs: ["04-what-is-a-bond"], concepts: ["bond.issuer", "bond.investor", "bond.contract"], component: "FinancingMap", teacher: { commonError: "Tratar el bono como una participación accionarial." } }),
  scene({ id: "l1-bond-object", title: "El bono canónico", type: "financial-object", route: "LIVE", phase: "presentation", durationMinutes: 3, sourceRefs: ["05-bond-anatomy"], concepts: ["bond.contract", "bond.coupon_rate", "bond.notional", "bond.face_value", "bond.maturity"], component: "BondObject", stageLabels: ["Documento", "Condiciones"] }),
  scene({ id: "l1-anatomy", title: "Anatomía del contrato", type: "concept-simulator", route: "LIVE", phase: "presentation", durationMinutes: 5, sourceRefs: ["05-bond-anatomy"], concepts: ["bond.coupon_rate", "bond.coupon_payment", "bond.notional", "bond.face_value", "bond.maturity"], component: "BondAnatomy", stageLabels: ["Cupón", "Base", "Principal", "Plazo"] }),
  scene({ id: "l1-cashflows", title: "Contrato → cash flows", type: "mathematical-state", route: "LIVE", phase: "presentation", durationMinutes: 5, sourceRefs: ["05-bond-anatomy"], concepts: ["bond.cashflows", "bond.final_cashflow", "bond.coupon_payment"], component: "CashflowTimeline", stageLabels: ["Hoy", "Cupones", "Pago final"] }),
  scene({ id: "l1-bridge", title: "Conozco pagos, no valor", type: "bridge", route: "LIVE", phase: "presentation", durationMinutes: 1, sourceRefs: ["05-bond-anatomy"], concepts: ["bond.cashflows"], component: "Bridge", stageLabels: ["Sé", "Falta", "Siguiente"] }),
  scene({ id: "l1-builder", title: "Bond Builder", type: "guided-exercise", route: "LIVE", phase: "guided", durationMinutes: 12, sourceRefs: ["05-bond-anatomy"], concepts: ["bond.coupon_rate", "bond.coupon_payment", "bond.notional", "bond.face_value", "bond.maturity", "bond.cashflows"], component: "BondBuilder", stageLabels: ["Configura", "Predice", "Comprueba"] }),
  scene({ id: "l1-contract-check", title: "Contract Check", type: "diagnostic-quiz", route: "LIVE", phase: "guided", durationMinutes: 8, sourceRefs: ["04-what-is-a-bond", "05-bond-anatomy"], concepts: ["bond.contract", "bond.final_cashflow"], component: "ContractQuiz", stageLabels: ["Responde", "Explica", "Corrige"] }),
  scene({ id: "l1-depth", title: "Notional y face value", type: "recap", route: "REQUIRED", phase: "consolidation", durationMinutes: 6, sourceRefs: ["05-bond-anatomy"], concepts: ["bond.notional", "bond.face_value"], component: "ConceptNote", stageLabels: ["Coinciden aquí", "No son universales"] })
];

export const lesson01: Lesson = {
  id: "lesson-01",
  slug: "el-bono-como-contrato",
  title: "El bono como contrato",
  kicker: "Lección 01 · Instrumento",
  thesis: "Un bono permite financiarse hoy mediante un contrato que fija quién paga, cuánto paga y cuándo paga.",
  requires: { concepts: [], notation: [] },
  requirement_routes: { concepts: {}, notation: {} },
  introduces: [
    ...["bond.contract", "bond.issuer", "bond.investor", "bond.coupon_rate", "bond.coupon_payment", "bond.notional", "bond.face_value", "bond.maturity", "bond.cashflows", "bond.final_cashflow"].map((id) => ({ id, kind: "concept" as const, route: "LIVE" as const, scene: id === "bond.cashflows" || id === "bond.final_cashflow" ? "l1-cashflows" : "l1-anatomy" })),
    ...["notation.C_t", "notation.N", "notation.FV", "notation.t", "notation.T"].map((id) => ({ id, kind: "notation" as const, route: "LIVE" as const, scene: id === "notation.C_t" || id === "notation.t" ? "l1-cashflows" : "l1-anatomy" }))
  ],
  introduction_routes: Object.fromEntries(["bond.contract", "bond.issuer", "bond.investor", "bond.coupon_rate", "bond.coupon_payment", "bond.notional", "bond.face_value", "bond.maturity", "bond.cashflows", "bond.final_cashflow", "notation.C_t", "notation.N", "notation.FV", "notation.t", "notation.T"].map((id) => [id, "LIVE"])),
  recalls: [], routes: routesFromScenes(scenes),
  objectives: [
    { id: "l1-explain-contract", route: "LIVE", statement: "Explicar la financiación emisor–inversor", concepts: ["bond.contract", "bond.issuer", "bond.investor"], notation: [] },
    { id: "l1-build-cashflows", route: "LIVE", statement: "Traducir condiciones del bono a sus cash flows", concepts: ["bond.coupon_payment", "bond.final_cashflow"], notation: ["notation.C_t", "notation.FV", "notation.T"] }
  ],
  load: { livePresentationMinutes: 20, guidedMinutes: 20, requiredAutonomousMinutes: 6, optionalMinutes: 0 },
  scenes,
  bridge: { known: "Sé qué pagos recibiré", gap: "No sé cuánto valen hoy", next: "Necesito descuento", target: "lesson-02" },
  used_later: [
    { id: "bond.cashflows", target: "lesson-02", route: "LIVE" },
    { id: "bond.coupon_payment", target: "lesson-03", route: "LIVE" },
    { id: "bond.coupon_rate", target: "lesson-04", route: "LIVE" }
  ],
  financialClaims: ["bond.coupon_is_rate"],
  misconceptions: ["coupon_rate_equals_payment", "notional_equals_face_value_universal"],
  deliveryProfiles
};
