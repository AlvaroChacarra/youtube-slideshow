# Repaso final — Minibloques 3 y 4

## Role
Cerrar el Bloque 1 recapitulando rendimiento, formación de precios y construcción conceptual de la curva.

## Required content
### Microbloque 3 — YTM vs CAGR
- Calcular la YTM no exige reinversión. Para realizar hasta vencimiento ese rendimiento compuesto se necesitan los supuestos de cobro y reinversión correspondientes.
- CAGR sin reinversión mide el resultado compuesto si los cupones se mantienen aparte.
- YTM es una convención útil para comparar bonos.
- Cuanto mayor es el cupón, mayor relevancia tiene la hipótesis de reinversión.
- Zero coupon: YTM y CAGR coinciden.

### Microbloque 4 — Del bono a la curva de tipos
- Varias referencias pueden convivir cerca del mismo tenor.
- Cupón contractual fijo; precio de mercado variable.
- Precio + cash flows → YTM.
- Cada punto observado representa un bono.
- La curva ajustada resume rendimientos por vencimiento.
- Benchmark = referencia líquida de un tenor.

Mensaje final: `El YTM permite comparar bonos; la curva organiza esos rendimientos por plazo.`

## Approved composition
Composición horizontal aprobada como opción 7 del conjunto total de recap: dos bandas apiladas; YTM vs CAGR arriba y del bono a la curva abajo, con curva grande integrada en el segundo bloque.

## Reference
`../references/13-recap-miniblocks-3-4.png`

## Descripción visual detallada
Composición de cierre en dos bandas horizontales apiladas, enmarcadas con líneas ornamentales sobre fondo navy. El título `Conclusiones — Microbloques 3 y 4` se alinea a la izquierda en serif blanca y queda subrayado por un pequeño motivo lineal cyan. Cada banda incorpora en su margen izquierdo un indicador vertical con numeración `1/2` o `2/2`, un nodo luminoso y la etiqueta del minibloque.

La banda superior está dedicada a `YTM vs CAGR`. Un icono circular de balanza acompaña cuatro viñetas: reinversión asumida, rendimiento realizado, convención comparativa y efecto de los cupones bajos. Las palabras que articulan cada idea aparecen en mayor peso, mientras las explicaciones se mantienen en blanco más ligero. Un icono de flechas opuestas en el extremo derecho refuerza visualmente la comparación entre las dos métricas.

La banda inferior resume `Del bono a la curva de tipos`. A la izquierda aparece un icono de gráfico ascendente y una lista sobre multiplicidad de bonos, cupones fijos, precios variables, YTM, puntos observados y curva ajustada. La mitad derecha contiene un gráfico de gran formato titulado `CURVA DE TIPOS (TIR)`, con puntos cyan, línea ajustada, eje de vencimiento de 0Y a 50Y y escala porcentual vertical. En el pie, una frase centrada y flanqueada por motivos geométricos sintetiza el recorrido: `Del rendimiento individual al mapa del mercado`.

## Why approved
- Cierra el recorrido desde rendimiento individual hasta mapa de mercado.
- La curva aparece como conclusión natural, no como elemento aislado.
- Mantiene densidad suficiente para repasar sin volver a impartir el contenido.

## Do not change
- Mantener los microbloques 3 y 4 juntos.
- No introducir todavía duración, DV01 ni movimientos de curva.
- Mantener la curva como visual de cierre.

## Apuntes de impartición

### Guion de recapitulación
1. Repetir la diferencia esencial: la YTM es la tasa interna que reconcilia precio y flujos; el CAGR sin reinversión anualiza una riqueza terminal construida manteniendo cupones al `0%`.
2. Recordar el experimento de los tres cupones: misma YTM del `4%`, precios distintos y CAGR sin reinversión distintos. El cupón cero elimina el componente de reinversión intermedia.
3. Volver al mercado: emisiones de distintas generaciones envejecen y coinciden alrededor de un tenor. Sus cupones permanecen fijos; sus precios cambian.
4. Encadenar `precio + cash flows → YTM` para cada bono y colocar cada observación en coordenadas vencimiento–rendimiento.
5. Cerrar con la curva fair como resumen de la nube y los benchmarks como anclajes líquidos.

### Fórmulas y relaciones de cierre
- YTM: `P₀ = Σ CFₜ/(1+y)^t`.
- CAGR sin reinversión: `(W_T/P₀)^(1/T)−1`.
- Precio y rendimiento: para flujos convencionales, `dP/dy < 0`.
- Punto observado: `(vencimiento residual, YTM)`.
- Curva fair: función ajustada que resume el rendimiento por plazo; no exige que todos los bonos coincidan exactamente con ella.

### Insights finales
- Cupón, precio y YTM son tres conceptos relacionados pero no intercambiables: el cupón pertenece al contrato, el precio al mercado y la YTM es una tasa implícita derivada de ambos.
- Compartir tenor o YTM no convierte dos bonos en equivalentes; pueden diferir en cupón, duración, liquidez, crédito y exposición a reinversión.
- La curva de YTM observada no es automáticamente la curva spot empleada para descontar cada flujo.
- Todo el bloque puede resumirse como `contrato → cash flows → precio → rendimiento → curva`.

### Comprobación final
Pedir al alumno que explique, sin leer la slide, por qué un bono de cupón alto puede cotizar por encima de `100`, por qué ese precio no implica necesariamente que esté caro y cómo termina representado como un punto en la curva. Si puede enlazar las tres respuestas, la arquitectura conceptual del bloque está consolidada.

## Implementación web — 2026-09-05

Candidata desarrollada a petición del usuario; la aprobación de la referencia original no se transfiere automáticamente a este render.

Dos bandas preservadas: YTM vs resultado compuesto y después precio+flujos→YTM→curva. Pregunta de recuperación con respuesta bajo demanda; sin duración ni DV01.

Render implementado: [Slide 13](../../../../presentation/evidence/final/slide-13.jpg). Referencia PNG anterior conservada como baseline.

Segunda revisión visual: jerarquía y contexto separados, relaciones y cambios de ejemplo explícitos; consultar `presentation/AUDIT.md` para hallazgos, correcciones y límites. Las capturas enlazadas corresponden a esta revisión.
