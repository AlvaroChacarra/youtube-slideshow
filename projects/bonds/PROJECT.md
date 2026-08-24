# Bonds — proyecto didáctico

## Objetivo

Construir una explicación visual progresiva de bonos que parta de la intuición económica, pase por la anatomía del instrumento y llegue a valoración, yield y sensibilidad a tipos.

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

## Secuencia aprobada hasta ahora

1. `01-what-is-a-bond.md` — **¿Qué es un bono?**
2. `02-bond-anatomy.md` — **Anatomía de un bono a través de un ejemplo**
3. `03-discounting-theory.md` — **Descuento de flujos — teoría**
4. `04-discounting-example.md` — **Descuento de flujos — ejemplo**

Las cuatro tienen referencia visual aprobada.

## Siguiente bloque previsto

### Slide 05 — Yield to Maturity

Introducir el YTM como la tasa única `y` que hace que el valor presente de los flujos sea igual al precio observado:

`P_mercado - P_DCF(y) ≈ 0`.

Para el bono canónico, al cotizar a par (`P = 100 €`) y tener cupón anual del 4%, el resultado es `YTM = 4%`.

La slide debe explicar tanto la intuición como el procedimiento de resolución: una aproximación cerrada puede servir como estimación, mientras que el valor exacto se obtiene resolviendo numéricamente la ecuación de precio.

## Convenciones matemáticas actuales

- Slides 03–04 presentan primero la valoración general usando `r_t`, tasa aplicable al flujo de cada periodo.
- La slide 05 introducirá explícitamente el caso de una única tasa interna `y` / YTM aplicada a todos los flujos.
- No confundir **coupon rate** (4%) con **coupon payment** (4 €).
- En vencimiento el numerador contiene cupón más devolución de principal; antes del vencimiento contiene solo el cupón.

## Regla narrativa

Cada slide debe añadir una sola pieza conceptual nueva y conservar lo ya aprendido. Cuando un concepto merezca intuición y cálculo, preferir dos slides consecutivas —teoría y ejemplo— antes que comprimir ambas en una sola.
