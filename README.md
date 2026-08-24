# Visual Pipeline Skills V2.1

Rama canónica independiente para gobernar la producción futura de lienzos didácticos HTML mediante cuatro handoffs persistidos y auditables. Esta rama contiene doctrina, contratos, schemas y validación; no contiene frontend ni una narrativa de producción.

## Pipeline

1. Una narrativa semántica versionada entra en `visual-director-lienzo`, sola o acompañada por un bundle perceptual aprobado.
2. Sin referencia aprobada, Visual explora tres direcciones y espera aprobación humana; con referencia aprobada, la ingiere y formaliza sin rediseñarla.
3. `motion-director-lienzo` especifica transformaciones sin alterar la composición aprobada.
4. `frontend-producer-lienzo` reconstruye los holds y compara screenshot contra referencia antes de implementar motion.
5. `audita-y-mejora-lienzo-didactico` ejecuta primero blind decode y después comprueba fidelidad semántica y perceptual.
6. Cada finding vuelve de forma explícita a su propietario y exige una nueva auditoría.

Los artefactos persistidos —no la memoria conversacional— son la única interfaz entre etapas. El contrato normativo está en [`contracts/pipeline-contract.md`](contracts/pipeline-contract.md).

## Alcance

Incluido:

- exactamente cuatro skills canónicas;
- contratos JSON versionados;
- integración Image → Contract documentada en [`docs/image-to-code-integration.md`](docs/image-to-code-integration.md);
- routing y procedencia doctrinal;
- validación estática y CI sin dependencias externas.

Excluido:

- código frontend o runtime;
- escenas, ejemplos o narrativa sobre bonos;
- copias de `DESIGN.md`, proyectos, specs o referencias upstream;
- assets, renders, fixtures visuales o dependencias npm;
- ejecución automática de skills externas.

## Uso

Leer en este orden:

1. [`AGENTS.md`](AGENTS.md)
2. [`contracts/pipeline-contract.md`](contracts/pipeline-contract.md)
3. [`docs/image-to-code-integration.md`](docs/image-to-code-integration.md) cuando exista una referencia aprobada;
4. [`skills/README.md`](skills/README.md)
5. el `SKILL.md` propietario de la etapa;
6. el schema del output correspondiente.

La validación final se ejecuta con `node scripts/validate-skills.mjs`.
