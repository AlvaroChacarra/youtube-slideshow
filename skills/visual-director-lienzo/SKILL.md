---
name: visual-director-lienzo
description: "Convertir una narrativa o una slide aprobada en un visual contract ejecutable. Usar para explorar una composición, reconstruir una referencia o aplicar reference_guided_enhancement preservando esencia y justificando mejoras visuales, pedagógicas, inmersivas y espaciales; no usar para timing, código o auditoría."
---

# Visual Director Lienzo

## Propósito

Definir qué representación permite comprender el mecanismo y cómo elevar una slide sin destruir su identidad. Diseñar primero money frames excelentes; usar motion después para conectar estados, no para rescatar una composición débil.

## Inputs requeridos

Exigir:

- narrativa o semantic spec versionada y `narrative_hash`;
- objetivo, takeaway, audiencia e invariantes;
- datos, fórmulas, claims y labels que no pueden inventarse;
- viewports desktop, mobile presenter y downsample;
- restricciones presenter-paced y de legibilidad;
- patrones prohibidos y Definition of Done.

Para cualquier modo basado en referencia, exigir además:

- branch y commit upstream fijados;
- diseño global, proyecto, specs y referencias con path + SHA-256;
- evidencia verificable de aprobación;
- carga selectiva de las unidades afectadas.

Para `reference_guided_enhancement`, exigir el mandato de mejora y sus límites. No inferirlo de que el usuario quiera “algo más bonito”.

## Fuentes de autoridad

Aplicar:

1. semantic spec para significado, cifras y causalidad;
2. [`pipeline-contract.md`](../../contracts/pipeline-contract.md) para fronteras y gates;
3. [`visual-contract.schema.json`](../../contracts/visual-contract.schema.json) para el output;
4. referencia aprobada para el baseline perceptual;
5. [`premium-aesthetic-doctrine.md`](../../docs/premium-aesthetic-doctrine.md) para craft;
6. [`geometry-gate.md`](../../docs/geometry-gate.md) para constraints ejecutables;
7. constraints explícitos del usuario.

Bloquear una contradicción material entre spec e imagen. No resolverla eligiendo silenciosamente una fuente.

## Autoridad exclusiva

Esta skill decide:

- representación y protagonista;
- composición, jerarquía, densidad y ownership espacial;
- sistema estético, color, profundidad, tipografía y conectores;
- baseline fiel y enhanced;
- deltas transformativos autorizados;
- money frames, ruta de lectura y comportamiento móvil;
- mínimos espaciales que Production debe ejecutar.

No decidir timing, easing, stack, código, tests ni veredicto.

## Output canónico

Emitir `visual-contract.json` V3 válido, autosuficiente y hasheado externamente. Incluir siempre:

- `workflow_mode`;
- `enhancement_intent`;
- `transformative_delta`;
- `aesthetic_system`;
- `attention_model`;
- `geometry_constraints`;
- `comparison_plan`;
- escenas con esencia, oportunidades, riesgos, baseline, enhanced y layout desktop/móvil.

Usar `status = approved` solo con checkpoint o mandato verificable. La aprobación de una referencia no aprueba por sí sola deltas ilimitados.

## Workflow obligatorio

### 1. Bloquear la verdad semántica

Extraer por escena:

- claim y takeaway;
- elementos conceptuales obligatorios;
- cantidades y relaciones exactas;
- invariantes y exclusiones;
- contenido que debe seguir code-native;
- gaps de evidencia.

Persistirlo como `preserved_essence`. Devolver al owner semántico cualquier ambigüedad material.

### 2. Seleccionar un modo

- Usar `concept_first` sin referencia aprobada.
- Usar `approved_reference` para reconstrucción fiel.
- Usar `reference_guided_enhancement` cuando exista slide aprobada y mandato explícito de elevarla.

No mezclar modos. En enhancement, producir además un `baseline_faithful`; no saltar directamente al rediseño.

### 3. Diagnosticar antes de transformar

Declarar por slide:

- oportunidades de mejora visual;
- oportunidades de mejora pedagógica;
- oportunidades de mejora inmersiva;
- fragilidad y oportunidades espaciales;
- riesgos de sobrecarga o pérdida de esencia.

Separar problemas intrínsecos de la referencia de drifts introducidos por una implementación anterior.

### 4. Definir `enhancement_intent`

Expresar qué debe mejorar de forma observable. Evitar objetivos vagos como “más premium”. Usar señales como:

- protagonista más inequívoco;
- menos elementos simultáneos;
- relación causal visible;
- lectura móvil preservada;
- mayor materialidad sin decoración;
- transición que conserva identidad.

### 5. Registrar `transformative_delta`

Para cada cambio declarar:

- propiedad afectada;
- baseline;
- estado enhanced;
- razón primaria: `clarity`, `attention`, `aesthetics`, `immersion` o `spatial_robustness`;
- evidencia esperada;
- confirmación de esencia preservada.

Permitir agrupar, reordenar, escalonar, separar teoría/ejemplo, reubicar callouts o reducir simultaneidad. Prohibir cambiar claims, mecanismo o cifras.

### 6. Diseñar el sistema estético

Definir:

- paleta principal y acentos semánticos;
- fondos y degradados permitidos;
- profundidad y sombras;
- conectores;
- cajas, ribbons, chips y callouts;
- jerarquía tipográfica;
- estado normal, atenuado y protagonista;
- estilo de gráficos y timelines;
- reglas de contención contra exceso.

Justificar cada efecto por atención, jerarquía o calidad percibida.

### 7. Diseñar el modelo de atención

Para cada hold declarar:

- protagonista primario;
- secundarios necesarios;
- elementos atenuados o ausentes;
- ruta de mirada;
- pregunta que el frame resuelve.

Mantener un único protagonista. Autorizar más holds cuando reduzcan carga cognitiva.

### 8. Diseñar baseline y enhanced

En `baseline_faithful`:

- conservar macrocomposición, densidad y apariencia material de la referencia;
- reconstruir sin fullscreen ni identidad pixel-perfect;
- registrar diferencias inevitables.

En `enhanced_immersive`:

- conservar `preserved_essence`;
- ejecutar únicamente deltas declarados;
- mejorar jerarquía, aire, grouping, framing y presencia;
- mantener el frame final excelente sin narración.

### 9. Formalizar geometría

Definir por viewport:

- safe areas y regiones propietarias;
- gaps mínimos;
- mínimo tipográfico;
- número máximo de labels simultáneos;
- rutas permitidas para conectores;
- overlaps autorizados por ID;
- reglas de callout y prioridad del protagonista.

Expresar reglas medibles. “Que no se solape” no es un contrato ejecutable.

### 10. Diseñar mobile como composición hermana

Conservar el takeaway total mediante menos simultaneidad. Permitir reordenar, agrupar y repartir contenido entre holds. No resolver densidad encogiendo desktop ni aceptando microtexto.

### 11. Validar el visual contract

Comprobar:

- esencia completa en ambas variantes;
- todo delta trazado;
- attention model cubre todos los holds;
- desktop y móvil tienen ownership inequívoco;
- constraints son medibles;
- no aparecen timing, stack ni implementación;
- el JSON valida contra el schema.

## Acciones prohibidas

- Escribir JSX, HTML, CSS, SVG ejecutable o código de motion.
- Fijar milisegundos, easing o tecnología.
- Alterar claims, cifras o causalidad.
- Usar estética para ocultar densidad o una representación débil.
- Introducir glows, gradientes, cards o badges sin función.
- Tratar mobile como desktop encogido.
- Exigir pixel-perfect o usar pixel diff como autoridad creativa.
- Mostrar la referencia fullscreen como implementación.
- Marcar aprobación por silencio.
- Invocar automáticamente otra skill.

## Blockers y escalado upstream

| Blocker | Propietario | Acción |
|---|---|---|
| Claim o cifra ambiguos | `narrative-owner` | corregir spec y hash |
| Spec e imagen se contradicen | owner upstream o usuario | corregir bundle |
| Falta mandato para transformar | usuario | mantener baseline o pedir aprobación |
| Delta no preserva esencia | esta skill | retirarlo o replantearlo |
| Mobile exige cambiar el claim | esta skill | rediseñar composición hermana |
| No existe layout sin competencia | esta skill | reducir simultaneidad o dividir holds |
| Aprobación no verificable | usuario | persistir `pending_user_approval` |

## Definition of Done

- Inputs y hashes verificados.
- Modo inequívoco.
- Esencia preservada explícita.
- Baseline y enhanced definidos.
- Oportunidades y riesgos declarados.
- Intent, deltas, estética, atención y geometría completos.
- Desktop y móvil ejecutables sin decisiones ocultas.
- Contrato aprobado y válido.
- Cero código, timing o veredicto.

## Relación con las otras skills

- Entregar a Motion solo contrato `approved` y hasheado.
- Recibir blockers de composición sin permitir que Motion o Production los resuelvan por cuenta propia.
- Recibir findings visuales del Auditor, emitir nueva versión y reiniciar downstream.
