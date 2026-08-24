# Visual Pipeline Skills V2

Rama canónica independiente para gobernar la producción futura de lienzos didácticos HTML mediante cuatro handoffs persistidos y auditables. Esta rama contiene doctrina, contratos, schemas y validación; no contiene frontend ni una narrativa de producción.

## Pipeline

1. Una narrativa semántica versionada entra en `visual-director-lienzo`.
2. El Visual Director propone tres direcciones, diseña holds estáticos y espera aprobación humana.
3. `motion-director-lienzo` especifica transformaciones sin alterar la composición aprobada.
4. `frontend-producer-lienzo` implementa ambos contratos sin reinterpretarlos.
5. `audita-y-mejora-lienzo-didactico` inspecciona el output real y emite un veredicto independiente.
6. Cada finding vuelve de forma explícita a su propietario y exige una nueva auditoría.

Los artefactos persistidos —no la memoria conversacional— son la única interfaz entre etapas. El contrato normativo está en [`contracts/pipeline-contract.md`](contracts/pipeline-contract.md).

## Alcance

Incluido:

- exactamente cuatro skills canónicas;
- contratos JSON versionados;
- routing y procedencia doctrinal;
- validación estática y CI sin dependencias externas.

Excluido:

- código frontend o runtime;
- escenas, ejemplos o narrativa sobre bonos;
- `DESIGN.md` o decisiones visuales del futuro benchmark;
- assets, renders, fixtures visuales o dependencias npm;
- ejecución automática de skills externas.

## Uso

Leer en este orden:

1. [`AGENTS.md`](AGENTS.md)
2. [`contracts/pipeline-contract.md`](contracts/pipeline-contract.md)
3. [`skills/README.md`](skills/README.md)
4. el `SKILL.md` propietario de la etapa;
5. el schema del output correspondiente.

La validación final se ejecuta con `node scripts/validate-skills.mjs`.
