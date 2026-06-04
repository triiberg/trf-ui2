# Spinner

> **Status: ready** · `import { Spinner } from "@trf/ui2"` · source: `src/components/ui/spinner.tsx`

A small spinning loader (Lucide `Loader2`). For tiny, inline loading.

## Usage

```tsx
<Spinner size="sm" />
<Button disabled><Spinner size="sm" /> Saving…</Button>
```

`size`: `sm | md | lg`. Inherits `currentColor`; defaults to muted.

## Rules

- **Spinner** = tiny inline (in a button, beside text). **`LoadingState`** = a whole area
  loading (centered spinner + label). **`Skeleton`** = when you know the layout.

## Related

- [feedback.md](feedback.md) (LoadingState, EmptyState) · [skeleton.md](skeleton.md)
