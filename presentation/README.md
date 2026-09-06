# Presentaciones interactivas reutilizables

Dos decks comparten el mismo reproductor: **Fundamentos de los bonos** (13 escenas,43 pasos) y **Del dato a una predicción** (3 escenas,7 pasos). La evolución está implementada en PR #4; main conserva la entrega aprobada de PR #3 hasta la aprobación del usuario. Estado verificable y límites: [AUDIT.md](AUDIT.md). Roadmap único: [WORK_PLAN.md](../WORK_PLAN.md).

## Abrir y presentar

La compilación genera `dist/fundamentos-bonos.html` y `dist/regresion-visual.html`: aplicación, fuentes, estilos, fórmulas e imágenes incrustados. Abrir en un navegador que ejecute JavaScript. Ambos archivos se han probado servidos por HTTP; no se certifica `file://` en todos los navegadores ni los visores móviles de archivos. Las rutas web son `/` y `/regression/`.

- Flechas, espacio o Page Up/Down: pasos. Home/End: extremos. I: índice. N: notas y pregunta.
- R reinicia la escena y sus controles; C activa la vista limpia. C o Esc permiten volver.
- La escena recuerda su paso y los escenarios se conservan al navegar. Los sliders usan las flechas para ajustar valores, sin avanzar el deck.
- Los conceptos bajo la escena abren una explicación, supuestos y lugar de introducción. Abrir un diálogo detiene el replay en ambas ventanas y conserva el estado. Cerrar devuelve el foco al control de origen.
- «Abrir vista del ponente» separa notas, pregunta, siguiente paso y controles del público. Permitir esa ventana y mantener abierta la original. Las ventanas relacionadas se sincronizan; recargar la ventana de público corta esa relación y requiere abrir de nuevo la vista del ponente.
- «Sesión y grabación» registra tiempos, pasos y escenarios. Descargar el archivo para conservarlo, abrirlo después y reproducirlo. La sesión vive en memoria hasta descargarla. No contiene audio, cámara ni vídeo.
- «Copiar enlace al estado» conserva escena, paso y todos los supuestos/selecciones. El enlace necesita que su página esté disponible para quien lo recibe; un enlace local no distribuye el HTML.
- «Reservar área de cámara» deja espacio junto a la presentación en escritorio para componerla con OBS u otro software. No enciende una cámara ni produce un vídeo; en pantallas pequeñas se utiliza la composición de lectura.

[Recorrido de ejemplo](examples/bonds-guided-session.json):82 segundos,14 estados de las escenas05–07. Importarlo desde «Abrir archivo de sesión» y pulsar Reproducir. Muestra descuento, precio, reinversión0/4/8% y el último pago sin reinversión posterior. Es una guía de ensayo, sin narración ni validación con alumnos.

`prefers-reduced-motion` y `?motion=0` desactivan el movimiento. Enlaces de posición: `?slide=6&step=3` (slide desde1;step desde0); `capture=1` abre la vista limpia. En móvil se lee mediante scroll, con la misma semántica y escenarios.

## Qué ha cambiado en bonos

- Las cifras, fórmulas y etiquetas cambian juntas. Se anima la atención y el objeto, sin interpolar resultados financieros incompatibles.
- La selección de un pago persiste entre descuento y reinversión. Cada fila muestra cuánto tiempo queda hastaT y su contribución a la riqueza terminal; el pago final no recibe años ficticios.
- La comparación móvil mantiene tres casos alineados y revela riqueza/CAGR en su paso; el cálculo se consulta por cupón.
- La curva usa escalas D3 con dimensiones reales, foco0–10Y y contexto0–50Y. La selección se conserva fuera del detalle y se identifica en el contexto. Los ticks y la leyenda principal tienen12px reales; el selector nativo permite elegir todos los puntos.
- Los cambios de muestra son explícitos. El repaso utiliza la misma nube y ajuste de la escena11.

## Desarrollar y reconstruir

Node24.19.x, npm11.9.x (runtime conservado del proyecto):

```bash
cd presentation
npm ci
npm run dev
```

```bash
ASTRO_TELEMETRY_DISABLED=1 npm run build
```

La compilación comprueba tipos, ejecuta 40 pruebas y genera ambas webs y ambos HTML. El empaquetado conserva tanto CSS enlazado como estilos incrustados por Astro, en el orden original. Desarrollo y build utilizan cachés distintas. `PRESENTATION_BASE=/youtube-slideshow/` permite construir para esa subruta.

GitHub Actions ejecuta validación y build en la PR. El workflow no publica ni modifica Pages.

## Añadir otro deck

1. Crear `src/decks/<tema>/index.tsx` con una `DeckDefinition<Scenario>` tipada: identificadores estables, capítulos, escenas/pasos, conceptos, entidades, notas, escenarios iniciales y validación.
2. Escribir el cálculo y las visuales del tema fuera de `src/player/`. Usar las piezas demostradas de `src/visuals/` y el estilo base compartido. Las visuales específicas siguen siendo componentes locales; no hay un lenguaje universal de layouts.
3. Añadir un wrapper `<Player deck={definition}/>` y una página Astro que cargue fuentes, `player/base.css`, `player/player.css` y los estilos propios del deck. El deck de regresión es el ejemplo completo sin imports financieros ni CSS de bonos.
4. Añadir un entry de `createRoot` y una entrada en `src/delivery/decks.mjs` para incluirlo en el mismo empaquetado.
5. Ejecutar validación y probar su entrega real. `assertDeck` comprueba referencias; `parseSession` rechaza versiones, escenarios y secuencias incompatibles. Cambiar `deck.version` al romper compatibilidad con sesiones existentes.

La reutilización demostrada incluye navegación, ayudas, notas, ponente, escenarios, grabación/replay, números, fórmulas, controles, geometría responsive y empaquetado. No se afirma un porcentaje de reutilización ni que todos los componentes financieros sirvan para cualquier tema.

## Autoridad de contenido y módulos

| Módulo | Responsabilidad |
|---|---|
| `src/player/` | Contrato, navegación, foco, sincronización de ventanas, sesiones y controles; sin imports de bonos |
| `src/visuals/` | Fórmula, aparición, cifra atómica, control de rango y medida de ancho |
| `src/decks/bonds.tsx` | Mapeo de las13fichas al contrato, escenarios financieros y persistencia de objetos |
| `src/presentation/` | Copy y visuales del deck de bonos; estilos de contrato/mercado |
| `src/domain/` | Pagos, descuento, YTM, reinversión y nube/ajuste ilustrativo |
| `src/decks/regression/` | Segundo tema, datos ilustrativos, cálculo, visuales y tema propios |
| `src/delivery/` y `scripts/build-offline.mjs` | Definiciones de salida y empaquetado común |
| `tests/` |12tests originales de dominio/navegación y26tests adicionales de estado, UI, ventanas y sesiones |

Las fichas Markdown gobiernan el significado financiero; el código tipado gobierna el cálculo. El registro de escenas mapea explícitamente conceptos/prerrequisitos y entidades. Los PNG históricos no se sobrescriben; `evidence/implementation/` conserva los renders auditados de esta candidatura.

Se calcula con precisión completa y se redondea al mostrar. Emisiones y nube son ilustrativas, no cotizaciones. La curva es deYTM, no spot. Su ajuste utiliza mínimos cuadrados con base `[1,exp(−t/5),t/50]`,30 observaciones y8benchmarks. La regresión usa4datos inventados y una regla ajustable; no acredita causalidad ni precisión fuera de la muestra.

Las escenas pueden declarar `entranceDelay` (segundos) para reservar el viaje de objetos persistentes antes de mostrar el cuerpo. El player controla esa entrada, la cancela al cambiar de escena y la omite con movimiento reducido. En bonos 03–07 se reservan0,8 s.
