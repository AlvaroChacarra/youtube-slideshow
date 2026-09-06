# DESIGN — visual language v0.1

Estado: calibración inicial basada en las primeras referencias aprobadas del proyecto `bonds`.

Este archivo recoge preferencias transversales. No debe absorber decisiones narrativas específicas de bonos.

## Principios

1. **Claridad antes que espectacularidad.** La composición debe entenderse rápido por un espectador que escucha una explicación.
2. **Cero paja visual.** Cada texto, icono, línea, imagen o contenedor debe aportar estructura, significado o jerarquía.
3. **Una idea dominante por slide.** Evitar competir con varios centros de atención.
4. **Minimalismo didáctico, no vacío decorativo.** Simplificar hasta que solo quede lo necesario para comprender el mecanismo.
5. **Ejemplos concretos cuando reducen abstracción.** La teoría puede tener una slide propia; la aplicación numérica, otra.
6. **Referencia visual antes de código.** Una composición aprobada es el objetivo perceptual de la futura implementación.

## Mundo visual aprobado

- Formato principal: **16:9 horizontal**.
- Fondo: navy muy oscuro, aproximadamente `#011226` / `#05172F`.
- Texto principal: blanco o blanco roto.
- Acento primario: cyan / teal. En las referencias aparece aproximadamente entre `#2B858D` y `#26939C`; no fijar aún un token exacto.
- Acento secundario: verde/lima muy contenido para distinguir semánticas como pago futuro, crecimiento o resultado. No convertirlo en decoración.
- Contraste alto, pero sin neón dominante.
- Bordes y conectores finos; esquinas redondeadas cuando delimitan información real.
- Iconografía lineal, simple y consistente.

## Imagen y fotografía

La fotografía es opcional y subordinada al diagrama.

Cuando se utilice:

- debe funcionar como contexto, no como protagonista;
- aplicar tratamiento oscuro/neutral que la integre con el fondo;
- evitar puestas de sol, naranjas intensos u otros focos cromáticos que compitan con la explicación;
- mantener suficiente contraste para que líneas, iconos y texto sean lo primero que se lea.

## Composición

- Márgenes generosos y aire alrededor del protagonista.
- Preferencia por relaciones espaciales explícitas: timelines, flechas, conectores y anotaciones directas.
- Etiquetar cerca del objeto al que se refiere el texto.
- Usar tarjetas/callouts solo cuando agrupen una definición o relación semántica; evitar grids de cards de estética dashboard/SaaS.
- Evitar ornamentación, badges, métricas ficticias y contenedores innecesarios.
- Las fórmulas pueden vivir en una banda o caja cuando sean el foco conceptual, no por convención estética.

## Tipografía

- Default: sans-serif limpia y muy legible para títulos, etiquetas y narrativa.
- Una serif editorial puede aparecer de forma puntual cuando el propio objeto físico/documental lo justifica, como en la anatomía de un certificado de bono; no es el default del sistema.
- Jerarquía visible mediante tamaño, peso y espacio antes que mediante múltiples colores.
- Texto secundario corto. Si una explicación necesita un párrafo, probablemente debe convertirse en narración o dividirse.

## Motion y continuidad

El Bloque 1 ya implementa movimiento dirigido por pasos y objetos persistentes entre contrato, valoración y YTM. La evolución propuesta vive en `WORK_PLAN.md`; no implica que exista un motor transversal terminado. Criterios:

- debe explicar una relación o transformación;
- preservar la composición aprobada en sus estados importantes;
- evitar movimiento ambiente sin función pedagógica.

## Anti-patrones observados

- slides convertidas en dashboards;
- demasiados elementos pequeños simultáneos;
- imágenes cinematográficas que eclipsan el contenido;
- glows, gradientes o decoración usados para simular calidad;
- bloques de texto explicando lo que el diagrama debería mostrar;
- generalizar componentes antes de haber observado invariantes en varias referencias.

## Evolución de este documento

Añadir una regla global solo cuando aparezca de forma consistente en varias decisiones aprobadas o se confirme en más de un proyecto. Una preferencia propia de `bonds` debe permanecer en `projects/bonds/`.


## Objetivo de profesionalización y reutilización

Mandato explícito del usuario (2026-09-05): la calidad técnica debe percibirse a través de una explicación inmersiva y rigurosa, con continuidad de contenido, pedagogía y elementos. La tecnología se elige por su contribución observable a interpretar el mecanismo.

El repositorio debe permitir nuevas presentaciones mediante reutilización de patrones probados. Separar tema/datos de controles, representación y entrega es una dirección de evolución, no una capacidad genérica ya completada. Mantener primero la legibilidad, la identidad de los objetos y la fidelidad de las escalas.
