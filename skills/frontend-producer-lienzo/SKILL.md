---
name: frontend-producer-lienzo
description: "Implementar baseline y enhanced desde contratos V3 vigentes con craft real, layout robusto, medición de texto, callouts inteligentes, responsive, presenter pacing y geometry gate automatizado. Usar para construir, probar y evidenciar el runtime; no usar para rediseñar, alterar timing contractual o emitir veredictos."
---

# Frontend Producer Lienzo

## Propósito

Convertir contratos aprobados en output ejecutable, medible y reproducible. Elevar implementación y craft sin introducir decisiones visuales ocultas.

## Inputs requeridos

Exigir:

- semantic specs y hashes;
- visual contract V3 `approved` + hash;
- motion contract V3 `ready` + hash;
- source manifest, referencias y aprobación;
- baseline/enhanced, IDs, holds y deltas;
- sistema estético y geometry constraints;
- viewports, navegador, comandos y criterios de evidencia;
- Definition of Done.

Bloquear hashes inválidos, contratos superseded o inputs solo conversacionales.

## Fuentes de autoridad

Aplicar:

1. semantic spec para contenido y cifras;
2. visual contract para composición, estética, variantes y geometría;
3. motion contract para atención, continuidad y tiempo;
4. [`pipeline-contract.md`](../../contracts/pipeline-contract.md) para gates;
5. [`implementation-manifest.schema.json`](../../contracts/implementation-manifest.schema.json) para el output;
6. [`geometry-gate.md`](../../docs/geometry-gate.md) para medición;
7. constraints técnicos explícitos.

No arbitrar conflictos upstream. Bloquear y devolver.

## Autoridad exclusiva

Esta skill decide:

- tecnología mínima y arquitectura del código;
- implementación visual y motion contractual;
- medición real de texto y geometría;
- estrategia de layout, callouts y responsive dentro del contrato;
- presenter pacing, interrupción, reverse, reset y reduced motion;
- geometry gate, tests, capturas y manifest;
- optimización técnica sin cambio perceptual material.

No decidir composición, estética, contenido, timing contractual ni veredicto.

## Output canónico

Emitir `implementation-manifest.json` V3 válido con:

- commit y hashes consumidos;
- variantes `baseline_faithful` y `enhanced_immersive`;
- comandos, stack, outputs y viewports;
- escenas, holds y beats implementados;
- tests y evidencia por estado;
- comparaciones original/baseline/enhanced;
- `geometry_gate` con reports, cobertura y capturas anotadas;
- desviaciones y limitaciones.

`status = implemented` exige enhanced geometry `PASS`, tests verdes y cero desviación material no aprobada.

## Workflow obligatorio

### 1. Validar gates upstream

Recalcular hashes, comprobar versions major, estados, approvals, bindings, deltas y source commit. No editar contratos para acomodar el código.

### 2. Construir matriz de obligaciones

Mapear cada escena, hold, beat, objeto persistente, viewport y constraint a:

- owner de código;
- test;
- evidencia;
- gate de salida.

Resolver gaps antes de programar.

### 3. Seleccionar tecnología mínima

Preferir HTML semántico, CSS, SVG y APIs nativas cuando basten. Justificar cada dependencia material. Mantener runtime sin dependencia externa cuando el contrato no la requiera.

Clasificar como code-native texto, cifras, fórmulas, charts, timelines, conectores, labels, controles y objetos animables. No rasterizarlos.

### 4. Implementar baseline primero

Reconstruir los holds baseline sin motion. Comparar contra la referencia en layout, jerarquía, proporción, spacing, tipografía, color y densidad. Usar pixel diff solo como señal auxiliar.

No cargar la referencia en el runtime ni mostrarla fullscreen. Reservarla para la superficie de comparación.

### 5. Implementar enhanced desde deltas

Ejecutar solo cambios declarados. Verificar que cada delta tiene owner, código y evidencia. Aplicar la mini-doctrina estética sin añadir adornos no contratados.

### 6. Construir layout robusto

Usar grid/flex/constraints, no coordenadas frágiles para contenido variable. Implementar:

- safe areas;
- gaps mínimos;
- regiones con ownership;
- callouts que eligen posiciones permitidas;
- stacking explícito;
- conectores con rutas que evitan labels;
- límites de ancho/alto y overflow;
- composición móvil hermana.

### 7. Medir texto real

Medir después de fuentes y layout con `getBoundingClientRect`, estilos computados y overflow real. Cuando exista fitting autorizado:

- buscar tamaño dentro de rango contractual;
- no bajar del mínimo;
- dividir contenido o bloquear si no cabe;
- repetir ante resize mediante observación controlada.

No ocultar densidad con microtexto, truncado o scale global.

### 8. Implementar motion y atención

Mantener nodos persistentes. Ejecutar entrada, apagado, transformación, spotlight y respiración contractuales. Combinar opacidad con trayectoria, escala, máscara o trazado; evitar fade-only.

Resolver input rápido a estado seguro. Finalizar toda animación en hold estable e indefinido.

### 9. Implementar reverse, reset y reduced motion

Probar forward/reverse por beat, reset desde inicio/intermedio/final y dos resets consecutivos. Cancelar animaciones y listeners. Conservar holds y significado en reduced motion.

### 10. Implementar responsive real

Validar:

- desktop contractual;
- mobile presenter sin scroll que separe canvas y controles;
- downsample 16:9 con labels materiales sobre mínimo;
- touch targets y teclado;
- protagonista, ruta de lectura y fórmula preservados.

Si mobile necesita otra composición no contratada, volver a Visual.

### 11. Ejecutar geometry gate

Muestrear cada hold y, por beat, inicio, máximo cambio y final. Detectar al menos:

- text/text y text/object overlap;
- clipping y overflow;
- mínimo tipográfico;
- conector contra label;
- duplicidad persistente;
- estado vacío;
- competencia de protagonista;
- discontinuidad material.

Emitir `PASS/FAIL`, hold/beat, IDs, owner y screenshot anotado. Un failure enhanced bloquea `implemented`.

### 12. Generar evidencia comparativa

Capturar:

- originales hasheados;
- baseline final desktop/móvil;
- todos los holds enhanced desktop/móvil;
- muestras de transición;
- reverse, reset y reduced motion;
- comparativas original/baseline/enhanced;
- anotaciones geométricas.

### 13. Ejecutar tests

Cubrir inventario de estados, límites, presenter pacing, input rápido, identidad, reverse, reset idempotente, reduced motion, responsive, cero requests de referencia y geometría.

### 14. Emitir manifest

Registrar comandos exactos, hashes, outputs, reports, diferencias, aprobaciones y limitaciones. Reproducir desde instalación limpia antes de cerrar.

## Acciones prohibidas

- Editar narrativa o contratos consumidos.
- Cambiar composición, estética, labels o timing por conveniencia.
- Añadir elementos “para que se entienda” sin delta visual aprobado.
- Usar posición absoluta frágil donde el contenido pueda variar.
- Ocultar overflow, truncar claims o bajar de mínimo tipográfico.
- Introducir autoplay, loops o ghost layers.
- Rasterizar texto, fórmulas, charts o timeline.
- Usar referencia fullscreen o exigir pixel-perfect.
- Falsear geometry, evidencia o un test para cerrar `implemented`.
- Emitir veredicto.
- Invocar automáticamente al Auditor.

## Blockers y escalado upstream

| Blocker | Propietario | Acción |
|---|---|---|
| Hash, state o schema inválido | propietario upstream | regenerar |
| Hold imposible sin otra composición | Visual Director | evidenciar y esperar |
| Beat imposible sin otro timing | Motion Director | evidenciar y esperar |
| Texto no cabe sobre mínimo | Visual Director | reducir densidad o dividir hold |
| Mobile degenera con layout contratado | Visual Director | aprobar sibling |
| Geometry falla por implementación | esta skill | corregir y repetir gate |
| Referencia adecuada, browser pierde jerarquía | esta skill | corregir baseline |
| Evidencia no reproduce | esta skill | corregir harness |

## Definition of Done

- Gates y hashes verificados.
- Baseline fiel y enhanced implementados por separado.
- Deltas trazados a código y evidencia.
- Texto medido y responsive real.
- Presenter pacing, input rápido, reverse, reset y reduced motion pasan.
- Geometry enhanced `PASS` en todos los viewports/estados.
- Evidencia original/baseline/enhanced completa y hasheada.
- Cero referencias fullscreen, ghost layers y desviaciones silenciosas.
- Manifest V3 válido y reproducible.

## Relación con las otras skills

- Consumir solo contratos vigentes.
- Devolver blockers a Visual o Motion sin aplicar cambios de autoridad.
- Entregar al Auditor output real, manifest, reports y evidencia.
- Remediar findings técnicos mediante nuevo sujeto y nueva auditoría.
