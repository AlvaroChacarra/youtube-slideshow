# Slide 02 — Anatomía de un bono a través de un ejemplo

Status: **referencia aprobada**.

Referencia: `../references/04-bond-anatomy.png`

## Descripción visual detallada

La composición contrapone un objeto financiero tangible con su explicación técnica. El título `Especificación de un bono` ocupa la parte superior en serif blanca; debajo, una línea ornamental y el subtítulo cyan presentan el ejemplo de un bono a cinco años con cupón del 4%. La mitad izquierda está dominada por un certificado vertical de papel marfil, con textura, borde ornamental y sello institucional. Dentro del certificado aparecen, alineados como campos contractuales, el emisor, cupón, precio hoy, valor nominal, notional, vencimiento y frecuencia, todos con sus valores concretos.

La mitad derecha contiene siete tarjetas horizontales navy con borde cyan. Cada tarjeta combina un icono circular, el nombre del atributo en cyan y una definición breve en blanco. Líneas diagonales parten de los valores escritos en el certificado y terminan en puntos cyan junto a sus definiciones, haciendo visible la correspondencia entre dato contractual y concepto. La separación interna vertical de cada tarjeta refuerza la distinción entre término y explicación.

En el borde inferior derecho, una timeline encapsulada traduce el contrato a flujos para el inversor: `Hoy −100€`, cupones de `4€` en 1Y, 2Y, 3Y y 4Y, y `104€` en 5Y. Cada momento usa un icono circular de cartera o monedas, conectado con flechas horizontales. El certificado claro crea un fuerte contraste material con el fondo navy, mientras la red de conectores y la timeline convierten la ficha estática en una lectura causal del instrumento.

## Propósito didáctico

Explicar los componentes de un bono partiendo de un instrumento concreto, no de una lista abstracta de definiciones.

## Ejemplo

- bono a **5 años**;
- cupón **4% anual**;
- precio hoy **100 €**;
- valor nominal / face value **100 €**;
- notional **100 €**;
- frecuencia **anual**.

## Elementos que deben quedar identificados

- **Emisor**: entidad que emite el bono y asume la obligación de pago.
- **Cupón**: tasa periódica de interés; aquí 4% anual.
- **Precio hoy**: importe pagado hoy por el inversor; aquí 100 €.
- **Notional**: base sobre la que se calcula el cupón; aquí 100 €.
- **Face value / valor nominal**: principal devuelto al vencimiento; aquí 100 €.
- **Vencimiento**: horizonte hasta el pago final; aquí 5 años.
- **Frecuencia**: periodicidad de los cupones; aquí anual.

## Traducción a cash flows

Desde la perspectiva del inversor:

- hoy: `-100 €`;
- 1Y: `+4 €`;
- 2Y: `+4 €`;
- 3Y: `+4 €`;
- 4Y: `+4 €`;
- 5Y: `+104 €` = `4 €` de cupón + `100 €` de face value.

El pago anual de cupón se obtiene como `4% × 100 € = 4 €`.

## Composición aprobada

- Certificado/objeto de bono grande como protagonista central.
- Datos del ejemplo escritos dentro del propio bono.
- Callouts laterales conectados directamente a cada atributo.
- Timeline horizontal inferior que traduce las especificaciones del instrumento a pagos efectivos.
- Fondo navy limpio; certificado claro para crear contraste material.

## Por qué se aprobó

- Convierte terminología abstracta en un objeto reconocible.
- Cada definición apunta al dato real del ejemplo.
- La timeline inferior prepara de forma natural la valoración por descuento de flujos.
- Mantiene el mismo ejemplo que se reutilizará en las slides posteriores.

## Nota conceptual

En este ejemplo `notional = face value = 100 €`. No presentarlos como sinónimos universales: aquí coinciden numéricamente, pero se conservan las etiquetas porque una magnitud es la base del cupón y la otra representa el principal reembolsado al vencimiento.

## Apuntes de impartición

### Guion sugerido
1. Leer el certificado como si fuera una ficha contractual. Identificar primero emisor, vencimiento y frecuencia; después cupón, notional, valor nominal y precio.
2. Separar magnitudes contractuales de mercado. Cupón, frecuencia, principal y vencimiento vienen definidos por el bono. El precio de `100 €` es una observación de mercado hoy y puede cambiar mañana.
3. Calcular el pago anual: `coupon payment = coupon rate × notional = 4% × 100 € = 4 €`.
4. Trasladar los campos a la timeline. El inversor paga `100 €` hoy, recibe `4 €` cada año y en el quinto año recibe el último cupón más el principal: `4 € + 100 € = 104 €`.

### Fórmulas y convenciones
- Pago de cupón por periodo: `C = c × N`, donde `c` es la tasa de cupón por periodo y `N` el notional.
- Con frecuencia anual, `c = 4%` produce `C = 4 €` cada año.
- Flujo final: `CF₅ = C + FV = 4 + 100 = 104 €`.
- Secuencia del inversor: `(-100, 4, 4, 4, 4, 104)`.

Si la frecuencia fuese semestral, habría que ajustar tanto el cupón por periodo como el número de periodos. No desarrollar la convención exacta aquí, pero dejar claro que `4% anual` no significa automáticamente `4 €` cada seis meses.

### Insights y aclaraciones
- `Precio`, `notional` y `face value` pueden coincidir numéricamente y seguir siendo conceptos distintos. Precio es lo pagado; notional es la base de cálculo; face value es el principal contractual que se devuelve.
- El cupón del `4%` es una tasa; los `4 €` son un importe. Evitar llamar «cupón» a ambos sin especificar si se habla de tasa o pago.
- El valor nominal no se recibe cada año. Solo se recupera al vencimiento, salvo estructuras amortizables que quedan fuera de este bloque.

### Pregunta de control y transición
Preguntar: «Si el precio de mercado bajase a `95 €`, ¿cambiarían los pagos `4, 4, 4, 4, 104`?». La respuesta es no. Transición: «Si los pagos no cambian pero ocurren en fechas distintas, necesitamos traducirlos todos a dinero de hoy».
