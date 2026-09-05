# Slide 06 — Mismo YTM, distinto CAGR

## Estado

**Aprobada por el usuario.** Corresponde a la composición 4 de la iteración final de la slide 6.

## Propósito

Demostrar con tres bonos que compartir exactamente el mismo YTM no implica obtener el mismo rendimiento compuesto realizado cuando los cupones no se reinvierten.

La slide debe distinguir el cálculo de YTM, que no exige reinvertir, de la realización de ese rendimiento compuesto, que depende de los cobros y la reinversión. Por su parte, el `CAGR sin reinversión` usado en este ejemplo anualiza la riqueza terminal cuando los cupones cobrados se mantienen aparte al 0% hasta vencimiento.

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

`../references/08-same-ytm-different-cagr.png`

## Descripción visual detallada

La cabecera centra el título `Mismo YTM, distinto CAGR` en serif blanca y añade el subtítulo `Ejemplo con tres cupones: 8%, 1% y 0%`. Dos bandas explicativas bajo el título definen, con iconos de diana y gráfico ascendente, la YTM y el CAGR sin reinversión antes de presentar los cálculos.

El cuerpo está dividido en tres columnas de idéntico tamaño, identificadas como `A`, `B` y `C`. Cada panel comienza con el cupón —8%, 1% o 0%— y una tarjeta de precio actual con icono de etiqueta. Junto a ella aparece una pequeña timeline de cinco años que muestra los pagos anuales y el principal final. Tres secciones numeradas organizan después el razonamiento: precio consistente con `YTM = 4%`, riqueza final sin reinversión y cálculo del CAGR sin reinversión. Las fórmulas sustituyen valores concretos y el resultado de CAGR se enfatiza en cyan al final de cada tercera sección.

La repetición exacta de estructura permite comparar horizontalmente los tres casos: `117.81€ / 3.51%`, `86.64€ / 3.92%` y `82.19€ / 4.00%`. Una franja inferior con estrella cyan sintetiza la conclusión en dos líneas y destaca tipográficamente `YTM = 4%`, `CAGR es distinto`, `cupones bajos` y `compromiso más fiel`. El diseño prioriza la comparación controlada: mismos marcos y orden de lectura, cambiando únicamente cupón, precio, flujos y CAGR.

## Qué evitar

- Introducir todavía curva de tipos o escenarios de reinversión con tipos futuros distintos.
- Añadir relación precio-yield; se reserva para una slide posterior.
- Ocultar las sustituciones numéricas detrás de fórmulas genéricas.
- Presentar YTM como rendimiento realizado garantizado cuando existen cupones intermedios.

## Apuntes de impartición

### Guion sugerido
1. Fijar las variables comunes: cinco años, principal `100 €`, pagos anuales y YTM `4%`. Solo cambia el cupón.
2. Mostrar que el precio debe adaptarse para conservar la misma YTM. El bono A paga más cupones y vale más de `100`; el B paga menos y vale menos; el C no paga cupones y cotiza con mayor descuento.
3. Calcular la riqueza terminal sin reinversión sumando cobros nominales. A produce `140 €`, B `105 €` y C `100 €`.
4. Comparar esa riqueza con el precio inicial correspondiente. El CAGR no depende solo de cuánto se cobra, sino también de cuánto se pagó al inicio y de cuándo llegó cada cobro.
5. Concluir que el cupón cero reproduce exactamente la YTM si se mantiene hasta vencimiento y no hay default, porque todo el rendimiento está concentrado en un único flujo final y no existe riesgo de reinversión.

### Cálculos de contraste
- Bono A: `P_A = 117.81`, `W_A = 140`, `CAGR_A = (140/117.81)^(1/5)−1 = 3.51%`.
- Bono B: `P_B = 86.64`, `W_B = 105`, `CAGR_B = (105/86.64)^(1/5)−1 = 3.92%`.
- Bono C: `P_C = 82.19`, `W_C = 100`, `CAGR_C = (100/82.19)^(1/5)−1 = 4.00%`.

Los precios se obtienen descontando cada secuencia al `4%`; por construcción, los tres bonos comparten YTM.

### Insights y contexto
- Cuanto antes se recibe una fracción grande de la inversión, más depende el resultado compuesto final de la tasa disponible para reinvertirla.
- «Cupón alto» no significa automáticamente «mejor inversión»: el precio incorpora el valor de esos pagos mayores.
- Si los cupones se reinvirtieran exactamente al `4%`, la riqueza terminal de los tres casos sería coherente con un rendimiento compuesto del `4%`.
- Impuestos, costes, default y venta anticipada se omiten deliberadamente para aislar el riesgo de reinversión.

### Pregunta de control y transición
Preguntar por qué el bono A, pese a repartir más euros, tiene el CAGR sin reinversión más bajo. Transición: «Ya sabemos comparar estructuras de pago; ahora veremos por qué el mercado ofrece simultáneamente muchos bonos con cupones distintos en una zona de vencimiento similar».

## Implementación web — 2026-09-05

Candidata desarrollada a petición del usuario; la aprobación de la referencia original no se transfiere automáticamente a este render.

Tres columnas conservadas con operaciones desplegadas por pasos. Precios y CAGR proceden de cálculos con precisión completa; en móvil se leen en secuencia vertical.

Render implementado: [Slide 08](../../../../presentation/evidence/final/slide-08.jpg). Referencia PNG anterior conservada como baseline.

Segunda revisión visual: jerarquía y contexto separados, relaciones y cambios de ejemplo explícitos; consultar `presentation/AUDIT.md` para hallazgos, correcciones y límites. Las capturas enlazadas corresponden a esta revisión.


## Evolución web — candidatura PR #4, 2026-09-05

El nuevo ejemplo explicita reinversión g=0%, independientemente del g explorado en07. En móvil, tabla conjunta de cupón, precio, riqueza al año5 y CAGR; riqueza aparece en el paso2 y CAGR en3. El caption declara «Sin reinversión · riqueza al año5». Seleccionar cupón cambia el desarrollo, conservando los otros casos en la tabla. Esa selección se graba y reproduce como parte del escenario.

Referencia de la composición actual: `presentation/evidence/implementation/08-desktop.png`. El estado de revisión e integración se mantiene en el PROJECT del bloque y en presentation/AUDIT.md; este addendum no cambia las referencias PNG históricas ni implica merge.
