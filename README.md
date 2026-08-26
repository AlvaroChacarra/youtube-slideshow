# Immersive Slide Engine V3

Pipeline de cuatro skills que toma una slide didáctica ya buena y produce dos runtimes comparables:

- `baseline_faithful`: reconstrucción fiel para medir el punto de partida;
- `enhanced_immersive`: mejora controlada de craft, atención, pedagogía y robustez.

La referencia conserva autoridad semántica y funciona como baseline compositivo. En `reference_guided_enhancement` deja de ser una cárcel: cada cambio debe preservar la esencia y declarar qué mejora y por qué.

## Vertical slice

V3 se limita a:

1. Bonds Slide 2 — anatomía del bono;
2. Bonds Slide 4 — descuento y fórmula expandida.

Para cada una se conservan original, runtime baseline, runtime enhanced y comparación auditada. No se generaliza al deck hasta obtener `GO_ENHANCED_V3` en ambas.

## Pipeline

1. Visual fija esencia, deltas, sistema estético, atención por hold, layout desktop/móvil y constraints espaciales.
2. Motion convierte los holds en dirección de atención presenter-paced, con continuidad, respiración y simultaneidad limitada.
3. Production reconstruye baseline y enhanced, mide texto/geometría y genera evidencia.
4. Audit compara original → baseline → enhanced en fidelidad esencial, uplift visual, inmersión, pedagogía y robustez.

Los JSON versionados y sus hashes —no el chat— transfieren autoridad entre etapas. Véase [`pipeline-contract.md`](contracts/pipeline-contract.md).

## Ejecutar

```sh
npm ci
npm run serve
```

Abrir `http://127.0.0.1:4173`. La interfaz permite cambiar slide, variante y hold.

Validación completa:

```sh
npm test
```

`npm test` regenera en orden runtime tests, diagnóstico geométrico baseline, geometry gate enhanced, capturas, manifest, auditoría y validaciones finales. Si se ejecuta `npm run evidence` de forma aislada, hay que regenerar después `manifest` y `audit` porque cambian los hashes downstream.

## Resultado del vertical slice

- Enhanced geometry: `PASS`, 114 muestras y 0 violaciones materiales.
- Baseline geometry: `FAIL` diagnóstico; conserva la fragilidad compacta que V3 debía corregir.
- Runtime: reverse, reset, interrupción y reduced motion en `PASS`.
- Auditoría: `ready_for_user_review`, 8,9/10.
- Decisión de ingeniería: `GO_ENHANCED_V3` para Slides 2 y 4; no implica todavía escalar al deck completo.

Comparativas principales:

- [`Slide 2 · original → baseline → enhanced`](evidence/comparisons/slide-02-original-baseline-enhanced.png)
- [`Slide 4 · original → baseline → enhanced`](evidence/comparisons/slide-04-original-baseline-enhanced.png)

El [`implementation-manifest.json`](implementation-manifest.json) contiene los 46 artefactos content-addressed. La conclusión, los scores y la limitación de independencia están en [`audit-report.json`](projects/bonds/audit/audit-report.json).

## Documentos canónicos

- Integración de referencias: [`docs/image-to-code-integration.md`](docs/image-to-code-integration.md)
- Mini-doctrina premium: [`docs/premium-aesthetic-doctrine.md`](docs/premium-aesthetic-doctrine.md)
- Geometry gate: [`docs/geometry-gate.md`](docs/geometry-gate.md)
- Routing de skills: [`skills/README.md`](skills/README.md)
- Provenance y precedentes fijados: [`docs/source-map.md`](docs/source-map.md)
