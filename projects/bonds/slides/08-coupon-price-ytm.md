# Slide 08 — Del cupón al precio, y del precio al YTM

## Estado

**Aprobada / fijada.**

## Propósito

Explicar que, para bonos con tenor parecido y cash flows contractuales distintos, el cupón permanece fijo y el precio de mercado se ajusta para que los YTM queden alrededor del nivel exigido por el mercado en esa zona de la curva.

## Ejemplo didáctico

Tres bonos con ~5 años de vida residual y face value 100 €:

- cupón 7% → precio 113.36 € → YTM ≈ 4%;
- cupón 4% → precio 100.00 € → YTM ≈ 4%;
- cupón 3% → precio 95.55 € → YTM ≈ 4%.

Los valores son una construcción pedagógica para aislar la relación cupón–precio–YTM.

## Idea central

**En renta fija el cupón no cambia. Para que bonos distintos ofrezcan rendimientos comparables, lo que ajusta el mercado es el precio.**

- cupón por encima del nivel de mercado → bono con prima;
- cupón cercano al nivel de mercado → bono cerca de par;
- cupón por debajo del nivel de mercado → bono con descuento.

Si se observan precio y cash flows, puede inferirse el YTM resolviendo la ecuación de valoración.

## Curva introducida

A la derecha aparece por primera vez una nube de bonos observados con una curva fair ajustada. La mayoría de puntos se concentra en 0–10Y y la densidad disminuye progresivamente hacia 50Y. La línea representa un ajuste teórico tipo spline que minimiza el error frente a los YTM observados.

No desarrollar todavía la curva en profundidad; la slide 09 la convierte en protagonista.

## Referencia

`../references/08-coupon-price-ytm.webp`
