# ActionPill

> **Status: ready** · `import { ActionPill } from "@trf/ui2"` · source:
> `src/components/ui/action-pill.tsx` (CVA variants)

**Small pill-shaped action chip** for compact inline actions where a full `Button` is too heavy —
table-row actions, list-item quick actions, toggle-like filters. Ported from trf-ui v1.

## Usage

```tsx
import { ActionPill } from "@trf/ui2";

// Row actions
<ActionPill onClick={matchRow}>Match</ActionPill>
<ActionPill variant="destructive" onClick={skipRow}>Skip</ActionPill>

// Toggle-like filter pills
<ActionPill variant={active ? "selected" : "default"} onClick={toggle}>
  Unpaid only
</ActionPill>
```

## Variants

| Variant | Use |
| --- | --- |
| `default` | Neutral inline action |
| `selected` | Active state of a toggle pill |
| `primary` | The one emphasised action in a row |
| `warning` | Caution-flavoured action (e.g. Import) |
| `destructive` | Dangerous action (e.g. Skip, Remove) |

## Rules

- It's a `<button>` — full keyboard/focus handling included. Don't wrap it in another button.
- For static labels (no action), use [`Badge`](badge.md) or [`StatusBadge`](status-badge.md) instead.
- Don't use it as a primary page action — that's a `Button`.

## Related

- [Button](button.md) · [Badge](badge.md) · [StatusBadge](status-badge.md)
