# Instrucciones del repositorio

## Orden de lectura obligatorio

1. [`README.md`](README.md)
2. [`contracts/pipeline-contract.md`](contracts/pipeline-contract.md)
3. [`docs/image-to-code-integration.md`](docs/image-to-code-integration.md) si el input declara una referencia aprobada
4. [`skills/README.md`](skills/README.md)
5. el `SKILL.md` correspondiente a la tarea
6. el schema correspondiente a su output

## Routing

| Tarea | Skill propietaria | Output |
|---|---|---|
| Explorar o formalizar representación, composición y dirección visual | `visual-director-lienzo` | `visual-contract.json` |
| Transformación, continuidad, timing y holds | `motion-director-lienzo` | `motion-contract.json` |
| Código, interacción e implementación reproducible | `frontend-producer-lienzo` | `implementation-manifest.json` |
| QA perceptual, pedagógica, móvil y técnica | `audita-y-mejora-lienzo-didactico` | `audit-report.json` |

Si una tarea cruza una frontera, cerrar y persistir primero el handoff del propietario actual. Ninguna skill invoca automáticamente a otra.

## Invariantes

- Existen exactamente cuatro skills.
- Image-to-Code es un upstream documentado, no una quinta etapa ni una dependencia runtime.
- No se añade código frontend, runtime, narrativa de producción ni diseño concreto del futuro benchmark.
- No existen dependencias externas runtime.
- Los contratos versionados y sus hashes son la única fuente de verdad entre etapas.
- La memoria conversacional no sustituye inputs requeridos.
- Solo el Visual Director decide composición.
- Solo el Motion Director decide timing y continuidad temporal.
- Solo el Frontend Producer decide implementación técnica.
- Solo el Auditor emite veredictos.
- La spec semántica gobierna contenido; una referencia aprobada gobierna composición, jerarquía y apariencia.
- Una contradicción material entre spec y referencia bloquea el bundle upstream.
- El checkpoint humano es obligatorio en `concept-first`; en `approved-reference` solo puede heredarse con evidencia verificable.
- Una referencia se reconstruye; mostrarla como imagen fullscreen no constituye implementación.
- La auditoría juzga output real por encima de intención, rationale o corrección del código.
- No hay autoaprobación ni circularidad silenciosa.
- Un finding upstream vuelve a la skill propietaria y genera un artefacto nuevo.

## Firewall de contaminación

No copiar ni adaptar indiscriminadamente archivos, código, contratos, nombres visuales o soluciones de ramas anteriores. Un precedente interno puede consultarse por SHA y sintetizarse en contratos genéricos, pero no se mergea, rebasa, cherry-pickea ni se convierte en dependencia. Las fuentes registradas en [`docs/source-map.md`](docs/source-map.md) son investigación doctrinal y no deben copiarse literalmente.

## Comprobación obligatoria

Antes de cerrar cualquier cambio ejecutar:

```sh
node scripts/validate-skills.mjs
```

No declarar una capacidad implementada sin evidencia persistida en el output canónico de su etapa.
