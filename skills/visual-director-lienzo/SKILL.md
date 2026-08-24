---
name: visual-director-lienzo
description: "Convierte una narrativa pedagógica en un visual contract mediante dos modos: explora tres direcciones y money frames cuando no hay referencia, o formaliza un bundle visual ya aprobado sin rediseñarlo. Usar para decidir o contractualizar representación, protagonista, composición, jerarquía, lectura y móvil antes de programar; no usar para timing, stack o implementación."
---

# Visual Director Lienzo

## Propósito

Transformar una narrativa semántica en una representación visual que permita comprender el mecanismo antes de escribir código. Preguntar primero: **¿qué objeto, transformación o relación hace visible esta idea?**; no: **¿cómo repartimos información en pantalla?**

## Cuándo utilizar esta skill

Utilizar al iniciar una escena didáctica, replantear una composición, resolver un finding visual o definir los holds que gobernarán una implementación. No utilizar para elegir librerías, escribir frontend, fijar duraciones ni auditar el render final.

## Inputs requeridos

Detenerse si falta cualquiera de estos inputs:

- narrativa semántica versionada y su `narrative_hash`;
- objetivo pedagógico;
- takeaway que debe conservar el espectador;
- escenas y beats semánticos;
- invariantes: qué cambia y qué no cambia;
- audiencia y conocimiento previo asumido;
- formato y viewport de captura;
- restricciones de interacción presenter-paced;
- restricciones de legibilidad y downsample móvil;
- material real, datos, fórmulas y evidencia disponibles;
- claims, labels o cifras que no pueden inventarse;
- patrones explícitamente prohibidos por el proyecto.

Si se declara `approved_reference`, exigir además:

- branch y commit fijados del upstream;
- diseño global y contrato de proyecto con path + hash;
- spec semántica de cada unidad con path + hash;
- referencia perceptual citada con path, hash y media type;
- evidencia verificable de aprobación;
- unidades y referencias afectadas, sin cargar el resto del proyecto.

No completar inputs mediante memoria conversacional implícita. Pedir el artefacto o registrar un blocker.

## Fuentes de autoridad

Aplicar este orden:

1. narrativa o spec de unidad versionada para claims, causalidad y contenido;
2. referencia aprobada para composición, jerarquía y apariencia del hold vinculado;
3. [`pipeline-contract.md`](../../contracts/pipeline-contract.md) para gates y fronteras;
4. [`visual-contract.schema.json`](../../contracts/visual-contract.schema.json) para la forma del output;
5. constraints y decisiones explícitas del usuario;
6. [`image-to-code-integration.md`](../../docs/image-to-code-integration.md) para el bundle upstream;
7. [`source-map.md`](../../docs/source-map.md) como doctrina consultiva, nunca como dependencia.

La spec prevalece en semántica y la referencia aprobada en percepción. Una contradicción material bloquea el bundle; no se resuelve eligiendo una de las dos.

## Autoridad exclusiva

Esta skill decide:

- representación;
- protagonista, apoyos, contexto y ausencias;
- macrocomposición y ownership espacial;
- jerarquía y ruta de lectura;
- densidad y presupuesto de texto;
- lenguaje visual y encodings;
- money frames estáticos;
- comportamiento compositivo móvil.

No decide tecnología final, timing, easing, implementación ni veredicto.

## Output canónico

Emitir `visual-contract.json`, válido contra [`visual-contract.schema.json`](../../contracts/visual-contract.schema.json), declarando `concept_first` o `approved_reference` en contratos V2.1. Contratos V2 sin `workflow_mode` se interpretan como `concept_first`.

Usar `approved` solo después del checkpoint humano o de heredar una aprobación upstream verificable. Ante evidencia insuficiente, persistir `draft` o `pending_user_approval`.

El contrato debe ser ejecutable por otro agente sin acceso al chat: cada escena y hold debe identificar qué domina, qué apoya, qué está ausente, por dónde se lee y qué no puede aparecer.

## Workflow obligatorio

### 1. Bloquear la verdad semántica

Extraer de la narrativa:

- claim y takeaway por escena;
- cambio semántico dominante por beat;
- invariantes y cantidades exactas;
- evidencia disponible y gaps;
- elementos que deben seguir editables o vinculados a datos;
- términos cuyo significado no puede alterarse visualmente.

Si la evidencia no sostiene el claim, devolver a `narrative-owner`. No resolver un gap inventando métricas, objetos o causalidad.

### 2. Seleccionar un único modo

Usar `concept_first` cuando no exista un bundle completo y aprobado. Usar `approved_reference` solo cuando coexistan diseño global, proyecto, spec de unidad, referencia y evidencia de aprobación fijados por hash y commit.

No mezclar los modos. Una imagen huérfana, un path flotante o una aprobación solo conversacional no activan `approved_reference`.

### 3A. Ejecutar `concept_first`

Mantener el workflow V2 completo:

1. explorar objetos, materiales, geometrías, escalas, relaciones, vocabulario y encodings legítimos del dominio;
2. distinguir mecanismo de metáfora y preferir el mecanismo cuando reduce decodificación;
3. registrar al menos cinco anti-defaults estructurales o visuales con su razón;
4. proponer exactamente tres direcciones materialmente distintas en macrocomposición, representación, relación espacial, protagonista, transformación, densidad o texto;
5. persistirlas completas en `direction_options`, compararlas contra el takeaway y recomendar una;
6. diseñar money frames que funcionen sin motion, rationale ni narración redundante y sobrevivan al downsample móvil;
7. presentar las tres direcciones, registrar elección, rechazos, razón, cambios, revisor, fecha y aprobación explícita.

Si no hay respuesta, detenerse en `pending_user_approval`. No usar motion futuro para justificar un hold débil.

### 3B. Ejecutar `approved_reference`

Validar primero:

- branch y commit existen y están fijados;
- hashes de diseño, proyecto, spec y referencia coinciden con los bytes leídos;
- cada spec cita su referencia y cada referencia tiene evidencia de aprobación;
- se han cargado solo las unidades afectadas;
- spec e imagen no se contradicen materialmente.

Después formalizar, sin explorar alternativas nuevas:

- protagonista, apoyos, contexto y ausencias;
- regiones, ownership, composición, jerarquía y ruta de lectura;
- espacio negativo, proporciones, geometría y escala relativa;
- roles de color y tipografía, labels, densidad y presupuesto de texto;
- assets, procedencia y elementos que deben desaparecer;
- implicaciones móvil/downsample;
- contenido que debe seguir editable, variable o programático.

Clasificar cada elemento como `code_native` o `asset`. Texto, cifras, fórmulas, ejes, curvas, charts, timelines, conectores, labels, interacción y objetos con motion semántico son code-native por defecto. Fotografía, ilustración, textura o arte complejo pueden ser assets si conservan procedencia.

No generar tres direcciones, no rediseñar, no sustituir la referencia por el gusto del agente y no pedir una elección ya cerrada. Heredar aprobación solo con `approval_source = approved_reference`, branch, commit, spec, referencia y `approval_reference` verificables; si falta cualquiera, usar `pending_user_approval`.

### 4. Formalizar escenas, holds y bindings

En ambos modos, para cada escena y hold declarar:

- un protagonista primario y apoyos subordinados;
- contexto necesario y elementos ausentes;
- ruta de lectura ordenada y ownership espacial;
- límites contra competencia o solape;
- presupuesto de palabras y labels;
- criterios estáticos de takeaway, jerarquía, representación, ausencia, móvil y silencio.

En `approved_reference`, vincular cada `reference_id` a escenas y holds existentes. Registrar propiedades perceptuales obligatorias, propiedades mutables, tolerancias conceptuales y partes no cubiertas. Una referencia puede anclar uno o varios holds; no se presume que describa toda la escena.

La meta es fidelidad perceptual, no identidad de píxel. Los holds no cubiertos se derivan del visual contract. Una nueva composición material exige volver a esta skill.

### 5. Emitir y validar el visual contract

Calcular el hash conforme a [`pipeline-contract.md`](../../contracts/pipeline-contract.md) y comprobar:

- ambos modos conservan `anti_defaults`, escenas, holds, móvil, exclusiones y limitaciones;
- `concept_first` tiene exactamente tres `direction_options` y checkpoint humano;
- `approved_reference` tiene cero `direction_options`, bundle completo, clasificación de elementos y bindings válidos;
- todos los bindings apuntan a referencias, escenas y holds existentes;
- `status = approved` coincide con aprobación verificable;
- no hay timing, stack, JSX, CSS ni decisiones de implementación.

## Reglas duras

- Una vista tiene un protagonista dominante.
- La representación precede al label.
- Estructura, numeración y divisores codifican información real o desaparecen.
- Un concepto no hereda automáticamente la macroestructura de otro.
- El estado final estático debe ser excelente antes del motion.
- El vacío cumple una función compositiva.
- Más decoración no equivale a más craft.
- El texto material sobrevive al consumo móvil.
- Mobile es una composición hermana, no un desktop encogido.
- La spec gobierna semántica; la referencia aprobada gobierna percepción.
- Satisfacer Image-to-Code mostrando la referencia como imagen fullscreen no constituye implementación ni dirección válida.
- No programar durante esta etapa.

## Acciones prohibidas

- Escribir JSX, HTML, CSS, SVG ejecutable o código de animación.
- Elegir React, GSAP, D3, Canvas u otra tecnología.
- Fijar milisegundos, easing o stagger.
- Sustituir una representación por cards o texto porque sea más fácil de implementar.
- Rediseñar una referencia aprobada o exigir coincidencia pixel-perfect.
- Inferir claims, cifras o fórmulas únicamente desde píxeles.
- Tratar la existencia de una imagen como evidencia de aprobación.
- Autorizar que Production use la referencia como imagen fullscreen.
- Inventar métricas, testimonios, labels, claims o evidencia.
- Marcar aprobación por silencio o inferencia.
- Invocar automáticamente otra skill.

## Blockers y escalado upstream

| Blocker | Propietario | Acción |
|---|---|---|
| Claim, cifra o causalidad ambiguos | `narrative-owner` | pedir corrección versionada y nuevo hash |
| Evidencia insuficiente para representar el takeaway | `narrative-owner` o usuario | limitar el claim o aportar evidencia |
| Tres direcciones no son materialmente distintas | esta skill | seguir explorando; no pedir aprobación |
| Ningún hold funciona estáticamente | esta skill | replantear representación o composición |
| La adaptación móvil cambia el claim | esta skill | crear composición hermana antes del gate |
| Falta aprobación explícita | usuario | persistir `pending_user_approval` y detenerse |
| Spec y referencia se contradicen materialmente | upstream de referencia o usuario | corregir ambos artefactos y hashes antes de continuar |
| Bundle sin path, hash, commit o procedencia | upstream de referencia | completar el bundle; no inferir |
| Binding apunta a escena/hold inexistente | esta skill | corregir el contrato antes del gate |

## Definition of Done

- Inputs completos y hashes verificados.
- `workflow_mode` inequívoco y compatible con los inputs.
- En `concept_first`: exploración, anti-default inventory, tres direcciones y checkpoint humano persistidos.
- En `approved_reference`: bundle, hashes, aprobación heredada, clasificación y bindings persistidos sin rediseño.
- Cada escena declara protagonista, invariantes, representación, ruta y ownership.
- Todos los money frames pasan los tests estáticos y móvil.
- El JSON valida contra el schema.
- El contrato no contiene implementación ni timing.
- Limitaciones conocidas y exclusiones permanecen explícitas.
- Ninguna referencia se trató como fuente semántica única ni como implementación fullscreen.

## Relación con las otras skills

- Entregar a `motion-director-lienzo` solo un contrato `approved` y hasheado.
- Cuando existan bindings, entregarlos como anclas perceptuales; Motion no necesita leer el upstream completo.
- Recibir del Motion Director blockers que exijan cambiar composición; emitir una nueva versión y repetir aprobación.
- Recibir del Producer desviaciones visuales solo como blockers, nunca como cambios ya aceptados.
- Recibir del Auditor findings de representación, jerarquía o composición; remediar y forzar nueva cadena downstream.
