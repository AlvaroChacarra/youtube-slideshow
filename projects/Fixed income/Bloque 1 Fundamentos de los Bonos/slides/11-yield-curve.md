# Slide 09 — La curva de tipos

## Estado

**Aprobada / fijada.** La composición elegida es la opción 1 de la última iteración, corregida para que el corto plazo sea exactamente 0–2Y.

## Propósito

Fijar qué es una curva de tipos, cómo se lee y qué papel cumplen los bonos benchmark.

## Definiciones visuales

- **Cada punto** = un bono observado con su vencimiento residual y su YTM.
- **La línea** = curva fair ajustada sobre la nube de bonos.
- **Benchmark** = referencia más líquida y seguida en un tenor concreto.
- **Eje X** = vencimiento / vida residual.
- **Eje Y** = YTM.

## Segmentación aprobada

Para esta explicación pedagógica:

- **0–2Y = corto plazo**;
- **>2Y = largo plazo**.

La separación visual debe ocurrir exactamente en 2Y. No extender el sombreado de corto plazo más allá de ese punto.

## Benchmarks típicos que se muestran

2Y · 3Y · 5Y · 7Y · 10Y · 15Y · 30Y · 50Y.

No implica que sean los únicos plazos emitidos ni que exista una referencia permanente e inmutable en cada punto; representan hitos habituales de la curva soberana.

## Mensaje central

**La curva de tipos convierte muchos bonos individuales en una visión ordenada del rendimiento exigido por el mercado según el plazo.**

Los benchmarks funcionan como anclajes líquidos, mientras que la curva fair resume el conjunto de observaciones.

## Composición aprobada

- Cabecera con bandera española y “España · Bonos y Obligaciones del Estado”.
- Columna izquierda con cuatro definiciones compactas: punto, línea, benchmark y benchmarks típicos.
- Gráfico grande como protagonista.
- Nube de aproximadamente 30 bonos, concentrada principalmente entre 0–10Y y progresivamente más escasa hasta 50Y.
- Curva fair suave sobre la nube.
- Sombreado corto plazo únicamente 0–2Y; resto etiquetado largo plazo >2Y.

## Referencia

`../references/11-yield-curve.png`

## Descripción visual detallada

La cabecera combina una cápsula con bandera española, el título central `La curva de tipos` en serif blanca y el subtítulo `El mapa de rendimientos por plazo`. Un círculo con el número `9` ocupa la esquina superior izquierda. La retícula principal reserva una columna estrecha para definiciones y aproximadamente tres cuartas partes del ancho para el gráfico.

La columna izquierda contiene cuatro tarjetas numeradas. La primera representa mediante puntos que cada observación es un bono; la segunda usa una línea curva para definir la curva fair; la tercera utiliza una estrella para identificar un benchmark; la cuarta, con icono de calendario, enumera los vencimientos benchmark habituales. Cada tarjeta mantiene la misma jerarquía: número circular, símbolo visual y término clave en cyan seguido de su explicación en blanco.

El gráfico principal muestra YTM en el eje vertical y vencimiento desde 0Y hasta 50Y en el horizontal. Una nube densa de bonos se concentra en los primeros diez años y se vuelve más dispersa en los plazos largos. Una línea cyan suave recorre la nube como ajuste fair. La zona `0–2Y` está sombreada y delimitada exactamente en 2Y bajo la etiqueta `Corto plazo`; el resto se identifica como `Largo plazo >2Y`. Estrellas alineadas junto al eje inferior marcan 2Y, 3Y, 5Y, 7Y, 10Y, 15Y, 30Y y 50Y. Una banda final con estrella resume que la curva transforma bonos individuales en una visión ordenada del coste de financiación por plazo.

## Apuntes de impartición

### Guion sugerido
1. Leer primero un punto: coordenada horizontal igual a vida residual; coordenada vertical igual a YTM observada a partir de precio y cash flows.
2. Leer después la nube. La dispersión muestra que bonos cercanos en plazo no son idénticos y que el mercado contiene más información que una única línea.
3. Introducir la curva fair como resumen suave del nivel de rendimiento por vencimiento. La línea reduce ruido y permite interpolar entre referencias líquidas.
4. Señalar los benchmarks como anclajes de mercado especialmente líquidos. Aclarar que la condición de benchmark puede cambiar cuando se emite una referencia nueva.
5. Recorrer 0–2Y y >2Y solo como segmentación pedagógica de esta slide, no como definición universal de corto y largo plazo.

### Lectura económica
- Una curva ascendente indica, descriptivamente, mayores rendimientos a plazos largos que cortos. No atribuirla a una única causa: puede combinar expectativas de tipos, prima por plazo, inflación, oferta, demanda y riesgo.
- Una curva plana o invertida cambia la relación entre tramos, pero no altera el significado de ejes y puntos.
- La densidad mayor en 0–10Y refleja el ejemplo visual; no debe presentarse como censo exacto del mercado español.

### Precisión técnica
Esta lámina muestra una **curva de YTM de bonos observados**. No equipararla sin matices a una curva cero cupón o spot utilizada para descontar cada flujo. Para construir una curva de descuento se requiere seleccionar instrumentos, ajustar convenciones y, habitualmente, aplicar bootstrapping o un modelo de ajuste. Esa distinción rellena el hueco entre la fórmula con `rₜ` de las slides 3–4 y la nube de YTM de esta slide.

### Preguntas de control y cierre
Preguntar qué representa un punto, qué representa la línea y por qué ambos son necesarios. Preguntar también si dos bonos 5Y deben tener exactamente el mismo YTM. Cerrar: «La curva no sustituye a los bonos; organiza la información que contienen».

## Implementación web — 2026-09-05

Candidata desarrollada a petición del usuario; la aprobación de la referencia original no se transfiere automáticamente a este render.

30 observaciones ilustrativas, 20 hasta10Y, incluidos los ocho benchmarks exactos. Eje lineal0–50Y, corto plazo hasta2Yexacto, selección accesible de punto. Ajuste por mínimos cuadrados con base[1,exp(−t/5),t/50]; sustituye el cúbico del runtime por su desviación en el extremo largo. Sigue siendo una curva de YTM, no spot.

Render implementado: [Slide 11](../../../../presentation/evidence/final/slide-11.jpg). Referencia PNG anterior conservada como baseline.

Segunda revisión visual: jerarquía y contexto separados, relaciones y cambios de ejemplo explícitos; consultar `presentation/AUDIT.md` para hallazgos, correcciones y límites. Las capturas enlazadas corresponden a esta revisión.
