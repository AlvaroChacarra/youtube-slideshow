# Image-to-Code — instrucciones del repositorio

Este branch persiste referencias visuales aprobadas y su significado. El chat ayuda a iterar; el repositorio es la fuente de verdad.

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

## Reglas de trabajo

- Global si expresa gusto reutilizable; proyecto si expresa la historia completa; bloque si expresa una unidad curricular; slide si expresa una composición concreta.
- No convertir una decisión aislada de una slide en regla global sin evidencia repetida y aprobación.
- No inventar nuevos patrones visuales cuando una referencia aprobada ya resuelve el problema.
- No crear todavía frameworks, templates, componentes o tokens extensos por anticipación. Extraerlos cuando la implementación image-to-code demuestre invariantes reales.
- Mantener el repositorio pequeño. Añadir archivos solo cuando reduzcan ambigüedad o permitan reproducir una decisión.
- Si una decisión visual aprobada cambia, actualizar la especificación y su referencia en el mismo cambio.
