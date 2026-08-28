# Production stack

| Layer | Locked version | Decision |
|---|---:|---|
| Node | 24 LTS | Reproducible production runtime |
| Astro | 7.2.9 | Static shell and Pages output; lockfile resolves Vite 8.2.2 |
| React | 19.2.8 | Client islands only; no RSC |
| TypeScript | 5.9.3 | V1 baseline |
| Zod | 4.5.1 | Runtime contracts and JSON Schema |
| Motion | 13.1.1 | General interface transitions |
| GSAP | 3.13.0 | Four bounded financial transformations |
| KaTeX | 0.18.4 | Stable formula layout |
| D3 | modular | Scales, shapes, arrays only |
| Vitest | 4.1.11 | Unit and contract tests |
| Playwright | 1.62.1 | Browser, visual, ARIA, accessibility |
| axe-core | 4.13.0 | Automated accessibility audit |

## TypeScript 6 spike

TypeScript 6.0.3 passed an isolated strict `tsc --noEmit` spike after removing
the deprecated `baseUrl` option. V1 stays on 5.9.3 because Astro, Vitest and the
three Playwright engines have not all executed against TS6 as the installed
compiler. No overrides, `skipLibCheck`, experimental APIs, or workarounds were
introduced. TypeScript 7 is deliberately outside V1.

## Ownership

Astro owns routes and static output. A single React island owns each lesson.
`useReducer` owns scene, stage, scenario, progress, and profile state. SVG is the
primary financial drawing surface; D3 supplies geometry without taking DOM
ownership. GSAP and KaTeX are lazy-loaded only by scenes that require them.
