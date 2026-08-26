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

Referencia: `../references/05-ytm-vs-cagr.webp`.

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
