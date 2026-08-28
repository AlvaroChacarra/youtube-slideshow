# Final audit

## Current verdict

| Verdict | Status | Reason |
|---|---|---|
| Technical | **PASS** | Reproducible build, contracts, finance/runtime units, three browser engines, axe, performance and reviewed visual baselines are green in Course CI. |
| Product | **GO_TO_OWNER_REVIEW** | All four lessons, five delivery variants and the cumulative checkpoint are integrated; the approved visual direction scores 9.00/10. |
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
| Static JS budgets | PASS | 99,545 bytes (97.2 KiB) maximum initial gzip; 76,821 bytes (75.0 KiB) largest async chunk |
| Browser matrix | PASS | 114 project cases: 98 canonical executions pass and 16 browser/profile exclusions are explicit skips |
| Viewport matrix | PASS | 1280×720, 1440×900, 1600×900, 1920×1080, 2560×1440, 390×844, 430×932, 768×1024, 1024×768 |
| Visual regression | PASS | Seven Chromium baselines accepted only after opening the rendered landing, L1–L4, mobile study and checkpoint output |
| Accessibility | PASS | axe reports 0 critical and 0 serious violations in the browser matrix |
| Browser performance | PASS | LCP 592 ms, CLS 0, maximum long task 0 ms and only the local production-preview origin |
| Pages artifact | PASS | static artifact builds with `/youtube-slideshow/`; no branch deployment was requested |
| Human dry-run | PENDING | See `TEACHING_DRY_RUN.md` |

## Rendered visual audit

| Surface | Score | Opened evidence |
|---|---:|---|
| L1 — contract | 9.1 | dominant paper bond, contractual labels and market observation remain distinct |
| L2 — present value | 9.0 | complete KaTeX DCF band and price result preserve one causal reading |
| L3 — reinvestment | 8.8 | coupon sequence resolves cleanly into terminal wealth and realized CAGR |
| L4 — market curve | 8.9 | observed points, fitted illustrative line and benchmark roles remain separate |
| Global | **9.0** | landing, desktop lessons, 390 px study flow and checkpoint form one coherent Contract Spine |

| Weighted dimension | Weight | Score |
|---|---:|---:|
| Immediate understanding | 25% | 9.2 |
| Hierarchy | 20% | 9.1 |
| Pedagogical causality | 20% | 8.9 |
| Identity/freshness | 15% | 9.0 |
| Motion clarity | 10% | 8.7 |
| Responsive behavior | 10% | 8.8 |

Weighted result: **9.00/10**; no dimension is below 8.7.

## Known source limitations

At the verified baseline, four WebPs are structurally truncated and one is
visibly pixel-corrupted. Their exact hashes match the repository source; the
runtime reconstructs meaning from Markdown and healthy repeated patterns but
does not assert reference-level visual fidelity for those five artifacts.

The two empty legacy pilot branches still require deletion by a repository
administrator. Neither item blocks the runtime, CI artifact or owner review.
Production Pages remains intentionally undeployed until merge or an explicit
manual branch publication. Teaching and OBS validation remain human gates.
