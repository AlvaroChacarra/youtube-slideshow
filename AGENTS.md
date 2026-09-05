# Image-to-Code — instrucciones del repositorio

El repositorio conserva referencias visuales, su significado y una presentación web implementada. El chat ayuda a iterar; el repositorio es la fuente de verdad.

## Orden de lectura obligatorio

Para una tarea dentro de un proyecto:

1. `design/DESIGN.md`
2. `projects/<proyecto>/PROJECT.md`
3. si el proyecto tiene bloques, únicamente `projects/<proyecto>/<bloque>/PROJECT.md` del bloque afectado
4. únicamente los `slides/*.md` afectados
5. únicamente las imágenes de `references/` citadas por esas slides

No cargar por defecto otros proyectos, otros bloques, todas las slides ni todas las referencias.

## Estructura de Fixed income

`projects/Fixed income/PROJECT.md` define el roadmap curricular completo.

Cada bloque vive en su propia carpeta y tiene un `PROJECT.md` con su alcance. El Bloque 1 contiene las slides y referencias ya aprobadas de fundamentos de bonos.

## Fuentes de autoridad

- `design/DESIGN.md`: gusto y reglas visuales transversales.
- `projects/<proyecto>/PROJECT.md`: narrativa y roadmap del proyecto.
- `projects/<proyecto>/<bloque>/PROJECT.md`: alcance, secuencia y convenciones del bloque.
- `slides/<slide>.md`: significado, contenido obligatorio y rationale de una composición.
- `references/<slide>.*`: verdad perceptual de la composición aprobada.

Si imagen y markdown discrepan en contenido semántico, prevalece el markdown y la referencia debe corregirse. Para composición, jerarquía y apariencia, la imagen es la referencia perceptual.

Para modificar la web integrada, la base operativa es `presentation/` y sus renders versionados en `presentation/evidence/final/`, con el estado indicado en el PROJECT del bloque. Las PNG originales conservan su función de referencia histórica; no se usan para revertir silenciosamente el rediseño fusionado. El significado financiero sigue gobernado por las fichas reconciliadas.

## Reglas de trabajo

- Global si expresa gusto reutilizable; proyecto si expresa la historia completa; bloque si expresa una unidad curricular; slide si expresa una composición concreta.
- No convertir una decisión aislada de una slide en regla global sin evidencia repetida y aprobación.
- No inventar nuevos patrones visuales cuando una referencia aprobada ya resuelve el problema.
- Extraer el núcleo reutilizable solo a partir de invariantes demostrados. Probarlo con un segundo deck; no crear un framework o catálogo extenso por anticipación.
- Mantener el repositorio pequeño. Añadir archivos solo cuando reduzcan ambigüedad o permitan reproducir una decisión.
- Si una decisión visual aprobada cambia, actualizar la especificación y su referencia en el mismo cambio.


## Presentación web y evolución

- Estado implementado, ejecución y entrega: `presentation/README.md`.
- Auditoría actual y límites de evidencia: `presentation/AUDIT.md`; leer primero su sección de estado vigente.
- Mandato nuevo y único roadmap de evolución: `WORK_PLAN.md`. Sus mejoras están propuestas, no implementadas.
- El estado de aprobación/integración de la web se mantiene en el `PROJECT.md` del bloque; las descripciones de las PNG en las fichas son históricas.
- Mandato actual: análisis y documentación para conversación antes de tocar código. No convertir el plan propuesto en autorización de desarrollo o merge.
- Toda corrección futura debe mantener correspondencia entre datos, fórmula, gráfico y escenario, también durante movimiento. Ver aceptación y prueba de reutilización en `WORK_PLAN.md`.
