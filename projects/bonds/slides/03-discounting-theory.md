# Slide 03 — Descuento de flujos — teoría

Status: **referencia aprobada**.

Referencia: `../references/03-discounting-theory.webp`

## Propósito didáctico

Introducir la idea general de valoración antes de sustituir números del ejemplo.

Mensaje central:

> El precio de un bono es el valor presente de sus pagos futuros.

## Contenido obligatorio

Timeline conceptual:

- hoy;
- `t = 1` → `C_1`;
- `t = 2` → `C_2`;
- …;
- `t = n - 1` → `C_{n-1}`;
- `t = n` → `C_n + Principal`.

Fórmula general:

`Precio hoy = Σ[t=1..n] CF_t / (1 + r_t)^t`

Definiciones mínimas:

- `CF_t`: flujo en el momento `t`;
- `r_t`: tasa de descuento aplicable al flujo del momento `t`;
- `n`: número de periodos hasta vencimiento.

## Composición aprobada

- Slide deliberadamente más teórica y minimalista que la 04.
- Título y subtítulo en la parte superior.
- Timeline horizontal como protagonista visual.
- Bono/hoy a la izquierda; flujos avanzan hacia vencimiento.
- El flujo final se distingue porque contiene cupón + principal.
- Fórmula grande y aislada debajo de la timeline.
- Definiciones breves; no expandir todavía los números del bono canónico.

## Por qué se aprobó

- Fue la dirección preferida entre las exploraciones por su sencillez e interpretabilidad.
- Tiene muy poca carga de lectura.
- Separa claramente el principio general de su aplicación numérica.
- La estructura prepara la slide 04 sin repetirla.

## Evitar al implementarla

- introducir ya los `4 € / 104 €` del ejemplo;
- añadir tablas, múltiples cajas o explicaciones verbales largas;
- convertir `r_t` en YTM sin explicarlo: el YTM se introduce posteriormente como tasa única que iguala DCF y precio observado.
