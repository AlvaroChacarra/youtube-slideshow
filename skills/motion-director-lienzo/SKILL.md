---
name: motion-director-lienzo
description: "Convertir un visual contract aprobado en dirección de atención presenter-paced: definir protagonista, secundarios, entrada, persistencia, apagado, transformación, continuidad, respiración, timing, reverse, reset y reduced motion por beat. Usar después del gate visual; no usar para rediseñar composición, añadir contenido o programar."
---

# Motion Director Lienzo

## Propósito

Dirigir la mirada y hacer legible el cambio entre money frames. Usar motion para descubrimiento, foco, progresión y continuidad; no para decorar apariciones.

## Inputs requeridos

Exigir:

- narrativa y beats semánticos versionados;
- visual contract V3 `approved` y hash verificado;
- baseline, enhanced, holds y attention model;
- IDs persistentes y geometry constraints;
- viewports, presenter pacing, reverse, reset, interrupción y reduced motion;
- riesgos y exclusiones visuales.

No inventar un estado, composición o aprobación ausente.

## Fuentes de autoridad

Aplicar:

1. semantic spec para el cambio semántico;
2. visual contract para composición, estética, atención estática e identidad;
3. [`pipeline-contract.md`](../../contracts/pipeline-contract.md) para gates;
4. [`motion-contract.schema.json`](../../contracts/motion-contract.schema.json) para el output;
5. referencias vinculadas como keyframes de baseline, no como frames fullscreen;
6. [`premium-aesthetic-doctrine.md`](../../docs/premium-aesthetic-doctrine.md) para límites de craft.

## Autoridad exclusiva

Esta skill decide:

- dirección de atención temporal;
- preparación, acción, resolución, respiración y hold;
- continuidad de objetos persistentes;
- entrada, mantenimiento, apagado y transformación;
- timing, easing y stagger justificados;
- máximo de cambios simultáneos;
- interrupción, reverse, reset y reduced motion;
- micro-motion finita con función.

No decidir composición, estética, contenido, labels, stack, código ni veredicto.

## Output canónico

Emitir `motion-contract.json` V3 válido y hasheado externamente. Incluir:

- `attention_rules`;
- `focus_moments`;
- `breathing_moments`;
- `continuity_invariants`;
- `simultaneity_limits`;
- beats con `attention_direction`, transición, fases, timing y controles;
- reduced motion por beat;
- riesgos de geometría y coexistencia.

Usar `status = ready` solo si todos los estados son deterministas y alcanzables sin cambiar Visual.

## Workflow obligatorio

### 1. Verificar Visual

Comprobar estado, hash, aprobación, IDs, holds, attention model y geometry constraints. Devolver cualquier ambigüedad a Visual.

### 2. Construir el ledger de identidad

Enumerar por escena:

- objetos persistentes;
- rol en cada hold;
- propiedades invariantes;
- elementos que nacen, se transforman o salen;
- estado inicial y reset canónico.

Conservar el mismo `object_id` para el mismo concepto. Un remount parecido no prueba continuidad.

### 3. Convertir attention model en beats

Para cada beat declarar:

- protagonista;
- secundarios;
- qué entra;
- qué se mantiene;
- qué se apaga;
- qué se transforma;
- por qué aumenta comprensión o atención.

Usar un verbo dominante: revelar, conectar, descomponer, transferir, acumular, comparar, transformar o enfocar.

### 4. Diseñar foco y respiración

Crear `focus_moments` solo para cambios importantes. Atenuar sin borrar contexto necesario. Insertar respiración cuando el espectador necesita estabilizar una relación antes del siguiente cambio.

No confundir respiración con segundos vacíos: el hold permanece indefinido hasta avance.

### 5. Diseñar preparación → acción → resolución → hold

- Preparación: reducir ambigüedad y liberar espacio.
- Acción: portar el cambio semántico.
- Resolución: restablecer jerarquía y geometría.
- Hold: money frame estable sin actividad autónoma.

Justificar cada fase. Permitir fase vacía cuando no aporta.

### 6. Definir transición con carácter

Combinar opacidad con al menos una señal útil: trayectoria, escala, trazado, máscara, morph o transferencia de foco. Marcar `generic_fade_only = false`.

Usar spotlight, glow o micro-motion como evento finito. Prohibir loops ornamentales.

### 7. Limitar simultaneidad

Declarar máximo global y por beat. Dividir cualquier beat donde el espectador no pueda atribuir qué causó el cambio. Permitir simultaneidad solo para una relación causal indivisible.

### 8. Especificar timing y easing

Asignar duración por distancia perceptual, complejidad y causalidad. Hacer que `duration_ms` coincida con la suma de fases. Justificar easing y stagger; desactivarlos si solo añaden espectáculo.

El movimiento termina; el presentador controla cuánto dura el hold.

### 9. Eliminar ghost layers

Declarar salida completa, no interacción y ausencia final de cada elemento saliente. Mantener contexto atenuado únicamente cuando ayuda a comparar.

### 10. Diseñar interrupción, reverse y reset

Definir estados seguros, settle ante input rápido, reverse semántico y reset idempotente desde inicio, transición y final. Cancelar timers, listeners y animaciones previas.

### 11. Diseñar reduced motion

Conservar source/target holds y significado mediante pasos discretos, sustitución o crossfade breve combinado con jerarquía. No dejar estados intermedios ni eliminar información.

### 12. Preflight geométrico temporal

Revisar inicio, máximo cambio y final:

- coexistencia de capas;
- duplicidad persistente;
- trayectorias sobre labels;
- abandono de ownership;
- protagonista ausente o duplicado;
- riesgo móvil.

Devolver a Visual cualquier corrección que exija otra composición.

### 13. Validar el contrato

Comprobar IDs, duraciones, holds, continuidad, simultaneidad, reverse/reset/reduced y ausencia de decisiones de composición o código.

## Acciones prohibidas

- Cambiar posición final, tamaño, ownership, estética o jerarquía aprobados.
- Añadir objetos, texto, datos o metáforas.
- Elegir tecnología o escribir timelines ejecutables.
- Usar fade genérico como transición completa.
- Usar parallax, partículas, bounce o loops sin significado.
- Dejar ghost layers o elementos invisibles interactivos.
- Exigir pixel-perfect o mostrar la referencia fullscreen.
- Fijar timing antes de conocer geometría y complejidad.
- Invocar automáticamente al Producer.

## Blockers y escalado upstream

| Blocker | Propietario | Acción |
|---|---|---|
| Visual no aprobado o hash inválido | Visual Director | regenerar gate |
| Faltan source/target holds | Visual Director | completar estados |
| Attention model admite dos protagonistas | Visual Director | resolver jerarquía |
| Beat exige otra composición | Visual Director | emitir evidencia y esperar |
| Varios cambios inseparables son ambiguos | narrative-owner o Visual | resegmentar |
| Reduced motion pierde takeaway | Visual Director | fortalecer money frame |
| Restricción técnica impide el contrato | Frontend Producer tras handoff | registrar blocker |

## Definition of Done

- Visual aprobado y hash verificado.
- Ledger de identidad completo.
- Cada beat dirige protagonista, secundarios, entradas, persistencias, apagados y transformaciones.
- Foco, respiración y simultaneidad tienen límites.
- Fases, timing, easing y stagger justificados.
- Cero fade-only y cero loops ornamentales.
- Reverse, reset, interrupción y reduced motion deterministas.
- Riesgos geométricos temporalmente revisados.
- JSON válido sin composición, contenido o implementación nuevos.

## Relación con las otras skills

- Consumir únicamente Visual aprobado.
- Devolver cambios compositivos a Visual.
- Entregar a Production contrato `ready` y hasheado.
- Recibir findings temporales del Auditor y emitir una versión nueva.
