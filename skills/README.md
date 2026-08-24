# Routing de skills

Cada etapa consume un artefacto cerrado, produce uno nuevo y carece de autoridad para modificar silenciosamente el input recibido.

| Orden | Skill | Autoridad exclusiva | Input cerrado | Output canónico | Devuelve a |
|---:|---|---|---|---|---|
| 1 | [`visual-director-lienzo`](visual-director-lienzo/SKILL.md) | representación y composición | narrativa semántica versionada | `visual-contract.json` | autor de narrativa o usuario |
| 2 | [`motion-director-lienzo`](motion-director-lienzo/SKILL.md) | transformación y timing | visual contract aprobado | `motion-contract.json` | Visual Director |
| 3 | [`frontend-producer-lienzo`](frontend-producer-lienzo/SKILL.md) | implementación | narrativa y contratos visual/motion válidos | `implementation-manifest.json` | Visual o Motion Director |
| 4 | [`audita-y-mejora-lienzo-didactico`](audita-y-mejora-lienzo-didactico/SKILL.md) | evaluación y veredicto | build y manifest reproducibles | `audit-report.json` | propietario del finding |

## Regla de ejecución

1. Resolver la tarea con la tabla anterior.
2. Verificar que todos los inputs requeridos existen, tienen hash y siguen vigentes.
3. Cargar solo la skill propietaria y el schema de su output.
4. Persistir el output antes de transferir autoridad.
5. Validar el JSON contra el schema aplicable.
6. Detenerse en el gate definido por [`pipeline-contract.md`](../contracts/pipeline-contract.md).

No encadenar skills por memoria, prompt implícito o invocación recursiva. Las fuentes externas de [`docs/source-map.md`](../docs/source-map.md) no necesitan estar instaladas y nunca se cargan como dependencias de ejecución.
