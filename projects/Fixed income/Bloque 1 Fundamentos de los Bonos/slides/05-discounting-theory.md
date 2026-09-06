# Slide 03 — Descuento de flujos — teoría

Status: **referencia aprobada**.

Referencia: `../references/05-discounting-theory.png`

## Descripción visual detallada

Slide minimalista y centrada, con fondo navy profundo y una jerarquía vertical muy limpia. El título `Descuento de flujos` aparece arriba en sans serif blanca de gran tamaño y el subtítulo gris formula la tesis: el precio es el valor presente de los pagos futuros. El centro de la lámina está ocupado por una timeline horizontal fina en cyan que nace en una caja redondeada con la palabra `BONO` y la etiqueta `Hoy`.

Sobre la línea se distribuyen los flujos `C₁`, `C₂`, `Cₙ₋₁` y, al final, `Cₙ + Principal`; debajo se indican los momentos `t=1`, `t=2`, `t=n−1` y `t=n (Vencimiento)`. Los pagos se representan mediante nodos cyan con pequeñas marcas verticales. Una elipsis de tres puntos resuelve visualmente los periodos intermedios y el nodo final recibe un halo luminoso para señalar que incorpora cupón y principal.

Debajo de la timeline se sitúa una caja central de gran formato con borde cyan que contiene la suma de flujos descontados. La fórmula tiene amplio espacio en blanco y funciona como segundo foco de atención después de la línea temporal. Una banda inferior más discreta actúa como leyenda: un punto cyan introduce `CFₜ = flujo en el momento t` y otro introduce `rₜ = tasa de descuento`. La ausencia de ilustración decorativa mantiene toda la atención en la relación temporal entre pagos y valor presente.

## Propósito didáctico

Introducir la idea general de valoración antes de sustituir números del ejemplo.

Mensaje central:

> El precio de un bono es el valor presente de sus pagos futuros.

## Contenido obligatorio

Timeline conceptual:

- hoy;
- `t = 1` → `C_1`;
- `t = 2` → `C_2`;
- …;
- `t = n - 1` → `C_{n-1}`;
- `t = n` → `C_n + Principal`.

Fórmula general:

`Precio hoy = Σ[t=1..n] CF_t / (1 + r_t)^t`

Definiciones mínimas:

- `CF_t`: flujo en el momento `t`;
- `r_t`: tasa de descuento aplicable al flujo del momento `t`;
- `n`: número de periodos hasta vencimiento.

## Composición aprobada

- Slide deliberadamente más teórica y minimalista que la 04.
- Título y subtítulo en la parte superior.
- Timeline horizontal como protagonista visual.
- Bono/hoy a la izquierda; flujos avanzan hacia vencimiento.
- El flujo final se distingue porque contiene cupón + principal.
- Fórmula grande y aislada debajo de la timeline.
- Definiciones breves; no expandir todavía los números del bono canónico.

## Por qué se aprobó

- Fue la dirección preferida entre las exploraciones por su sencillez e interpretabilidad.
- Tiene muy poca carga de lectura.
- Separa claramente el principio general de su aplicación numérica.
- La estructura prepara la slide 04 sin repetirla.

## Evitar al implementarla

- introducir ya los `4 € / 104 €` del ejemplo;
- añadir tablas, múltiples cajas o explicaciones verbales largas;
- convertir `r_t` en YTM sin explicarlo: el YTM se introduce posteriormente como tasa única que iguala DCF y precio observado.

## Apuntes de impartición

### Guion sugerido
1. Partir de la intuición temporal: un euro futuro no equivale necesariamente a un euro hoy porque el dinero tiene coste de oportunidad y riesgo.
2. Recorrer la timeline de izquierda a derecha. Cada `CFₜ` llega en una fecha distinta y, por tanto, necesita su propio factor de descuento.
3. Explicar que el precio es la suma de equivalentes actuales, no la suma nominal de los cobros.
4. Señalar el último flujo: en vencimiento se recibe el cupón correspondiente más el principal.

### Fórmula central
`P₀ = Σ[t=1..n] CFₜ / (1 + rₜ)^t`

- `P₀`: valor o precio hoy.
- `CFₜ`: flujo recibido en el periodo `t`.
- `rₜ`: tasa de descuento apropiada para ese plazo y ese flujo.
- `t`: distancia temporal expresada en periodos coherentes con la tasa.
- `n`: número total de periodos hasta vencimiento.

Para un único flujo: `PV(CFₜ) = CFₜ/(1+rₜ)^t`. El denominador crece con la tasa y con el tiempo; por eso, manteniendo todo lo demás constante, un flujo vale menos hoy cuanto más tarde llega o mayor es la tasa exigida.

### Insights y contexto
- El descuento no «quita» dinero al flujo contractual; cambia la unidad de comparación, convirtiendo euros futuros en euros de hoy.
- Esta formulación usa una tasa `rₜ` para cada plazo. Más adelante la YTM resumirá todos los flujos con una única tasa interna `y`; no son exactamente el mismo objeto.
- En una valoración completa, la tasa puede incorporar nivel libre de riesgo, prima de crédito, liquidez y otras compensaciones. Aquí se mantiene agregada para centrar la mecánica.

### Errores frecuentes y transición
- No sumar los flujos sin descontarlos.
- No aplicar el exponente equivocado ni mezclar tasas anuales con periodos semestrales.
- No incluir el principal en todos los años.

Transición: «Ya tenemos la regla general; ahora sustituiremos cada símbolo por los pagos concretos del bono de cinco años».

## Implementación web — 2026-09-05

Candidata desarrollada a petición del usuario; la aprobación de la referencia original no se transfiere automáticamente a este render.

Línea temporal simbólica persistente y selección de flujo vinculada al término de descuento. Se definen CF_t, r_t, t y n; sin introducir YTM.

Render implementado: [Slide 05](../../../../presentation/evidence/final/slide-05.jpg). Referencia PNG anterior conservada como baseline.

Segunda revisión visual: jerarquía y contexto separados, relaciones y cambios de ejemplo explícitos; consultar `presentation/AUDIT.md` para hallazgos, correcciones y límites. Las capturas enlazadas corresponden a esta revisión.


## Evolución web — candidatura PR #4, 2026-09-05

La notación del rail es CF₁, CF₂, …, CFₙ₋₁, CFₙ; el último CF ya incluye principal. No escribir CFₙ+FV como si CFₙ excluyera principal. Seleccionar un pago conserva su identidad al pasar al ejemplo y a la reinversión. La fórmula se actualiza en el mismo estado.

Referencia de la composición actual: `presentation/evidence/implementation/05-desktop.png`. El estado de revisión e integración se mantiene en el PROJECT del bloque y en presentation/AUDIT.md; este addendum no cambia las referencias PNG históricas ni implica merge.
