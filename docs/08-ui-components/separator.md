# Separator

> **Status: ready** · `import { Separator } from "@trf/ui2"` · source: `src/components/ui/separator.tsx`

A thin divider line (Radix). Horizontal by default; vertical for inline groups.

## Usage

```tsx
<Separator className="my-3" />

<div className="flex h-5 items-center gap-3">
  <span>Left</span>
  <Separator orientation="vertical" />
  <span>Right</span>
</div>
```

`orientation`: `horizontal | vertical`. `decorative` (default true) hides it from assistive tech;
set `decorative={false}` when it separates meaningful groups.

## Related

- [layout.md](layout.md) (Stack/Row) · [03 Design Tokens](../03-design-tokens.md) (`border` token)
