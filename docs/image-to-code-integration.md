# Image-to-Code Integration V3

## Propósito

Image-to-Code entrega significado y referencias aprobadas al pipeline de cuatro skills. No añade una etapa ni una dependencia runtime.

## Niveles de autoridad

| Nivel | Gobierna |
|---|---|
| diseño global | gusto y reglas reutilizables |
| proyecto | narrativa, ejemplo y convenciones |
| spec de unidad | objetivo, contenido y exclusiones |
| referencia aprobada | baseline perceptual de la unidad |

La spec gana en semántica. Una contradicción material entre spec e imagen bloquea el bundle.

## Bundle mínimo

Fijar branch, commit, paths y SHA-256 de diseño, proyecto, specs y referencias. Cargar solo las unidades afectadas. Una imagen sin aprobación verificable no activa ningún modo basado en referencia.

## Selección de modo

- `concept_first`: no hay bundle completo; explorar tres direcciones.
- `approved_reference`: reconstruir sin rediseñar.
- `reference_guided_enhancement`: preservar esencia y permitir mejoras justificadas.

En enhancement, la referencia deja de gobernar posición exacta, densidad o jerarquía secundaria cuando un delta aprobado mejora claridad, atención, estética, inmersión o robustez espacial. Nunca autoriza cambiar claims, cifras, mecanismo o takeaway.

## Baseline y enhanced

Producir dos variantes separadas:

1. `baseline_faithful`: reconstrucción perceptualmente cercana que prueba que el input se entendió;
2. `enhanced_immersive`: composición nueva dentro de los límites del visual contract.

No usar el baseline como capa oculta del enhanced ni como raster de fondo. Texto, fórmulas, timelines, labels, conectores y objetos con motion semántico permanecen code-native.

## Binding y comparación

Vincular cada `reference_id` a `scene_id` y holds. Registrar:

- propiedades esenciales inmutables;
- propiedades perceptuales del baseline;
- propiedades que pueden transformarse;
- delta, razón y evidencia esperada;
- partes no cubiertas por la imagen.

Comparar `original → baseline → enhanced`, no solo `reference → screenshot`. Pixel diff puede aportar señal para baseline; no decide calidad ni enhancement.

## Mobile

La referencia desktop no se escala sin criterio. En enhancement, mobile es composición hermana: puede reducir simultaneidad, cambiar orden, agrupar o repartir contenido entre holds, preservando la esencia total y el takeaway de cada fase.

## Reconstrucción

Prohibir:

- mostrar la referencia fullscreen;
- rasterizar texto, fórmulas o gráficos editables;
- inferir semántica solo desde píxeles;
- exigir identidad pixel-perfect al enhanced.

Permitir assets únicamente para fotografía, ilustración o textura con procedencia y sin función estructural programática.

## Auditoría

Observar primero el output real. Después comparar semántica y referencia. Declarar si el auditor conocía el sujeto o participó en su creación; esa limitación impide presentarlo como auditoría plenamente independiente, pero no sustituye los gates objetivos.
