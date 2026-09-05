# Repaso final — Minibloques 1 y 2

## Role
Recapitular al final del Bloque 1 los fundamentos contractuales y de valoración antes del segundo repaso.

## Required content
### Microbloque 1 — Qué es un bono
- Contrato entre emisor e inversor.
- Capital hoy a cambio de cupones y principal futuros.
- Emisor, cupón, vencimiento y principal / face value.
- Ejemplo canónico: `-100 → 4 → 4 → 4 → 4 → 104`.

### Microbloque 2 — Cómo se valora un bono
- `Precio = valor presente de los flujos futuros`.
- Fórmula general `P = Σ CF_t / (1+r_t)^t`.
- Antes de maturity: `CF_t = cupón × notional`.
- En maturity: `CF_n = cupón × notional + face value`.

Mensaje final: `Un bono es un contrato de flujos; su precio es el valor presente de esos flujos.`

## Approved composition
Composición horizontal aprobada como opción 3 del primer conjunto de recap: dos bandas apiladas, una por microbloque, con ejemplo de cash flows arriba y fórmula/definiciones abajo.

## Reference
`../references/12-recap-miniblocks-1-2.png`

## Descripción visual detallada
Lámina de recapitulación con marco ornamental doble sobre fondo navy. El título `Conclusiones — Microbloques 1 y 2` ocupa la cabecera en serif blanca, con raya cyan y pequeño rombo central. El contenido se divide en dos bandas horizontales apiladas, cada una contenida por un marco fino con remates decorativos en las esquinas. En el margen izquierdo de ambas bandas aparece un indicador vertical con nodo luminoso, numeración `1/2` o `2/2`, etiqueta de microbloque e icono circular.

La banda superior resume `Qué es un bono`. Un icono institucional introduce tres afirmaciones con pequeños pictogramas de contrato, porcentaje y ficha. A la derecha, una timeline compacta representa `HOY −100€`, cuatro cupones de `4€` y un flujo final de `104€`, unidos por una línea discontinua cyan. La banda inferior dedica un bloque editorial al título `Cómo se valora un bono`, seguido de una fórmula de valor presente encerrada en un marco ornamental claro. A su derecha se alinean las definiciones de `CFₜ`, `n`, `rₜ` y `CFₙ`.

Una cápsula ancha en la parte baja de la segunda banda destaca la conclusión `El precio refleja el valor presente de todos los flujos futuros`, precedida por una estrella. En el pie, un rótulo decorativo central con icono de institución cierra la secuencia: `De la estructura al precio`. La combinación de bandas, marcadores `1/2–2/2` y ornamentación común convierte los dos contenidos en etapas consecutivas de una misma recapitulación.

## Why approved
- Resume sin repetir literalmente las slides originales.
- Preserva el ejemplo canónico.
- Une estructura y valoración en una sola cadena conceptual.

## Do not change
- Mantener los dos microbloques en una única slide.
- No introducir YTM/CAGR todavía.
- Mantener el mensaje final que conecta contrato y valor presente.

## Apuntes de impartición

### Guion de recapitulación
1. Pedir al alumno que reconstruya el bono sin ayuda: emisor, precio hoy, cupón, notional, principal, frecuencia y vencimiento.
2. Recuperar la secuencia `−100, 4, 4, 4, 4, 104` y preguntar de dónde procede cada cifra.
3. Pasar de contrato a valoración: cada flujo se descuenta hasta hoy y el precio es la suma de esos valores presentes.
4. Señalar que el último `104` no es un cupón extraordinario: contiene `4` de cupón y `100` de devolución del principal.

### Fórmulas que deben poder reconstruirse
- `C = c × N = 4% × 100 = 4 €`.
- `CFₜ = 4 €` para `t=1…4`.
- `CF₅ = 4 + 100 = 104 €`.
- `P₀ = Σ[t=1..5] CFₜ/(1+rₜ)^t`.

### Diagnóstico rápido
El alumno debería poder contestar:
- por qué precio y valor nominal no son el mismo concepto;
- por qué el flujo final es mayor;
- por qué un flujo lejano se descuenta más;
- qué ocurre con el precio si aumentan las tasas manteniendo fijos los flujos.

Si alguna respuesta falla, volver a la anatomía o a la timeline antes de avanzar. Esta recapitulación debe cerrar la cadena `contrato → flujos → valor presente`, sin introducir todavía la comparación YTM–CAGR.

## Implementación web — 2026-09-05

Candidata desarrollada a petición del usuario; la aprobación de la referencia original no se transfiere automáticamente a este render.

Dos bandas preservadas: reconstruir contrato/pagos y después valor presente. Fórmula general y sustitución expandida; principal únicamente al vencimiento.

Render implementado: [Slide 12](../../../../presentation/evidence/final/slide-12.jpg). Referencia PNG anterior conservada como baseline.
