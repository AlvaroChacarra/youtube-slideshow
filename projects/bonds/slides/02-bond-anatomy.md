# Slide 02 — Anatomía de un bono a través de un ejemplo

Status: **referencia aprobada**.

Referencia: `../references/02-bond-anatomy.webp`

## Propósito didáctico

Explicar los componentes de un bono partiendo de un instrumento concreto, no de una lista abstracta de definiciones.

## Ejemplo

- bono a **5 años**;
- cupón **4% anual**;
- precio hoy **100 €**;
- valor nominal / face value **100 €**;
- notional **100 €**;
- frecuencia **anual**.

## Elementos que deben quedar identificados

- **Emisor**: entidad que emite el bono y asume la obligación de pago.
- **Cupón**: tasa periódica de interés; aquí 4% anual.
- **Precio hoy**: importe pagado hoy por el inversor; aquí 100 €.
- **Notional**: base sobre la que se calcula el cupón; aquí 100 €.
- **Face value / valor nominal**: principal devuelto al vencimiento; aquí 100 €.
- **Vencimiento**: horizonte hasta el pago final; aquí 5 años.
- **Frecuencia**: periodicidad de los cupones; aquí anual.

## Traducción a cash flows

Desde la perspectiva del inversor:

- hoy: `-100 €`;
- 1Y: `+4 €`;
- 2Y: `+4 €`;
- 3Y: `+4 €`;
- 4Y: `+4 €`;
- 5Y: `+104 €` = `4 €` de cupón + `100 €` de face value.

El pago anual de cupón se obtiene como `4% × 100 € = 4 €`.

## Composición aprobada

- Certificado/objeto de bono grande como protagonista central.
- Datos del ejemplo escritos dentro del propio bono.
- Callouts laterales conectados directamente a cada atributo.
- Timeline horizontal inferior que traduce las especificaciones del instrumento a pagos efectivos.
- Fondo navy limpio; certificado claro para crear contraste material.

## Por qué se aprobó

- Convierte terminología abstracta en un objeto reconocible.
- Cada definición apunta al dato real del ejemplo.
- La timeline inferior prepara de forma natural la valoración por descuento de flujos.
- Mantiene el mismo ejemplo que se reutilizará en las slides posteriores.

## Nota conceptual

En este ejemplo `notional = face value = 100 €`. No presentarlos como sinónimos universales: aquí coinciden numéricamente, pero se conservan las etiquetas porque una magnitud es la base del cupón y la otra representa el principal reembolsado al vencimiento.
