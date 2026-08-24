# Image-to-Code Integration

## 1. Propósito

Image-to-Code es un upstream opcional del pipeline de cuatro skills. Su función es entregar una decisión visual ya aprobada con suficiente trazabilidad para convertirla en contrato, motion, implementación y evidencia. No añade una quinta etapa ni sustituye al Visual Director.

## 2. Cuatro niveles de autoridad

| Nivel | Responsabilidad | No gobierna |
|---|---|---|
| `DESIGN.md` | gusto y reglas visuales reutilizables | narrativa o composición de una unidad concreta |
| `PROJECT.md` | narrativa, secuencia, ejemplo y convenciones del proyecto | detalle perceptual de cada unidad |
| spec de unidad | objetivo, contenido obligatorio, semántica, restricciones y exclusiones | apariencia aproximada cuando existe referencia aprobada |
| referencia aprobada | composición, jerarquía, proporciones, apariencia y densidad del hold vinculado | claims, cifras, fórmulas o significado |

Regla de conflicto:

- semántica: gana la spec;
- percepción: gana la referencia aprobada;
- contradicción material: bloquear y corregir el bundle upstream.

Ningún consumidor puede escoger la fuente más conveniente ni completar un conflicto desde memoria conversacional.

## 3. Bundle mínimo y carga selectiva

El Visual Director recibe branch y commit fijados, paths y hashes del diseño global, proyecto, specs afectadas y referencias citadas. Cada referencia necesita evidencia de aprobación y un identificador estable.

Para trabajar en una unidad cargar únicamente:

1. diseño global;
2. contrato del proyecto;
3. spec de la unidad afectada;
4. referencias citadas por esa spec.

No cargar todas las unidades o imágenes por defecto. El contrato admite cualquier cardinalidad y no fija un número de unidades.

## 4. Selección de modo visual

### `concept_first`

Usar cuando no existe un bundle perceptual aprobado y verificable. Mantener exploración de dominio, anti-default inventory, tres direcciones, money frames y checkpoint humano.

### `approved_reference`

Usar cuando existen simultáneamente diseño global, proyecto, spec de unidad, referencia y aprobación verificable. Visual interpreta y formaliza; no genera alternativas, no rediseña y no repite el checkpoint.

Si existe la imagen pero no la evidencia de aprobación, mantener `pending_user_approval`.

## 5. Binding a holds

Una referencia es un ancla perceptual, no una descripción completa de la escena. Cada binding declara:

- referencia, escena y uno o más holds;
- propiedades perceptuales obligatorias;
- propiedades que pueden cambiar;
- tolerancias conceptuales;
- partes no cubiertas por la imagen.

La meta es fidelidad perceptual y estructural, no identidad de píxel. Un hold no cubierto se deriva del visual contract; una nueva composición material vuelve a Visual.

## 6. Reconstrucción, no fullscreen

Satisfacer el contrato mostrando la referencia como imagen fullscreen está prohibido. El diseño debe reconstruirse.

Code-native por defecto:

- texto, cifras, fórmulas y labels;
- ejes, curvas, charts, timelines y conectores;
- estados interactivos y objetos con valores variables;
- cualquier elemento que participe en motion semántico.

Asset permitido con procedencia:

- fotografía, ilustración o textura;
- material artístico complejo sin manipulación estructural.

Visual clasifica los elementos; Production implementa esa clasificación y documenta excepciones.

## 7. Motion como transición entre keyframes

Los holds vinculados actúan como keyframes perceptuales. Motion puede diseñar preparación, acción y resolución entre ellos, pero debe devolver una composición reconocible en cada ancla. Los estados intermedios pueden diferir; un nuevo hold material no cubierto requiere Visual.

## 8. Producción y comparación

Antes de motion, Production compara referencia aprobada y screenshot del navegador para layout, protagonista, escala, proporciones, spacing, alignment, whitespace, jerarquía tipográfica, color, geometría, labels, assets y densidad.

La comparación puede combinar diff de screenshot, bounding boxes, geometría DOM, visión, comparación perceptual e inspección humana/agente. Un pixel diff aislado no decide fidelidad. Toda diferencia material deliberada necesita aprobación verificable.

## 9. Auditoría

El orden es obligatorio:

1. blind decode del output sin mostrar rationale, contratos o referencia;
2. comprobación de fidelidad semántica contra la spec;
3. comprobación de fidelidad perceptual contra la referencia;
4. inspección de implementación y causas.

El Auditor distingue:

- fallo upstream: el output reproduce la referencia, pero la referencia no explica bien la spec;
- fallo de implementación: la referencia es válida, pero el navegador pierde su jerarquía o composición.

`ready_for_user_review` y `reference_candidate` requieren `reference_fidelity = passed` cuando el bundle es aplicable.

## 10. Invalidación y no dependencia

Un cambio material en diseño, proyecto, spec o referencia invalida los artefactos downstream definidos por [`pipeline-contract.md`](../contracts/pipeline-contract.md). No se actualizan hashes silenciosamente.

El upstream se consume por archivos hasheados y commit fijado. No necesita estar instalado, no se invoca automáticamente y no se mergea en esta rama.
