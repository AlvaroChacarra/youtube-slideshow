# Bloque 1 — presentación de 13 escenas

## Mandato y ejecución

Mejorar las trece slides aprobadas como presentación web high end, pedagógica y entretenida. Implementar el plan completo, auditar output real y corregir defectos materiales antes de entregar. El usuario dirige la exposición: las animaciones avanzan por pasos y se pueden recorrer hacia atrás.

- Inicio UTC: 2026-09-05T13:46:18Z. Deadline: 2026-09-05T16:46:18Z (tres horas, incluida revisión y esperas).
- Base: `main@29bd5a81e08348a0fc51abe9666b36f758f23453`.
- Rama: `experience/bonds-13-slides`.
- Reutilización selectiva: dominio financiero y dependencias de `course/bonds-foundations-runtime-v1@cf0d9ad8c869864aae8de266f700bd095457d834`.
- Skill: desarrolla-autonomo. Perfil recomendado Astra Extra High; selector principal no verificable ni modificado; agentes heredan perfil efectivo. Revisión independiente con contexto limpio.
- Autorizado: desarrollo, comprobación visual, commits, pushes y PR. No merge ni sustitución del Pages actual sin confirmación. Ningún push de esta rama despliega.

## Producto y límites

Una presentación de 13 slides, exactamente en el orden canónico. Abre directamente en el deck. Formato principal 16:9, vista de captura limpia, teclado, navegación por pasos, índice, reinicio, notas y ayudas conceptuales bajo demanda. Móvil con composición adaptada y controles táctiles. Sin landing comercial, plataforma LMS, login ni contenido curricular nuevo.

Dirección: navy profundo, cyan para contrato/descuento y verde contenido para cobro/resultado; tipografía sans legible, certificado marfil como objeto documental. Conservar relaciones espaciales de las referencias. Reconstruir texto/datos/diagramas como elementos editables; fotografía subordinada solo en escenas que la necesitan. Cada transición debe explicar una relación: el cambio de etapa no desmonta el escenario entero.

Separar fuente, cálculo y representación. Un cálculo alimenta cifras, fórmulas y gráficos. Las PNG permanecen como baseline histórico; fichas reciben un addendum de implementación que documenta cambios de composición y referencias al resultado. No declarar aprobadas por el usuario las nuevas capturas.

## Plan por slide

| # | Fuente | Mejora observable | Comprobación clave |
|---|---|---|---|
| 01 | Portada | Título protagonista, certificado/flujos/curva como anticipo dirigido | Composición izquierda/derecha, legibilidad, inicio directo |
| 02 | Índice | Cuatro estaciones conectadas, accesibles para saltar y regresar | Cuatro microbloques, rangos docentes 1–2/3–4/5–6/7–9 |
| 03 | Qué es un bono | Diagrama radial con certificado central, capital/pagos revelados causalmente | Emisores arriba, inversores abajo, usos laterales; direcciones correctas |
| 04 | Anatomía | Certificado vinculado a definiciones; paso final lo convierte en flujos | Precio separado de condiciones contractuales; 4% × 100 = 4, final 104 |
| 05 | Descuento teoría | Misma línea temporal, flujo elegido conecta con su término de fórmula | CF_t y r_t definidos; símbolos sin adelantar YTM ni ejemplo numérico |
| 06 | Descuento ejemplo | Cinco flujos enlazados a cinco valores presentes y suma; explorar r_5 | Principal solo al final; r_t no confundido con y; cálculo coherente |
| 07 | YTM vs CAGR | Comparación bilateral; cupones viajan a riqueza terminal; reinversión exploratoria | YTM=4%; efectivo 0%→120€→3,71%; cálculo YTM no exige reinversión |
| 08 | Mismo YTM | Tres columnas comparables, cálculo desplegado por pasos con valores sustituidos | Cupones 8/1/0%, precios y CAGR calculados sin redondeo intermedio |
| 09 | Varios bonos | Historia temporal de emisiones con vida residual cambiante y cupones constantes | Emisiones distintas siguen distintas; fechas/datos ilustrativos declarados |
| 10 | Cupón-precio-YTM | Tres contratos fijos frente al rendimiento exigido; precios reaccionan | Cupones 7/4/3%; al 4% precios 113,36/100/95,55; prima/par/descuento |
| 11 | Curva | Nube de bonos, lectura de un punto, línea fair y benchmarks por etapas | Ejes correctos, corte 2Y exacto, datos ilustrativos, YTM ≠ spot |
| 12 | Repaso 1–2 | Dos bandas; reconstrucción guiada contrato→flujos→valor presente | Último flujo y fórmula general, ayudas y respuestas bajo demanda |
| 13 | Repaso 3–4 | Dos bandas; comparación y curva cierran el recorrido; pregunta final | Sin duración/DV01; YTM/riqueza/mercado correctamente enlazados |

## Bloques de ejecución

1. [en curso] Plan subido, inspección de referencias y arquitectura mínima; dependencia/runtime preparados.
2. [pendiente] Secuencia de referencia 03–06 con estética, movimiento y controles; revisión independiente antes de escalar.
3. [pendiente] Completar 01–02 y 07–13 conservando la secuencia y el rigor; notas/ayudas y móvil.
4. [pendiente] Auditar las trece slides y estados densos en navegador. Corregir hallazgos; verificar cálculo y navegación.
5. [pendiente] Guardar evidencia, documentación, commits/push y PR; entregar resultado utilizable sin merge.

## Aceptación y evidencia

- Cobertura 13/13 y todos sus pasos, incluidos retroceso, salto desde índice, reinicio y enlaces directos.
- Revisión visual independiente del render, no solo del código: foco dominante, continuidad de objetos, correspondencia con fuente, ausencia de recortes/solapes y contraste/lectura.
- Capturas de las 13 finales a 1600×900; recorrido a 1280×720; escenas densas y controles en 390×844 y 844×390. Estados intermedios en transiciones de riesgo; reduced-motion.
- Comparación explícita con PNG originales y runtime anterior en escenas equivalentes. Una puntuación autodeclarada no prueba mejora ni equivale a aprobación humana.
- Validación financiera con invariantes y ejemplos; compilación reproducible y checks de integración. Cero errores de consola en recorrido verificado.
- Ayudas se abren/cierra con teclado y no roban el foco; controles de tasa no activan avance de slide; selección de gráfico accesible con teclado.
- Datos de curva/emisiones son ilustrativos, no cotizaciones reales. Precio de mercado vs principal; YTM calculada vs retorno realizado; curva de YTM vs tasas spot.
- Audio y exportación de vídeo no pedidos: no forman parte de aceptación. Se prepara vista limpia para grabación con OBS.

## Decisiones, hallazgos y continuidad

- La secuencia actual de 13 PNG prevalece sobre los 17 WebP del runtime antiguo. Se crea `presentation/` en este mismo repo, con reutilización selectiva de dominio/dependencias; el runtime anterior permanece íntegro en su rama.
- Se conservarán fórmulas y operaciones obligatorias; las revelaciones progresivas y ayudas absorberán densidad, sin eliminar contenido.
- Ambigüedad resuelta: desktop/proyección es superficie principal; móvil es adaptación de consulta y manipulación del mismo deck. No nueva plataforma de estudio.
- Pendientes iniciales del revisor: corregir ambigüedades YTM de imágenes frente a fichas, conectores de anatomía, escala/corte 2Y e historia temporal de emisiones.
- Estado actual: plan escrito; implementación no iniciada. Revisor independiente `presentation_reviewer`; asset opcional `skyline_asset`.
