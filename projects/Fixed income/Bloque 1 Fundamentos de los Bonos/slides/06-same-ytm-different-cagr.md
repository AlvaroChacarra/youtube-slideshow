# Slide 06 — Mismo YTM, distinto CAGR

## Estado

**Aprobada por el usuario.** Corresponde a la composición 4 de la iteración final de la slide 6.

## Propósito

Demostrar con tres bonos que compartir exactamente el mismo YTM no implica obtener el mismo rendimiento compuesto realizado cuando los cupones no se reinvierten.

La slide debe hacer visible que el YTM incorpora una hipótesis de reinversión de los cupones al mismo rendimiento, mientras que el `CAGR sin reinversión` usado en este ejemplo anualiza la riqueza terminal cuando los cupones cobrados se mantienen aparte al 0% hasta vencimiento.

## Supuestos comunes

- vencimiento: **5 años**;
- face value: **100 €**;
- pagos: **anuales**;
- YTM común: **4%**.

## Bono A — cupón 8%

Flujos: `8, 8, 8, 8, 108`.

Precio consistente con YTM = 4%:

`117.81 = 8/1.04 + 8/1.04^2 + 8/1.04^3 + 8/1.04^4 + 108/1.04^5`.

Riqueza terminal sin reinversión:

`140 = 8 + 8 + 8 + 8 + 108`.

CAGR sin reinversión:

`(140 / 117.81)^(1/5) - 1 = 3.51%`.

## Bono B — cupón 1%

Flujos: `1, 1, 1, 1, 101`.

Precio consistente con YTM = 4%:

`86.64 = 1/1.04 + 1/1.04^2 + 1/1.04^3 + 1/1.04^4 + 101/1.04^5`.

Riqueza terminal sin reinversión:

`105 = 1 + 1 + 1 + 1 + 101`.

CAGR sin reinversión:

`(105 / 86.64)^(1/5) - 1 = 3.92%`.

## Bono C — cupón 0%

Flujos: `0, 0, 0, 0, 100`.

Precio consistente con YTM = 4%:

`82.19 = 100 / 1.04^5`.

Riqueza terminal sin reinversión:

`100`.

CAGR sin reinversión:

`(100 / 82.19)^(1/5) - 1 = 4.00%`.

## Mensaje didáctico central

**Los tres bonos tienen exactamente YTM = 4%, pero no tienen el mismo rendimiento compuesto si no reinviertes los cupones.**

Cuanto mayor es el cupón, mayor es la exposición a qué rendimiento pueda obtenerse al reinvertir esos cobros intermedios. El bono cupón cero es el caso límite: no existe reinversión intermedia y, manteniéndolo hasta vencimiento, YTM y CAGR coinciden.

## Precisión terminológica

`CAGR sin reinversión` no es la TIR estándar del bono. En esta slide significa específicamente la tasa anual compuesta que transforma el precio inicial en la riqueza terminal obtenida al mantener cada cupón cobrado como efectivo al 0% hasta vencimiento.

## Composición aprobada

- Tres columnas simétricas, una por cupón: 8%, 1%, 0%.
- Cada columna sigue el mismo orden pedagógico: precio → flujos → precio consistente con YTM → riqueza terminal → CAGR.
- Las operaciones deben mostrarse con los valores numéricos sustituidos; la clase debe poder seguir el cálculo sin reconstruirlo mentalmente.
- YTM y CAGR se definen brevemente en la franja superior.
- Conclusión única y protagonista en la franja inferior.

## Referencia visual

`../references/06-same-ytm-different-cagr.webp`

## Qué evitar

- Introducir todavía curva de tipos o escenarios de reinversión con tipos futuros distintos.
- Añadir relación precio-yield; se reserva para una slide posterior.
- Ocultar las sustituciones numéricas detrás de fórmulas genéricas.
- Presentar YTM como rendimiento realizado garantizado cuando existen cupones intermedios.
