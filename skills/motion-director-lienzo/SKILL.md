---
name: motion-director-lienzo
description: Convierte un visual contract aprobado en transformaciones semánticas presenter-paced con estados, continuidad, timing, easing, holds, interrupción, reverse, reset y reduced motion. Usar después del checkpoint visual; no usar para rediseñar composición, añadir contenido o implementar código.
---

# Motion Director Lienzo

## Propósito

Convertir estados visuales aprobados en transformaciones que expliquen aparición, causalidad, transferencia, acumulación, comparación, cambio de variable, cambio de representación o conservación de identidad.

Motion no adorna una composición: hace legible el cambio entre dos estados semánticos.

## Cuándo utilizar esta skill

Utilizar cuando existe un visual contract aprobado y deben definirse beats, continuidad temporal o remediarse un finding de motion. No utilizar para elegir una composición, reescribir el contenido, programar timelines o emitir un veredicto.

## Inputs requeridos

Exigir:

- narrativa y beats semánticos versionados;
- `visual-contract.json` con estado `approved`;
- `visual_contract_hash` verificado;
- money frames y estados estáticos de origen/destino;
- objetos que deben persistir;
- restricciones presenter-paced;
- requisitos de interruptibilidad;
- requisitos de reverse y reset;
- política de reduced motion;
- viewports y constraints móviles;
- cualquier riesgo o exclusión declarado por Visual.

No inferir un estado visual ausente ni reconstruir la aprobación desde el chat.

## Fuentes de autoridad

Aplicar este orden:

1. narrativa para el cambio semántico;
2. visual contract aprobado para composición y objetos;
3. [`pipeline-contract.md`](../../contracts/pipeline-contract.md) para gates y fronteras;
4. [`motion-contract.schema.json`](../../contracts/motion-contract.schema.json) para el output;
5. [`source-map.md`](../../docs/source-map.md) como doctrina consultiva.

## Autoridad exclusiva

Esta skill decide:

- estados temporales entre holds aprobados;
- transformación y continuidad de objetos;
- preparación, acción, resolución y hold;
- timing, duración, easing y stagger justificado;
- interruptibilidad y estados seguros;
- comportamiento de reverse y reset;
- fallback de reduced motion;
- desaparición completa y riesgos de solape.

No decide composición, representación, contenido, labels, stack, código ni veredicto.

## Output canónico

Emitir `motion-contract.json`, válido contra [`motion-contract.schema.json`](../../contracts/motion-contract.schema.json). Usar `status = ready` solo cuando todos los beats son deterministas y ejecutables; usar `blocked` si el visual contract no puede animarse sin degradarse.

## Workflow obligatorio

### 1. Verificar el gate visual

Comprobar:

- estado visual `approved`;
- aprobación humana completa;
- hash recibido igual al artefacto leído;
- todos los source/target holds existentes;
- composición, protagonista y ownership inequívocos.

Si falta algo, devolver a Visual. No completar el contrato visual desde Motion.

### 2. Construir el ledger de estados e identidades

Para cada escena enumerar:

- estado inicial y holds alcanzables;
- `object_id` de cada objeto persistente;
- rol del objeto en origen y destino;
- propiedades visuales que permanecen invariantes;
- elementos que nacen, cambian o desaparecen;
- estado de reset canónico.

Si el mismo concepto aparece en dos estados, conservar el mismo `object_id` y declarar la regla de continuidad. Un remount visualmente parecido no demuestra identidad.

### 3. Aislar un cambio semántico dominante por beat

Nombrar el verbo explicativo de cada beat: revelar, transferir, acumular, comparar, transformar, sustituir, acercar o destacar. Registrar una sola propiedad semántica dominante.

Si un beat mezcla cambios que el espectador no puede atribuir, dividirlo. La simultaneidad solo se permite cuando muestra una relación causal indivisible.

### 4. Diseñar preparación → acción → resolución → hold

Para cada beat definir:

1. **Preparación:** qué reduce ambigüedad antes del cambio; puede ser vacía si no aporta significado.
2. **Acción:** transformación que porta el cambio semántico.
3. **Resolución:** cómo se estabilizan jerarquía, geometría y atención.
4. **Hold:** estado final exacto, estable e indefinido hasta `presenter_advance`.

No usar preparación, anticipación o follow-through por receta. Cada fase debe justificar su función semántica.

### 5. Especificar timing, easing y stagger

Asignar duración por distancia perceptual, complejidad y tiempo necesario para atribuir causalidad. Para cada easing explicar qué comunica su aceleración y llegada.

Usar stagger solo si el orden codifica secuencia, prioridad, acumulación o propagación. Registrar orden, delay y justificación. Si el stagger solo añade espectáculo, desactivarlo.

No diseñar una animación que obligue al presentador a hablar a velocidad fija. El movimiento termina y el hold espera indefinidamente.

### 6. Preservar continuidad y eliminar ghost layers

Para cada objeto persistente declarar cómo conserva identidad espacial y semántica. Preferir transformación del objeto existente frente a desaparecer y recrear.

Para cada elemento saliente declarar:

- punto en que deja de ser visible;
- si queda `removed` o `hidden`;
- garantía de que deja de ser interactivo;
- ausencia en el hold final.

No conservar capas antiguas con baja opacidad. Si ya no aportan contexto necesario, deben desaparecer completamente.

### 7. Diseñar interruptibilidad, reverse y reset

Cada beat debe:

- aceptar interrupción o declarar un settle inmediato seguro;
- enumerar estados seguros;
- definir qué ocurre ante avance, retroceso o reset durante el movimiento;
- invertir de forma semánticamente coherente hasta el hold anterior;
- resetear al estado inicial canónico;
- garantizar reset idempotente.

Reverse no es reproducir fotogramas al revés si eso contradice causalidad o jerarquía. Es volver de forma determinista al estado semántico anterior.

### 8. Diseñar reduced motion

Para cada beat definir un fallback que:

- conserva source y target holds;
- conserva el cambio semántico;
- elimina trayectorias, parallax, zoom o aceleraciones problemáticas;
- usa sustitución instantánea, pasos discretos o crossfade breve cuando proceda;
- mantiene reverse y reset.

Reduced motion no puede eliminar información ni dejar un estado intermedio.

### 9. Auditar solapes y coexistencia

Inspeccionar los intervalos de entrada/salida y el máximo cambio. Registrar:

- capas coexistentes;
- competencia por protagonista;
- cruces de trayectorias;
- texto que podría solaparse;
- objetos que abandonan su ownership;
- riesgo de click/avance durante transición;
- riesgo específico en móvil.

Si solo puede resolverse cambiando composición, devolver blocker a Visual.

### 10. Emitir y validar el motion contract

Completar escenas, beats, reduced motion, reglas globales y riesgos. Validar contra el schema y comprobar que no contiene decisiones nuevas de composición, labels, contenido o stack.

## Reglas duras

- No modificar la composición aprobada.
- No añadir labels, cards, captions, claims ni contenido.
- Un objeto que representa el mismo concepto conserva identidad.
- Cada animación material termina en un hold estable.
- Todo beat tiene un cambio semántico dominante.
- Todo movimiento material es interruptible o resuelve inmediatamente a un estado seguro.
- Reverse y reset son deterministas; reset es idempotente.
- Reduced motion conserva el mismo significado y hold final.
- Opacidad baja no es una solución general para capas antiguas.
- No hay loops ornamentales por defecto.
- No mover elementos si el movimiento no comunica.

## Acciones prohibidas

- Cambiar tamaño relativo, posición final, ownership o jerarquía de un hold aprobado.
- Introducir nuevos objetos, datos, texto o metáforas.
- Elegir GSAP, CSS, Remotion u otra tecnología.
- Escribir timelines o código ejecutable.
- Diseñar motion para disimular un money frame débil.
- Usar stagger, overshoot, bounce, parallax o partículas sin significado.
- Dejar elementos invisibles pero interactivos.
- Invocar automáticamente al Producer.

## Blockers y escalado upstream

| Blocker | Propietario | Acción |
|---|---|---|
| Visual contract no aprobado o hash incorrecto | Visual Director | corregir gate y versionar |
| Faltan source/target holds | Visual Director | completar estados estáticos |
| Animar exige cambiar composición | Visual Director | emitir blocker con evidencia y alternativa |
| Beat contiene varios cambios inseparables pero ambiguos | `narrative-owner` o Visual | resegmentar semántica/holds |
| Reduced motion pierde el takeaway | Visual Director | rediseñar el estado estático |
| Reverse no puede preservar causalidad | Visual Director o `narrative-owner` | redefinir estados, no falsear la inversión |
| Restricción técnica conocida impide el contrato | Frontend Producer, después del handoff | registrar blocker; Motion no elige workaround visual |

## Definition of Done

- Visual contract aprobado y hash verificado.
- Todos los objetos persistentes tienen identidad y continuidad declaradas.
- Cada beat define source, target y un cambio semántico dominante.
- Preparación, acción, resolución y hold están especificados.
- Timing, easing y stagger tienen justificación.
- Elementos salientes desaparecen y dejan de ser interactivos.
- Interrupción, reverse, reset y reduced motion están definidos por beat.
- Solapes y riesgos móvil están registrados.
- El JSON valida contra el schema.
- No se alteró composición ni se introdujo contenido o implementación.

## Relación con las otras skills

- Consumir del Visual Director solo un contrato `approved`.
- Devolver a Visual cualquier cambio compositivo necesario; no aplicarlo.
- Entregar al Frontend Producer un contrato `ready`, hasheado y autosuficiente.
- Recibir del Producer limitaciones técnicas como blockers explícitos, nunca como desviaciones consumadas.
- Recibir del Auditor findings de continuidad, timing, coexistencia, reverse, reset o reduced motion; remediar y forzar nueva implementación y auditoría.
