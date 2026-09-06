# Evolución del producto de presentaciones

Estado: **fases 0–3 implementadas; auditoría cerrada con límites documentados; entrega lista para revisión. PR #4, sin merge ni despliegue**.
Última actualización:2026-09-06. Base aprobada: `main@31d0687` (PR #3). Checkpoint de implementación: `c04f7f5`.

## Mandato y ejecución

El usuario autoriza ejecutar todas las fases con **desarrolla-autonomo**: mejorar acabado, pedagogía, continuidad de objetos y contenido, entretenimiento al servicio de la explicación, herramientas de presentación y reutilización del repositorio. No detener la implementación entre fases para pedir «continúa». Merge requiere aprobación de esta entrega concreta; la autorización de PR #3 no se extiende a PR #4.

Inicio UTC:2026-09-05T21:48:11Z. Deadline:2026-09-06T00:48:11Z; incluye revisión, pruebas y pushes. Rama:`plan/presentation-evolution`. Se conserva el modelo/esfuerzo efectivo del Work. Coordinador implementa; revisión técnica independiente y revisión perceptual final con contexto limpio.

Se prioriza exposición/grabación guiada, manteniendo exploración y lectura móvil. La reutilización se demuestra con un deck distinto: **Del dato a una predicción**,3escenas y7pasos.

## Fases y aceptación

| Fase | Resultado implementado | Validación |
|---|---|---|
|0 · Corregir base | Cifras atómicas, curva responsive, comparación móvil, notación, puentes y repaso coherentes |12tests originales conservados; UI numérica, gráficos reales y renders de13composiciones |
|1 · Continuidad05–07 | Selección persistente del flujo; descuento y contribución a riqueza terminal; último pago sin reinversión posterior | Pruebas de tasas, selección y navegación; móvil y escritorio; recorrido de ejemplo de82s |
|2 · Reutilización | Player independiente del dominio; escenarios/IDs/conceptos; estilos comunes separados; segundo deck y empaquetado compartido | Ambos contratos validados; cálculo/interacciones de regresión; entrega web/HTML de los dos temas |
|3 · Presentar y producir | Ponente separado, ayuda contextual, grabar/importar/replay, enlace con supuestos, área de cámara | Ventanas reales sincronizadas;9tests de integración con mensajes/RAF controlados; grabación y replay reales; perfil de cámara medido |
|Integración |40 pruebas; Astro0/0/0; build; CI; documentación y evidencias | Revisiones independientes cerradas;13desktop, móviles07/08/11 y recorrido43estados; límites temporales en AUDIT |

Se corrigieron también defectos hallados durante QA: mensajes retrasados que deshacían avances; replay remoto que no cedía al usuario; ayuda que dejaba avanzar el replay; curva demasiado alta en escritorio; estilos pequeños perdidos al empaquetar; composición07 demasiado densa al reservar cámara.

## Decisiones de producto y tecnología

- Conservar Astro+React+TypeScript, HTML/SVG, KaTeX y GSAP. D3 escala los gráficos con el ancho real. No instalar tecnología nueva para representar30puntos o añadir movimiento sin función docente.
- Un mismo objeto económico conserva identidad; un nuevo contrato o muestra se anuncia. El caso común de10 produce puntos coincidentes en `(5Y,YTM común)`. La nube de11 amplía a otra muestra explícita.
- Cada resultado visible corresponde al escenario actual. La reinversión se muestra por tiempo restante y contribución; animar una cifra financiera independiente de su fórmula queda descartado.
- La composición móvil puede cambiar; la semántica, el orden de explicación y los escenarios se conservan.
- El catálogo compartido se limita a patrones demostrados. El player no conoce13slides, tasas, vencimientos ni marca. Los componentes financieros y el cálculo permanecen locales al dominio.
- Sesiones versionadas guardan estados y tiempos, no audio/vídeo. Se entrega un ensayo reproducible de82s, no una prueba de comprensión humana.
- La continuidad usa objetos persistentes y GSAP existente; el cuerpo espera0,8 s en03–07 antes de entrar, con cancelación al cambiar escena y aparición inmediata sin motion. Flip no se añade al no necesitar relocalización DOM adicional; evitar dos responsables animando una misma propiedad.
- Remotion sigue condicionado a pedir exportación de vídeo determinista. No se crea un adapter vacío ni se afirma que GSAP equivale a animación por frame. Three/WebGPU y Rive requieren una relación o ilustración que los justifique.

Las fuentes primarias y alternativas tecnológicas contrastadas el2026-09-05 están en la [auditoría previa](presentation/AUDIT.md#tercera-auditoria-evolucion) y el historial de este plan. Las dependencias conservan sus versiones; instalar una librería no acredita una capacidad.

## Cierre verificable

1. Asociar las capturas y resultados al estado del código; inspeccionar13escenas y los casos móviles densos, ambas entregas y los controles del ponente.
2. Cerrar defectos materiales de la revisión independiente, repetir solo las comprobaciones afectadas y verificar CI en el último commit.
3. Publicar el checkpoint y la PR lista para revisión; entregar los dos HTML y el recorrido de ejemplo. No hacer merge ni desplegar sin aprobación.

## Después de la aprobación

- Ensayar con voz y cámara en el equipo real; validar Safari iOS y el navegador/dispositivo utilizado para exponer. Medir rendimiento allí antes de prometer60fps.
- Probar la secuencia05–07 con una persona nueva: qué cambia, qué permanece y por qué YTM y CAGR difieren. Registrar errores de interpretación antes de ampliar efectos.
- Construir el próximo bloque mediante el contrato del segundo deck. Extraer nuevos componentes solo cuando aparezca una necesidad repetida.
- Si se necesita vídeo: elegir formato/duración, adaptar motion al reloj de frames de Remotion y validar audio/subtítulos/renders. Es una fase editorial y técnica distinta.

No consta todavía ensayo con alumno, narración grabada, Safari físico, auditoría exhaustiva de cada fotograma ni medición de fps. Esos límites se mantienen visibles en la entrega.
