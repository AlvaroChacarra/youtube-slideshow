# Geometry Gate V3

## Contrato

Ejecutar el gate sobre cada hold estable y sobre muestras de cada beat en desktop, mobile presenter y downsample 16:9. El enhanced solo puede cerrar con `PASS`.

## Violaciones materiales

| Código | Condición | Owner primario |
|---|---|---|
| `TEXT_TEXT_OVERLAP` | dos labels no relacionados intersectan por encima de la tolerancia | Frontend; Visual si la región es insuficiente |
| `TEXT_OBJECT_OVERLAP` | un label invade un objeto que no lo contiene | Frontend |
| `CLIPPING` | contenido material sale de su safe area o viewport | Frontend; Visual si exige nueva composición |
| `OVERFLOW` | stage o región contractual genera scroll accidental | Frontend |
| `MIN_FONT` | texto visible cae bajo el mínimo del viewport | Visual para densidad; Frontend para implementación |
| `CONNECTOR_LABEL_COLLISION` | un conector cruza un label ajeno | Frontend |
| `PERSISTENT_DUPLICATE` | más de una copia visible del mismo `persistent_id` | Motion/Frontend |
| `EMPTY_STATE` | un hold o muestra no tiene protagonista ni evidencia suficiente | Motion |
| `PROTAGONIST_COMPETITION` | falta primario o coexisten varios primarios | Visual |
| `MOTION_DISCONTINUITY` | una muestra pierde el objeto persistente o salta fuera de safe area | Motion/Frontend |

## Medición

- Usar `getBoundingClientRect`, estilos computados y layout real del navegador.
- Excluir relaciones ancestro/descendiente y overlaps autorizados por ID.
- Medir el tamaño efectivo, no solo el `font-size` declarado.
- Aplicar el mínimo del viewport a texto material; solo metadata etiquetada explícitamente puede usar el floor común de 9,5 px.
- Muestrear conectores SVG a lo largo de su path y comprobar labels ajenos.
- Tratar DPR como evidencia de captura, no como aumento del tamaño CSS legible.

## Output

Emitir JSON con:

- `PASS` o `FAIL`;
- variante, slide, hold/beat y viewport;
- IDs implicados, medida y umbral;
- owner recomendado;
- path y hash de screenshot anotado.

Conservar una captura anotada representativa por slide/viewport aun en `PASS`; ante fallo, capturar cada estado afectado.

El baseline se ejecuta con `--allow-fail` como diagnóstico comparativo. Solo `enhanced_immersive` puede satisfacer el gate de aceptación; su reporte canónico está en `evidence/geometry/enhanced_immersive-report.json`.
