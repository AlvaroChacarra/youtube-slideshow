# Instrucciones del repositorio

## Orden de lectura obligatorio

1. [`README.md`](README.md)
2. [`contracts/pipeline-contract.md`](contracts/pipeline-contract.md)
3. [`skills/README.md`](skills/README.md)
4. el `SKILL.md` correspondiente a la tarea
5. el schema correspondiente a su output

## Routing

| Tarea | Skill propietaria | Output |
|---|---|---|
| Concepto, representación, composición y dirección visual | `visual-director-lienzo` | `visual-contract.json` |
| Transformación, continuidad, timing y holds | `motion-director-lienzo` | `motion-contract.json` |
| Código, interacción e implementación reproducible | `frontend-producer-lienzo` | `implementation-manifest.json` |
| QA perceptual, pedagógica, móvil y técnica | `audita-y-mejora-lienzo-didactico` | `audit-report.json` |

Si una tarea cruza una frontera, cerrar y persistir primero el handoff del propietario actual. Ninguna skill invoca automáticamente a otra.

## Invariantes

- Existen exactamente cuatro skills.
- No se añade código frontend, runtime, narrativa de producción ni diseño concreto del futuro benchmark.
- No existen dependencias externas runtime.
- Los contratos versionados y sus hashes son la única fuente de verdad entre etapas.
- La memoria conversacional no sustituye inputs requeridos.
- Solo el Visual Director decide composición.
- Solo el Motion Director decide timing y continuidad temporal.
- Solo el Frontend Producer decide implementación técnica.
- Solo el Auditor emite veredictos.
- El checkpoint humano es obligatorio antes de aprobar una dirección visual.
- La auditoría juzga output real por encima de intención, rationale o corrección del código.
- No hay autoaprobación ni circularidad silenciosa.
- Un finding upstream vuelve a la skill propietaria y genera un artefacto nuevo.

## Firewall de contaminación

No copiar ni adaptar archivos, código, contratos, nombres visuales o soluciones de ramas anteriores. Las fuentes externas registradas en [`docs/source-map.md`](docs/source-map.md) son investigación doctrinal: no son dependencias, no tienen autoridad sobre los contratos locales y no deben copiarse literalmente.

## Comprobación obligatoria

Antes de cerrar cualquier cambio ejecutar:

```sh
node scripts/validate-skills.mjs
```

No declarar una capacidad implementada sin evidencia persistida en el output canónico de su etapa.
