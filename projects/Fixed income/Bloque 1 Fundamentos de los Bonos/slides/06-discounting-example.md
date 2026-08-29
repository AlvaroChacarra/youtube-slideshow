# Slide 04 — Descuento de flujos — ejemplo

Status: **referencia aprobada**.

Referencia: `../references/06-discounting-example.png`

## Descripción visual detallada

La lámina conserva el título y subtítulo de la explicación teórica, pero aumenta la densidad para desarrollar el caso numérico. Bajo la cabecera aparece una banda horizontal con icono de etiqueta y la ficha `bono a 5 años, cupón 4%, notional 100€, face value 100€`; `Ejemplo:` se resalta en cyan y el resto permanece en blanco.

La zona central muestra una timeline desde una caja `BONO / Hoy` hasta cinco nodos. Los cuatro primeros pagos son `4€` y quedan agrupados por una llave superior rotulada `Cupones (solo cupón)`. El quinto nodo, `104€`, está destacado con halo y la etiqueta `Cupón + principal`; debajo se identifica como `t=5 (Vencimiento)`. A la derecha, una tarjeta informativa divide mediante una línea los dos casos: antes del vencimiento, `CFₜ = cupón × notional = 4€`; en vencimiento, el flujo incorpora además el face value y alcanza `104€`.

En la mitad inferior, una caja ancha contiene la fórmula general del precio y, a su derecha, define `CFₜ` y `rₜ`. Debajo aparece otra caja con el `Ejemplo expandido`, donde los cinco numeradores concretos se descuentan con `r₁` a `r₅`. Una leyenda final alinea las definiciones de flujo, tasa y número de periodos. Los contornos cyan, los divisores finos y el uso consistente de blanco para operaciones y cyan para conceptos guían la lectura desde contrato, a flujos, a fórmula compacta y finalmente a sustitución numérica.

## Propósito didáctico

Aplicar inmediatamente la fórmula general de la slide 03 al mismo bono introducido en la slide 02.

Esta slide puede contener más información que la 03 porque su función es hacer explícita la mecánica numérica.

## Ejemplo reutilizado

- vencimiento: `5 años`;
- cupón: `4% anual`;
- notional: `100 €`;
- face value: `100 €`;
- frecuencia: `anual`.

Por tanto:

`coupon payment = coupon rate × notional = 4% × 100 € = 4 €`.

## Cash flows

- `CF_1 = 4 €`;
- `CF_2 = 4 €`;
- `CF_3 = 4 €`;
- `CF_4 = 4 €`;
- `CF_5 = 104 €`.

La distinción que debe quedar visualmente inequívoca es:

### Antes del vencimiento

`CF_t = coupon rate × notional = 4 €`.

### En vencimiento

`CF_5 = coupon rate × notional + face value`

`CF_5 = 4 € + 100 € = 104 €`.

El face value aparece en el numerador **solo en maturity**.

## Fórmula expandida

`Precio hoy = 4/(1+r_1)^1 + 4/(1+r_2)^2 + 4/(1+r_3)^3 + 4/(1+r_4)^4 + 104/(1+r_5)^5`

## Composición aprobada

- Mantener título/subtítulo y mundo visual de la slide 03.
- Añadir una pequeña banda que recuerde el ejemplo canónico.
- Timeline con los cinco pagos concretos: `4, 4, 4, 4, 104`.
- Agrupar visualmente los cuatro primeros como **cupones (solo cupón)**.
- Destacar el último como **cupón + principal**.
- Callout lateral que explique la construcción del numerador antes de maturity y en maturity.
- Fórmula general y, debajo, fórmula expandida con los valores del ejemplo.

## Por qué se aprobó

- Hace explícito algo que la fórmula compacta puede ocultar: qué contiene realmente `CF_t`.
- Reutiliza exactamente el mismo bono de la slide 02 y elimina costes de reorientación.
- La slide 03 conserva la intuición limpia; esta slide absorbe la carga algebraica y numérica.

## Evitar al implementarla

- llamar `cupón` indistintamente al 4% y a los 4 € sin contexto;
- sumar face value a todos los periodos;
- cambiar el ejemplo numérico;
- introducir todavía el YTM como si ya hubiera sido explicado.

## Apuntes de impartición

### Guion sugerido
1. Recuperar el bono canónico y reconstruir los flujos sin mirar la fórmula: cuatro pagos de cupón de `4 €` y un pago final de `104 €`.
2. Mostrar que cada numerador procede del contrato. En `t=1…4`, `CFₜ = 4`; en `t=5`, `CF₅ = 4 + 100 = 104`.
3. Descontar cada flujo con la tasa asociada a su vencimiento. Insistir en que `r₁`, `r₂`, …, `r₅` pueden ser distintas porque representan puntos diferentes de la estructura temporal.
4. Sumar los cinco valores presentes para obtener el precio teórico hoy.

### Desarrollo algebraico
`P₀ = 4/(1+r₁) + 4/(1+r₂)^2 + 4/(1+r₃)^3 + 4/(1+r₄)^4 + 104/(1+r₅)^5`

Si, solo como simplificación, todas las tasas fueran iguales a `r`, entonces:

`P₀ = 4/(1+r) + 4/(1+r)^2 + 4/(1+r)^3 + 4/(1+r)^4 + 104/(1+r)^5`

Esta segunda expresión se parece a la ecuación de YTM, pero la dirección del problema será distinta: en valoración se supone una tasa y se calcula precio; en YTM se observa el precio y se resuelve la tasa.

### Insights numéricos
- Si todas las tasas fueran `4%`, el precio sería `100 €`: el bono cotizaría a la par porque tasa de cupón y rendimiento exigido coinciden bajo estos supuestos.
- Si las tasas suben manteniendo fijos los flujos, los denominadores aumentan y el precio cae. Si bajan, el precio sube. Esta es la primera intuición de la relación inversa precio–tipos.
- El flujo de `104 €` suele aportar la mayor parte del valor presente porque contiene la devolución del principal, aunque sea también el flujo más lejano.

### Preguntas de control y transición
Preguntar qué ocurre con el precio si `r₅` aumenta y todo lo demás permanece constante. Después preguntar qué parte del `104` es cupón y cuál principal. Transición: «Hasta ahora hemos usado tasas para obtener un precio; el mercado plantea a menudo el problema inverso: conocemos precio y flujos y queremos una sola tasa resumen».
