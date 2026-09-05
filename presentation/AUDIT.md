# Auditoría — Fundamentos de los bonos

## Veredicto y alcance

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
