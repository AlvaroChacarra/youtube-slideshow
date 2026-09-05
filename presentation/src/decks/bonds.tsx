import type { DeckDefinition, SceneContext, Scene } from "../player/types";
import { slides, chapters, glossary } from "../presentation/content";
import {
  BondActor,
  CashflowSpine,
  RangeControl,
} from "../presentation/primitives";
import {
  Cover,
  Roadmap,
  Financing,
  Anatomy,
  DiscountTheory,
  DiscountExample,
} from "../presentation/Foundations";
import {
  ReturnsComparison,
  CouponComparison,
  BondGenerations,
  PriceDiscovery,
  MarketCurve,
  RecapFoundations,
  RecapMarket,
} from "../presentation/Markets";
import { euro } from "../presentation/model";
import { bondCloud } from "../presentation/BondCurve";

export type BondScenario = {
  lastRate: number;
  reinvestment: number;
  marketYield: number;
  flow: number;
  curvePoint: string | null;
  curveRange: 10 | 50 | null;
  couponCase: number;
};
const initial: BondScenario = {
  lastRate: 0.04,
  reinvestment: 0,
  marketYield: 0.04,
  flow: 1,
  curvePoint: null,
  curveRange: null,
  couponCase: 0,
};
const ids = slides.map((s) => s.slug);
const stepIds = [
  ["opening"],
  ["route"],
  ["issuers", "capital", "payments", "activity"],
  ["contract", "terms", "coupon", "cashflows"],
  ["dates", "present-value", "price"],
  ["cashflows", "terms", "sum", "last-rate"],
  ["ytm", "cash", "cagr", "reinvestment"],
  ["coupons", "prices", "wealth", "cagr"],
  ["issue", "generations", "age", "tenor"],
  ["contracts", "yield", "price", "point"],
  ["point", "cloud", "fair", "benchmarks"],
  ["contract", "cashflows", "price"],
  ["returns", "pricing", "curve"],
];
const concepts = [
  "coupon",
  "principal",
  "present-value",
  "ytm",
  "cagr",
  "tenor",
  "curve",
];
const introduced = [3, 3, 4, 6, 6, 8, 10];
const sceneConcepts = [
  [],
  [],
  ["principal"],
  ["coupon", "principal"],
  ["present-value"],
  ["present-value"],
  ["ytm", "cagr"],
  ["cagr"],
  ["tenor"],
  ["ytm"],
  ["curve"],
  ["coupon", "principal", "present-value"],
  ["ytm", "cagr", "tenor", "curve"],
];
const prerequisites = [
  [],
  [],
  [],
  [],
  ["coupon", "principal"],
  ["present-value"],
  ["present-value"],
  ["ytm", "cagr"],
  ["coupon"],
  ["coupon", "ytm", "tenor"],
  ["ytm", "tenor"],
  [],
  [],
];
const renderers: Array<(ctx: SceneContext<BondScenario>) => React.ReactNode> = [
  () => <Cover />,
  (c) => <Roadmap onJump={(i) => c.jump(ids[i]!)} />,
  (c) => <Financing step={c.step} />,
  (c) => <Anatomy step={c.step} />,
  (c) => <DiscountTheory step={c.step} selected={c.scenario.flow} />,
  (c) => (
    <DiscountExample
      step={c.step}
      rate={c.scenario.lastRate}
      onRate={(lastRate) => c.update({ lastRate })}
      selected={c.scenario.flow}
    />
  ),
  (c) => (
    <ReturnsComparison
      step={c.step}
      rate={c.scenario.reinvestment}
      onRate={(reinvestment) => c.update({ reinvestment })}
      selected={c.scenario.flow}
      onSelect={(flow) => c.update({ flow })}
    />
  ),
  (c) => (
    <CouponComparison
      step={c.step}
      active={c.scenario.couponCase}
      onSelect={(couponCase) => c.update({ couponCase })}
    />
  ),
  (c) => <BondGenerations step={c.step} />,
  (c) => (
    <PriceDiscovery
      step={c.step}
      rate={c.scenario.marketYield}
      onRate={(marketYield) => c.update({ marketYield })}
    />
  ),
  (c) => (
    <MarketCurve
      step={c.step}
      chosen={c.scenario.curvePoint}
      focus={c.scenario.curveRange}
      onRange={(curveRange) => c.update({ curveRange })}
      onChoose={(curvePoint) => c.update({ curvePoint })}
    />
  ),
  (c) => <RecapFoundations step={c.step} />,
  (c) => <RecapMarket step={c.step} />,
];
const actorModes: Record<
  string,
  "cover" | "financing" | "anatomy" | "valuation"
> = {
  "01-block-cover": "cover",
  "03-what-is-a-bond": "financing",
  "04-bond-anatomy": "anatomy",
  "05-discounting-theory": "valuation",
  "06-discounting-example": "valuation",
};
const railModes: Record<string, "anatomy" | "theory" | "example" | "returns"> =
  {
    "04-bond-anatomy": "anatomy",
    "05-discounting-theory": "theory",
    "06-discounting-example": "example",
    "07-ytm-vs-cagr": "returns",
  };
const sceneScenarios = [
  "canonical",
  "canonical",
  "canonical",
  "canonical",
  "canonical",
  "discount-rates",
  "reinvestment",
  "coupon-cases",
  "generations",
  "market-yield",
  "illustrative-curve",
  "canonical",
  "canonical",
];
const scenes: Scene<BondScenario>[] = slides.map((s, i) => ({
  id: s.slug,
  title: s.title,
  eyebrow: s.eyebrow,
  chapter: s.chapter,
  note: s.note,
  question: s.question,
  answer: s.answer,
  steps: s.steps.map((title, j) => ({
    id: stepIds[i]![j]!,
    title,
    caption: s.captions[j] ?? "",
  })),
  conceptIds: sceneConcepts[i]!,
  prerequisiteIds: prerequisites[i]!,
  entityIds: i >= 2 && i <= 6 ? ["canonical-bond", "canonical-cashflows"] : [],
  scenarioId: sceneScenarios[i]!,
  cover: i === 0,
  className: `slide-${i}`,
  render: renderers[i]!,
  ...(i === 5
    ? {
        caption: (c: SceneContext<BondScenario>) =>
          c.step >= 2 && c.scenario.lastRate !== 0.04
            ? `Con r₅ = ${euro(c.scenario.lastRate * 100, 1)}% y las otras tasas al 4%, cambia el precio. Los pagos se conservan.`
            : (s.captions[c.step] ?? ""),
      }
    : i === 6
      ? {
          caption: (c: SceneContext<BondScenario>) =>
            c.step === 3
              ? `La YTM permanece al 4%. La reinversión g = ${euro(c.scenario.reinvestment * 100, 1)}% cambia la riqueza terminal y el CAGR; ambos rendimientos coinciden cuando g = 4%.`
              : (s.captions[c.step] ?? ""),
        }
      : {}),
}));
export const bondsDeck: DeckDefinition<BondScenario> = {
  id: "bonds-foundations",
  version: 2,
  title: "Fundamentos de los bonos",
  subtitle: "FIXED INCOME · FUNDAMENTOS",
  author: "ÁLVARO LÓPEZ CHACARRA",
  mark: "01",
  className: "bonds-deck",
  chapters: chapters.map((c) => ({ title: c.title, sceneId: ids[c.slide]! })),
  scenes,
  entities: ["canonical-bond", "canonical-cashflows"],
  scenarioIds: [...new Set(sceneScenarios)],
  concepts: glossary.map(([title, explanation], i) => ({
    id: concepts[i]!,
    title: title!,
    explanation: explanation!,
    introducedAt: ids[introduced[i]!]!,
    ...(i === 2
      ? {
          inputs: "Importe del pago, plazo y tasa anual efectiva del plazo.",
          output: "Valor equivalente hoy, en euros.",
        }
      : i === 3
        ? {
            inputs: "Precio observado y pagos fechados del contrato.",
            output:
              "Una tasa interna anual que iguala precio y valor presente.",
          }
        : i === 4
          ? {
              inputs: "Precio inicial, riqueza terminal y años de inversión.",
              output: "Tasa anual compuesta de esa riqueza.",
            }
          : {}),
  })),
  initialScenario: initial,
  validateScenario: (value: unknown): value is BondScenario => {
    if (!value || typeof value !== "object") return false;
    const v = value as BondScenario;
    return (
      Object.keys(v).length === 7 &&
      [null, 10, 50].includes(v.curveRange) &&
      Number.isInteger(v.couponCase) &&
      v.couponCase >= 0 &&
      v.couponCase <= 2 &&
      Number.isFinite(v.lastRate) &&
      v.lastRate >= 0 &&
      v.lastRate <= 0.1 &&
      Number.isFinite(v.reinvestment) &&
      v.reinvestment >= 0 &&
      v.reinvestment <= 0.08 &&
      Number.isFinite(v.marketYield) &&
      v.marketYield >= 0.01 &&
      v.marketYield <= 0.08 &&
      Number.isInteger(v.flow) &&
      v.flow >= 1 &&
      v.flow <= 5 &&
      (v.curvePoint === null || bondCloud.some((p) => p.id === v.curvePoint))
    );
  },
  resetScene: (id, s) => ({
    ...s,
    flow: 1,
    ...(id === "06-discounting-example"
      ? { lastRate: 0.04 }
      : id === "07-ytm-vs-cagr"
        ? { reinvestment: 0 }
        : id === "10-coupon-price-ytm"
          ? { marketYield: 0.04 }
          : id === "08-same-ytm-different-cagr"
            ? { couponCase: 0 }
            : id === "11-yield-curve"
              ? { curvePoint: null, curveRange: null }
              : {}),
  }),
  backdrop: (c) =>
    ["01-block-cover", "03-what-is-a-bond"].includes(c.sceneId) ? (
      <div
        className="skyline"
        style={{
          backgroundImage: `url(${import.meta.env.OFFLINE_SKYLINE || `${import.meta.env.BASE_URL}assets/financial-skyline.webp`})`,
        }}
        aria-hidden="true"
      />
    ) : null,
  overlay: (c) => (
    <>
      <BondActor
        mode={actorModes[c.sceneId] ?? "hidden"}
        step={c.step}
        motion={c.motion}
      />
      <CashflowSpine
        mode={railModes[c.sceneId] ?? "hidden"}
        step={c.step}
        motion={c.motion}
        selected={c.scenario.flow}
        onSelect={(flow) => c.update({ flow })}
      />
    </>
  ),
  controls: (c) =>
    c.sceneId === "06-discounting-example" ? (
      <RangeControl
        label="Tasa del año 5 · r₅"
        value={c.scenario.lastRate}
        onChange={(lastRate) => c.update({ lastRate })}
      />
    ) : c.sceneId === "07-ytm-vs-cagr" ? (
      <RangeControl
        label="Reinversión de cupones · g"
        value={c.scenario.reinvestment}
        onChange={(reinvestment) => c.update({ reinvestment })}
        max={0.08}
      />
    ) : c.sceneId === "10-coupon-price-ytm" ? (
      <RangeControl
        label="Rendimiento exigido común · YTM"
        value={c.scenario.marketYield}
        onChange={(marketYield) => c.update({ marketYield })}
        min={0.01}
        max={0.08}
      />
    ) : null,
};
