# Fixed Income Foundations V1 — Verified baseline

| Field | Value |
|---|---|
| `SOURCE_REPOSITORY` | `AlvaroChacarra/youtube-slideshow` |
| `SOURCE_SHA` | `bdf6bdc4f86b62922143ac201a3739f8b40fcf5a` |
| `BENCHMARK_REPOSITORY` | `AlvaroChacarra/algo_trading_intro` |
| `BENCHMARK_SHA` | `fde4cbb33dfeab1b59fa42c6d4817b826b91b383` |
| `WORK_BRANCH` | `course/bonds-foundations-runtime-v1` |
| `START_DATE` | `2026-08-28` |

## Gate evidence

- `origin/main` matched the expected source SHA at start.
- Both legacy pilot branches pointed at the source SHA and contained no unique commits.
- The work branch was created from the verified source SHA; `main` remains untouched.
- The benchmark is read-only and no commit or runtime code is imported from it.
- The 17 Markdown specifications and 17 reference paths are present.

## Source-quality note

The repository bytes for `01-block-cover.webp`, `02-table-of-contents.webp`,
`11-same-ytm-different-cagr.webp`, and `17-recap-miniblocks-3-4.webp` do not
decode completely with the available WebP decoders. Their hashes match the
canonical GitHub objects, so the runtime records them without silently replacing
the approved sources. Visual decisions use the authoritative Markdown plus the
13 decodable references until those four canonical assets are refreshed.

## Branch hygiene note

The two empty remote pilot branches were verified as deletion-safe. The current
GitHub integration does not expose remote branch deletion, so their removal is
tracked as a repository-administration action rather than concealed as complete.
