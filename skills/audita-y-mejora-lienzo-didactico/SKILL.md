---
name: audita-y-mejora-lienzo-didactico
description: "Audita independientemente el output real de un lienzo didáctico: primero blind decode y después fidelidad semántica, contractual y perceptual frente a referencias aprobadas. Inspecciona estados, móvil y robustez, puntúa ocho dimensiones y asigna findings verificables. Usar antes de revisión humana y tras remediaciones; no usar para autoaprobar ni rediseñar."
---

# Audita y Mejora Lienzo Didáctico

## Propósito

Determinar desde el output real qué se entiende, dónde mira el espectador, qué compite, qué se solapa, qué parece genérico y qué motion explica. El auditor evalúa evidencia, no intención, calidad del código ni elocuencia del rationale.

“Mejora” significa convertir findings en remediación trazable por el propietario y repetir la auditoría; no autoriza a corregir primero ni a autoaprobar después.

## Cuándo utilizar esta skill

Utilizar antes de revisión del usuario, antes de declarar una referencia, después de una remediación o cuando exista duda sobre comprensión, craft, motion, móvil o robustez. No utilizar como sustituto del Visual Director, Motion Director o Producer.

## Inputs requeridos

Para iniciar la pasada ciega exigir:

- commit exacto del sujeto;
- `implementation-manifest.json` válido y su hash;
- comandos reproducibles;
- output ejecutable o capturas/vídeo suficientes;
- viewports contractuales y downsample móvil;
- acceso a reverse, reset y reduced motion;
- criterios y Definition of Done de auditoría.

Mantener ocultos durante la primera pasada:

- rationale creativo;
- explicación del Producer;
- narrativa;
- visual y motion contracts;
- código y tests, salvo lo imprescindible para arrancar el sujeto.
- semantic specs y referencias aprobadas, aunque estén disponibles en el bundle.

Después de cerrar el blind decode exigir narrativa o semantic specs, ambos contratos y hashes, manifest, código, tests, desviaciones y, cuando aplique, el `reference_bundle` con imágenes y bindings fijados.

## Fuentes de autoridad

Aplicar este orden:

1. output real reproducible como evidencia perceptual;
2. narrativa o semantic spec para verdad pedagógica y claims;
3. referencia aprobada para el resultado perceptual del hold vinculado;
4. visual y motion contracts para representación, estados, tolerancias y comportamiento;
5. [`pipeline-contract.md`](../../contracts/pipeline-contract.md) para routing y gates;
6. [`image-to-code-integration.md`](../../docs/image-to-code-integration.md) cuando exista bundle;
7. [`audit-report.schema.json`](../../contracts/audit-report.schema.json) para el output;
8. criterios explícitos del encargo;
9. [`source-map.md`](../../docs/source-map.md) como doctrina consultiva.

El código y los tests explican causas o robustez después de observar; no anulan un fallo visible.

## Autoridad exclusiva

Esta skill decide:

- cobertura de evidencia;
- blind decode;
- scores;
- severidad y findings;
- blockers y limitaciones;
- propietario requerido;
- veredicto.

No decide una nueva representación, composición, narrativa, timing o implementación.

## Output canónico

Emitir `audit-report.json`, válido contra [`audit-report.schema.json`](../../contracts/audit-report.schema.json), con:

- sujeto y manifest hasheados;
- independencia declarada;
- evidencia y cobertura;
- `reference_context` y `reference_fidelity` cuando existan referencias aprobadas;
- scores 0–10; si un blocker temprano invalida la inspección, mantener las nueve claves y usar `null` en vez de inventar notas;
- findings con severidad, consecuencia, causa probable, corrección verificable y propietario;
- blockers y limitaciones;
- veredicto;
- `required_next_owner`;
- versiones exactas de los contratos, manifest y schema de auditoría consumidos.

Un informe es inmutable. Una nueva pasada produce otro `audit_id`.

## Independencia

La primera pasada debe ocultar rationale y contratos. Registrar:

- si el auditor creó el sujeto;
- si lo remedió;
- si pudo mantener rationale oculto;
- cuando haya referencias, si semantic specs, contratos y referencias permanecieron ocultos hasta cerrar el blind decode;
- qué limitaciones afectan independencia.

Si el mismo agente crea o remedia, puede ejecutar la auditoría, pero no declarar independencia plena. `reference_candidate` exige que esta limitación no comprometa el blind decode; ante duda, mantener `ready_for_user_review` y pedir revisión independiente.

## Workflow obligatorio

### 1. Congelar el sujeto y reproducirlo

Verificar commit, manifest y hashes. Ejecutar los comandos declarados desde un estado limpio o equivalente. Registrar navegador, viewport, seeds, datos y cualquier paso manual.

Si el build no reproduce, faltan outputs o el manifest apunta a otro commit, emitir `blocked`. No reparar durante esta pasada.

### 2. Ejecutar blind decode

Sin leer narrativa, contratos ni rationale:

1. observar el primer hold y cada hold posterior;
2. describir en una frase qué cree que explica cada escena;
3. identificar protagonista y ruta de lectura;
4. describir qué cambia en cada beat y por qué;
5. registrar dudas, interpretaciones alternativas y texto imprescindible;
6. decidir `passed`, `failed` o `limited` con evidencia.

El blind decode puede leer el texto visible del output. No puede usar explicaciones externas. Es satisfactorio cuando la interpretación coincide sustancialmente con el takeaway y el cambio causal sin necesitar rationale.

### 3. Cubrir toda la evidencia mínima

Inspeccionar:

- todos los holds;
- inicio, final y máximo cambio de cada beat;
- intervalos de entrada y salida;
- intervalos con capas coexistentes;
- reverse por beat;
- reset desde estados inicial, intermedio y final;
- viewport de captura;
- downsample móvil;
- reduced motion;
- estados con texto, fórmulas o cifras pequeñas;
- inputs rápidos o interrupción durante motion;
- build y replay reproducibles.

No muestrear solo escenas “representativas”. Si una evidencia requerida no existe, marcar cobertura `not_tested` y convertirla en finding o blocker según materialidad.

### 4. Auditar móvil como superficie propia

En el viewport móvil y downsample comprobar:

- takeaway y protagonista preservados;
- ruta de lectura equivalente;
- composición no reducida a desktop encogido;
- texto, cifras y fórmulas legibles;
- ausencia de clipping, scroll accidental y solapes;
- controles no antepuestos a la evidencia;
- touch/avance/reverse/reset operables;
- reduced motion y hold final equivalentes.

Un desktop excelente no compensa un móvil fallido.

### 5. Leer después las fuentes normativas

Solo tras cerrar notas ciegas, leer:

- narrativa y claim;
- visual contract y aprobación;
- motion contract;
- implementation manifest y desviaciones;
- código y tests relevantes.

Comparar lo inferido con lo prescrito. Mantener separadas:

- comprensión observada;
- fidelidad contractual;
- robustez técnica;
- causa probable.

No reescribir la observación ciega para hacerla coincidir con la intención.

### 6. Auditar fidelidad semántica y perceptual

Solo después del blind decode, y en este orden:

1. comparar output con narrativa o semantic spec para verificar contenido, datos, fórmulas, exclusiones y takeaway;
2. abrir cada referencia aprobada vinculada;
3. comparar referencia y browser output en el mismo hold/viewport;
4. contrastar layout, protagonista, escala, proporciones, spacing, alignment, whitespace, jerarquía tipográfica, roles de color, geometría, labels, assets y densidad;
5. registrar `reference_fidelity` como `passed`, `failed`, `limited` o `not_applicable`, con hashes y evidencia por binding exacto `reference_id + scene_id + hold_id`; los hashes de spec/referencia deben coincidir con el bundle y `output_hash` con el screenshot del manifest para el mismo viewport.

Evaluar fidelidad perceptual y estructural; no exigir identidad de píxel ni dejar que un pixel diff sustituya el juicio. Confirmar además que la referencia fue reconstruida: mostrarla fullscreen no constituye implementación, incluso si produce una coincidencia visual perfecta.

Si la referencia, la spec o los contratos se vieron antes de cerrar las notas ciegas, declarar los flags de independencia en `false`, usar `reference_fidelity.status = not_tested` con comparaciones vacías, invalidar esa pasada y emitir `blocked`. Usar `required_next_owner = user` para encargar una pasada nueva; el Auditor no se invoca automáticamente.

Distinguir obligatoriamente:

- **fallo upstream de diseño:** el navegador reproduce bien la referencia, pero la referencia explica mal la semantic spec; `failure_origin = upstream_design`, `owner = visual-director-lienzo` o `user` cuando la decisión pertenece al bundle upstream;
- **fallo de implementación:** la referencia es adecuada, pero el navegador pierde composición o jerarquía; `failure_origin = implementation`, owner Frontend Producer.

No culpar a Production por una debilidad intrínseca del keyframe ni a Visual por drift introducido en el navegador.

### 7. Puntuar ocho dimensiones

Asignar 0–10 con evidencia específica:

1. `pedagogical_comprehension`;
2. `composition_and_hierarchy`;
3. `visual_craft_and_taste`;
4. `motion_and_continuity`;
5. `cognitive_load_and_pacing`;
6. `interaction_and_holds`;
7. `mobile_legibility`;
8. `technical_robustness`.

Calcular `total` como media aritmética de las ocho, redondeada a una decimal. No subir una nota por esfuerzo, dificultad técnica o calidad del rationale.

Excepción acotada: si un blocker invalida la auditoría antes de observar holds o beats —por ejemplo, referencia revelada antes del blind decode— usar `null` en las ocho dimensiones y en `total`, y arrays de cobertura vacíos. Cualquier veredicto distinto de `blocked` exige cobertura y scores numéricos.

### 8. Emitir findings accionables

Cada finding debe contener:

- localización y evidencia observable;
- severidad;
- consecuencia para comprensión, atención, fidelidad o uso;
- causa probable, etiquetada como hipótesis cuando proceda;
- corrección verificable expresada como condición de salida;
- skill propietaria.
- cuando aplique, `reference_id` y `failure_origin`.

Severidades:

- `blocker`: impide comprender, reproducir, validar o confiar en el resultado;
- `major`: degradación material que impide revisión del usuario como candidato serio;
- `minor`: defecto visible/acotado que no cambia el takeaway;
- `nit`: pulido no material.

No convertir preferencias personales en findings. Toda crítica debe enlazar evidencia con consecuencia.

### 9. Asignar propietario y artefactos invalidados

Aplicar:

- representación, protagonista, composición, jerarquía → `visual-director-lienzo`;
- transformación, identidad, timing, hold, coexistencia → `motion-director-lienzo`;
- fidelidad de código, responsive, interacción, build, tests → `frontend-producer-lienzo`;
- claim, evidencia o segmentación semántica → `narrative-owner`.
- referencia aprobada intrínsecamente débil frente a la semantic spec → Visual Director o `user` cuando la decisión pertenece al bundle upstream;
- reconstrucción del browser que pierde una referencia adecuada → Frontend Producer.

Un finding upstream invalida todos los artefactos downstream definidos en el pipeline contract.

### 10. Emitir veredicto

Usar exactamente estas reglas:

#### `blocked`

Aplicar si el sujeto no reproduce, hashes/gates son inválidos, falta evidencia crítica, existe un claim materialmente falso, se contaminó el blind decode o no puede realizarse una auditoría fiable. Usar también blocker cuando Production sustituyó la reconstrucción por la referencia fullscreen o falseó evidencia para aparentar fidelidad.

#### `revision_required`

Aplicar si existe cualquier blocker o major, una desviación material no aprobada, blind decode fallido, móvil/reduced motion fallido, o cualquiera de comprensión/composición/craft es menor que 7.

#### `ready_for_user_review`

Exigir:

- build y estados reproducibles;
- cero blockers y majors;
- cobertura mínima completa;
- blind decode, móvil y reduced motion satisfactorios;
- total ≥ 8;
- comprensión, composición y craft ≥ 8;
- cuando `reference_context.applicable = true`, `reference_fidelity = passed`.

Puede conservar minors explícitos que no alteren el takeaway.
En este veredicto, `required_next_owner` debe ser `user`.

#### `reference_candidate`

Exigir simultáneamente:

- total ≥ 9;
- comprensión ≥ 9;
- composición ≥ 9;
- craft visual ≥ 9;
- cero blockers;
- cero majors;
- blind decode satisfactorio;
- downsample móvil satisfactorio;
- build y estados reproducibles;
- cuando `reference_context.applicable = true`, `reference_fidelity = passed`;
- `required_next_owner = none`.

No redondear hacia arriba para alcanzar un umbral.

### 11. Ejecutar la mejora sin autoaprobación

Secuencia obligatoria:

1. cerrar y persistir el informe;
2. asignar cada finding al propietario;
3. dejar que el propietario produzca nuevos artefactos;
4. congelar el nuevo sujeto;
5. repetir desde output real con nuevo `audit_id`;
6. declarar si el mismo agente participó en remediación.

No editar el sujeto dentro de la pasada que lo evalúa.

## Reglas duras

- Auditar output real antes que intención o código.
- Ocultar rationale en la primera pasada.
- Inspeccionar toda la cobertura mínima.
- Mantener observación, contrato y causa como capas separadas.
- Asignar cada problema a un único propietario primario.
- Toda corrección debe ser verificable.
- Un build verde no equivale a calidad visual.
- Un score no sustituye findings ni evidencia.
- Toda remediación exige nueva auditoría.
- Declarar limitaciones de independencia.
- Blind decode se cierra antes de abrir semantic specs, contratos o referencias.
- Todo informe que consuma el schema 2.1 declara `reference_context`, incluso si `applicable = false`.
- La semantic spec gobierna significado y la referencia aprobada gobierna percepción.
- Mostrar la referencia aprobada como imagen fullscreen no constituye implementación.
- Reference fidelity no exige pixel-perfect y nunca depende solo de pixel diff.

## Acciones prohibidas

- Leer primero el rationale del Producer por conveniencia.
- Ver la referencia aprobada antes de cerrar blind decode.
- Auditar solo screenshots elegidos por el creador.
- Arreglar antes de emitir informe.
- Cambiar diseño, motion o código desde autoridad de Auditor.
- Ocultar findings porque el usuario aún no los verá.
- Autoaprobar una remediación sin pasada nueva.
- Declarar `reference_candidate` por promedio si falla un umbral reforzado.
- Aprobar reference fidelity si falta un binding, hash o screenshot comparable.
- Rebajar a major un fullscreen que impide considerar el sujeto una implementación.
- Invocar automáticamente otra skill.

## Blockers y escalado upstream

| Blocker | Propietario | Acción |
|---|---|---|
| Sujeto/commit/manifest no reproducible | Frontend Producer | emitir `blocked`, pedir reproducción |
| Evidencia crítica ausente | Frontend Producer | capturar; nueva auditoría |
| Claim no sostenible | `narrative-owner` | corregir narrativa; invalidar cadena |
| Composición impide comprensión | Visual Director | nuevo visual contract y checkpoint |
| Spec y referencia se contradicen materialmente | Visual Director o usuario/upstream source owner | bloquear y corregir el bundle |
| Referencia adecuada pero output pierde jerarquía/composición | Frontend Producer | corregir reconstrucción y reauditar |
| Referencia abierta antes de cerrar blind decode | usuario | emitir `blocked` y encargar una pasada nueva |
| Motion destruye identidad o causalidad | Motion Director | nuevo motion contract |
| Independencia insuficiente para referencia | usuario | mantener veredicto inferior o pedir auditor independiente |

## Definition of Done

- Sujeto congelado y reproducido.
- Independencia y limitaciones declaradas.
- Blind decode cerrado antes de leer rationale/contratos.
- Los flags de ocultación semántica, contractual y perceptual coinciden con el orden realmente seguido.
- Cuando aplica, fidelidad semántica precede a fidelity perceptual y `reference_fidelity` cubre cada binding.
- Los fallos upstream y de implementación tienen `failure_origin` y owner coherentes.
- Todos los holds, beats y estados de riesgo inspeccionados.
- Móvil, downsample y reduced motion cubiertos.
- Ocho scores y total calculados con evidencia, o todos `null` solo ante un blocker temprano que invalida la inspección.
- Cada finding tiene severidad, consecuencia, causa probable, corrección y propietario.
- Veredicto cumple umbrales exactos.
- `required_next_owner` es coherente con findings.
- `consumed_versions` registra toda la cadena contractual observada.
- JSON válido e inmutable persistido.

## Relación con las otras skills

- No dirigir a Visual, Motion o Production antes de emitir findings.
- Devolver cada finding al propietario definido por el pipeline contract.
- Consumir el nuevo output como sujeto nuevo, no como edición del informe anterior.
- Si participa en remediación, declarar la pérdida parcial de independencia en la siguiente pasada.
