# Final audit

## Current verdict

| Verdict | Status | Reason |
|---|---|---|
| Technical | **FAIL** | Build/contracts/unit tests pass, but local browser binaries are unavailable and visual, browser, axe, LCP and CLS gates remain unexecuted. |
| Product | **ITERATE** | Owner review must use opened screenshots; five canonical WebP sources also require restoration. |
| Teaching | **PENDING_DRY_RUN** | The timed human rehearsal and OBS test are deliberately not inferred from automated checks. |

## Audit order

For every visual review: open output → state the dominant object and relation →
exercise interaction → compare reference/source constraint → compare contract →
read implementation only if needed → record the verdict.

## Evidence ledger

| Gate | Status | Evidence |
|---|---|---|
| Source mapping | PASS with tracked source debt | `source-check` maps 17/17 and identifies five baseline asset defects |
| Contracts | PASS | Zod schema plus BOND-CHECK-01…14 |
| Finance | PASS | Fixtures and solver unit tests, error < 1e-8 |
| Runtime units | PASS | reducer, routes, deep links, persistence, keyboard, capture |
| Static build | PASS | six generated routes under `/youtube-slideshow/` |
| Static JS budgets | PASS | 97.2 KiB maximum initial gzip; 75.0 KiB largest async chunk |
| Browser suite definition | PASS | 114 cases discovered for Chromium, Firefox and WebKit |
| Browser matrix | BLOCKED LOCALLY | Playwright binary CDN returned a zero-byte/truncated archive |
| Visual audit | PENDING | Never declare from code or a non-erroring screenshot command |
| Accessibility | PENDING | axe tests authored; execution requires browsers |
| LCP / CLS | PENDING | Browser measurement required |
| Human dry-run | PENDING | See `TEACHING_DRY_RUN.md` |

## Known source limitations

At the verified baseline, four WebPs are structurally truncated and one is
visibly pixel-corrupted. Their exact hashes match the repository source; the
runtime reconstructs meaning from Markdown and healthy repeated patterns but
does not assert reference-level visual fidelity for those five artifacts.
