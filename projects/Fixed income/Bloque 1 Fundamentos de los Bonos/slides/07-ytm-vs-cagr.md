# Slide 05 — YTM vs CAGR

## Propósito

Separar dos formas de resumir la rentabilidad del mismo bono antes de comparar bonos con estructuras de cupón distintas.

## Ejemplo canónico

- vencimiento: **5 años**;
- cupón: **4% anual**;
- frecuencia: **anual**;
- notional: **100 €**;
- face value: **100 €**;
- precio hoy: **100 €**.

Flujos: `-100, +4, +4, +4, +4, +104`.

## Definiciones que deben quedar correctas

### YTM

La YTM es la tasa interna `y` que iguala el precio observado con el valor presente de los flujos contractuales del bono:

`100 = 4/(1+y)^1 + 4/(1+y)^2 + 4/(1+y)^3 + 4/(1+y)^4 + 104/(1+y)^5`.

Resultado para el bono canónico: **YTM = 4.00%**.

Matiz pedagógico obligatorio: calcular la YTM no requiere que de hecho se reinviertan los cupones. Sin embargo, para que el rendimiento compuesto realizado hasta vencimiento coincida con la YTM, los cupones intermedios deben reinvertirse al mismo YTM.

### CAGR sin reinversión

Para esta secuencia didáctica, definir explícitamente el CAGR como la tasa anual compuesta de la riqueza terminal cuando los cupones cobrados se mantienen como efectivo al 0% hasta vencimiento, es decir, sin reinversión.

Riqueza terminal: `4 + 4 + 4 + 4 + 104 = 120 €`.

`CAGR = (120/100)^(1/5) - 1 = 3.71%`.

No presentar este CAGR como IRR del bono. Es una medida deliberada de riqueza terminal bajo una hipótesis de reinversión del 0%.

## Composición aprobada

Referencia: `../references/07-ytm-vs-cagr.png`.

## Descripción visual detallada

La imagen se estructura como una comparación bilateral estrictamente simétrica. En la cabecera, `YTM vs CAGR` aparece en serif blanca y un subtítulo aclara que se trata del mismo bono resumido de dos maneras. Una ficha horizontal inmediatamente inferior reúne vencimiento, cupón, precio, face value y frecuencia, con `Bono 5 años` destacado en cyan.

Dos grandes paneles con borde cyan ocupan el cuerpo. El panel izquierdo, `YTM`, presenta primero la definición textual, luego la ecuación completa de descuento y finalmente una cápsula central con `YTM = 4.00%`. En la parte baja se visualizan los flujos `−100€, 4€, 4€, 4€, 4€, 104€`; arcos discontinuos entre los cupones y fechas posteriores representan gráficamente la reinversión. El panel derecho, `CAGR`, muestra la suma de los cobros hasta `120€`, la fórmula de anualización y una cápsula `CAGR = 3.71%`. Su timeline dirige cada cupón mediante flechas discontinuas hacia una caja inferior `Caja / Efectivo 120€`, haciendo explícito que los cobros se acumulan sin reinvertirse.

Una franja de cierre recorre todo el ancho y comienza con una estrella cyan. El texto contrasta la convención de reinversión de YTM con la anualización del resultado final en CAGR. El paralelismo de marcos, fórmulas, resultados y timelines permite comparar ambas métricas siguiendo la misma secuencia visual.

Composición de dos columnas simétricas:

- izquierda: definición, ecuación y resultado de YTM;
- derecha: definición, acumulación de cupones sin reinversión, ecuación y resultado de CAGR;
- arriba: ficha compacta del bono canónico;
- abajo: una frase que contraste las hipótesis de ambas métricas.

## Por qué se aprobó

- comparación inmediata y simétrica;
- mantiene el mismo ejemplo de las slides anteriores;
- muestra definición, cálculo y resultado sin depender de texto oral para entender la diferencia;
- la densidad es mayor que en las slides introductorias, pero cada bloque tiene función matemática concreta;
- evita introducir todavía la relación precio–yield, que se reserva para otra slide.

## No introducir

- prima/par/descuento;
- `precio > 100 -> yield < cupón` ni reglas equivalentes;
- métodos numéricos para resolver YTM;
- curvas de tipos;
- nuevas métricas de retorno sin definición explícita.

## Apuntes de impartición

### Guion sugerido
1. Presentar la YTM como solución de una ecuación inversa: se conocen precio y flujos y se busca la tasa única `y` que hace compatibles ambos.
2. Resolver conceptualmente el caso a la par: con precio `100`, cupón `4%` y principal `100`, la tasa interna es `4%`.
3. Separar cálculo de YTM y rendimiento realizado. La YTM puede calcularse sin reinvertir nada; la reinversión importa para que la riqueza final efectivamente realizada crezca al mismo `4%` compuesto.
4. Construir el CAGR alternativo acumulando los cupones como efectivo al `0%`: riqueza terminal `120 €`, frente a un desembolso inicial de `100 €` durante cinco años.
5. Comparar resultados: `4.00%` frente a `3.71%`. La diferencia no es un error; procede de hipótesis distintas sobre qué ocurre con los cupones intermedios.

### Fórmulas
YTM:

`100 = 4/(1+y) + 4/(1+y)^2 + 4/(1+y)^3 + 4/(1+y)^4 + 104/(1+y)^5`

`y = 4.00%`

CAGR sin reinversión:

`W₅ = 4 + 4 + 4 + 4 + 104 = 120 €`

`CAGR₀ = (W₅/P₀)^(1/5) − 1 = (120/100)^(1/5) − 1 = 3.71%`

El subíndice `0` recuerda que los cupones se mantienen al `0%`. Si se reinvirtiesen a una tasa `g`, la riqueza terminal sería `W₅(g) = 4(1+g)^4 + 4(1+g)^3 + 4(1+g)^2 + 4(1+g) + 104`.

### Insights y matices
- La YTM es una TIR contractual basada en precio y flujos; no es una predicción de los tipos futuros ni una rentabilidad garantizada antes del vencimiento.
- Para realizar la YTM hasta vencimiento deben cumplirse, entre otras, ausencia de default, mantenimiento hasta maturity y reinversión de cupones al mismo rendimiento.
- La convención de `CAGR sin reinversión` es específica de esta explicación. No debe confundirse con TIR, current yield ni total return de mercado.

### Pregunta de control y transición
Preguntar: «¿Qué bono será más sensible a la hipótesis de reinversión: uno con cupones altos o uno sin cupones?». Transición: «Vamos a mantener la misma YTM y cambiar solo la cantidad de dinero que llega antes del vencimiento».
