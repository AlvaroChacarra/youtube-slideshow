# Slide 04 — Descuento de flujos — ejemplo

Status: **referencia aprobada**.

Referencia: `../references/04-discounting-example.webp`

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
