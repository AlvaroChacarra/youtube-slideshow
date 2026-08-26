# Fixed income — temario

## Objetivo

Construir una introducción visual y progresiva a fixed income que lleve al espectador desde la mecánica de un bono individual hasta la lectura de curvas, spreads y riesgo de cartera.

La secuencia pedagógica es deliberada:

**instrumento → sensibilidad → origen de los yields → curva → crédito → gestión del riesgo**.

No adelantar herramientas de bloques posteriores si no son necesarias para comprender la idea actual.

## Roadmap

### Bloque 1 — Fundamentos de los Bonos

Pregunta: **¿Qué estoy comprando y cómo lo valoro?**

Contenido:

- qué es un bono y sus cash flows;
- notional, face value, cupón y maturity;
- descuento de flujos y precio;
- YTM y diferencia frente a CAGR realizado;
- bonos a par, prima y descuento;
- por qué conviven bonos con distinto cupón en un mismo tenor;
- relación cupón → precio → YTM;
- primera introducción visual a la curva de tipos.

Estado: **en desarrollo avanzado; slides 01–09 fijadas**.

La slide de curva del Bloque 1 solo presenta la curva como objeto que ordena bonos. No debe explicar todavía de dónde procede su forma.

### Bloque 2 — Riesgo de Tipos

Pregunta: **¿Por qué cambia el precio de un bono y cuánto cambia?**

Contenido imprescindible:

- relación inversa precio ↔ yield;
- efecto de maturity y coupon sobre la sensibilidad;
- duration como medida de sensibilidad;
- modified duration;
- DV01 como traducción a P&L;
- convexity de forma intuitiva.

Objetivo de salida: ante un movimiento de yield, entender qué le ocurre al precio y por qué un bono largo suele reaccionar más.

### Bloque 3 — Política Monetaria y Curva

Pregunta: **¿De dónde salen los yields?**

Contenido imprescindible:

- banco comercial vs banco central;
- depósitos, reservas y decisiones de liquidez;
- BCE y tipo de depósito como ancla del corto plazo;
- competencia entre reservas BCE, préstamos y bonos;
- por qué un activo con riesgo/plazo debe compensar frente a la alternativa segura;
- tipos cortos esperados y term premium;
- construcción conceptual de la curva EUR;
- spread soberano y curva SPGB;
- 2020, ciclo de subidas 2022–2023, inversión de curva y situación actual;
- SVB como aplicación final de duration + liquidez + subida de yields.

### Bloque 4 — La Curva como Objeto de Mercado

Pregunta: **¿Cómo se interpreta y se opera una curva?**

Contenido imprescindible:

- spot y forwards;
- steepening y flattening;
- movimientos paralelos y no paralelos;
- carry;
- roll-down;
- key-rate risk;
- lectura de valor relativo entre zonas de curva.

### Bloque 5 — Crédito y Spreads

Pregunta: **¿Por qué dos bonos del mismo plazo pagan distinto?**

Contenido imprescindible:

- risk-free vs sovereign vs corporate;
- spread de crédito;
- default y recovery;
- ratings como señal, no como precio;
- liquidez y técnicos de mercado;
- Z-spread / OAS a nivel conceptual cuando corresponda.

### Bloque 6 — Riesgo y Hedging

Pregunta: **¿Cómo se gestiona una cartera de fixed income?**

Contenido imprescindible:

- DV01 agregado y por buckets;
- duration matching;
- key-rate exposures;
- hedge ratios;
- futuros y swaps como instrumentos de cobertura;
- P&L attribution básico: carry, rolldown, rates, spread y residual.

## Regla narrativa global

1. Primero entender el objeto.
2. Después entender cómo reacciona su precio.
3. Solo entonces explicar quién mueve los yields y cómo se forma la curva.
4. Después introducir valor relativo y crédito.
5. Terminar con construcción y cobertura de carteras.

Cada slide debe añadir una sola pieza conceptual nueva. La narración oral completa la imagen; la imagen no debe contener todo el discurso.