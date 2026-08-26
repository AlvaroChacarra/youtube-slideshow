# Instrucciones del repositorio

## Orden de lectura obligatorio

1. [`README.md`](README.md)
2. [`contracts/pipeline-contract.md`](contracts/pipeline-contract.md)
3. [`docs/image-to-code-integration.md`](docs/image-to-code-integration.md) cuando exista referencia
4. [`docs/premium-aesthetic-doctrine.md`](docs/premium-aesthetic-doctrine.md) para trabajo enhanced
5. [`docs/geometry-gate.md`](docs/geometry-gate.md) para producción o QA
6. [`skills/README.md`](skills/README.md)
7. el `SKILL.md` propietario y el schema de su output

## Routing

| Tarea | Skill propietaria | Output |
|---|---|---|
| Representación, composición, estética y deltas autorizados | `visual-director-lienzo` | `visual-contract.json` |
| Atención, continuidad, timing y holds | `motion-director-lienzo` | `motion-contract.json` |
| Runtime, responsive, geometría y evidencia | `frontend-producer-lienzo` | `implementation-manifest.json` |
| Comparación perceptual, pedagogía y veredicto | `audita-y-mejora-lienzo-didactico` | `audit-report.json` |

Cerrar y persistir cada handoff antes de transferir autoridad. Ninguna skill invoca automáticamente a otra.

## Invariantes V3

- Mantener exactamente las cuatro skills canónicas; no crear una quinta etapa.
- Partir del commit fijado de `skill-branch`; no mergear, rebasar ni cherry-pickear precedentes.
- Limitar el vertical slice V3 a Bonds Slide 2 y Slide 4.
- Tratar Image-to-Code como upstream hasheado, nunca como dependencia runtime.
- Mantener separadas verdad semántica, referencia original, baseline fiel y enhanced runtime.
- En `reference_guided_enhancement`, preservar la esencia; permitir solo deltas trazados a claridad, atención, estética, inmersión o robustez espacial.
- Solo Visual decide composición y estética; solo Motion decide tiempo y atención temporal; solo Production decide implementación; solo Audit emite veredicto.
- Reconstruir texto, fórmulas, charts, conectores y objetos animables como code-native. No usar la referencia fullscreen.
- Hacer presenter pacing manual, holds indefinidos, reverse, reset y reduced motion deterministas.
- Exigir geometry gate `PASS` al enhanced en desktop y móvil. Un solape material, clipping, texto submínimo, duplicidad persistente o estado vacío bloquea aceptación.
- Auditar output real antes que rationale y declarar cualquier pérdida de independencia.
- No escalar al deck completo sin `GO_ENHANCED_V3` para ambas slides.

## Estructura y verdad canónica

- Doctrina y fronteras: `contracts/` y `docs/`.
- Inputs fijados, contratos y auditoría del slice: `projects/bonds/`.
- Runtime reproducible: `runtime/`.
- Evidencia generada y comparativas: `evidence/`.
- Validación: `scripts/` y workflows de `.github/`.

## Comprobación obligatoria

Ejecutar antes de cerrar:

```sh
npm ci
npm test
```

`npm test` es la cadena reproducible completa y debe ser el último comando generativo. No regenerar `evidence/` después sin reconstruir manifest y auditoría.

No declarar una capacidad por intención: debe aparecer en el contrato propietario y en evidencia reproducible.
