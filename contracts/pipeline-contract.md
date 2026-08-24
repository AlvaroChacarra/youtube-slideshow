# Pipeline Contract V2

## 1. Propósito y autoridad

Este contrato define la única transferencia válida de autoridad entre cuatro etapas. Ante contradicción prevalecen, por orden:

1. narrativa semántica versionada para claims y contenido;
2. este contrato para fronteras, gates e invalidación;
3. schema del artefacto producido;
4. `SKILL.md` de la etapa propietaria;
5. artefactos aprobados y sus hashes;
6. documentación de procedencia.

La conversación, el rationale y las fuentes externas no pueden corregir ni completar implícitamente un handoff.

## 2. Etapas y artefactos

| Etapa | Propietario | Input normativo | Output normativo | Gate de salida |
|---|---|---|---|---|
| Dirección visual | `visual-director-lienzo` | narrativa semántica + constraints | `visual-contract.json` | aprobación humana explícita |
| Dirección de motion | `motion-director-lienzo` | narrativa + visual contract aprobado | `motion-contract.json` | contrato completo o blocker upstream |
| Producción frontend | `frontend-producer-lienzo` | narrativa + visual + motion vigentes | `implementation-manifest.json` | build, evidencia y desviaciones registradas |
| Auditoría | `audita-y-mejora-lienzo-didactico` | output real + manifest + contratos | `audit-report.json` | veredicto y siguiente propietario explícitos |

El nombre de archivo es convencional; su contenido y hash son normativos. Cada artefacto debe validar contra su schema antes de ser consumido.

## 3. Flujo de estados

### 3.1 Visual contract

`draft` → `pending_user_approval` → `approved`

Ramas terminales o de sustitución: `rejected`, `superseded`.

Solo `approved`, con `user_approval.status = approved`, habilita Motion. Cambiar una dirección aprobada crea una nueva versión y deja la anterior `superseded`; no se edita en silencio.

### 3.2 Motion contract

`draft` → `ready`

Ramas: `blocked`, `superseded`. Solo `ready` habilita Production.

### 3.3 Implementation manifest

`draft` → `implemented`

Ramas: `blocked`, `superseded`. `implemented` significa reproducible y evidenciado; no significa aprobado visualmente.

### 3.4 Audit report

Todo informe termina en exactamente uno de:

- `blocked`;
- `revision_required`;
- `ready_for_user_review`;
- `reference_candidate`.

Una remediación no cambia el veredicto anterior: produce nueva implementación, nueva evidencia y nuevo informe.

## 4. Checkpoint humano

El Visual Director debe persistir antes de aprobar:

- las tres direcciones globales materialmente distintas;
- dirección elegida y direcciones rechazadas;
- razón de selección;
- cambios solicitados y su resolución;
- identidad del revisor, fecha y referencia verificable de aprobación.

Sin respuesta explícita, el estado permanece `pending_user_approval`. Silencio, ejecución no interactiva, aceptación de un plan general o aprobación de la narrativa no equivalen a aprobación visual.

## 5. Hashes y trazabilidad

Todos los hashes de contenido usan SHA-256 y el formato `sha256:<64 hex minúsculas>`.

- `narrative_hash`: bytes exactos de la narrativa versionada.
- `visual_contract_hash`: JSON del visual contract canonicalizado conforme a RFC 8785, excluyendo únicamente un campo de hash propio si en el futuro existiera.
- `motion_contract_hash`: misma regla para motion.
- `implementation_manifest_hash` y hashes de evidencia: misma regla o bytes exactos del archivo, según el tipo registrado.
- `commit` y `subject_commit`: commit Git que permite reproducir el sujeto.

El consumidor debe copiar los hashes del artefacto que realmente leyó. Una coincidencia de nombre de archivo no demuestra identidad.

## 6. Invalidación

| Cambio material | Invalida |
|---|---|
| Narrativa | visual, motion, implementation y audit |
| Visual contract | motion, implementation y audit |
| Motion contract | implementation y audit |
| Implementación, assets, datos de demo o configuración de render | audit |
| Solo audit | nada upstream; crea un informe nuevo |

También invalida un artefacto cualquier cambio en un input declarado, viewport contractual, constraint de interacción, regla móvil, criterio de auditoría o schema major que pueda alterar el resultado.

Un artefacto invalidado no se reetiqueta como válido. Debe regenerarse, obtener un hash nuevo y atravesar de nuevo sus gates. Un cambio editorial sin efecto semántico puede conservar validez solo si el propietario registra el análisis de no impacto.

## 7. Devolución upstream

Todo blocker o finding debe incluir:

1. evidencia observable;
2. consecuencia pedagógica, perceptual o técnica;
3. causa probable, sin presentarla como hecho si no está demostrada;
4. corrección verificable;
5. skill propietaria;
6. artefactos invalidados.

Reglas de routing:

- representación, protagonista, jerarquía o composición → Visual Director;
- continuidad, transformación, timing, holds o capas coexistentes → Motion Director;
- fidelidad, implementación, interacción, responsive, build o reproducción → Frontend Producer;
- narrativa, claim o evidencia insuficiente → autor de narrativa/usuario;
- ambigüedad de aprobación → usuario.

El Auditor no remedia antes de emitir el informe. Si el mismo agente participa después en la remediación, la siguiente auditoría debe declarar esa limitación de independencia.

## 8. Prohibición de circularidad

Está prohibido:

- que Visual escriba JSX, CSS, timings o decisiones de stack;
- que Motion cambie composición, contenido o labels;
- que Production altere contratos o añada comprensión mediante diseño no aprobado;
- que Audit autoapruebe, oculte rationale antes de su primera lectura del output, o convierta un finding en una modificación silenciosa;
- que una skill invoque automáticamente otra antes de persistir su output;
- que un mismo artefacto sea a la vez borrador creativo y evidencia de auditoría;
- que una fuente externa o memoria conversacional tenga mayor autoridad que un contrato local.

## 9. Versionado

`contract_version` usa SemVer:

- patch: precisión editorial sin cambiar validación ni significado;
- minor: campo opcional o capacidad compatible;
- major: campo obligatorio, significado, estado, gate o regla de invalidación incompatible.

Cada schema declara su propia versión SemVer en `x-schema-version`; Visual y Motion declaran además la versión de cada instancia en `contract_version`. Producer y Auditor deben persistir las versiones efectivamente leídas en `consumed_versions`; el nombre del archivo o un hash aislado no sustituye ese registro. Si no soportan el major recibido, deben bloquear, no aproximar.

## 10. Definition of Done del pipeline

El pipeline puede cerrar una iteración cuando:

- los cuatro artefactos validan y sus hashes forman una cadena trazable;
- la aprobación humana del visual contract es verificable;
- no existen desviaciones silenciosas;
- todos los holds, transiciones de riesgo, reverse, reset, reduced motion y móvil tienen evidencia;
- el informe contiene un veredicto válido y siguiente propietario;
- `reference_candidate` satisface sus umbrales reforzados;
- cualquier limitación de independencia o cobertura permanece explícita.
