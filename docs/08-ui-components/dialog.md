# Dialog

> **Status: ready** · `import { Dialog, DialogTrigger, DialogContent, ... } from "@trf/ui2"` · source: `src/components/ui/dialog.tsx`

Accessible modal (Radix) — focus trapped, `Esc` closes, focus returns to the trigger. For
confirmations and short forms.

## Usage

```tsx
<Dialog>
  <DialogTrigger asChild><Button variant="destructive">Cancel invoice</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Cancel invoice #1042?</DialogTitle>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild><Button variant="secondary">Keep it</Button></DialogClose>
      <DialogClose asChild><Button variant="destructive">Yes, cancel</Button></DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

Parts: `Dialog` (root) · `DialogTrigger` (`asChild`) · `DialogContent` (includes a close ✕) ·
`DialogHeader` / `DialogFooter` · `DialogTitle` / `DialogDescription` · `DialogClose`.
Controlled via `open` + `onOpenChange` on `Dialog`.

## Rules

- Confirm **destructive actions** (delete/cancel) with a Dialog.
- Always include a `DialogTitle` (accessibility). Don't nest bordered boxes inside the content.
- For non-modal hints use `Tooltip`/`Popover`; for menus use `DropdownMenu`; for a movable/resizable
  reference panel the user keeps working alongside, use `FloatingWindow` instead.

## Related

- [DropdownMenu](dropdown-menu.md) · [combobox](combobox.md) (Popover) · [FloatingWindow](floating-window.md)
