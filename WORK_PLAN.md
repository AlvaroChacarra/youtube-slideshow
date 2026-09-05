# Evolución de las presentaciones — plan para discusión

Estado: **propuesta; ejecución funcional pendiente de conversación con el usuario**.
Fecha: 2026-09-05. Base inspeccionada: `main@31d06877a9d5fe6ff0aba4a5eac3ff7dcb4d070a` (PR #3 fusionada por autorización expresa).

## Mandato vigente

Convertir la presentación en un producto de calidad técnica y editorial alta: inmersivo, claro, pedagógico, entretenido y reutilizable para futuras presentaciones. Auditar contenido, gráficas, relaciones visuales, transiciones e interacciones antes de elegir nuevas tecnologías. Cada elemento y movimiento debe ayudar a interpretar el contenido.

En esta fase se autoriza **auditoría, investigación y modificación de documentación**. No implementar correcciones, refactorizaciones, cambios de contenido renderizado ni dependencias hasta discutir los resultados. La autorización de merge de PR #3 cerró la entrega anterior; no autoriza fusionar nuevas propuestas.

El plan anterior se consumió al completar las 13 slides. Sus resultados y límites permanecen en [presentation/AUDIT.md](presentation/AUDIT.md) y en el historial Git. Este archivo es el único roadmap operativo de evolución; no reactivar sus antiguos plazos ni tareas completadas.

## Diagnóstico y decisión recomendada

La presentación actual ya tiene una identidad editorial consistente, cálculos separados y representaciones editables. La revisión de las 13 composiciones no justifica rehacer la base. Las limitaciones principales son:

1. Lectura móvil de gráficas y comparación de casos, y coherencia de las cifras durante su animación.
2. Continuidad parcial: fuerte entre contrato y valoración, más dependiente de texto entre los ejemplos de mercado. El mecanismo de reinversión se calcula, pero todavía se visualiza sobre todo como fórmula y contador.
3. Arquitectura especializada en este deck: orden, escenarios, estilos y posiciones condicionados por números de slide. Todavía no es un motor de presentaciones reutilizable.
4. Auditoría visual manual sin una puerta automática de regresiones en el repositorio.

**Recomendación:** conservar Astro + React + TypeScript, HTML/SVG, KaTeX y GSAP. Mejorar el modelo de escenas, la geometría de los gráficos y la dirección del movimiento. Evaluar GSAP Flip para cambios de composición; extraer utilidades D3 donde sustituyan escalas manuales. La novedad tecnológica debe superar una prueba de comprensión, rendimiento y mantenimiento, no justificar su propia inclusión.

La auditoría detallada por slide, hallazgos y evidencia están en [AUDIT.md](presentation/AUDIT.md#tercera-auditoria-evolucion). Su dictamen es **revision_required para el nuevo objetivo de profesionalización**, sin error financiero estable identificado en los casos comprobados. No revoca la aprobación de la entrega anterior ni equivale a una nueva revisión independiente.

## Dirección del producto

- El ponente sigue controlando el ritmo. Una escena tiene preparación, transformación y resolución estable; el siguiente avance no exige esperar una animación decorativa.
- Conservación de identidad: mismo objeto económico → mismo identificador y apariencia reconocible. Otro bono o muestra → cambio explícito de contexto. No transformar contratos diferentes como si fueran el mismo.
- Cada relación nueva se explica visualmente. Ejemplo: un cupón del año 1 se sigue hasta el año 5, se ve cuánto crece y cómo contribuye a la riqueza terminal.
- Etiquetas y fórmulas junto al objeto que explican. Ayudas breves por concepto, con definición, entrada/salida cuando haya cálculo, supuesto y referencia al punto donde se introdujo.
- Misma semántica entre escritorio, lectura móvil y grabación. La composición puede cambiar para mantener legibilidad y comparación.
- La percepción high end procede de tipografía, foco, materiales discretos, escalas honestas, continuidad y ritmo. La profundidad o el 3D requieren una relación espacial que realmente se beneficie.
- La reutilización se demuestra con otro deck real; no se fija un porcentaje de líneas reutilizadas sin medirlo.

## Fase 0 — corregir la base antes de ampliar efectos

Prioridad: alta. Alcance propuesto tras autorización de implementación.

| Trabajo | Resultado esperado | Aceptación verificable |
|---|---|---|
| Coherencia temporal de números (A01) | Tasa, fórmula, riqueza y CAGR pertenecen al mismo estado financiero | Cambios 0→8→0% y rápidos/reversos; todos los frames muestreados mantienen la relación, o separan claramente valor anterior/transición/resultado. Primero actualizar cifras de forma atómica; animar el énfasis, no inventar cifras intermedias |
| Curva móvil y densidad 0–10Y (A02) | Ejes y leyenda legibles; selección practicable; contexto completo conservado | Layout calculado para el ancho real, etiquetas esenciales ≥12 px de tamaño tipográfico efectivo como objetivo del producto; foco 0–10Y con vista general 0–50Y y escala explícita. Selección por teclado/táctil y alternativa textual verificadas |
| Comparación móvil (A03) | Se comparan los tres bonos sin memorizar dos pantallas anteriores | Resumen compacto visible de cupón/precio/CAGR; desarrollo del cálculo bajo demanda por caso o por etapa, conservando alineación semántica |
| Puentes y consistencia de representación (A04–A06) | Ejemplos distinguidos, iconos estables y curva del repaso fiel a lo aprendido | Revisar 06→07, 07→08, 08→09, 09→10 y 10→11; caso base indicado al recuperar 100 €. Unir punto y contrato solo cuando sean el mismo escenario. Repaso usa los mismos datos o rotula claramente un esquema |
| Lenguaje financiero y notación (A05/A06) | Cálculo de YTM separado de realización del retorno; C/CF y g/k definidos donde se usan | Contrastar fichas, ayuda y texto renderizado; coma decimal coherente o convención declarada; no ocultar el efecto del redondeo en la suma de PV |
| Base de regresión (A09) | Las correcciones no degradan el deck fusionado | 12 pruebas actuales conservadas; pruebas de UI para escenarios y navegación; capturas de las 13 composiciones; casos móviles densos; pruebas de movimiento reducido y cambios rápidos. Evidencia asociada al commit |

La sincronización documental de estado/mandato y la eliminación de contradicciones escritas de YTM sí se realizan en esta fase de conversación. Los cambios de interfaz de esta tabla siguen pendientes.

## Fase 1 — una secuencia de referencia con mayor continuidad

Empezar por **05–07: descuento → precio → YTM frente a riqueza terminal**. Tiene una relación causal clara, objetos ya compartidos y permite evaluar mejoras visuales sin inventar nuevo contenido.

1. Diseñar el estado clave de cada explicación antes del movimiento. El último flujo sigue distinguido como cupón + principal.
2. Mantener selección de flujo y destacar su término; convertir su contribución a PV en una representación directa sin deformar el importe contractual.
3. Pasar al caso base de YTM de forma explícita. Para reinversión, seguir cada cupón por el tiempo restante hasta T; mostrar una contribución y después la suma. El pago final no obtiene años ficticios de reinversión.
4. GSAP controla una secuencia semántica; Flip se evalúa para anclas de composición. Las entradas esperan al evento de resolución, no a un retardo numérico independiente. Un único responsable anima cada propiedad.
5. Retroceso, saltos y clics rápidos resuelven un estado válido. Móvil usa el mismo escenario y una composición apropiada, sin encoger toda la lámina.
6. Comparar una toma de 60–90 segundos con la base, con la misma explicación y duración aproximada. Pedir a un observador que explique qué permanece fijo, qué cambia y por qué. La mejora debe verse en la interpretación, además de en la estética.

**Gate:** aprobación visual del usuario sobre esa secuencia y ausencia de errores de correspondencia, lectura o interacción en los casos de riesgo. No extender un recurso porque sea llamativo si empeora la comprensión.

Segundo candidato: **10→11**, donde un contrato da lugar a un punto y después a una nube. El caso de YTM común produce tres puntos coincidentes en (5Y, y), no tres yields inventadas. La nube ilustrativa actual es otra muestra; el paso a ella exige una expansión de contexto explícita. No deformar silenciosamente los datos para que el morph sea atractivo.

## Fase 2 — extraer un núcleo reutilizable

Extraer solo patrones demostrados por la base y por la secuencia de referencia. Mantener un único repositorio y aplicación; no publicar todavía un paquete genérico.

| Capa propuesta | Responsabilidad | Qué debe quedar fuera |
|---|---|---|
| Player | Navegación por escena/paso, estado de sesión, índice, foco, atajos, vista de público y captura | Números 13/5, títulos de bonos, tasas y fórmulas financieras |
| Definición del deck | Metadatos, orden, capítulos, escenas, pasos, notas, conceptos, escenarios y procedencia | Lógica interna de animación y posiciones globales |
| Modelo de escena | Prerrequisitos, concepto introducido, takeaway, objetos entrantes/persistentes/salientes, acciones y estado final | Inferencias basadas únicamente en el índice de la slide |
| Catálogo visual pequeño | Timeline, comparación, gráfico con foco y contexto, bloque de ecuación, anotación, número y controles | Hipótesis financieras fijas o una plantilla universal de cards |
| Adaptador de dominio | Escenarios, cálculos, unidades, redondeo, procedencia y validación | Navegación, CSS y gestión del navegador |
| Adaptador de entrega | Web y HTML autocontenido; más adelante vídeo | Copias independientes de las fórmulas o del contenido docente |

Contrato orientativo, aún no implementado: `DeckDefinition` contiene identificadores estables, `sceneId`, `stepId`, `conceptIds`, `scenarioId`, `entityIds`, `actions`, `notes`, `sources` y límites de capacidades. Referenciar componentes React tipados; no diseñar ahora un lenguaje JSON capaz de describir cualquier presentación.

Orden de extracción:

1. Separar estado/controles y metadatos; eliminar fin de deck, escenarios e identidad de marca codificados dentro del player.
2. Sustituir condicionales de índice por registro de escenas y anclas explícitas. El usuario no tiene que conocer este contrato para presentar.
3. Consolidar CSS por componente y tokens observados; formatear el código para revisión. Evitar una capa más de overrides sobre las dos hojas existentes.
4. Resolver la autoridad de contenido: fichas como significado; datos/cálculo tipados; copy de escena trazable. Validar referencias entre ellos. No generar todos los layouts automáticamente desde Markdown.
5. Definir cómo se conserva/reinicia un escenario al navegar y cómo se serializa un estado para compartirlo o reproducir una grabación.
6. Probar con un **segundo deck corto de otra temática**, elegido con el usuario. Debe poder añadirse mediante definición, contenido, escenarios y assets, sin modificar el player. Un componente especializado nuevo puede ser local al segundo deck.

**Gate:** las 13 slides conservan comportamiento y aspecto acordados; segundo deck utilizable con el mismo núcleo; ningún import de dominio de bonos en el player; validación de escenarios reproducible. Esta es la prueba de reutilización; todavía no existe evidencia para prometer un porcentaje.

## Fase 3 — herramientas de presentación y producción

Priorizar según el uso real, después del núcleo:

- Vista del ponente separada: notas, siguiente paso y pregunta en otra ventana; público sin instrucciones internas. Añadir área segura para cámara en OBS como perfil de composición verificado, no como hueco impuesto a todas las slides.
- Ayudas contextuales de una acción que recuperan el concepto y devuelven foco/estado exactamente al punto de partida.
- Repetición de una sesión desde una lista de eventos/estados y supuestos; base para generar clips y enseñar escenarios reproducibles.
- Adaptador Remotion si se prioriza exportación de vídeo. Compartir datos y componentes visuales puros; escribir animación por frame. El GSAP/CSS actual no se convierte directamente en un render determinista.
- Formatos adicionales solo con demanda: PDF de apoyo o vídeo corto tienen decisiones editoriales propias; no se obtiene una buena versión móvil recortando la versión 16:9.

<a id="tecnologias-contrastadas"></a>
## Tecnologías contrastadas

Consulta realizada el 2026-09-05 con fuentes primarias. El buscador general no estuvo operativo. Algunas webs devolvieron 403; D3 y Remotion se verificaron en sus repositorios oficiales mediante el conector. No se afirma cobertura exhaustiva de lanzamientos recientes ni se recomiendan versiones sin comprobar compatibilidad.

| Tecnología | Capacidad verificada | Decisión para este proyecto |
|---|---|---|
| [GSAP Flip](https://gsap.com/docs/v3/Plugins/Flip/) | Captura/correlaciona geometría e IDs antes/después de cambios de layout; devuelve una timeline; contempla interrupciones | Probar en la secuencia de referencia. Ya usamos GSAP; evita añadir otro orquestador. No resuelve por sí solo semántica, legibilidad ni conflictos de estado |
| [D3 zoom](https://github.com/d3/d3-zoom/blob/main/README.md) | Pan/zoom sobre SVG, HTML o Canvas | Utilizar geometría/escalas y foco de tramo cuando aporte lectura. Para dos vistas fijas 0–10/0–50Y puede bastar una transformación controlada, sin instalar zoom libre |
| [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) | Transiciones de vistas/estados DOM, dentro y entre documentos | Posible recurso de navegación externa; no añadirlo como segundo motor a los mismos objetos del deck. Validar compatibilidad en el perfil de navegadores elegido |
| [Remotion](https://github.com/remotion-dev/remotion/blob/main/packages/docs/docs/animating-properties.mdx) | Animación derivada del frame; documentación advierte de flicker con animaciones ajenas a ese reloj | Adaptador futuro para vídeo reproducible; compartir el modelo y las visuales, no prometer compatibilidad directa de efectos GSAP |
| [Three.js WebGPURenderer](https://threejs.org/manual/en/webgpurenderer.html) | WebGPU, respaldo WebGL2, materiales TSL; el manual señala estado experimental y posibles carencias/rendimiento diferente | Reservar a representaciones con una tercera dimensión necesaria. La curva actual de 30 puntos no lo necesita; exigir alternativa 2D y presupuesto de rendimiento |
| [Rive state machines](https://rive.app/docs/runtimes/state-machines) | Control lógico de animaciones interactivas dentro de un archivo Rive | Opcional para un objeto ilustrado diseñado con ese flujo; no sustituye al cálculo, la tipografía matemática ni el gráfico financiero |

Motion, varios módulos D3 y Zod figuran en package.json, pero no se encontraron imports directos de ellos en `presentation/src`. No confundir dependencias instaladas con capacidades utilizadas. Revisar su necesidad durante la extracción; esta fase no cambia el lockfile.

## Cómo juzgaremos la mejora

- **Comprensión:** el observador explica qué cambia y qué se conserva. Validación específica de r_t/y/g, contrato/precio y bono/punto/curva. La comprensión de una persona nueva sigue sin medirse.
- **Integridad visual:** estados clave legibles en escritorio y móvil; evaluación de escenas densas y transiciones de riesgo, con evidencia del commit exacto.
- **Integridad temporal:** números y geometría coherentes en cambios de tasa, movimiento reversible e interrupciones; capturas muestreadas no equivalen a todos los frames.
- **Rendimiento:** medir en un equipo objetivo y Safari iOS real antes de fijar presupuestos. Objetivo orientativo 60 fps durante motion en escritorio; no es una medida conseguida ni se garantiza desde el navegador remoto.
- **Reutilización:** segundo deck sin modificar el núcleo, mismas pruebas y empaquetado, sin supuestos financieros escondidos.
- **Producción:** ensayo real con voz y cámara; registrar qué ve el espectador y qué ve el ponente. No confundir vista limpia con un sistema completo de producción.

## Decisiones que conviene discutir

Recomendación de orden: Fase 0 → secuencia 05–07 → extracción del núcleo → segundo deck → herramientas de producción. La segunda secuencia 10–11 puede servir para comprobar la generalización de gráficos.

La elección que más cambia prioridades es el **uso principal: exposición/grabación guiada por ti o exploración autónoma por el espectador**. Por el contexto actual, la propuesta prioriza exposición y grabación; conserva interactividad y lectura móvil como capacidades del mismo producto. Confirmar esta prioridad en conversación antes de iniciar implementación.
