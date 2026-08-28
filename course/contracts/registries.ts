import type { Route } from "./course";

export type NotationEntry = {
  id: string;
  symbol: string;
  name: string;
  meaning: string;
  firstIntroduction: string;
  route: Route;
  unit: string;
  visual: string;
  constraints: string;
};

export const notationRegistry: NotationEntry[] = [
  { id: "notation.C_t", symbol: "C_t", name: "coupon payment", meaning: "Pago de cupón en el periodo t", firstIntroduction: "l1-cashflows", route: "LIVE", unit: "currency", visual: "lime payment token", constraints: "No confundir con coupon rate" },
  { id: "notation.CF_t", symbol: "CF_t", name: "cash flow", meaning: "Flujo total recibido en t", firstIntroduction: "l2-recall", route: "LIVE", unit: "currency", visual: "timeline node", constraints: "En T incluye cupón más principal" },
  { id: "notation.r_t", symbol: "r_t", name: "spot discount rate", meaning: "Tasa aplicable al flujo de t", firstIntroduction: "l2-formula", route: "LIVE", unit: "annual rate", visual: "discount lens label", constraints: "No identificar automáticamente con YTM" },
  { id: "notation.y", symbol: "y", name: "yield to maturity", meaning: "Tasa única que iguala precio y PV de flujos", firstIntroduction: "l3-solve-ytm", route: "LIVE", unit: "annual rate", visual: "cyan comparison line", constraints: "No garantiza retorno realizado" },
  { id: "notation.P", symbol: "P", name: "price", meaning: "Precio observado hoy", firstIntroduction: "l2-pv-price", route: "LIVE", unit: "currency", visual: "large price result", constraints: "No es un término contractual" },
  { id: "notation.N", symbol: "N", name: "notional", meaning: "Base de cálculo del cupón", firstIntroduction: "l1-anatomy", route: "LIVE", unit: "currency", visual: "bond certificate field", constraints: "Puede diferir del face value" },
  { id: "notation.FV", symbol: "FV", name: "face value", meaning: "Principal devuelto al vencimiento", firstIntroduction: "l1-anatomy", route: "LIVE", unit: "currency", visual: "final payment core", constraints: "Aparece solo en el flujo final" },
  { id: "notation.t", symbol: "t", name: "period index", meaning: "Índice temporal de un flujo", firstIntroduction: "l1-cashflows", route: "LIVE", unit: "period", visual: "timeline coordinate", constraints: "1 ≤ t ≤ T" },
  { id: "notation.T", symbol: "T", name: "maturity in years", meaning: "Años hasta vencimiento", firstIntroduction: "l1-anatomy", route: "LIVE", unit: "years", visual: "terminal timeline marker", constraints: "Entero positivo en V1" },
  { id: "notation.n", symbol: "n", name: "coupon periods", meaning: "Número de periodos de cupón", firstIntroduction: "l2-formula", route: "LIVE", unit: "period", visual: "formula upper bound", constraints: "En V1 anual, n = T" }
];

export const conceptRegistry = [
  "bond.contract", "bond.issuer", "bond.investor", "bond.coupon_rate", "bond.coupon_payment",
  "bond.notional", "bond.face_value", "bond.maturity", "bond.cashflows", "bond.final_cashflow",
  "valuation.time_value", "valuation.discount_factor", "valuation.present_value", "valuation.price",
  "valuation.spot_rates", "yield.ytm", "return.terminal_wealth", "return.realized_cagr",
  "return.reinvestment", "market.residual_maturity", "market.repricing", "market.observed_bond",
  "curve.fair", "curve.benchmark", "curve.tenor"
] as const;

export const financialClaims = [
  { id: "bond.coupon_is_rate", statement: "El coupon rate y el coupon payment son magnitudes distintas", route: "LIVE", sourceRef: "05-bond-anatomy", lesson: "lesson-01" },
  { id: "bond.face_value_only_at_maturity", statement: "En el bono bullet anual de V1, el face value aparece únicamente en el flujo final", route: "LIVE", sourceRef: "08-discounting-example", lesson: "lesson-02" },
  { id: "bond.price_is_present_value", statement: "El precio es la suma del valor presente de todos los flujos", route: "LIVE", sourceRef: "07-discounting-theory", lesson: "lesson-02" },
  { id: "ytm.calculation_no_reinvestment", statement: "Calcular YTM no requiere reinvertir los cupones", route: "LIVE", sourceRef: "10-ytm-vs-cagr", lesson: "lesson-03" },
  { id: "ytm.realization_requires_reinvestment", statement: "Realizar un retorno compuesto igual al YTM requiere reinvertir cupones al YTM", route: "LIVE", sourceRef: "10-ytm-vs-cagr", lesson: "lesson-03" },
  { id: "ytm.same_not_same_cagr", statement: "Mismo YTM no implica el mismo CAGR sin reinversión", route: "LIVE", sourceRef: "11-same-ytm-different-cagr", lesson: "lesson-03" },
  { id: "market.coupon_fixed_price_moves", statement: "El cupón queda fijo y el precio de mercado cambia", route: "LIVE", sourceRef: "14-coupon-price-ytm", lesson: "lesson-04" },
  { id: "curve.point_not_line", statement: "Cada punto es un bono observado; la línea es una curva ajustada", route: "LIVE", sourceRef: "15-yield-curve", lesson: "lesson-04" },
  { id: "curve.short_boundary", statement: "La separación pedagógica de corto plazo ocurre exactamente en 2Y", route: "LIVE", sourceRef: "15-yield-curve", lesson: "lesson-04" }
] as const;

export const representationChain = [
  "bond.contract",
  "cashflow.sequence",
  "present_value.contributions",
  "return.structure",
  "curve.observed_point"
] as const;

export const misconceptions = [
  { id: "coupon_rate_equals_payment", statement: "4% equivale siempre a 4 €", lesson: "lesson-01", treatmentScene: "l1-builder" },
  { id: "notional_equals_face_value_universal", statement: "Notional y face value son siempre sinónimos", lesson: "lesson-01", treatmentScene: "l1-contract-check" },
  { id: "principal_every_period", statement: "El principal se paga en cada periodo", lesson: "lesson-02", treatmentScene: "l2-dcf-lab" },
  { id: "flat_rate_is_universal", statement: "Una tasa plana es la regla general", lesson: "lesson-02", treatmentScene: "l2-rate-lab" },
  { id: "spot_rate_equals_ytm", statement: "r_t es automáticamente YTM", lesson: "lesson-02", treatmentScene: "l2-formula" },
  { id: "ytm_guaranteed_return", statement: "YTM es retorno realizado garantizado", lesson: "lesson-03", treatmentScene: "l3-reinvestment" },
  { id: "ytm_calculation_needs_reinvestment", statement: "Calcular YTM exige reinvertir", lesson: "lesson-03", treatmentScene: "l3-solve-ytm" },
  { id: "same_ytm_same_cagr", statement: "Mismo YTM implica mismo CAGR", lesson: "lesson-03", treatmentScene: "l3-compare-cagr" },
  { id: "zero_coupon_reinvestment", statement: "Un zero coupon tiene cupones que reinvertir", lesson: "lesson-03", treatmentScene: "l3-zero-bridge" },
  { id: "coupon_changes_with_market", statement: "El cupón cambia con el mercado", lesson: "lesson-04", treatmentScene: "l4-repricing" },
  { id: "original_equals_residual", statement: "Vencimiento original y vida residual son iguales", lesson: "lesson-04", treatmentScene: "l4-residual-life" },
  { id: "point_is_curve", statement: "Cada punto individual es la curva", lesson: "lesson-04", treatmentScene: "l4-points-curve" },
  { id: "curve_is_observed_bond", statement: "La línea es un bono observado", lesson: "lesson-04", treatmentScene: "l4-points-curve" },
  { id: "benchmark_only_bond", statement: "Benchmark es el único bono de ese tenor", lesson: "lesson-04", treatmentScene: "l4-benchmarks" }
] as const;
