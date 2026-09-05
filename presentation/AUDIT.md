# Auditoría — Fundamentos de los bonos

**Estado vigente:** entrega anterior fusionada en `main@31d0687` por autorización del usuario. La [tercera auditoría](#tercera-auditoria-evolucion), posterior al merge, identifica correcciones y oportunidades para el nuevo objetivo de profesionalización. Las dos primeras secciones de revisión conservan su alcance histórico.

## Veredicto y alcance — primera revisión histórica

**`ready_for_user_review` para las composiciones estáticas de escritorio.** El revisor perceptual independiente no encontró hallazgos bloqueantes ni mayores en los estados finales de las trece slides a 1280 × 720. Observó mejoras de jerarquía, limpieza y representación temporal frente a las referencias PNG históricas.

Este veredicto no constituye aprobación del usuario ni acredita todas las transiciones. La integración funcional observada se registra por separado al final. No se ha realizado una auditoría frame a frame ni una prueba de apertura mediante `file://`.

La candidatura cubre el Bloque 1 actual: **13 slides y 43 estados de explicación**. Las referencias aprobadas históricas y sus fichas siguen en `projects/Fixed income/Bloque 1 Fundamentos de los Bonos/`; los nuevos renders son una candidatura para revisión, no una sustitución implícitamente aprobada.

## Evidencia disponible

| Comprobación | Resultado registrado | Alcance |
|---|---|---|
| Compilación actual | 0 errores, 0 warnings y 0 hints | Build y comprobación de tipos; no demuestra funcionamiento de cada interacción |
| Tests | 12 tests pasan | Dominio financiero y modelo de presentación |
| Recorrido | 43 estados de 13 slides comprobados unitariamente | Avance, reversibilidad, extremos y normalización de posiciones; no equivale a recorrer todos los estados en navegador |
| Revisión perceptual independiente | `ready_for_user_review`, sin bloqueantes ni mayores | Estados finales estáticos de escritorio |
| Integración en navegador | Recorrido e interacciones representativas completados | Avance, extremos, índice, tasas, selección, reinicio, ayudas, vista limpia y móvil; detalle al final |
| HTML local mediante `file://` | No probado en navegador | La generación del archivo único no acredita su apertura en todos los visores |

Las capturas individuales se encuentran en `evidence/final/slide-01.jpg` a `evidence/final/slide-13.jpg`; `evidence/final/all-13-slides.jpg` permite compararlas conjuntamente. Corresponden a estados finales y no documentan los 43 estados ni los fotogramas intermedios del motion.

El encuadre de captura de escritorio usa un viewport externo de **1363 × 936** que aloja la presentación interna de **1280 × 720**. No deben confundirse ambas dimensiones al interpretar las capturas.

También se contemplan pantallas móviles de **390 × 844** y **844 × 390**. En móvil se muestra una slide a la vez, con scroll dentro del recorrido de lectura y controles de navegación; no se pretende encajar toda composición horizontal en una sola pantalla sin desplazamiento. Las capturas móviles conservadas en `evidence/final/` son `mobile-03.jpg`, `mobile-04-bottom.jpg`, `mobile-05.jpg`, `mobile-08.jpg`, `mobile-11.jpg` y `landscape-07.jpg`. El veredicto independiente citado arriba se limita al conjunto estático de escritorio; los resultados funcionales móviles deben constar en el registro de integración.

## Hallazgos corregidos y comprobaciones financieras

- Se corrigieron las fórmulas de las slides 05 y 12 y el solape detectado en la slide 05. La revisión final se refiere a las capturas posteriores a esas correcciones.
- El descuento mantiene los cinco pagos contractuales. El control de `r₅` altera solo el valor presente del último pago; las otras cuatro tasas permanecen al 4%. Esta separación se comprueba unitariamente.
- La reinversión modifica riqueza terminal y CAGR sin alterar precio ni flujos contractuales del caso. Reinvertir al 4% reproduce un CAGR del 4% bajo los supuestos docentes.
- Los casos de cupones 8%, 1% y 0%, y los casos de precio para cupones 7%, 4% y 3%, se calculan con precisión completa y se contrastan con los resultados esperados.
- La nube es ilustrativa, no contiene cotizaciones. Los tests comprueban ocho observaciones benchmark en 2, 3, 5, 7, 10, 15, 30 y 50 años y acotan la desviación del ajuste en el extremo largo. Es una curva de YTM; no proporciona una curva spot de descuento.

## Diferencias comprobadas respecto al runtime anterior

La comparación de código se realizó contra `origin/course/bonds-foundations-runtime-v1`, cuya revisión inspeccionada fue `cf0d9ad8c869864aae8de266f700bd095457d834`. Ese runtime se organizaba en cuatro lecciones sobre el manifiesto anterior de 17 artefactos. La fuente actual del Bloque 1 contiene 13 PNG y 13 fichas; por tanto, 13 frente a 17 expresa alineación con la fuente actual, no una medida de mayor cobertura por sí sola.

| Aspecto | Runtime anterior | Candidatura actual y efecto verificable |
|---|---|---|
| Recorrido | Cuatro lecciones, escenas y perfiles de entrega | `content.ts` enumera las 13 slides actuales con pasos, notas, pregunta y respuesta propios; el índice permite recorrer directamente el deck |
| Financiación | `FinancingMap` presenta dos artículos, inversores/emisor, con flechas textuales | `Foundations.tsx` representa Estado, empresa, inversores, usos del capital y conectores SVG alrededor del certificado; recupera actores y relaciones espaciales de la referencia mediante elementos editables |
| Continuidad | El contenedor usa una clave `escena:stage` que remonta `SceneFrame` en cada etapa | `BondActor` y `CashflowSpine` permanecen montados fuera del cambio de slide; GSAP transforma su geometría. La continuidad implementada se concentra en financiación, anatomía y descuento, no en todo el deck |
| Descuento | `FormulaBuilder` alterna expresión, leyenda y precio agregado | `DiscountExample` muestra cada fracción, tasa y PV; seleccionar un flujo resalta su término y el control de `r₅` aísla una contribución |
| Comparación de cupones | `CouponComparison` escribe precios, riquezas y CAGR como literales | `couponCase` calcula los casos; la representación permite revelar flujos, descuento, acumulación y anualización por pasos |
| Móvil y ayudas | A ≤900 px se fuerza estudio, con las escenas en su último estado; la guía docente requiere perfil aula, `profe=1` y escritorio | Se conserva la navegación slide/paso en móvil. Notas, pregunta y glosario están disponibles desde los controles normales, sin cambiar de perfil |

El runtime anterior ya tenía funciones financieras, interactividad, teclado, deep links, capture y KaTeX. No se presentan esas capacidades como novedades absolutas. Las diferencias anteriores acreditan estructura y comportamiento implementado; la calidad percibida de las animaciones necesita inspección temporal adicional.

## Límites de la conclusión

- La revisión independiente cubre composiciones estáticas; no todos los pasos, tamaños de ventana, interacciones ni fotogramas intermedios.
- Las capturas aceptadas sirven como evidencia de esta candidatura. Una regresión visual contra ellas no probaría por sí sola excelencia estética ni fidelidad a todas las referencias.
- Los tests financieros y de navegación no sustituyen pruebas de integración, una sesión de impartición ni un ensayo de grabación.
- No consta aprobación humana de esta dirección visual ni autorización de publicación derivada de esta auditoría.

## Integración observada en navegador

**Resultado: funcional en las comprobaciones realizadas, sin defectos materiales abiertos.**

- Código validado: `9b7b8798f971b1f3e2207b811ed36892648d85ec`. Árbol de fuentes `presentation/src`: `fa1463b7e2a297f27c3cd5b3d74fceedbf8dbdba`. Los commits posteriores de documentación/evidencia no alteran estas fuentes.
- Navegador: Chrome del entorno de auditoría; versión de motor no consultada. Se sirvió el HTML autocontenido generado, mediante la ruta temporal `/qa/deck.html` del preview local. Esa ruta es de QA, no un despliegue para el usuario.
- Navegación: recorrido secuencial desde 01/0 hasta 13/2; extremo final desactiva avance, retroceso vuelve a 13/1 y Home retorna a 01/0 con retroceso desactivado. El recorrido automatizado se dividió tras un timeout del controlador; la presentación permaneció en 08/0 y se completó desde allí. No se interpreta ese timeout como defecto de aplicación.
- Índice: salto desde portada a 06 y recuperación del último paso visitado (3). Los enlaces directos se emplearon también para las trece capturas finales.
- Descuento: flecha derecha del slider cambia r₅ de 4% a 4,5% sin cambiar slide ni paso. Seleccionar flujo 2 activa su selección; reiniciar vuelve a paso 0, flujo 5 y tasa 4%.
- Reinversión: el control g alcanza 8% manteniendo slide 07/paso 3; conserva YTM 4% y contrato, y muestra riqueza 123,47 € y CAGR 4,31%.
- Precio: YTM exigida 8% mantiene slide 10/paso 3 y cupones 7/4/3%; precios observados 96,01 / 84,03 / 80,04 €, todos con descuento.
- Curva: Enter sobre el punto 50Y actualiza la lectura a ILL-30, 50,0 años y 3,68%. En móvil, el selector produce la misma lectura; reinicio restaura ILL-03 y paso 0.
- Notas y ayudas: apertura de notas, respuesta desplegable, cierre con Escape y apertura del concepto YTM/TIR en el glosario comprobadas. El diálogo recibe foco y limita los atajos del deck mientras está abierto.
- Vista limpia: entrada desde el control y salida mediante Escape comprobadas. `motion=0` produce `data-motion=false`; los escenarios numéricos anteriores se verificaron en ese modo. `prefers-reduced-motion` está implementado y revisado en código, pero no se simuló el ajuste nativo del sistema operativo.
- Movimiento: activación normal `data-motion=true` y transición anatomía 04/2→04/3→05/0 recorridas; se inspeccionó su composición resultante (`motion-04-flows.jpg`). No se certifica cada fotograma intermedio ni se ha renderizado vídeo.
- Móvil: 390×844 conserva una slide y pasos; 03 y 05 no presentan overflow horizontal (ancho del contenido igual al scrollWidth). En 11 se selecciona, se reinicia y se accede a controles mediante scroll; avanzar a 12 devuelve el inicio de la slide a top=0. Se inspeccionaron también anatomía y comparación de cupones; 844×390 conserva texto legible y lectura vertical, documentada en `landscape-07.jpg`.
- Consola: sin errores de aplicación en los registros consultados del recorrido. El controlador registró errores de su extensión Chrome al enviar metadatos, excluidos explícitamente del resultado de la aplicación.
- Empaquetado: un script inline, ninguna referencia externa en elementos de recursos ni en URLs CSS. El empaquetador usa solo la hoja referenciada por el build actual, evitando duplicar CSS de hashes obsoletos.

HTML entregado: **2.490.856 bytes**, SHA-256 `99ec579510247fe8c707cca9b08d0964ae4e53dcd856bf9075db491bf2b8d70b`. Se validó el mismo archivo servido por HTTP; la apertura mediante `file://` permanece **NO PROBADA**. Incluye aplicación, ilustración y fuentes para uso local, pero un visor que no ejecute JavaScript no puede reproducirlo.

## Segunda auditoría escrupulosa — 2026-09-05

El usuario pidió ampliar el alcance a continuidad temporal antes del push. La segunda revisión encontró problemas que el primer dictamen estático no había detectado. Esta sección prevalece sobre el estado anterior.

| Hallazgo | Corrección | Comprobación |
|---|---|---|
| Cajas de título y contexto se invadían 2,1 px en08; contexto≈10,6px | Cabecera a12% y contexto12,8px | Nuevo h1 termina164,97px; contexto comienza177,28px: separación12,31px a1280 |
| Etiqueta de descuento parecía referirse al certificado | «Valor equivalente hoy» junto aPV | Captura05 desktop y móvil |
| Fracciones06/08 y fórmulas13 demasiado pequeñas | Display de fracciones, ampliación y alineación de columnas | Renders06/08/13; se corrigió la regresión Vencimiento/104 desktop y móvil |
| A/B/C cambiaban de cupón entre ejemplos | Emisiones E1/E2/E3, nuevos ejemplos09/10 y nueva muestra11 explícitos | Capturas09–11; no se simula identidad entre contratos diferentes |
| Índice mezclaba numeración docente y física | Rangos rotulados «Temas» | Captura02 y saltos conservados |
| Cambio abrupto de etiquetas y corte de salidas | Intercambio de texto100/200ms, autoAlpha y salida180ms | Revisión de código, navegación normal y inversa |
| Los flujos desaparecían de06 y se recreaban en07 | Mismo CashflowSpine viaja a la timelineYTM; altura y tipos se interpolan | Destino medido enDOM, un raíl visible, captura07 y fotogramas06→07 |
| En tránsito06→07 el certificado y rail tapaban contenido entrante | El contenido espera720ms al asentamiento; después entra400ms | Fotogramas reales100/137/171/206ms y estado asentado; sin superposición con explicaciones nuevas |
| Una captura móvil08 estaba mal identificada | Se sustituye por render comprobado slide8/paso3 | Nueva mobile-08 muestra comparación, no portada |

Fuente final validada: árbol `presentation/src` **25c026ea7e44bff582ebfdca65f64003ddce7c95**. Último build: cero errores/warnings/hints y12tests pasan. HTML: **2.494.611 bytes**, SHA256 **3ef8323c23b502273251c9ba64b983fd9e7dd6891c989a53274a777a510182df**.

Revisor independiente con contexto limpio: las13composiciones desktop actuales no tienen defectos materiales abiertos; también revisó las nuevas zonas móviles05/08. La coordinación inspeccionó mobile06 corregida, comprobó navegación06↔07 con motion activo y capturó tiempos reales desde una salida estable. La continuidad geométrica se extiende hasta07 en escritorio; móvil conserva composición adaptada y la continuidad de valores. De08enadelante se relacionan composiciones y ejemplos explícitos, no se presenta como una transformación continua del mismo bono.

El cuerpo de la explicación entra después del viaje del objeto en03–07; en las otras escenas espera180ms. `motion=0` conserva aparición inmediata. Los fotogramas son muestras temporales, no una certificación de todos los frames o los43estados. Sigue sin probarse file:// en navegador. El intento de obtener el repo auxiliar de la skill fue rechazado automáticamente; no se presenta esta auditoría como cumplimiento completo de su contrato de vídeo/audio.

Las capturas individuales, el mosaico13y la comparativa antes/después se renovaron. `transition-contact.jpg` representa las muestras temporales finales; no utilizar versiones previas. Las capturas móviles históricas no incluidas en `evidence/final` no sirven como evidencia de esta entrega.


<a id="tercera-auditoria-evolucion"></a>
## Tercera auditoría — evolución del producto, 2026-09-05

### Conclusión

**ÁMBAR · `revision_required` respecto al nuevo objetivo.** La presentación es una buena base editorial para exposición guiada. Su estética es consistente y los casos financieros comprobados terminan en valores correctos. Se requiere mejorar lectura móvil, coherencia durante los cambios numéricos, continuidad entre los ejemplos de mercado y separación entre motor y contenido antes de escalar a otras presentaciones.

No se recomienda rehacer el producto ni añadir 3D por defecto. El siguiente incremento de valor está en hacer visible la causalidad con objetos identificables, facilitar el seguimiento de fórmulas y convertir los patrones probados en un núcleo reutilizable. Las propuestas y su orden viven en [WORK_PLAN.md](../WORK_PLAN.md).

### Base, método y límites

- Base remota verificada: `main@31d06877a9d5fe6ff0aba4a5eac3ff7dcb4d070a`; fuentes `presentation/src` = `25c026ea7e44bff582ebfdca65f64003ddce7c95`.
- Revisión nueva de los estados finales renderizados de las **13 slides**, además de código de escenas, dominio, controles, empaquetado, pruebas y fichas canónicas. Las capturas históricas de `evidence/final` pertenecen al mismo árbol de fuentes; sirven como referencia estable, no como prueba de todos los pasos.
- Escritorio: navegador Chrome del entorno, viewport 1363×936; la escena 16:9 se ajusta dentro. Móvil: viewport interno 390×844, contenido útil 375 px por la barra de scroll de Chrome; no equivale a Safari iOS ni a un dispositivo real.
- Móvil inspeccionado nuevamente: comparación 08 y curva 11, composición inicial, métricas de layout y operaciones de selección/ayudas/reset. No se completó una lectura visual de todas las posiciones de scroll de las 13 slides móviles.
- El harness móvil sirve el HTML autocontenido cuyo SHA-256 coincide con la entrega final: `3ef8323c23b502273251c9ba64b983fd9e7dd6891c989a53274a777a510182df`.
- `npm run validate`: 0 errores/advertencias/hints de tipos y **12 tests aprobados**. Son pruebas de dominio y modelo de navegación, no una suite visual ni de accesibilidad completa. No se recompiló la entrega por cambios funcionales: no hubo cambios funcionales.
- La nueva tentativa de recorrer todos los estados en una sola llamada de navegador agotó el tiempo del controlador y se interrumpió en 07/2. No se certifica un nuevo recorrido E2E completo. Las pruebas unitarias sí recorren los 43 estados y la auditoría anterior documenta un recorrido de navegador completo.
- El scroll automatizado genérico sobre el wrapper móvil también agotó el tiempo del controlador. La selección y las acciones por controles semánticos funcionaron. No se atribuyen esos errores del controlador a la aplicación.
- Auditoría realizada por el mismo agente coordinador con historial visible: **no es una nueva auditoría independiente ni un blind decode**. No hubo prueba de comprensión con un alumno, medición de fps, lector de pantalla, ensayo OBS, audio ni inspección de todos los fotogramas.
- Se leyeron mediante el conector los protocolos canónicos de `audita-y-mejora-video-grafico`: AUDITORIA_RENDER, SISTEMA_VISUAL, SISTEMA_MOTION_Y_RENDER, CONTRATOS_Y_ORQUESTACION y su schema. Se aplican criterios de composición, continuidad y rigor; el contrato de producción de vídeo de otro proyecto no se impone a esta presentación web. No se emite `pass_to_user` de un máster audiovisual inexistente.

### Inspección por slide y representación

| Slide | Valoración del output actual | Corrección o evolución que aporta valor |
|---|---|---|
| 01 · Portada | Foco claro, certificado reconocible y skyline subordinado. Anticipa contrato/flujos/curva con buen acabado | Conservar. El dibujo de curva es conceptual; evitar que se interprete como una cotización o como la misma serie cuantitativa de 11 |
| 02 · Índice | Cuatro perspectivas claras; composición uniforme y rangos docentes rotulados | Conservar. En un futuro deck, capítulos/rangos/iconos deben salir de su definición. Acrónimos adelantados aquí son un mapa, no una explicación ya impartida |
| 03 · Financiación | Dirección capital/pagos comprensible; emisor e inversor están separados; fondo no domina | Afinar conectores que quedan atenuados dentro del certificado; mantener la identidad del inversor al reaparecer en el repaso. No convertir el diagrama en un exhaustivo mapa de riesgos |
| 04 · Anatomía | Buena separación contrato/precio. Fórmula cupón-pago y cierre 104 coherentes | Mantener este nivel de causalidad como patrón. El bono persistente ayuda. Las correspondencias deben depender de anclas del objeto al generalizar, no de coordenadas del caso 5Y |
| 05 · Descuento teórico | Flujo seleccionado y término de PV conectados; fórmula general dominante y pagos simbólicos | Explicitar la correspondencia C_t/CF_t junto al uso. La selección del periodo intermedio representado por elipsis necesita semántica accesible equivalente. Recuperar concepto desde la fórmula sin abandonar el objeto |
| 06 · Descuento numérico | Pagos, fracciones y PV alineados; r₅ cambia solo la contribución del año 5 | Corregir coherencia temporal de números. Añadir ayuda de redondeo: los PV visibles 3,85+3,70+3,56+3,42+85,48 suman 100,01, mientras el total exacto redondeado es 100,00; no es un error de cálculo |
| 07 · YTM/CAGR | Simetría útil, caso base explícito, resultados dominantes y control g funcional | Visualizar qué ocurre con cada cupón hasta T. Ahora crece el contador y cambia una fórmula; la acumulación no se sigue como movimiento económico. Definir k o reutilizar t al introducir la suma de reinversión |
| 08 · Tres cupones | En desktop la alineación permite comparar condiciones y resultado. Las tres columnas tienen sentido por ser una comparación real | Reducir escaneo para el razonamiento: foco por etapa y comparación final. En móvil las columnas apiladas separan los resultados; resumen comparativo común y detalle bajo demanda |
| 09 · Emisiones | Calendario relativo coherente: 10 años originales, edades distintas y residuales 4,8/5,2/5,6; cupones fijos e IDs E1/E2/E3 | El paso del tiempo se revela mediante barras, pero no se experimenta cómo cambia el residual. Puede animarse el reloj/fecha conservando emisión y vencimiento, si no añade datos irrelevantes |
| 10 · Precio | Misma escala de barras y marca de par; control modifica precios y estados prima/par/descuento, conservando cupón | El cierre declara (5Y, y) en texto, todavía no traslada un objeto al gráfico. Convertir ese paso en un vínculo visual identificable. Los tres casos al mismo yield coinciden en coordenadas; no fingir una nube distinta |
| 11 · Curva | Datos ilustrativos rotulados, ejes correctos, punto y guías, línea y benchmarks distinguibles. Desktop funciona como mapa general | 20/30 observaciones están en el primer 20% del eje. Añadir foco 0–10Y y contexto 0–50Y sin deformar la escala. Móvil necesita otra geometría: leyenda 8 px y círculos de ~3,82 px hacen débil la lectura/manipulación directa |
| 12 · Repaso 1–2 | Recupera contrato, pagos y fórmula; cierre lógico | El inversor usa icono de documento mientras en 03 era un grupo de personas. Recuperar el mismo símbolo para no confundir actor con contrato. Mantener operaciones auxiliares grandes o desplegables |
| 13 · Repaso 3–4 | Recoge las distinciones correctas y finaliza el mapa conceptual | La minicurva es otro path con seis puntos, ascendente, distinto del ajuste de 11 con extremo largo casi plano/descendente. Reutilizar los datos de 11 o identificar visualmente que es un esquema. Tipografía matemática secundaria mejorable para proyección |

Las valoraciones de acabado son juicio perceptual del auditor. Las métricas y hechos descritos a continuación son verificaciones de DOM/código; no se convierte el juicio estético en una puntuación aparentemente objetiva.

### Hallazgos priorizados

**A01 · major · coherencia temporal.** En 07, desde un estado estable g=8%, al volver a g=0 el encabezado ya decía «sin reinversión» y la fórmula usaba 120, mientras las cifras visibles aún eran **122,36 € y 4,12%**. En el cambio 0→8 se observó también etiqueta 8% con cifras anteriores. `NumberValue` interpola valores durante 450 ms; fórmulas y etiquetas reciben inmediatamente el nuevo escenario. El resultado asentado es correcto. Corrección propuesta: cifras financieras atómicas y animación de énfasis; si se anima el escenario, tasa/cálculo/gráfico deben derivarse de un único progreso compartido. Evidencia DOM registrada en `evidence/evolution/audit-report.json`. No se ha medido la duración exacta del desacople percibido; 450 ms es la duración de código, no una medida de vídeo.

**A02 · major · legibilidad y selección de la curva móvil.** En 390×844 el plot mide 331 px para un viewBox de 780; los puntos normales miden 3,82 px y la leyenda tiene `font-size:8px`. Los ticks declaran 18 unidades SVG, pero sus cajas renderizadas miden 10 px de alto. El selector nativo sí permite llegar a ILL-30 y leer 50Y/3,68%; esa alternativa no vuelve legible el gráfico. Corrección propuesta: calcular dimensiones y tipografía para el ancho de destino, área de selección mayor y foco/contexto con controles explícitos. No se declara incumplimiento WCAG solo por medir el círculo: hay una alternativa de control y no se realizó auditoría normativa completa.

**A03 · major para comparación móvil · carga de memoria.** La slide 08 ocupa 2117 px de alto. Los tres casos comienzan en y=268/851/1434: a 844 px de alto, los resultados no se comparan de un vistazo. No hay overflow horizontal. Es una limitación de la representación adaptada, no un fallo de cálculo. Propuesta: matriz compacta de resultados comunes más desglose opcional, conservando el objetivo comparativo.

**A04 · oportunidad alta · continuidad de mercado.** 08 compara A/B/C a 8/1/0%; 09 usa E1/E2/E3; 10 vuelve a A/B/C a 7/4/3%; 11 cambia a ILL y a otra nube. Los cambios están señalados y no son un error financiero, pero no existe un objeto que una visualmente 10 con 11. La frase de 04 «un mismo bono durante todo el bloque» es más amplia que la implementación. Propuesta: IDs de escenario inequívocos, puente desde un contrato hasta su coordenada y expansión explícita a otra muestra. La continuidad debe respetar los contratos, no homogeneizarlos artificialmente.

**A05 · minor · fidelidad visual y notación.** 12 cambia el símbolo del inversor; 13 usa un gráfico manual distinto; las fórmulas usan puntos decimales y las cifras grandes comas; C_t/CF_t y el nuevo índice k de reinversión no se enlazan visualmente. Recuperar representaciones y definiciones; unificar la convención de formato. La redondez visual no debe borrar supuestos.

**A06 · major para continuidad documental · fuentes contradictorias.** El PROJECT del bloque y la lista inicial de la ficha 13 aún afirmaban que YTM presupone reinversión, mientras la ficha 07, el código y sus notas separan cálculo de YTM y realización del retorno compuesto. El PROJECT general decía slides 01–09 «en desarrollo avanzado» pese al merge de las 13. La documentación se reconcilia en esta propuesta; el programa no se modifica. Los apartados históricos de las fichas describen las PNG originales y no deben confundirse con la web fusionada.

**A07 · oportunidad alta · apoyo al ponente/espectador.** El glosario general funciona, pero no conoce el concepto seleccionado ni su primera explicación. Notas y respuesta abren un diálogo dentro de la misma salida que verá la audiencia. No es un defecto respecto al alcance anterior; para grabación profesional interesa separar vista del ponente y ayudas breves al público. Las notas de la vista actual no deben usarse como si estuvieran ocultas a OBS.

**A08 · major para reutilización · arquitectura especializada.** `Presentation.tsx` conoce las 13 escenas, nombres, marca, tasas y casos; `End` contiene el índice 12; `BondActor` y `CashflowSpine` reciben índices para decidir geometría; `MiniFlows` contiene cinco periodos, principal 100 y precio inicial −100. El empaquetador contiene nombre, título y asset de este deck. No son primitivas universales. El dominio financiero puro, el formato de contenido, los controles y varios componentes son buenos candidatos para extracción gradual. No está justificado empezar otra reescritura completa.

**A09 · major para escalar · validación y mantenibilidad.** Hay 12 tests de dominio/navegación y herramientas de QA instaladas, pero no tests de navegador versionados ni workflow CI en main. Las dos hojas de estilos suman ~57 KB de texto fuente, con reglas largas y overrides sucesivos; parte de TSX también está comprimida en líneas grandes. La entrega funciona, pero localizar la autoridad de un layout y protegerla frente a otro deck exige trabajo. Propuesta: CSS por responsabilidad, código formateado, pruebas de UI/materiales de riesgo y referencias visuales asociadas a commit. La ausencia de imports de Motion/D3/Zod en `presentation/src` no demuestra que todo su código se envíe al navegador; eso requeriría analizar el bundle.

### Interacciones comprobadas de nuevo

| Caso | Resultado observado |
|---|---|
| 06 · r₅ de 4% a 10% con End del slider | Primeros cuatro PV no cambian; último 64,58 €, total 79,10 €; flujos 4/4/4/4/104 constantes; no navega de slide |
| 06 · reinicio | Vuelve al paso 0 |
| 07 · g=8% | YTM sigue 4%, riqueza asentada 123,47 €, CAGR 4,31%; la fórmula de reinversión se muestra |
| 07 · cambio rápido de g | Desacople transitorio confirmado entre escenario/copy/fórmula y cifras animadas (A01) |
| 10 · YTM exigida=8% | Cupones 7/4/3% fijos; precios 96,01/84,03/80,04 €, todos con descuento |
| 11 móvil · selector ILL-30 | Lectura 50,0 años y YTM 3,68% |
| 11 móvil · notas y respuesta | Pregunta YTM/spot; respuesta desplegada; cierre disponible |
| 11 móvil · reinicio | Restaura paso 0 y selección ILL-03 |

### Revisión de tecnologías y objetivo de aprendizaje

Fuentes, capacidades verificadas, restricciones y recomendación están en [WORK_PLAN.md](../WORK_PLAN.md#tecnologias-contrastadas). Se consultaron GSAP Flip, View Transition API, Three.js WebGPU, Rive y documentación oficial de D3/Remotion. No se confunde una lista de herramientas instaladas con funcionalidades realizadas.

La cadena contrato→flujos→valor→rendimiento→mercado es correcta. El gap pedagógico principal es perceptual: 07 introduce una fórmula de acumulación sin seguir cada cupón; 10→11 enuncia coordenadas sin conservar el objeto de origen; 08 móvil requiere comparar mediante memoria. La hipótesis a validar con una persona nueva es que seguir una contribución concreta y conservar contexto reduce esos saltos. **Aún no hay evidencia de un test de aprendizaje.**

Evidencia adicional de esta revisión: [informe estructurado](evidence/evolution/audit-report.json), [comparación móvil](evidence/evolution/mobile-08-top.jpg), [curva móvil](evidence/evolution/mobile-11.jpg).
