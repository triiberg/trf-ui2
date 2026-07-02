# FloatingWindow

> **Status: ready** · `import { FloatingWindow, FloatingWindowTrigger, FloatingWindowContent, ... } from "@trf/ui2"` · source: `src/components/ui/floating-window.tsx`

A movable, resizable, **non-modal** panel for viewing reference material (e.g. a source
document, an image) alongside a form the user keeps working in. Built on the same Radix
`Dialog` primitive as `Dialog`, but with `modal={false}` by default, no overlay, no
dismiss-on-outside-interaction, plus drag (by the header) and resize (bottom-right corner).

## Usage

```tsx
<FloatingWindow open={open} onOpenChange={setOpen}>
  <FloatingWindowContent className="flex h-[85vh] max-w-4xl flex-col gap-3">
    <FloatingWindowHeader>
      <FloatingWindowTitle className="truncate">{fileName}</FloatingWindowTitle>
    </FloatingWindowHeader>
    <iframe src={src} title={fileName} className="h-full w-full rounded-md border border-border" />
  </FloatingWindowContent>
</FloatingWindow>
```

Parts: `FloatingWindow` (root, `modal={false}` by default) · `FloatingWindowTrigger` (`asChild`) ·
`FloatingWindowContent` (includes a close ✕ and, unless disabled, a resize handle) ·
`FloatingWindowHeader` (the drag handle when inside a draggable content) · `FloatingWindowTitle` ·
`FloatingWindowClose` (`asChild`). Controlled via `open` + `onOpenChange` on `FloatingWindow`, same
as `Dialog`.

`FloatingWindowContent` takes two extra opt-in props, both default `true`:
- `draggable` — drag by `FloatingWindowHeader`. Set `false` to pin the panel in place.
- `resizable` — drag the bottom-right corner handle. Set `false` for a fixed size.

Initial position/size come from your `className` (e.g. `h-96 max-w-md`) exactly like `Dialog` —
dragging/resizing only kicks in once the user interacts with the handle/corner.

## Rules

- Use this when the user needs to **keep editing a form** while referencing something else (a
  source PDF during OCR review, an image next to its metadata form). If the content is a
  one-off confirmation or short form that should block the page, use `Dialog` instead.
- Always include a `FloatingWindowTitle` (accessibility) inside `FloatingWindowHeader`.
- Don't add a backdrop/overlay — the non-modal, unblocked page is the point. If you find
  yourself wanting an overlay, you probably want `Dialog`.

## Related

- [Dialog](dialog.md) — the modal counterpart; same parts pattern, no drag/resize.
