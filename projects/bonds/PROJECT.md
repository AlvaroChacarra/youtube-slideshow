# Bonds — proyecto didáctico

## Objetivo

Construir una explicación visual progresiva de bonos que parta de la intuición económica, pase por la anatomía del instrumento y llegue a valoración, yield, funcionamiento de mercado, curva de tipos y sensibilidad a tipos.

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

## Secuencia aprobada

1. `01-what-is-a-bond.md` — **¿Qué es un bono?**
2. `02-bond-anatomy.md` — **Anatomía de un bono a través de un ejemplo**
3. `03-discounting-theory.md` — **Descuento de flujos — teoría**
4. `04-discounting-example.md` — **Descuento de flujos — ejemplo**
5. `05-ytm-vs-cagr.md` — **YTM vs CAGR**
6. `06-same-ytm-different-cagr.md` — **Mismo YTM, distinto CAGR**
7. `07-why-many-bonds-same-tenor.md` — **¿Por qué hay varios bonos en un mismo tenor?**
8. `08-coupon-price-ytm.md` — **Del cupón al precio, y del precio al YTM**
9. `09-yield-curve.md` — **La curva de tipos**

**Estado:** slides 01–09 están fijadas. Cada una tiene especificación en `slides/` y referencia visual aprobada en `references/`.

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

Cada slide debe añadir una sola pieza conceptual nueva y conservar lo ya aprendido. Cuando un concepto merezca intuición y cálculo, preferir dos slides consecutivas antes que comprimir ambas en una sola.
