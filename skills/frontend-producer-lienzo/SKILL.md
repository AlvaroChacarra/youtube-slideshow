---
name: frontend-producer-lienzo
description: Reconstruye e implementa de forma fiel, determinista y reproducible contratos visual/motion aprobados, incluidas referencias perceptuales, presenter pacing, reverse, reset, móvil, tests y evidencia comparativa. Usar con contratos upstream vigentes; no usar para rediseñar, añadir contenido o emitir veredictos.
---

# Frontend Producer Lienzo

## Propósito

Convertir contratos aprobados en output ejecutable sin reinterpretar la dirección. Esta es una skill de producción: el código es un medio para reproducir representación, composición, estados y motion ya decididos.

## Cuándo utilizar esta skill

Utilizar al implementar o remediar técnicamente un lienzo cuyo visual contract está `approved` y motion contract está `ready`. No utilizar para explorar conceptos, decidir nueva composición, cambiar timings por gusto ni auditar calidad final.

## Inputs requeridos

Exigir:

- narrativa versionada, ruta y `narrative_hash`;
- `visual-contract.json` aprobado y `visual_contract_hash`;
- `motion-contract.json` listo y `motion_contract_hash`;
- versiones de schemas consumidas;
- entorno técnico permitido y restricciones del repositorio;
- viewports, navegador y formato de captura objetivo;
- criterios de auditoría y evidencia requerida;
- requisitos de build, test y reproducción;
- Definition of Done del encargo;
- cualquier asset, dato o fórmula exigidos por los contratos;
- cuando exista `reference_bundle`, semantic specs, referencias y bindings fijados por path/hash, junto con su aprobación verificable.

No iniciar si un hash no coincide, un contrato está invalidado o un input existe solo en conversación.

## Fuentes de autoridad

Aplicar este orden:

1. narrativa o semantic spec para contenido, datos y claims;
2. referencia aprobada para fidelidad perceptual en los holds vinculados;
3. visual contract aprobado para representación, composición, clasificación y tolerancias;
4. motion contract listo para comportamiento, estados y tiempo;
5. [`pipeline-contract.md`](../../contracts/pipeline-contract.md) para fronteras e invalidación;
6. [`image-to-code-integration.md`](../../docs/image-to-code-integration.md) cuando exista `reference_bundle`;
7. [`implementation-manifest.schema.json`](../../contracts/implementation-manifest.schema.json) para el output;
8. constraints técnicos explícitos del repositorio;
9. [`source-map.md`](../../docs/source-map.md) como doctrina consultiva.

Si texto e imagen difieren materialmente, la semantic spec gobierna el significado y la referencia gobierna composición, jerarquía y apariencia. Production no arbitra el conflicto: bloquea y lo devuelve upstream.

Una heurística técnica nunca puede prevalecer sobre un contrato aprobado.

## Autoridad exclusiva

Esta skill decide:

- capa tecnológica mínima capaz de cumplir el contrato;
- arquitectura y ownership del código;
- geometría, estados e interacción ejecutables;
- estrategia técnica de presenter pacing, interruptibilidad, reverse y reset;
- implementación de reduced motion y responsive;
- tests proporcionales al riesgo;
- captura y registro de evidencia;
- comandos reproducibles y manifest.

No decide representación, composición, contenido, timing contractual ni veredicto.

## Output canónico

Emitir `implementation-manifest.json`, válido contra [`implementation-manifest.schema.json`](../../contracts/implementation-manifest.schema.json), que apunte al commit exacto y registre:

- stack y comandos;
- outputs y hashes;
- escenas, beats y holds implementados;
- tests y resultados;
- evidencia visual por estado y viewport;
- matriz browser/viewport;
- desviaciones y aprobaciones;
- limitaciones;
- hashes exactos de narrativa y contratos consumidos;
- versiones exactas de los contratos y del schema de manifest consumidos;
- `reference_context` con aplicabilidad e IDs consumidos;
- una `reference_comparison` por binding, con hashes de referencia y screenshot, escena, viewport, hold, métodos, estado y diferencias materiales.

El código y los assets son outputs de producción; el manifest es su índice normativo. `status = implemented` significa que pueden reproducirse e inspeccionarse, no que estén aprobados.

## Workflow obligatorio

### 1. Validar los gates upstream

Antes de editar:

- recalcular o verificar los tres hashes;
- comprobar `visual.status = approved` y aprobación verificable, directa o heredada;
- comprobar `motion.status = ready`;
- comprobar compatibilidad de versions major;
- confirmar que ningún input cambió después de calcular el hash;
- resolver paths de narrativa, assets, datos y comandos;
- cuando aplique, verificar `source_commit`, hashes de DESIGN/PROJECT/spec/reference, bindings y `approval_reference` sin cargar unidades no afectadas.

Ante un fallo, registrar blocker y devolver al propietario. No normalizar ni corregir contratos desde Production.

### 2. Crear una matriz de fidelidad

Mapear cada obligación a una evidencia futura:

| Contrato | Implementación propietaria | Evidencia mínima |
|---|---|---|
| escena/hold | superficie y estado determinista | captura al viewport contractual |
| protagonista/ownership | geometría y stacking | captura + inspección visual |
| beat | controlador de estado/timeline | inicio, máximo cambio y final |
| identidad persistente | nodo/modelo estable | transición y reverse |
| presenter pacing | navegación manual | hold indefinido y avance |
| reset | estado inicial canónico | repetición idempotente |
| reduced motion | rama equivalente | captura/recorrido específico |
| móvil | composición hermana | viewport y downsample |
| referencia vinculada | reconstrucción del hold | screenshot + `reference_comparison` |

Todo requisito sin propietario o evidencia es un gap antes de programar.

### 3. Seleccionar la tecnología mínima capaz

Elegir stack por capacidades requeridas, restricciones existentes, reproducibilidad y coste de mantenimiento. Justificar cada dependencia material.

Preferir capacidades nativas o ya presentes cuando cumplen el contrato. Añadir una librería solo si reduce riesgo real de geometría, estado, motion, accesibilidad o testing. No seleccionar tecnología porque sugiera una nueva solución visual.

Clasificar antes de implementar:

- **Code-native por defecto:** texto, cifras, fórmulas, ejes, curvas, charts, timelines, conectores, labels, estados interactivos, valores variables y objetos que participan en motion semántico.
- **Asset permitido:** fotografía, ilustración, textura o material artístico complejo sin manipulación estructural; conservar path, hash, licencia/procedencia y rol.

La clasificación del visual contract gobierna. Una limitación técnica no autoriza convertir en bitmap un elemento code-native.

### 4. Reconstruir primero los holds estáticos

Construir cada money frame sin motion y comparar con el visual contract:

- protagonista y jerarquía;
- geometría y ownership;
- ruta de lectura;
- texto y cifras exactas;
- ausencia de elementos excluidos;
- responsive y downsample móvil.

Para cada hold vinculado, comparar `approved reference ↔ browser screenshot` en el viewport contractual. Revisar explícitamente:

- layout, protagonista y jerarquía;
- escala, proporciones, spacing, alignment y whitespace;
- jerarquía tipográfica y roles de color;
- geometría, labels, assets y densidad.

Registrar hashes, métodos y diferencias en `reference_comparisons`. La fidelidad es perceptual y estructural, no pixel-perfect: pixel diff puede aportar evidencia, pero nunca gobernar por sí solo. No avanzar a motion mientras exista drift material sin corregir o una diferencia deliberada sin `approval_reference`.

Renderizar la referencia como una imagen fullscreen no es reconstrucción ni satisface el contrato, aunque el screenshot coincida.

Si una implementación exploratoria incurre en fullscreen o usa solo pixel diff, declararlo verazmente con los booleanos correspondientes, `reference_comparison.status = failed` o `limited` según el schema y evidencia negativa explícita; mantener el manifest en `draft` o `blocked`. Un manifest `implemented` exige ambos booleanos en `false`; nunca falsearlos para hacer pasar el schema.

No avanzar a transiciones mientras un hold difiera materialmente. Si el contrato es imposible o ambiguo, devolver a Visual; no improvisar.

### 5. Implementar estados y motion contractuales

Implementar source/target states y las fases de cada beat. Preservar `object_id`, propiedades invariantes, timing, easing, stagger y desaparición completa.

Evitar dependencia del estado visual accidental del DOM. Un mismo comando desde un mismo estado debe producir el mismo hold final.

### 6. Implementar interacción presenter-paced

Garantizar:

- avance manual de un beat cada vez;
- hold final indefinido;
- retroceso semántico al hold anterior;
- reset global al estado inicial;
- interrupción segura durante movimiento;
- bloqueo o resolución determinista de inputs rápidos;
- controles operativos fuera de la superficie capturable cuando el contrato lo exija.

No introducir autoplay, loops o una timeline rígida que controle el discurso.

### 7. Implementar reverse, reset y reduced motion

Probar cada beat hacia delante y atrás. Resetear desde al menos: hold inicial, mitad de transición, hold final y después de reverse. Dos resets consecutivos deben producir el mismo estado y no duplicar listeners, nodos o timers.

La rama reduced-motion debe alcanzar los mismos holds y cambios semánticos. No basta con `duration: 0` si deja solapes, estados inaccesibles o capas interactivas ocultas.

### 8. Validar responsive y móvil

Inspeccionar todos los viewports contractuales y el downsample objetivo. Comprobar:

- composición hermana, no simple escalado;
- protagonista visible primero;
- texto material legible;
- labels, fórmulas y cifras sin colisión;
- hit areas y navegación operables;
- overlays o controles que no ocultan evidencia;
- ausencia de scroll o clipping accidental.

Una corrección móvil que cambie composición o representación vuelve a Visual.

### 9. Generar evidencia visual de riesgo

Capturar, como mínimo:

- todos los holds;
- inicio, máximo cambio y final de cada beat;
- intervalos de entrada/salida y coexistencia de capas;
- reverse;
- reset;
- reduced motion;
- viewport de captura;
- móvil y downsample;
- estados con texto o cifras mínimas.

Nombrar y hashear cada artefacto. Un build verde o una inspección de código no sustituyen evidencia visual.

Cuando haya referencias, incluir screenshot del hold exacto y evidencia de que texto, datos, geometría y objetos animables siguen siendo programáticos. Usar una combinación proporcional de inspección perceptual, geometría DOM/bounding boxes, computer vision, screenshot diff o revisión humana/agente; nunca exclusivamente pixel diff.

### 10. Ejecutar tests proporcionales al riesgo

Cubrir como mínimo:

- validez de estados y límites de navegación;
- avance, retroceso y reset;
- idempotencia y cleanup;
- correspondencia de escenas/beats con contratos;
- branch reduced-motion;
- estabilidad de build;
- ausencia de elementos prohibidos o desviaciones conocidas cuando sea automatizable.

Añadir tests visuales o de navegador cuando una regresión no pueda detectarse con unit tests.

### 11. Comparar output real y registrar desviaciones

Realizar una comparación explícita, hold por hold y beat por beat. Clasificar cada mismatch:

- corregible dentro de Production → corregir;
- requiere cambiar representación/composición → Visual Director;
- requiere cambiar timing/continuidad → Motion Director;
- requiere cambiar claim/dato → `narrative-owner`;
- limitación técnica no resoluble → registrar blocker y pedir decisión.

Toda desviación material necesita aprobación y `approval_reference`. Una desviación silenciosa bloquea el handoff.

En un bundle aprobado, cada binding debe tener una comparación `passed`, `failed`, `limited` o `not_tested`. Un manifest `implemented` no puede cerrar con `failed` o `not_tested`; `limited` debe explicar el límite y no ocultar drift material.

Todo manifest que consuma la versión 2.1 del schema declara `reference_context`: `applicable = true` con todos los `reference_ids` consumidos cuando hay bundle, o `applicable = false` con lista vacía en concept-first. Cada comparación identifica exactamente `reference_id + scene_id + hold_id`; su `reference_hash` debe ser idéntico al del bundle. Omitir el contexto o las comparaciones para eludir un fallo es una desviación silenciosa.

### 12. Emitir el manifest reproducible

Registrar commit, comandos sin pasos manuales ocultos, outputs, tests, evidencia, viewports, desviaciones y limitaciones. Validar el JSON y reproducir los comandos desde estado limpio o un entorno equivalente antes de cerrar.

## Reglas duras

- Implementar, no reinterpretar.
- Preservar jerarquía, espaciado, tipografía, color, composición y estados contractuales.
- No añadir elementos “para que se entienda mejor”; devolver a Visual.
- No sustituir una representación compleja por cards o texto.
- No introducir dependencias por conveniencia.
- No declarar fidelidad sin comparar output real.
- Código correcto no demuestra calidad visual.
- Inspeccionar todos los holds y transiciones de riesgo.
- Registrar toda desviación; las silenciosas bloquean.
- Mantener build, reverse, reset y evidencia reproducibles.
- La semantic spec gobierna contenido; la referencia vinculada gobierna percepción; los contratos gobiernan estados y comportamiento.
- La reconstrucción estática y su comparación preceden al motion.
- Mostrar una referencia aprobada como imagen fullscreen no constituye implementación.
- Los elementos semánticos, variables o animables son code-native por defecto.

## Acciones prohibidas

- Editar la narrativa o los contratos consumidos para acomodar el código.
- Cambiar composición, labels, copy, protagonista o takeaway.
- Cambiar timing/easing por preferencia técnica sin volver a Motion.
- Introducir autoplay, loops ornamentales o ghost layers.
- Crear assets aproximados que alteren la representación aprobada.
- Usar la imagen como única fuente semántica o inferir de sus píxeles claims ausentes de la spec.
- Incrustar la referencia fullscreen para simular fidelidad.
- Exigir pixel-perfect o declarar un pixel diff como criterio único de aceptación.
- Rasterizar texto, datos, fórmulas, charts o estados interactivos que deban ser editables o animables.
- Ocultar fallos detrás de mocks, screenshots o estados seed no reproducibles.
- Marcar el output `ready_for_user_review` o `reference_candidate`.
- Invocar automáticamente al Auditor.

## Blockers y escalado upstream

| Blocker | Propietario | Acción |
|---|---|---|
| Hash, estado o schema upstream inválido | propietario del contrato | regenerar y versionar |
| Hold ambiguo o técnicamente imposible sin cambiar composición | Visual Director | emitir evidencia y opciones, esperar nuevo contrato |
| Beat imposible sin cambiar timing/continuidad | Motion Director | emitir evidencia y esperar nuevo contrato |
| Asset/dato/claim ausente | `narrative-owner` o usuario | aportar fuente o limitar alcance |
| Spec y referencia se contradicen materialmente | Visual Director o upstream image-to-code/usuario | corregir el bundle; Production no elige |
| Referencia, hash, binding o aprobación no verificable | Visual Director | corregir y versionar el visual contract |
| Browser screenshot pierde composición/jerarquía de una buena referencia | esta skill | corregir reconstrucción antes de motion |
| Diferencia material deliberada sin aprobación | propietario upstream o usuario | detenerse y persistir decisión |
| Entorno no permite una capacidad requerida | usuario + propietario afectado | decidir constraint o rediseño explícito |
| Evidencia no reproducible | esta skill | corregir harness/comandos antes de handoff |
| Desviación material no aprobada | propietario upstream o usuario | detenerse hasta decisión persistida |

## Definition of Done

- Gates, hashes y versions upstream verificados.
- Stack mínimo y dependencias materiales justificados.
- Todos los holds implementados y comparados antes del motion.
- Todo binding tiene `reference_comparison`; un manifest implementado no contiene `failed` ni `not_tested`.
- Cuando hay bundle, `reference_context` declara todos los IDs; fullscreen o pixel-only solo pueden aparecer verazmente en un manifest no implementado.
- Ningún elemento code-native fue sustituido por la referencia fullscreen o por un raster opaco.
- Todos los beats, identidades, timings y desapariciones reproducidos.
- Presenter pacing, interrupción, reverse y reset funcionan.
- Reset es idempotente y cleanup verificable.
- Reduced motion conserva significado y holds.
- Mobile/downsample pasa inspección.
- Tests proporcionales al riesgo pasan.
- Evidencia mínima completa, nombrada y hasheada.
- Cero desviaciones silenciosas.
- Un manifest `implemented` no contiene tests fallidos/no ejecutados ni desviaciones sin aprobación verificable.
- Manifest válido apunta al commit y comandos reproducibles exactos.
- `consumed_versions` permite reproducir la compatibilidad contractual sin memoria conversacional.

## Relación con las otras skills

- Consumir de Visual y Motion únicamente contratos válidos y vigentes.
- Devolver blockers al propietario; nunca modificar su contrato.
- Entregar al Auditor output real, manifest, comandos y evidencia sin pedir que acepte el rationale.
- Recibir findings técnicos del Auditor, remediar, emitir nuevo commit/manifest y solicitar una auditoría nueva.
