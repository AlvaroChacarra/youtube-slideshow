import type { CSSProperties } from "react";
import { scaleLinear } from "d3-scale";
import type { DeckDefinition, SceneContext } from "../../player/types";
import { Build, Formula, NumberValue } from "../../visuals/Primitives";
import { useElementSize } from "../../visuals/useElementSize";

export type RegressionScenario = {
  slope: number;
  observation: number;
  input: number;
};
export const observations = [
  { id: 1, x: 1, y: 2.2 },
  { id: 2, x: 2, y: 2.8 },
  { id: 3, x: 3, y: 4.2 },
  { id: 4, x: 4, y: 4.8 },
];
export const predict = (x: number, slope: number) => 1 + slope * x;
export const meanSquaredError = (slope: number) =>
  observations.reduce((sum, p) => sum + (p.y - predict(p.x, slope)) ** 2, 0) /
  observations.length;

function Plot({
  context,
  showLine = false,
  showError = false,
  showPrediction = false,
}: {
  context: SceneContext<RegressionScenario>;
  showLine?: boolean;
  showError?: boolean;
  showPrediction?: boolean;
}) {
  const { ref, width } = useElementSize(700),
    height = 270;
  const x = scaleLinear()
    .domain([0, 6])
    .range([38, width - 25]);
  const y = scaleLinear()
    .domain([0, 10])
    .range([height - 37, 22]);
  const s = context.scenario;
  return (
    <div ref={ref} className="regression-plot">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="group"
        aria-label="Horas de práctica y puntuación: cuatro observaciones ilustrativas"
      >
        {[0, 2, 4, 6, 8, 10].map((t) => (
          <g key={t}>
            <path className="chart-grid" d={`M38 ${y(t)}H${width - 25}`} />
            <text x={28} y={y(t) + 4} textAnchor="end">
              {t}
            </text>
          </g>
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map((t) => (
          <text key={t} x={x(t)} y={height - 16} textAnchor="middle">
            {t}
          </text>
        ))}
        <text x={38} y={12}>
          Puntuación · puntos
        </text>
        <text x={width - 25} y={height - 1} textAnchor="end">
          Práctica · horas
        </text>
        {showLine && (
          <path
            className="regression-line"
            d={`M${x(0)} ${y(1)}L${x(6)} ${y(predict(6, s.slope))}`}
          />
        )}
        {observations.map((p) => (
          <g
            key={p.id}
            role="button"
            tabIndex={0}
            aria-label={`Observación ${p.id}: ${p.x} horas, ${p.y} puntos`}
            aria-pressed={p.id === s.observation}
            onClick={() => context.update({ observation: p.id })}
            onKeyDown={(e) => {
              if (["Enter", " "].includes(e.key)) {
                e.preventDefault();
                context.update({ observation: p.id });
              }
            }}
          >
            {showError && (
              <path
                className="regression-residual"
                d={`M${x(p.x)} ${y(p.y)}V${y(predict(p.x, s.slope))}`}
              />
            )}
            <circle cx={x(p.x)} cy={y(p.y)} r={15} fill="transparent" />
            <circle
              className="observation"
              cx={x(p.x)}
              cy={y(p.y)}
              r={p.id === s.observation ? 7 : 5}
            />
          </g>
        ))}
        {showPrediction && (
          <g>
            <path
              className="selected-guide"
              d={`M${x(s.input)} ${height - 37}V${y(predict(s.input, s.slope))}H38`}
            />
            <circle
              cx={x(s.input)}
              cy={y(predict(s.input, s.slope))}
              r={7}
              className="prediction-point"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
function DataScene(c: SceneContext<RegressionScenario>) {
  const p = observations.find((p) => p.id === c.scenario.observation)!;
  return (
    <div className="regression-scene">
      <Plot context={c} />
      <div className="regression-reading">
        <span className="panel-overline">UNA OBSERVACIÓN</span>
        <h2>
          {p.x} horas <span>→</span> {p.y.toLocaleString("es-ES")} puntos
        </h2>
        <Build at={1} step={c.step}>
          <p>
            Cada punto vincula una entrada <b>x</b> con un resultado observado{" "}
            <b>y</b>.
          </p>
        </Build>
        <small>
          Cuatro datos inventados para explicar el mecanismo. No demuestran
          causalidad.
        </small>
      </div>
    </div>
  );
}
function ModelScene(c: SceneContext<RegressionScenario>) {
  return (
    <div className="regression-scene">
      <Plot context={c} showLine showError={c.step >= 1} />
      <div className="regression-reading">
        <span className="panel-overline">UNA REGLA COMPARTIDA</span>
        <Formula display>{"\\hat y = 1 + a x"}</Formula>
        <p>
          a es la pendiente: cuánto cambia la predicción por cada hora
          adicional.
        </p>
        <Build at={1} step={c.step}>
          <p>Las distancias verticales son errores de predicción.</p>
          <strong className="regression-metric">
            <NumberValue value={meanSquaredError(c.scenario.slope)} />
            <small> Error cuadrático medio · puntos²</small>
          </strong>
        </Build>
        <Build at={2} step={c.step}>
          <label className="regression-slider">
            Pendiente a{" "}
            <output>{c.scenario.slope.toLocaleString("es-ES")}</output>
            <input
              aria-label="Pendiente a"
              type="range"
              min={0.5}
              max={1.5}
              step={0.05}
              value={c.scenario.slope}
              onChange={(e) =>
                c.update({ slope: Number(e.currentTarget.value) })
              }
            />
          </label>
        </Build>
      </div>
    </div>
  );
}
function PredictionScene(c: SceneContext<RegressionScenario>) {
  return (
    <div className="regression-scene">
      <Plot context={c} showLine showPrediction />
      <div className="regression-reading">
        <span className="panel-overline">UNA ENTRADA NUEVA</span>
        <label className="regression-slider">
          Horas de práctica <output>{c.scenario.input}</output>
          <input
            aria-label="Horas de práctica"
            type="range"
            min={0}
            max={6}
            step={0.5}
            value={c.scenario.input}
            onChange={(e) => c.update({ input: Number(e.currentTarget.value) })}
          />
        </label>
        <strong className="regression-metric">
          <NumberValue value={predict(c.scenario.input, c.scenario.slope)} />
          <small> puntos estimados</small>
        </strong>
        <Build at={1} step={c.step}>
          <p>
            La predicción procede de la misma regla. Aún debemos comprobarla con
            datos nuevos.
          </p>
          <p>
            Fuera del intervalo observado de 1–4 horas estamos extrapolando.
          </p>
        </Build>
      </div>
    </div>
  );
}
const common = {
  eyebrow: "Del dato a una predicción",
  chapter: 0,
  entityIds: ["observations", "model"],
  scenarioId: "linear-demo",
  className: "regression-stage",
};
export const regressionDeck: DeckDefinition<RegressionScenario> = {
  id: "regression-intro",
  version: 1,
  title: "Del dato a una predicción",
  subtitle: "DATA SCIENCE · UNA REGLA VISUAL",
  author: "ÁLVARO LÓPEZ CHACARRA",
  mark: "02",
  className: "regression-deck",
  theme: { "--cyan": "#c2b5fb", "--lime": "#f5c984" } as CSSProperties,
  chapters: [{ title: "Datos → regla → predicción", sceneId: "observations" }],
  entities: ["observations", "model"],
  scenarioIds: ["linear-demo"],
  concepts: [
    {
      id: "xy",
      title: "Entrada y resultado",
      explanation:
        "x es una característica observada; y es el resultado asociado. Una fila de datos produce un punto (x,y).",
      introducedAt: "observations",
    },
    {
      id: "model",
      title: "Regla y error",
      explanation:
        "La regla ŷ=1+ax transforma x en una predicción. El error es y−ŷ; el error cuadrático medio promedia los cuadrados de esas diferencias.",
      introducedAt: "model",
      inputs: "Horas x y pendiente a; intercepto fijo de 1 punto.",
      output: "Puntuación estimada ŷ.",
    },
    {
      id: "prediction",
      title: "Predicción y validación",
      explanation:
        "Aplicar la regla a un x nuevo produce una estimación, no una garantía. Para juzgarla se necesitan observaciones nuevas.",
      introducedAt: "prediction",
    },
  ],
  initialScenario: { slope: 1, observation: 1, input: 5 },
  validateScenario: (value: unknown): value is RegressionScenario => {
    if (!value || typeof value !== "object") return false;
    const v = value as RegressionScenario;
    return (
      Object.keys(v).length === 3 &&
      Number.isFinite(v.slope) &&
      v.slope >= 0.5 &&
      v.slope <= 1.5 &&
      Number.isInteger(v.observation) &&
      v.observation >= 1 &&
      v.observation <= 4 &&
      Number.isFinite(v.input) &&
      v.input >= 0 &&
      v.input <= 6
    );
  },
  resetScene: (id, s) =>
    id === "model"
      ? { ...s, slope: 1 }
      : id === "prediction"
        ? { ...s, input: 5 }
        : { ...s, observation: 1 },
  scenes: [
    {
      ...common,
      id: "observations",
      title: "Cada punto cuenta una observación.",
      conceptIds: ["xy"],
      prerequisiteIds: [],
      steps: [
        {
          id: "points",
          title: "Leer los datos",
          caption:
            "Selecciona un punto: conserva su identidad durante toda la explicación.",
        },
        {
          id: "coordinates",
          title: "Relacionar entrada y resultado",
          caption:
            "Las coordenadas convierten una fila de datos en una relación visual.",
        },
      ],
      note: "Presentar los datos como ejemplos ilustrativos. Seleccionar una observación y nombrar las unidades de ambos ejes.",
      question: "¿Qué representan las dos coordenadas?",
      answer:
        "Horas de práctica y puntuación observada. Una asociación no prueba causalidad.",
      render: DataScene,
    },
    {
      ...common,
      id: "model",
      title: "Una regla aproxima el conjunto.",
      conceptIds: ["model"],
      prerequisiteIds: ["xy"],
      steps: [
        {
          id: "line",
          title: "Introducir la regla",
          caption: "La misma regla produce una predicción para cualquier x.",
        },
        {
          id: "errors",
          title: "Ver los errores",
          caption:
            "Cada distancia vertical compara lo observado con lo predicho.",
        },
        {
          id: "slope",
          title: "Explorar la pendiente",
          caption:
            "Mover la regla cambia los errores; el criterio resume el conjunto.",
        },
      ],
      note: "La pendiente inicial es1 y el intercepto1. No se afirma que sea un ajuste óptimo: exploramos el efecto sobre el error.",
      question: "¿Qué cambia al mover la pendiente?",
      answer:
        "Cambian las predicciones y los errores. Los datos observados permanecen fijos.",
      render: ModelScene,
    },
    {
      ...common,
      id: "prediction",
      title: "La misma regla, una entrada nueva.",
      conceptIds: ["prediction"],
      prerequisiteIds: ["model"],
      steps: [
        {
          id: "new-input",
          title: "Obtener una predicción",
          caption: "La pendiente elegida en la escena anterior se conserva.",
        },
        {
          id: "validation",
          title: "Separar predicción y evidencia",
          caption:
            "Una estimación útil necesita validación fuera de los datos utilizados.",
        },
      ],
      note: "Con pendiente1 y x5, la predicción es6. Se mantiene cualquier pendiente elegida. Explicar extrapolación fuera de1–4 horas.",
      question: "¿Una predicción de seis puntos garantiza ese resultado?",
      answer:
        "No. Es una estimación del modelo que requiere contrastarse con datos nuevos.",
      render: PredictionScene,
    },
  ],
};
