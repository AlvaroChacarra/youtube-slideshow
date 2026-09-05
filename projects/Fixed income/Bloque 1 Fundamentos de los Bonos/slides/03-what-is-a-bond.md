# Slide 01 — ¿Qué es un bono?

Status: **referencia aprobada**.

Referencia: `../references/03-what-is-a-bond.png`

## Descripción visual detallada

La imagen utiliza una estructura radial sobre un fondo urbano nocturno muy oscurecido. En la parte superior se centra el título `¿Qué es un bono?` en blanco, con el subtítulo `Un instrumento. Dos emisores. Un propósito.` debajo. Dos emisores ocupan el nivel superior del diagrama: `Estado`, representado por un edificio clásico, y `Empresa`, representada por un conjunto de edificios corporativos. Desde ambos parten líneas curvas cyan con flechas que convergen en el instrumento central.

El bono se representa como un certificado rectangular de gran tamaño situado en el centro, con marco ornamental, la palabra `BONO` y un sello institucional. Desde este objeto salen dos ramas laterales: hacia la izquierda, una flecha conduce a `Infraestructura / Servicios públicos`, acompañada por un puente y pequeños iconos de transporte, agua, sanidad y energía; hacia la derecha, una línea verde conduce a `Proyectos / Crecimiento`, con iconos de construcción, industria, energía eólica y sostenibilidad.

En el nivel inferior aparece un grupo de inversores dentro de un círculo. La relación económica se descompone cromáticamente: `Capital hoy` se muestra en cyan y apunta desde los inversores hacia el bono, mientras `Pago futuro` se destaca en verde y desciende desde el bono hacia los inversores. El skyline, el puente y sus reflejos aportan contexto económico real sin interferir con el diagrama; la información principal se sostiene mediante iconos lineales, etiquetas breves y direcciones de flujo claramente diferenciadas.

## Propósito didáctico

Presentar el bono como mecanismo de financiación antes de introducir pagos, fórmulas o yield.

La idea que debe quedar es:

> Estado o empresa obtiene capital hoy de inversores y promete pagos futuros; ese capital financia actividad real.

## Contenido obligatorio

- Dos tipos de emisor: **Estado** y **Empresa**.
- Un **bono** como instrumento central.
- **Inversores** como proveedores del capital.
- Flujo conceptual de **capital hoy** hacia el emisor.
- Compromiso de **pago futuro** hacia los inversores.
- Uso del capital:
  - Estado → infraestructura / servicios públicos.
  - Empresa → proyectos / crecimiento.

## Composición aprobada

- Bono como protagonista central.
- Estado y empresa por encima, convergiendo hacia el bono.
- Inversores debajo, conectados mediante capital hoy / pago futuro.
- Resultados financiados a izquierda y derecha.
- Fondo urbano/infrastructural muy oscuro y de bajo contraste: contexto, no protagonista.
- Diagrama lineal con iconos simples y muy poco texto.

## Por qué se aprobó

- La estructura se entiende de un vistazo.
- Combina la composición clara de las exploraciones preferidas con iconografía útil.
- La imagen de fondo está suficientemente neutralizada y no compite con el contenido.
- No introduce todavía anatomía ni valoración; deja espacio narrativo a las siguientes slides.

## Evitar al implementarla

- fotografía luminosa o puesta de sol dominante;
- añadir definiciones largas;
- tratarla como un diagrama financiero exhaustivo;
- llenar los laterales con más usos del capital de los necesarios.

## Apuntes de impartición

### Guion sugerido
1. Empezar por la necesidad económica, no por la definición jurídica: Estados y empresas necesitan capital hoy para financiar gasto, inversión o crecimiento.
2. Presentar al inversor como contraparte: entrega capital hoy a cambio de una promesa contractual de pagos futuros. El bono es el vehículo que formaliza esa relación.
3. Recorrer las flechas del diagrama: inversores → capital hoy → bono/emisor; emisor → pagos futuros → inversores. Aclarar que el uso económico del capital y el pago financiero son partes diferentes de la historia.
4. Distinguir deuda de capital: el bonista no compra una participación residual como un accionista; adquiere derechos contractuales sobre pagos definidos, sujetos al riesgo de que el emisor no cumpla.

### Modelo mínimo por escrito
Desde la perspectiva del inversor:

`t = 0: −P₀`

`t > 0: +CFₜ`

Aquí `P₀` es el precio pagado hoy y `CFₜ` representa cada pago contractual futuro. Todavía no se calcula su valor presente; solo se fija la dirección de los flujos.

### Insights y contexto
- Un Estado suele financiar gasto público, infraestructura o refinanciación de deuda; una empresa puede financiar inversión, adquisiciones o necesidades generales. La finalidad no cambia la lógica básica del contrato.
- «Renta fija» no significa que el precio de mercado sea fijo. Lo que puede estar fijado es el calendario contractual de pagos; el precio variará después.
- El riesgo de crédito entra porque la promesa tiene un emisor. No desarrollar aún probabilidad de default, recovery ni spreads: basta con indicar que una promesa no equivale a certeza absoluta.

### Comprobación y transición
Comprobar que el alumno puede expresar el instrumento en una frase: «entrego dinero hoy y recibo pagos futuros acordados». Transición: «Ahora abrimos ese contrato y ponemos nombre a cada una de sus piezas».

## Implementación web — 2026-09-05

Candidata desarrollada a petición del usuario; la aprobación de la referencia original no se transfiere automáticamente a este render.

Diagrama radial conservado: emisores arriba, inversores abajo y usos laterales. Capital y pagos se revelan en sentidos opuestos; adaptación de lectura móvil.

Render implementado: [Slide 03](../../../../presentation/evidence/final/slide-03.jpg). Referencia PNG anterior conservada como baseline.
