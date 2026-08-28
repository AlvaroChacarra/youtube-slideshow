# Motion contract

Motion explains financial state change; it never supplies atmosphere.

## Ownership

- Motion: scene enter/exit, selection, shared layout, resize, feedback.
- GSAP: only bond→cash flows, cash flows→PVs→price, coupons→terminal wealth,
  and bonds→points→curve.
- CSS: focus, hover, reduced-motion fallback and deterministic capture state.

## Timing

| Event | Duration |
|---|---:|
| feedback | 160–220 ms |
| selection/layout | 280–420 ms |
| scene transition | 420–560 ms |

Primary easing is `cubic-bezier(.22,1,.36,1)`.

## Invariants

- Every timeline supports discrete seek, reverse and deterministic reset.
- A conceptual state never advances without user action.
- `visibilitychange` pauses active timelines.
- `gsap.context().revert()` and listener teardown run on unmount.
- Reduced motion renders identical end states through immediate substitution.
- Capture mode has no ambient or looping movement.
- Maximum three animated groups at once.
