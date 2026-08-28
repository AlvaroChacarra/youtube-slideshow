import { useMemo, useState } from "react";
import { cashFlows, couponPayment } from "../domain/cashflows";
import { solveYtm } from "../domain/ytm";

const questions = [
  ["L1", "¿Qué magnitud sirve de base para calcular el cupón?", ["Precio", "Notional", "YTM"], 1],
  ["L1", "¿Dónde aparece el principal en este bono bullet?", ["Cada año", "Solo al vencimiento", "Nunca"], 1],
  ["L1", "Cupón 3% y notional 100 implican…", ["3 €", "30 €", "103 €"], 0],
  ["L2", "El precio de un bono es…", ["Su último flujo", "Σ de PVs", "Su cupón"], 1],
  ["L2", "rₜ representa…", ["La tasa aplicable al flujo t", "Siempre YTM", "Coupon rate"], 0],
  ["L2", "¿Cuándo entra FV en el numerador?", ["En t=1", "En todos", "En maturity"], 2],
  ["L3", "¿Calcular YTM exige reinvertir cupones?", ["Sí", "No", "Solo a prima"], 1],
  ["L3", "Para realizar un retorno compuesto igual a YTM…", ["Reinvertir cupones al YTM", "Vender cada año", "Cambiar cupón"], 0],
  ["L3", "En un zero coupon mantenido a T…", ["YTM y CAGR coinciden", "No existe YTM", "Hay reinversión"], 0],
  ["L4", "¿Qué cambia con el mercado?", ["Cupón", "Face value", "Precio"], 2],
  ["L4", "Cada punto de la nube es…", ["Un bono observado", "La curva", "Un banco central"], 0],
  ["L4", "Benchmark significa…", ["Único bono", "Más líquido/seguido", "Cupón más alto"], 1]
] as const;

export default function CheckpointRuntime() {
  const bond = useMemo(() => ({ notional: 100, faceValue: 100, annualCouponRate: 0.03, maturityYears: 5 } as const), []);
  const flows = useMemo(() => cashFlows(bond), [bond]);
  const ytm = solveYtm({ price: 95.55, flows }).yield;
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [caseStep, setCaseStep] = useState(0);
  const score = Object.entries(answers).filter(([index, answer]) => questions[Number(index)]?.[3] === answer).length;
  const caseFacts = [
    `Coupon payment = 3% × 100 = ${couponPayment(bond).toFixed(0)} €`,
    `Cash flows = ${flows.map((flow) => flow.amount.toFixed(0)).join(" · ")}`,
    "El último flujo separa 3 € de cupón + 100 € de principal",
    "Precio 95,55 < FV 100: el bono cotiza con descuento",
    `YTM inferida ≈ ${(ytm * 100).toFixed(2)}%`,
    "Coordenada aproximada: (5Y, 4%)",
    "Punto = bono; benchmark = referencia líquida; línea = curva ajustada"
  ];
  return <div className="checkpoint-runtime">
    <section className="checkpoint-case">
      <span className="eyebrow">Caso integrado · 5Y</span><h2>De contrato a curva</h2>
      <div className="case-ticket"><span>Cupón <b>3%</b></span><span>FV <b>100</b></span><span>Precio <b>95,55</b></span></div>
      <ol>{caseFacts.map((fact, index) => <li key={fact} className={index <= caseStep ? "revealed" : ""}><button onClick={() => setCaseStep(index)}><span>{index + 1}</span><p>{index <= caseStep ? fact : ["Construye el cupón", "Construye los cash flows", "Identifica el flujo final", "Explica el descuento", "Infiere YTM", "Sitúa el bono", "Explica punto, benchmark y curva"][index]}</p></button></li>)}</ol>
    </section>
    <section className="retrieval-check"><header><div><span className="eyebrow">Retrieval check</span><h2>12 preguntas · 3 por lección</h2></div><strong className="tabular">{score}/{Object.keys(answers).length}</strong></header>
      <div className="question-grid">{questions.map(([lesson, prompt, options, correct], index) => <fieldset key={prompt}><legend><span>{lesson}</span>{prompt}</legend>{options.map((option, optionIndex) => <button key={option} className={answers[index] === optionIndex ? optionIndex === correct ? "correct" : "wrong" : ""} onClick={() => setAnswers((current) => ({ ...current, [index]: optionIndex }))}>{option}</button>)}{answers[index] !== undefined && <small>{answers[index] === correct ? "Correcto" : `Revisa: ${options[correct]}`}</small>}</fieldset>)}</div>
    </section>
  </div>;
}
