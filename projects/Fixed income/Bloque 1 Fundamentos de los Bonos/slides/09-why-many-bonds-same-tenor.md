# Slide 07 — ¿Por qué hay varios bonos en un mismo tenor?

## Estado

**Aprobada / fijada.**

## Propósito

Explicar por qué hoy pueden convivir varios Bonos u Obligaciones del Estado con vidas residuales cercanas aunque nacieran en momentos distintos y tengan cupones diferentes.

## Idea central

Una referencia benchmark nace con un vencimiento original y un cupón fijado por contrato. Con el paso del tiempo, su vida residual disminuye. Mientras tanto el Tesoro crea nuevas referencias y reabre referencias existentes. Por eso emisiones de distintas generaciones pueden terminar coincidiendo alrededor de una misma zona de tenor.

Ejemplo conceptual: una referencia emitida originalmente a 10 años pasa a tener 9 años de vida residual al año siguiente, después 8, 7, etc. Años más tarde puede convivir alrededor de la zona 5Y con otras referencias emitidas después.

## Contenido visual aprobado

- Contexto explícito: **España · Bonos y Obligaciones del Estado** con bandera española.
- Secuencia temporal en cuatro bloques:
  1. nueva referencia benchmark a 10 años;
  2. nueva referencia posterior a 10 años;
  3. paso del tiempo / envejecimiento de ambas referencias;
  4. hoy: varias emisiones históricas conviven alrededor de ~5 años de vida residual.
- El cupón queda fijado cuando nace cada referencia y no cambia.
- No explicar todavía el ajuste de precio por YTM; queda para la slide 08.

## Mensaje de cierre

**El cupón pertenece al contrato y se fija al emitir. Con el tiempo, distintos bonos pueden acabar conviviendo en una zona parecida de la curva.**

## Por qué se aprobó

- Hace tangible la diferencia entre vencimiento original y vida residual.
- Explica la multiplicidad de bonos antes de introducir repricing.
- Mantiene la bandera y el contexto español como elemento visual útil.
- Separa correctamente el problema histórico (por qué existen varios bonos) del problema de mercado (por qué cotizan a precios distintos).

## Referencia

`../references/09-why-many-bonds-same-tenor.png`

## Descripción visual detallada

La slide presenta una secuencia temporal de izquierda a derecha bajo el título `¿Por qué hay varios bonos en un mismo tenor?` y el subtítulo que explica que fueron emitidos en momentos distintos y envejecieron. Una cápsula centrada con bandera española fija el contexto `España · Bonos y Obligaciones del Estado`.

Cuatro columnas numeradas articulan la historia. La primera muestra la emisión de 2026 como nuevo benchmark a diez años, con una ficha de bono que incluye ISIN, fechas y cupón fijo del 2,40%. La segunda repite el patrón para una nueva referencia de 2027 con cupón del 3,10%. Ambas incorporan una nota inferior con estrella: el cupón se fija al emitir y no cambia. Flechas cyan gruesas conectan estas emisiones con la tercera columna, `Pasa el tiempo`, donde un reloj de arena y un calendario explican cómo una vida inicial de diez años se convierte sucesivamente en nueve, ocho y siete años residuales.

La cuarta columna, `Hoy`, reúne tres tarjetas compactas de bonos históricos emitidos en 2022, 2023 y 2024. Cada tarjeta separa datos contractuales y vencimiento residual, mostrando vidas cercanas —4,8, 5,2 y 5,6 años— pese a cupones diferentes. Una gran banda inferior, precedida por una estrella cyan, resume que el cupón pertenece al contrato y que emisiones distintas pueden acabar conviviendo en una zona parecida de la curva. Marcos finos, numeración circular y flechas mantienen visible la causalidad emisión → envejecimiento → coexistencia.

## Apuntes de impartición

### Guion sugerido
1. Distinguir vencimiento original de vida residual. Un bono emitido a diez años no permanece siempre en el punto 10Y: al día siguiente ya tiene algo menos de diez años por delante.
2. Seguir las columnas 2026 y 2027. Cada nueva referencia nace con su propia fecha, cupón y condiciones; el cupón contractual queda fijado aunque transcurra el tiempo.
3. En la columna de envejecimiento, hacer explícita la resta: `vida residual = fecha de vencimiento − fecha de valoración`.
4. Llegar a «Hoy»: emisiones de años diferentes pueden tener alrededor de cinco años restantes al mismo tiempo. Por eso una zona de la curva no contiene necesariamente un único bono.
5. Introducir benchmark como la referencia más líquida y seguida de una zona, no como sinónimo de «único bono existente».

### Conceptos y contexto de mercado
- `Tenor` se usa aquí como zona o plazo residual aproximado. Dos bonos en el tenor 5Y pueden vencer en fechas distintas y no tener exactamente la misma duración.
- Los soberanos emiten nuevas referencias y pueden reabrir una referencia existente para aumentar su saldo vivo. Las emisiones antiguas continúan negociándose como off-the-run mientras la nueva suele concentrar más liquidez.
- Cupones distintos reflejan condiciones de mercado y diseño contractual en fechas de emisión diferentes. No se reajustan para igualar el nivel actual de tipos.
- Los ISIN, fechas y cupones de la imagen son ilustrativos. No utilizarlos como inventario vigente del Tesoro sin contrastarlos con una fuente oficial.

### Insight central
La coexistencia se explica primero por historia y calendario, no por arbitraje: los bonos «envejecen» hacia plazos menores. La siguiente slide explicará cómo el precio permite que contratos con cupones diferentes sean comparables en rendimiento.

### Pregunta de control y transición
Preguntar: «Si tres bonos cercanos a 5Y pagan cupones distintos, ¿qué variable puede moverse hoy para que ninguno ofrezca una oportunidad obvia frente a los otros?». Respuesta de transición: el precio.

## Implementación web — 2026-09-05

Candidata desarrollada a petición del usuario; la aprobación de la referencia original no se transfiere automáticamente a este render.

Tres contratos ilustrativos distintos, originalmente a 10Y, emitidos hace 5,2 / 4,8 / 4,4 años, terminan con 4,8 / 5,2 / 5,6 años residuales. El calendario relativo sustituye fechas e ISIN ilustrativos inconsistentes; cada cupón permanece fijo.

Render implementado: [Slide 09](../../../../presentation/evidence/final/slide-09.jpg). Referencia PNG anterior conservada como baseline.

Segunda revisión visual: jerarquía y contexto separados, relaciones y cambios de ejemplo explícitos; consultar `presentation/AUDIT.md` para hallazgos, correcciones y límites. Las capturas enlazadas corresponden a esta revisión.
