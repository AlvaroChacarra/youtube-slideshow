# Fundamentos de los bonos — 13 slides

Presentación web del Bloque 1 canónico. Trece composiciones y 43 estados de explicación. El contrato y su línea de pagos mantienen identidad entre financiación, anatomía, descuento y rendimiento (este último viaje en escritorio). Las referencias PNG y sus fichas permanecen en `projects/Fixed income/Bloque 1 Fundamentos de los Bonos/`.

## Abrir y presentar

La entrega `fundamentos-bonos.html` contiene fuentes, ilustración, ecuaciones y aplicación para abrirla en un navegador con JavaScript. El mismo archivo se verificó servido por HTTP; su apertura mediante `file://` no se ha ensayado en todos los navegadores ni en los visores de archivos. No debe abrirse como una previsualización de texto.

- Flechas, espacio o Page Up/Down: recorrer los pasos. Home/End: extremos del bloque.
- I: índice de trece slides. Cada slide recuerda el último paso visitado.
- N: notas y pregunta de recuperación con respuesta desplegable.
- R: reiniciar la slide y su escenario. C: vista limpia para grabar; C o Esc para volver.
- Los controles táctiles ofrecen las mismas acciones. En pantallas pequeñas se consulta una slide a la vez con scroll y tipografía adaptada.
- Descuento: mover solo r₅. YTM/CAGR: mover reinversión g. Precios: mover YTM exigida. Curva: seleccionar un punto; en móvil también mediante selector.

Las flechas de un slider ajustan la tasa y no avanzan la presentación. Se respeta `prefers-reduced-motion`; `?motion=0` desactiva las animaciones también para inspección. Enlaces directos: `?slide=6&step=3`; slide empieza en 1, step en 0. `capture=1` abre la vista limpia. Las tasas exploradas permanecen al navegar durante la sesión; el enlace no serializa esos supuestos.

## Desarrollar y reconstruir

Node 24.19.x, npm 11.9.x (versiones conservadas del runtime del proyecto):

```bash
cd presentation
npm ci
npm run dev
```

```bash
ASTRO_TELEMETRY_DISABLED=1 npm run build
```

La compilación verifica tipos y ejecuta doce tests; produce la web estática en `dist/` y el archivo único `dist/fundamentos-bonos.html`. `PRESENTATION_BASE=/youtube-slideshow/` permite construir para esa subruta. La creación del HTML usa exactamente `Presentation`, no una segunda implementación.

La PR #3 está fusionada en `main@31d0687` por autorización del usuario. No hay workflow de despliegue en esta implementación ni se ha sustituido el Pages anterior. El [plan de evolución](../WORK_PLAN.md) está pendiente de discusión; no describe capacidades ya implementadas.

## Fuente, cálculo y representación

- `src/presentation/content.ts`: orden, títulos, pasos, explicaciones y preguntas de las trece slides.
- `src/domain/`: pagos, descuento, YTM, reinversión y nube/ajuste ilustrativo. Derivado del dominio del runtime anterior; la curva recibe una corrección documentada.
- `model.ts`: escenarios de la presentación y navegación.
- `Foundations.tsx`, `Markets.tsx`, `primitives.tsx`: representaciones HTML/SVG/KaTeX; el certificado y la línea de pagos viven fuera del cambio de slide.
- `Presentation.tsx`: sesión, controles, accesibilidad y animación de objetos.
- `scripts/build-offline.mjs`: empaquetado autocontenido. `tests/finance/`: identidades financieras, casos docentes y recorrido completo.

Las cifras se calculan con precisión completa y se redondean al mostrarlas. La curva y las emisiones son ilustrativas, no cotizaciones. La curva representada es de YTM; no proporciona las tasas spot para descontar cada flujo. El ajuste usa mínimos cuadrados con base `[1, exp(−t/5), t/50]`, sobre treinta observaciones que incluyen los ocho benchmarks.

## Revisión

`AUDIT.md` registra evidencia, hallazgos corregidos y límites de la validación. Las capturas de `evidence/final/` corresponden a estados finales de las trece slides. El PROJECT del bloque mantiene el estado de integración/aprobación; los addenda antiguos de las fichas describen la candidatura previa al merge. La nueva auditoría de evolución está en la sección vigente de `AUDIT.md`.
