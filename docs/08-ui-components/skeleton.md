# Skeleton

> **Status: ready** · `import { Skeleton } from "@trf/ui2"` · source: `src/components/ui/skeleton.tsx`

A pulsing placeholder for content that's still loading. Mirror the shape of what will appear.

## Usage

```tsx
<div className="flex items-center gap-3">
  <Skeleton className="size-10 rounded-full" />
  <div className="flex flex-1 flex-col gap-2">
    <Skeleton className="h-3.5 w-2/3" />
    <Skeleton className="h-3 w-1/3" />
  </div>
</div>
```

Size it with width/height utilities. It's just a `bg-muted` `animate-pulse` block.

## Rules

- **Skeleton** when you know the layout (a list/card is loading) — feels faster, no shift.
  **`LoadingState`** (spinner) for an unknown/whole-area load. **`Spinner`** for tiny inline.

## Related

- [feedback.md](feedback.md) — LoadingState, EmptyState, Spinner
