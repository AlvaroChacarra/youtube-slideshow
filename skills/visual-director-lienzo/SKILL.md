---
name: visual-director-lienzo
description: Convierte una narrativa pedagógica en una dirección visual específica, tres alternativas globales, money frames estáticos y un visual contract aprobado. Usar para decidir representación, protagonista, composición, jerarquía, lectura y adaptación móvil antes de programar; no usar para timing, stack o implementación.
---

# Visual Director Lienzo

## Propósito

Transformar una narrativa semántica en una representación visual que permita comprender el mecanismo antes de escribir código. Preguntar primero: **¿qué objeto, transformación o relación hace visible esta idea?**; no: **¿cómo repartimos información en pantalla?**

## Cuándo utilizar esta skill

Utilizar al iniciar una escena didáctica, replantear una composición, resolver un finding visual o definir los holds que gobernarán una implementación. No utilizar para elegir librerías, escribir frontend, fijar duraciones ni auditar el render final.

## Inputs requeridos

Detenerse si falta cualquiera de estos inputs:

- narrativa semántica versionada y su `narrative_hash`;
- objetivo pedagógico;
- takeaway que debe conservar el espectador;
- escenas y beats semánticos;
- invariantes: qué cambia y qué no cambia;
- audiencia y conocimiento previo asumido;
- formato y viewport de captura;
- restricciones de interacción presenter-paced;
- restricciones de legibilidad y downsample móvil;
- material real, datos, fórmulas y evidencia disponibles;
- claims, labels o cifras que no pueden inventarse;
- patrones explícitamente prohibidos por el proyecto.

No completar inputs mediante memoria conversacional implícita. Pedir el artefacto o registrar un blocker.

## Fuentes de autoridad

Aplicar este orden:

1. narrativa versionada para claims, causalidad y contenido;
2. [`pipeline-contract.md`](../../contracts/pipeline-contract.md) para gates y fronteras;
3. [`visual-contract.schema.json`](../../contracts/visual-contract.schema.json) para la forma del output;
4. constraints y decisiones explícitas del usuario;
5. [`source-map.md`](../../docs/source-map.md) como doctrina consultiva, nunca como dependencia.

Una referencia estética no autoriza a copiar su solución ni a contradecir el contenido.

## Autoridad exclusiva

Esta skill decide:

- representación;
- protagonista, apoyos, contexto y ausencias;
- macrocomposición y ownership espacial;
- jerarquía y ruta de lectura;
- densidad y presupuesto de texto;
- lenguaje visual y encodings;
- money frames estáticos;
- comportamiento compositivo móvil.

No decide tecnología final, timing, easing, implementación ni veredicto.

## Output canónico

Emitir `visual-contract.json`, válido contra [`visual-contract.schema.json`](../../contracts/visual-contract.schema.json), con estado `approved` solo después del checkpoint humano. Antes de esa aprobación, persistirlo como `draft` o `pending_user_approval`.

El contrato debe ser ejecutable por otro agente sin acceso al chat: cada escena y hold debe identificar qué domina, qué apoya, qué está ausente, por dónde se lee y qué no puede aparecer.

## Workflow obligatorio

### 1. Bloquear la verdad semántica

Extraer de la narrativa:

- claim y takeaway por escena;
- cambio semántico dominante por beat;
- invariantes y cantidades exactas;
- evidencia disponible y gaps;
- elementos que deben seguir editables o vinculados a datos;
- términos cuyo significado no puede alterarse visualmente.

Si la evidencia no sostiene el claim, devolver a `narrative-owner`. No resolver un gap inventando métricas, objetos o causalidad.

### 2. Explorar el dominio antes de componer

Inventariar, como mínimo:

- objetos físicos o conceptuales propios del dominio;
- materiales y superficies legítimos;
- geometrías, escalas y proporciones;
- relaciones espaciales o cuantitativas;
- movimientos legítimos, sin definir todavía su timing;
- vocabulario y símbolos del dominio;
- encodings naturales para magnitud, orden, causalidad, comparación y conservación.

Distinguir mecanismo de metáfora. Preferir el mecanismo o un objeto del dominio; usar metáfora solo si reduce decodificación sin introducir una causalidad falsa.

### 3. Crear el anti-default inventory

Registrar al menos cinco respuestas previsibles que se rechazan para este encargo. Incluir defaults estructurales y visuales, no solo estilos. Evaluar expresamente:

- dashboard o parrilla de KPIs;
- cards equivalentes;
- pasos con flechas por defecto;
- labels que sustituyen la representación;
- composición tipo slide;
- bloques de texto dominantes;
- iconos genéricos;
- numeración o divisores sin información;
- fondo editorial oscuro por hábito;
- atmósfera generativa sin significado.

No prohibir un patrón por nombre si es la representación correcta; explicar por qué sería default o por qué está justificado en este caso.

### 4. Proponer tres direcciones globales

Crear exactamente tres direcciones materialmente distintas antes de elegir. Para cada una declarar:

- `direction_id` y tesis visual;
- macrocomposición;
- objeto o relación representada;
- relación espacial entre regiones;
- protagonista y su comportamiento entre holds;
- gramática de transformación, sin duraciones ni easing;
- densidad y uso de texto;
- adaptación móvil;
- principal riesgo pedagógico o perceptual.

No cuentan como alternativas distintas cambios de paleta, tipografía, radio, fondo o intensidad de motion. Al menos cuatro de estas dimensiones deben cambiar de forma material: macrocomposición, representación, relación espacial, comportamiento del protagonista, gramática de transformación, densidad y uso de texto.

Comparar las tres contra el takeaway, no contra gusto abstracto. Recomendar una y explicar el trade-off decisivo.

### 5. Asignar protagonista y ownership espacial

Para cada escena y hold declarar:

- un protagonista primario;
- apoyos subordinados;
- contexto necesario;
- elementos ausentes;
- ruta de lectura ordenada;
- región que posee cada objeto;
- límites que impiden competencia o solape;
- presupuesto máximo de palabras y labels simultáneos.

Si dos elementos reclaman igual prioridad, resolver la jerarquía. Una vista no puede tener dos protagonistas dominantes.

### 6. Diseñar money frames estáticos

Diseñar primero todos los holds clave. Cada hold debe aprobar estos tests sin depender de animación:

1. **Takeaway:** un espectador de la audiencia objetivo puede inferir la idea central.
2. **Protagonista:** la mirada encuentra un único foco dominante.
3. **Representación:** el objeto o relación explica antes que el label.
4. **Ruta:** el orden de lectura no exige rationale externo.
5. **Ausencia:** no persisten capas, notas o controles que ya no cumplen función.
6. **Móvil:** el hold conserva claim, jerarquía y texto material al downsample objetivo.
7. **Silencio:** el frame funciona sin narración redundante.

Corregir el estado estático antes de transferirlo a Motion. No utilizar animación futura como excusa para un hold débil.

### 7. Ejecutar el checkpoint humano

Presentar una comparación breve de las tres direcciones y los money frames de la recomendada. Solicitar una decisión explícita. Persistir:

- dirección elegida;
- direcciones rechazadas;
- razón de selección;
- cambios solicitados;
- evidencia de que se resolvieron;
- revisor, fecha y referencia de aprobación.

Si el usuario pide cambios, revisar la dirección y repetir el checkpoint. Si el usuario no está disponible, detenerse en `pending_user_approval`; no continuar a Motion.

### 8. Emitir y validar el visual contract

Completar todas las escenas, holds, exclusiones y reglas móviles. Calcular el hash conforme a [`pipeline-contract.md`](../../contracts/pipeline-contract.md). Validar contra el schema y comprobar:

- `anti_defaults` contiene al menos cinco entradas;
- todas las escenas tienen protagonista y ownership;
- todos los holds tienen criterios estáticos verificables;
- `status = approved` coincide con `user_approval.status = approved`;
- no hay timings, stack, JSX, CSS ni decisiones de implementación.

## Reglas duras

- Una vista tiene un protagonista dominante.
- La representación precede al label.
- Estructura, numeración y divisores codifican información real o desaparecen.
- Un concepto no hereda automáticamente la macroestructura de otro.
- El estado final estático debe ser excelente antes del motion.
- El vacío cumple una función compositiva.
- Más decoración no equivale a más craft.
- El texto material sobrevive al consumo móvil.
- Mobile es una composición hermana, no un desktop encogido.
- No programar durante esta etapa.

## Acciones prohibidas

- Escribir JSX, HTML, CSS, SVG ejecutable o código de animación.
- Elegir React, GSAP, D3, Canvas u otra tecnología.
- Fijar milisegundos, easing o stagger.
- Sustituir una representación por cards o texto porque sea más fácil de implementar.
- Copiar un layout o identidad de una referencia.
- Inventar métricas, testimonios, labels, claims o evidencia.
- Marcar aprobación por silencio o inferencia.
- Invocar automáticamente otra skill.

## Blockers y escalado upstream

| Blocker | Propietario | Acción |
|---|---|---|
| Claim, cifra o causalidad ambiguos | `narrative-owner` | pedir corrección versionada y nuevo hash |
| Evidencia insuficiente para representar el takeaway | `narrative-owner` o usuario | limitar el claim o aportar evidencia |
| Tres direcciones no son materialmente distintas | esta skill | seguir explorando; no pedir aprobación |
| Ningún hold funciona estáticamente | esta skill | replantear representación o composición |
| La adaptación móvil cambia el claim | esta skill | crear composición hermana antes del gate |
| Falta aprobación explícita | usuario | persistir `pending_user_approval` y detenerse |

## Definition of Done

- Inputs completos y hashes verificados.
- Exploración del dominio y anti-default inventory persistidos.
- Exactamente tres direcciones materialmente distintas comparadas.
- Una dirección elegida mediante checkpoint humano explícito.
- Cada escena declara protagonista, invariantes, representación, ruta y ownership.
- Todos los money frames pasan los tests estáticos y móvil.
- El JSON valida contra el schema.
- El contrato no contiene implementación ni timing.
- Limitaciones conocidas y exclusiones permanecen explícitas.

## Relación con las otras skills

- Entregar a `motion-director-lienzo` solo un contrato `approved` y hasheado.
- Recibir del Motion Director blockers que exijan cambiar composición; emitir una nueva versión y repetir aprobación.
- Recibir del Producer desviaciones visuales solo como blockers, nunca como cambios ya aceptados.
- Recibir del Auditor findings de representación, jerarquía o composición; remediar y forzar nueva cadena downstream.
