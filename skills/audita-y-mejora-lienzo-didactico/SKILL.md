---
name: audita-y-mejora-lienzo-didactico
description: "Auditar output real y comparar slide original, runtime baseline y runtime enhanced en fidelidad esencial, uplift visual, inmersión, pedagogía y robustez espacial. Usar antes de escalar o tras remediaciones; exigir geometry gate y declarar independencia. No usar para rediseñar, remediar antes de informar ni autoaprobar."
---

# Audita y Mejora Lienzo Didáctico

## Propósito

Determinar si el enhanced respeta la slide y es claramente superior, no solo distinto. Evaluar evidencia perceptual, pedagógica y técnica; convertir defectos en findings trazables sin remediarlos durante la pasada.

## Inputs requeridos

Para observar el sujeto exigir:

- commit exacto y manifest V3 hasheado;
- runtime reproducible;
- original, baseline y enhanced por slide;
- viewports desktop, mobile presenter y downsample;
- todos los holds y muestras de beat;
- reverse, reset y reduced motion;
- geometry reports y capturas anotadas.

Después de la primera observación exigir specs, referencias, contratos, source manifest, código, tests y desviaciones.

## Fuentes de autoridad

Aplicar:

1. output real para percepción y comportamiento;
2. semantic spec para verdad y esencia;
3. referencia original para baseline;
4. visual contract para deltas y estética;
5. motion contract para atención y continuidad;
6. geometry report para violaciones medibles;
7. [`audit-report.schema.json`](../../contracts/audit-report.schema.json) para el output;
8. [`pipeline-contract.md`](../../contracts/pipeline-contract.md) para gates.

El código explica causas después de observar; no anula un fallo visible.

## Autoridad exclusiva

Esta skill decide:

- cobertura e independencia;
- comparación original/baseline/enhanced;
- fidelidad esencial y uplifts;
- scores, severidad y findings;
- veredicto de auditoría;
- `GO_ENHANCED_V3` o `NO_GO_ENHANCED_V3`.

No decidir nueva composición, estética, timing, contenido o implementación.

## Output canónico

Emitir `audit-report.json` V3 inmutable con:

- sujeto, manifest y versions;
- independencia y limitaciones;
- evidencia y cobertura;
- `comparative_assessment` por Slide 2 y Slide 4;
- scores;
- geometry gate consumido;
- findings, blockers y owner;
- veredicto;
- decisión V3.

Una remediación produce nuevo sujeto y nuevo `audit_id`.

## Workflow obligatorio

### 1. Congelar y reproducir

Verificar commit, hashes, comandos y navegador. Emitir `blocked` si el sujeto o la evidencia no reproducen. No reparar durante esta pasada.

### 2. Declarar independencia

Registrar si el auditor creó o remedió el sujeto y qué fuentes conocía. Intentar una primera lectura del output sin rationale. No afirmar blind decode independiente cuando exista memoria previa; convertirlo en limitación explícita.

### 3. Observar output real

Por cada variante y slide:

- describir en una frase qué explica;
- identificar protagonista y ruta de lectura;
- registrar qué cambia por beat;
- localizar dudas, competencia y texto imprescindible;
- comprobar que el hold funciona sin narración.

### 4. Cubrir estados y viewports

Inspeccionar:

- todos los holds;
- inicio, máximo cambio y final de cada beat;
- coexistencias;
- reverse y reset desde varios estados;
- reduced motion;
- desktop, mobile presenter y downsample;
- interacción rápida;
- build y replay.

No muestrear solo frames favorables.

### 5. Auditar geometry gate

Verificar que el report:

- cubre todas las superficies exigidas;
- usa layout real del navegador;
- contiene thresholds y IDs;
- enlaza screenshots anotados;
- no oculta allowlists amplias;
- termina en `PASS` para enhanced.

Reinspeccionar visualmente muestras. Un PASS automatizado no invalida una colisión visible.

### 6. Comparar original → baseline → enhanced

Emitir por slide cinco juicios:

1. `essential_fidelity`: la esencia, cifras y mecanismo siguen intactos;
2. `visual_uplift`: craft y calidad percibida mejoran claramente;
3. `immersive_uplift`: atención, foco, descubrimiento y continuidad superan al baseline;
4. `pedagogical_uplift`: comprensión no empeora y preferiblemente mejora;
5. `spatial_robustness`: overlaps, clipping y fragilidad desaparecen.

Separar “diferente” de “mejor”. Exigir evidencia observable por juicio.

### 7. Auditar fidelidad y deltas

Comparar specs y contratos después de observar:

- baseline contra referencia;
- enhanced contra `preserved_essence`;
- cada cambio material contra `transformative_delta`;
- atención real contra `attention_model` y motion contract;
- mobile contra su composición hermana.

Clasificar origen: `upstream_design`, `implementation`, `motion`, `semantic_spec` o `none`.

### 8. Puntuar

Asignar 0–10 con evidencia:

1. comprensión pedagógica;
2. composición y jerarquía;
3. craft visual;
4. motion y continuidad;
5. carga cognitiva y pacing;
6. interacción y holds;
7. legibilidad móvil;
8. robustez técnica.

Calcular total como media aritmética a una decimal. No premiar esfuerzo o complejidad.

### 9. Emitir findings

Incluir evidencia, severidad, consecuencia, causa probable, corrección verificable y owner.

- `blocker`: impide comprender, reproducir o confiar;
- `major`: impide considerar el enhanced claramente superior;
- `minor`: defecto visible sin pérdida del takeaway;
- `nit`: pulido acotado.

### 10. Emitir veredicto

Usar:

- `blocked` si no puede auditarse con fiabilidad;
- `revision_required` ante blocker/major, geometry FAIL o fallo mobile/reduced;
- `ready_for_user_review` con cero blocker/major, total ≥ 8 y cinco juicios positivos en ambas slides;
- `reference_candidate` solo con auditoría suficientemente independiente, total ≥ 9 y umbrales reforzados.

### 11. Decidir V3

Emitir `GO_ENHANCED_V3` únicamente si:

- ambas slides preservan esencia;
- ambas muestran uplift visual e inmersivo material;
- pedagogía es `improved` o `preserved`;
- geometry enhanced está en `PASS`;
- mobile, reverse, reset y reduced motion pasan;
- existen cero blockers y majors.

En cualquier otro caso emitir `NO_GO_ENHANCED_V3`. No promediar una slide fuerte con otra fallida.

### 12. Mejorar sin autoaprobación

Cerrar informe, asignar findings, permitir remediación por owner, congelar nuevo sujeto y repetir. Declarar participación previa.

## Acciones prohibidas

- Leer rationale antes del primer examen cuando pueda evitarse.
- Auditar solo screenshots elegidos por el creador.
- Corregir antes de persistir findings.
- Cambiar diseño, motion o código desde autoridad de Auditor.
- Ocultar limitaciones de independencia.
- Declarar mejora porque hay más animación o decoración.
- Aceptar geometry PASS con colisión visible.
- Autoaprobar una remediación.
- Exigir pixel-perfect o usar pixel diff como único criterio.
- Aceptar una referencia fullscreen como implementación.
- Invocar automáticamente otra skill.

## Blockers y escalado upstream

| Blocker | Propietario | Acción |
|---|---|---|
| Sujeto/manifest no reproduce | Frontend Producer | emitir `blocked` |
| Geometry coverage incompleta | Frontend Producer | completar y reauditar |
| Esencia perdida | Visual Director | nuevo contrato visual |
| Enhanced no supera baseline | Visual Director | replantear deltas |
| Motion dispersa atención | Motion Director | nuevo contrato motion |
| Mobile degenera | Visual o Frontend según origen | corregir y reauditar |
| Independencia insuficiente para referencia | usuario | pedir pasada independiente |

## Definition of Done

- Sujeto reproducido y congelado.
- Independencia declarada con honestidad.
- Original, baseline y enhanced comparados en ambas slides.
- Cinco juicios por slide con evidencia.
- Todos los holds, beats y viewports cubiertos.
- Geometry report verificado.
- Scores y total coherentes.
- Findings accionables y owners correctos.
- Veredicto y decisión V3 cumplen umbrales.
- JSON válido e inmutable.

## Relación con las otras skills

- Emitir findings antes de devolver trabajo.
- Enrutar representación/estética a Visual, atención/continuidad a Motion e implementación/geometría a Production.
- Consumir toda remediación como sujeto nuevo.
