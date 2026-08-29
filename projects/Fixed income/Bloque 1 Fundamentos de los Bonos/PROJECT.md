# Bonds — proyecto didáctico

## Objetivo

Construir una explicación visual progresiva de bonos que parta de la intuición económica, pase por la anatomía del instrumento y llegue a valoración, yield, funcionamiento de mercado y curva de tipos.

El espectador debe poder seguir cada idea sin conocimientos avanzados y sin leer una slide saturada. La narración oral y la imagen se complementan; la imagen no debe intentar contener todo el discurso.

## Ejemplo canónico

Mientras no se decida lo contrario, reutilizar el mismo bono para mantener continuidad:

- vencimiento: **5 años**;
- cupón: **4% anual**;
- frecuencia: **anual**;
- notional: **100 €**;
- face value / valor nominal: **100 €**;
- precio observado hoy: **100 €**.

Consecuencias del ejemplo:

- pago de cupón anual = `4% × 100 € = 4 €`;
- años 1–4: flujo al inversor = `4 €`;
- año 5: flujo al inversor = `4 € + 100 € = 104 €`;
- desembolso inicial desde la perspectiva del inversor = `-100 €`.

En este ejemplo notional y face value coinciden en 100 €. Se mantienen ambos nombres porque cumplen funciones conceptuales distintas: el notional sirve como base del cupón y el face value es el principal que se devuelve al vencimiento.

## Arquitectura pedagógica aprobada

El bloque se organiza en cuatro microbloques:

1. **Qué es un bono** — slides 1–2.
2. **Cómo se valora un bono** — slides 3–4.
3. **YTM vs CAGR** — slides 5–6.
4. **Del bono a la curva de tipos** — slides 7–9.

La estructura completa, en orden físico del deck, es:

1. `01-block-cover.md` — **Bloque 1 — Fundamentos de los bonos**.
2. `02-table-of-contents.md` — **Recorrido del bloque**.
3. `03-what-is-a-bond.md` — **¿Qué es un bono?**.
4. `04-bond-anatomy.md` — **Anatomía de un bono a través de un ejemplo**.
5. `05-discounting-theory.md` — **Descuento de flujos — teoría**.
6. `06-discounting-example.md` — **Descuento de flujos — ejemplo**.
7. `07-ytm-vs-cagr.md` — **YTM vs CAGR**.
8. `08-same-ytm-different-cagr.md` — **Mismo YTM, distinto CAGR**.
9. `09-why-many-bonds-same-tenor.md` — **¿Por qué hay varios bonos en un mismo tenor?**.
10. `10-coupon-price-ytm.md` — **Del cupón al precio, y del precio al YTM**.
11. `11-yield-curve.md` — **La curva de tipos**.
12. `12-recap-miniblocks-1-2.md` — **Repaso final · Microbloques 1 y 2**.
13. `13-recap-miniblocks-3-4.md` — **Repaso final · Microbloques 3 y 4**.

**Convención:** los prefijos `01`–`13` reflejan el orden físico real de los artefactos del deck. Las menciones a slides 1–9 dentro de la narrativa pedagógica identifican las nueve slides docentes de contenido, excluyendo portada, índice y los dos repasos. No existen portadas intermedias de microbloque.

**Estado canónico:** 13/13 artefactos visuales aprobados. Cada artefacto tiene una especificación en `slides/`, un PNG original en `references/`, una descripción visual detallada y apuntes de impartición.

## Contrato documental de cada diapositiva

La especificación escrita debe permitir reconstruir al menos el 90% de la intención docente aunque la imagen no esté disponible. Cada ficha debe conservar:

1. **Propósito didáctico:** la única idea nueva que incorpora la slide.
2. **Contenido y datos:** textos, magnitudes y relaciones que no pueden cambiar.
3. **Descripción visual detallada:** jerarquía, composición, posición, iconografía, color y conexiones.
4. **Apuntes de impartición:** orden recomendado de explicación y razonamiento verbal que completa la imagen.
5. **Fórmulas y cálculos:** variables definidas, sustitución numérica y resultado cuando corresponda.
6. **Insights y contexto:** interpretación económica, alcance del ejemplo y relación con el mercado real.
7. **Aclaraciones:** diferencias terminológicas y supuestos que la imagen puede ocultar.
8. **Pregunta o transición:** comprobación de comprensión y enlace con la siguiente slide.

La imagen es la referencia canónica de composición. El Markdown es la referencia canónica de significado, explicación y matices. Si existe tensión entre ambos, no se modifica silenciosamente ninguno: se documenta y se resuelve de forma explícita.

## Recorrido de impartición

- **Artefactos 01–02:** presentan la pregunta central y el mapa `contrato → flujos → descuento → precio → rendimiento → curva`.
- **Slides docentes 1–2 / artefactos 03–04:** definen el bono y convierten el contrato en la secuencia `−100, 4, 4, 4, 4, 104`.
- **Slides docentes 3–4 / artefactos 05–06:** convierten los flujos futuros en valor presente, primero de forma general y después mediante sustitución numérica.
- **Slides docentes 5–6 / artefactos 07–08:** distinguen la TIR contractual de la riqueza terminal bajo una hipótesis de reinversión y aíslan el efecto del cupón.
- **Slides docentes 7–9 / artefactos 09–11:** explican la coexistencia de emisiones, el ajuste del precio y la formación de una curva de YTM observada.
- **Artefactos 12–13:** verifican que el alumno puede reconstruir toda la cadena conceptual y sus fórmulas esenciales.

## Slide 05 — YTM vs CAGR

Comparar dos formas de resumir la rentabilidad del bono canónico:

- **YTM = 4.00%**: tasa interna que iguala precio y valor presente de los flujos bajo la convención de reinversión de cupones al mismo rendimiento;
- **CAGR sin reinversión = 3.71%**: anualización de la riqueza terminal si los cupones cobrados se mantienen aparte al 0% hasta vencimiento.

La diferencia entre ambas métricas debe explicarse como diferencia de hipótesis sobre los cupones, no como error de cálculo.

## Slide 06 — Mismo YTM, distinto CAGR

Tres bonos a 5 años, face value 100 €, pagos anuales y YTM común del 4%:

- cupón 8% → precio 117.81 € → CAGR sin reinversión 3.51%;
- cupón 1% → precio 86.64 € → CAGR sin reinversión 3.92%;
- cupón 0% → precio 82.19 € → CAGR sin reinversión 4.00%.

Mensaje central: **el mismo YTM no implica el mismo rendimiento compuesto realizado si no se reinvierten los cupones**. Cuanto mayor es el cupón, mayor es la relevancia de la reinversión intermedia; en el cupón cero no existe esa reinversión y YTM y CAGR coinciden.

## Slide 07 — ¿Por qué hay varios bonos en un mismo tenor?

Usar España como ejemplo para separar dos ideas que no deben mezclarse todavía:

- una referencia benchmark nace con vencimiento original y cupón fijado;
- el paso del tiempo reduce su vida residual;
- mientras tanto aparecen nuevas referencias y se reabren referencias existentes;
- emisiones de distintas generaciones pueden acabar conviviendo alrededor de una misma zona de tenor, por ejemplo ~5Y, con cupones diferentes.

La slide 07 explica **por qué existen varios bonos cercanos en tenor**. No explicar todavía el ajuste de sus precios.

## Slide 08 — Del cupón al precio, y del precio al YTM

Una vez existen varios bonos cercanos en tenor, introducir el mecanismo de mercado:

- el cupón y los cash flows son contractuales;
- el precio sí cambia;
- el precio se ajusta para que los YTM de bonos comparables queden alrededor del nivel exigido por el mercado en esa zona de la curva;
- cupón alto respecto al nivel de mercado → prima;
- cupón próximo → par;
- cupón bajo → descuento;
- con precio y cash flows conocidos puede inferirse el YTM.

La slide introduce visualmente una nube de bonos y una curva fair, pero sin desarrollarlas todavía.

## Slide 09 — La curva de tipos

Convertir la curva en protagonista:

- cada punto = bono observado con vencimiento residual y YTM;
- la línea = curva fair ajustada sobre la nube;
- benchmark = referencia más líquida y seguida en un tenor;
- benchmarks mostrados: 2Y, 3Y, 5Y, 7Y, 10Y, 15Y, 30Y y 50Y;
- para esta explicación pedagógica, **0–2Y = corto plazo** y **>2Y = largo plazo**;
- la nube tiene mayor densidad en 0–10Y y menor densidad progresivamente hacia 50Y.

Mensaje central: **la curva de tipos resume cuánto rendimiento exige el mercado según el plazo y ordena muchos bonos individuales en una estructura común.**

## Convenciones matemáticas actuales

- Slides 03–04 presentan primero la valoración general usando `r_t`, tasa aplicable al flujo de cada periodo.
- Slides 05–08 introducen el caso de una única tasa interna `y` / YTM aplicada a todos los flujos.
- No confundir **coupon rate** con **coupon payment**.
- En vencimiento el numerador contiene cupón más devolución de principal; antes del vencimiento contiene solo el cupón.
- `CAGR sin reinversión` significa en este proyecto la anualización de la riqueza terminal cuando los cupones se mantienen en efectivo al 0%; no es la TIR estándar del bono.
- Las cifras de mercado institucionales deben apoyarse en fuente oficial actualizada; los ISIN, cupones o fechas inventados dentro de una referencia visual son únicamente ilustrativos.

## Regla narrativa

Cada slide de contenido debe añadir una sola pieza conceptual nueva y conservar lo ya aprendido. No se intercalan portadas de microbloque: los cambios de tema se expresan mediante la transición oral documentada al final de cada ficha. Los dos repasos aparecen únicamente al final del bloque, no después de cada microbloque.
