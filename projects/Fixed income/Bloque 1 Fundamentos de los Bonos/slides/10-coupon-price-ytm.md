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

`../references/10-coupon-price-ytm.png`

## Descripción visual detallada

La composición divide el ancho en tres áreas funcionales bajo un título editorial grande y el subtítulo `Si los cash flows no cambian, el ajuste tiene que venir por el precio`. Un círculo con el número `8` aparece en la esquina superior izquierda y una cápsula con bandera española contextualiza el mercado soberano en la parte superior derecha.

La columna izquierda establece la cadena conceptual. Comienza con la fórmula `P = Σ CFₜ/(1+y)ᵗ` y una nota que indica que, observando precio y flujos, puede calcularse `y`. Tres pasos numerados describen después `Cupón fijo`, `Precio de mercado` y `YTM`, cada uno con un icono propio y una explicación breve. La zona central contiene tres bandas apiladas para los bonos A, B y C. Cada banda muestra cupón, timeline de flujos, precio, YTM del 4% y clasificación final: prima para el cupón 7%, par para el 4% y descuento para el 3%. La alineación vertical permite comparar inmediatamente cómo cambia el precio mientras el YTM permanece igual.

El panel derecho introduce una curva de rendimientos con nube de bonos observados, línea fair y una franja vertical que destaca la zona 5Y. Un callout explica que varios bonos pueden cotizar allí con YTM muy similares; una nota inferior aclara que cada punto combina precio y flujos para producir un YTM. La franja final de ancho completo resume, con una estrella cyan, que el mercado ajusta el precio para aproximar los rendimientos cuando los cupones son distintos pero el tenor es semejante.

## Apuntes de impartición

### Guion sugerido
1. Reafirmar que los cash flows contractuales de cada bono están fijados. El mercado no cambia el cupón del bono A de `7%` a `4%`; cambia cuánto está dispuesto a pagar por esos flujos.
2. Aplicar una YTM común del `4%` a los tres bonos de cinco años. El cupón alto produce precio con prima, el cupón igual al rendimiento produce precio a la par y el cupón bajo produce precio con descuento.
3. Leer la causalidad en ambos sentidos: `flujos + YTM exigida → precio`, o bien `flujos + precio observado → YTM implícita`.
4. Conectar cada bono con un punto de la nube. Bonos próximos en plazo no tienen por qué mostrar exactamente la misma YTM por diferencias de liquidez, crédito, fiscalidad, repo o microestructura; la curva representa un nivel fair alrededor del cual se distribuyen.

### Fórmula y resultados
`P(y) = Σ[t=1..T] CFₜ/(1+y)^t`

Con `T=5`, principal `100` y `y=4%`:

- cupón `7%`: `P ≈ 113.36 €` → prima;
- cupón `4%`: `P = 100.00 €` → par;
- cupón `3%`: `P ≈ 95.55 €` → descuento.

Para flujos positivos convencionales, `dP/dy < 0`: al aumentar el rendimiento exigido, disminuye el valor presente. Esta relación inversa es la mecánica fundamental, aunque la sensibilidad exacta se estudiaría posteriormente con duración y convexidad.

### Insights y aclaraciones
- Prima o descuento describen el precio respecto al principal; no significan por sí solos que el bono esté caro o barato.
- YTM es una tasa interna resumen. Dos bonos con la misma YTM pueden tener distinta exposición a tipos y reinversión por tener cupones y duraciones diferentes.
- La línea fair no obliga a que todos los puntos estén encima de ella. Es un ajuste del mercado, no una identidad contractual.

### Pregunta de control y transición
Preguntar qué debe ocurrir con el precio del bono de cupón `7%` si el rendimiento de mercado sube desde `4%`. Transición: «Cuando repetimos esta observación para muchos vencimientos obtenemos un mapa completo: la curva de tipos».
