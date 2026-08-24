---
name: audita-y-mejora-lienzo-didactico
description: Audita independientemente el output real de un lienzo didáctico, realiza blind decode, inspecciona holds/transiciones/móvil/reduced motion, puntúa ocho dimensiones y asigna findings verificables a su propietario. Usar antes de revisión humana o referencia y después de cada remediación; no usar para autoaprobar ni rediseñar antes de emitir informe.
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

Después del blind decode exigir narrativa, ambos contratos y hashes, manifest, código, tests y desviaciones.

## Fuentes de autoridad

Aplicar este orden:

1. output real reproducible como evidencia perceptual;
2. narrativa para verdad pedagógica y claims;
3. visual y motion contracts para fidelidad;
4. [`pipeline-contract.md`](../../contracts/pipeline-contract.md) para routing y gates;
5. [`audit-report.schema.json`](../../contracts/audit-report.schema.json) para el output;
6. criterios explícitos del encargo;
7. [`source-map.md`](../../docs/source-map.md) como doctrina consultiva.

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
- scores 0–10;
- findings con severidad, consecuencia, causa probable, corrección verificable y propietario;
- blockers y limitaciones;
- veredicto;
- `required_next_owner`.

Un informe es inmutable. Una nueva pasada produce otro `audit_id`.

## Independencia

La primera pasada debe ocultar rationale y contratos. Registrar:

- si el auditor creó el sujeto;
- si lo remedió;
- si pudo mantener rationale oculto;
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

### 6. Puntuar ocho dimensiones

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

### 7. Emitir findings accionables

Cada finding debe contener:

- localización y evidencia observable;
- severidad;
- consecuencia para comprensión, atención, fidelidad o uso;
- causa probable, etiquetada como hipótesis cuando proceda;
- corrección verificable expresada como condición de salida;
- skill propietaria.

Severidades:

- `blocker`: impide comprender, reproducir, validar o confiar en el resultado;
- `major`: degradación material que impide revisión del usuario como candidato serio;
- `minor`: defecto visible/acotado que no cambia el takeaway;
- `nit`: pulido no material.

No convertir preferencias personales en findings. Toda crítica debe enlazar evidencia con consecuencia.

### 8. Asignar propietario y artefactos invalidados

Aplicar:

- representación, protagonista, composición, jerarquía → `visual-director-lienzo`;
- transformación, identidad, timing, hold, coexistencia → `motion-director-lienzo`;
- fidelidad de código, responsive, interacción, build, tests → `frontend-producer-lienzo`;
- claim, evidencia o segmentación semántica → `narrative-owner`.

Un finding upstream invalida todos los artefactos downstream definidos en el pipeline contract.

### 9. Emitir veredicto

Usar exactamente estas reglas:

#### `blocked`

Aplicar si el sujeto no reproduce, hashes/gates son inválidos, falta evidencia crítica, existe un claim materialmente falso o no puede realizarse una auditoría fiable.

#### `revision_required`

Aplicar si existe cualquier blocker o major, una desviación material no aprobada, blind decode fallido, móvil/reduced motion fallido, o cualquiera de comprensión/composición/craft es menor que 7.

#### `ready_for_user_review`

Exigir:

- build y estados reproducibles;
- cero blockers y majors;
- cobertura mínima completa;
- blind decode, móvil y reduced motion satisfactorios;
- total ≥ 8;
- comprensión, composición y craft ≥ 8.

Puede conservar minors explícitos que no alteren el takeaway.

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
- `required_next_owner = none`.

No redondear hacia arriba para alcanzar un umbral.

### 10. Ejecutar la mejora sin autoaprobación

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

## Acciones prohibidas

- Leer primero el rationale del Producer por conveniencia.
- Auditar solo screenshots elegidos por el creador.
- Arreglar antes de emitir informe.
- Cambiar diseño, motion o código desde autoridad de Auditor.
- Ocultar findings porque el usuario aún no los verá.
- Autoaprobar una remediación sin pasada nueva.
- Declarar `reference_candidate` por promedio si falla un umbral reforzado.
- Invocar automáticamente otra skill.

## Blockers y escalado upstream

| Blocker | Propietario | Acción |
|---|---|---|
| Sujeto/commit/manifest no reproducible | Frontend Producer | emitir `blocked`, pedir reproducción |
| Evidencia crítica ausente | Frontend Producer | capturar; nueva auditoría |
| Claim no sostenible | `narrative-owner` | corregir narrativa; invalidar cadena |
| Composición impide comprensión | Visual Director | nuevo visual contract y checkpoint |
| Motion destruye identidad o causalidad | Motion Director | nuevo motion contract |
| Independencia insuficiente para referencia | usuario | mantener veredicto inferior o pedir auditor independiente |

## Definition of Done

- Sujeto congelado y reproducido.
- Independencia y limitaciones declaradas.
- Blind decode cerrado antes de leer rationale/contratos.
- Todos los holds, beats y estados de riesgo inspeccionados.
- Móvil, downsample y reduced motion cubiertos.
- Ocho scores y total calculados con evidencia.
- Cada finding tiene severidad, consecuencia, causa probable, corrección y propietario.
- Veredicto cumple umbrales exactos.
- `required_next_owner` es coherente con findings.
- JSON válido e inmutable persistido.

## Relación con las otras skills

- No dirigir a Visual, Motion o Production antes de emitir findings.
- Devolver cada finding al propietario definido por el pipeline contract.
- Consumir el nuevo output como sujeto nuevo, no como edición del informe anterior.
- Si participa en remediación, declarar la pérdida parcial de independencia en la siguiente pasada.
