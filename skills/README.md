# Routing de skills V3

| Orden | Skill | Autoridad exclusiva | Output |
|---:|---|---|---|
| 1 | [`visual-director-lienzo`](visual-director-lienzo/SKILL.md) | representación, composición, estética y deltas | `visual-contract.json` |
| 2 | [`motion-director-lienzo`](motion-director-lienzo/SKILL.md) | atención temporal, continuidad y timing | `motion-contract.json` |
| 3 | [`frontend-producer-lienzo`](frontend-producer-lienzo/SKILL.md) | implementación, responsive, geometría y evidencia | `implementation-manifest.json` |
| 4 | [`audita-y-mejora-lienzo-didactico`](audita-y-mejora-lienzo-didactico/SKILL.md) | evaluación comparativa y veredicto | `audit-report.json` |

## Regla de ejecución

1. Verificar inputs, hashes y versión major.
2. Cargar solo la skill propietaria y su schema.
3. Persistir y validar el output antes del siguiente handoff.
4. Devolver blockers al propietario; no corregir cruzando autoridad.

Visual selecciona un único modo:

- `concept_first` — explorar tres direcciones;
- `approved_reference` — reconstruir fielmente;
- `reference_guided_enhancement` — preservar esencia y mejorar con deltas justificados.

En V3, baseline y enhanced son variantes explícitas. Production no decide sus diferencias: las ejecuta. Audit no acepta un enhanced sin comparación original/baseline/enhanced y geometry gate `PASS`.
