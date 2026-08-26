# Pipeline Contract V3.0

## 1. Autoridad

Aplicar, por orden:

1. spec semántica versionada para contenido, cifras y causalidad;
2. este contrato para fronteras, gates e invalidación;
3. schema del artefacto producido;
4. `SKILL.md` propietario;
5. artefactos aprobados y hashes;
6. documentación de procedencia.

La conversación no completa un handoff. Toda excepción material queda persistida y hasheada.

## 2. Modos visuales

| Modo | Uso | Autoridad de la referencia | Gate |
|---|---|---|---|
| `concept_first` | No existe referencia aprobada | No aplica | tres direcciones + checkpoint humano |
| `approved_reference` | Reconstrucción fiel | gobierna composición y apariencia | aprobación upstream verificable |
| `reference_guided_enhancement` | Mejorar una slide buena | baseline conceptual y compositivo, no cárcel | mandato de mejora + deltas trazables + esencia preservada |

En enhancement, todo `transformative_delta` debe usar exactamente una razón primaria: `clarity`, `attention`, `aesthetics`, `immersion` o `spatial_robustness`. Un cambio no trazado bloquea Production.

Las dos variantes contractuales se llaman `baseline_faithful` y `enhanced_immersive`.

## 3. Etapas

| Etapa | Propietario | Input | Output | Gate de salida |
|---|---|---|---|---|
| Visual | `visual-director-lienzo` | spec + referencia + mandato | `visual-contract.json` | esencia, baseline, enhanced y móvil cerrados |
| Motion | `motion-director-lienzo` | visual aprobado | `motion-contract.json` | atención, continuidad y estados deterministas |
| Production | `frontend-producer-lienzo` | narrativa + contratos vigentes | `implementation-manifest.json` | build, tests, evidencia y geometry PASS |
| Audit | `audita-y-mejora-lienzo-didactico` | original + runtimes + manifest | `audit-report.json` | veredicto comparativo y decisión V3 |

Persistir el output antes de abrir la siguiente autoridad. Un finding vuelve a su propietario y genera artefactos nuevos; no se edita un informe cerrado.

## 4. Gates V3

### Visual gate

Exigir por slide:

- esencia preservada y elementos conceptuales obligatorios;
- oportunidades visuales, pedagógicas, inmersivas y espaciales;
- riesgos de sobrecarga;
- baseline fiel y enhanced diferenciados;
- `enhancement_intent`, `transformative_delta`, `aesthetic_system` y `attention_model`;
- reglas espaciales ejecutables y composición móvil hermana.

### Motion gate

Exigir por beat:

- protagonista y secundario;
- entrada, persistencia, apagado y transformación;
- razón de comprensión/atención;
- preparación, acción, resolución y hold;
- continuidad, respiración y máximo de cambios simultáneos;
- reverse, reset, interrupción y reduced motion.

Un fade genérico sin cambio espacial, jerárquico o semántico no satisface el gate.

### Production gate

Exigir:

- baseline y enhanced reproducibles;
- medición real de texto mediante layout del navegador;
- responsive desktop, móvil presenter y downsample 16:9;
- geometry gate automatizado en todos los holds y muestras de transición;
- evidencia original/baseline/enhanced;
- cero desviaciones silenciosas.

### Audit gate

Comparar por slide:

1. fidelidad esencial;
2. mejora visual;
3. mejora inmersiva;
4. mejora pedagógica;
5. robustez espacial.

`GO_ENHANCED_V3` exige ambas slides sin blocker/major, geometry `PASS`, mobile/reduced/reverse/reset correctos y uplift visual e inmersivo material. Si cualquiera falla: `NO_GO_ENHANCED_V3`.

## 5. Geometry gate

Romper la aceptación enhanced ante:

- solape no autorizado text/text o text/object;
- clipping u overflow;
- texto material bajo el mínimo contractual;
- conector invadiendo un label ajeno;
- duplicidad visible de objeto persistente;
- estado vacío;
- cero o más de un protagonista primario;
- discontinuidad material en una muestra de motion.

Cada violación declara hold/beat, viewport, IDs, evidencia anotada y owner recomendado. Véase [`geometry-gate.md`](../docs/geometry-gate.md).

## 6. Estados

- Visual: `draft`, `pending_user_approval`, `approved`, `rejected`, `superseded`.
- Motion: `draft`, `ready`, `blocked`, `superseded`.
- Implementation: `draft`, `implemented`, `blocked`, `superseded`.
- Audit: `blocked`, `revision_required`, `ready_for_user_review`, `reference_candidate`.

`implemented` significa reproducible y con gates técnicos en verde; no equivale a aprobación perceptual final.

## 7. Hashes e invalidación

Usar SHA-256 con `sha256:<64 hex>`. Canonicalizar JSON conforme a RFC 8785 cuando se calcule el hash de un contrato.

Cambios en narrativa, referencia, Visual, Motion, runtime, datos, viewport, umbral geométrico o schema invalidan todos los artefactos downstream afectados. No reetiquetar un artefacto viejo; regenerar y reauditar.

## 8. Fronteras

- Visual no escribe código ni timing.
- Motion no cambia composición, contenido ni estética.
- Production no mejora por su cuenta ni modifica contratos.
- Audit no remedia antes de cerrar findings ni se autoaprueba.
- Ninguna etapa usa la referencia fullscreen como implementación.
- Ninguna etapa trata pixel diff como autoridad única.
- Ninguna skill invoca automáticamente a otra.

## 9. Definition of Done

- Existen exactamente cuatro skills y cuatro schemas V3.
- Los contratos y hashes forman una cadena válida.
- Original, baseline y enhanced de Slides 2 y 4 son reproducibles.
- Todos los holds y transiciones de riesgo tienen evidencia desktop/móvil.
- Geometry gate enhanced está en `PASS` con cero violaciones materiales.
- Reverse, reset, reduced motion y presenter pacing pasan.
- El audit report contiene comparaciones por slide y una decisión válida.
- README, AGENTS y documentación canónica describen la realidad verificada.
