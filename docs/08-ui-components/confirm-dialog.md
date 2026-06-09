# ConfirmDialog (+ useConfirm)

> **Status: ready** · `import { ConfirmDialog, useConfirm } from "@trf/ui2"` · source:
> `src/components/ui/confirm-dialog.tsx` (built on `Dialog` + `Button` + `Alert` + `Spinner`)

The system's **confirmation prompt** — the on-system replacement for the native `confirm()` and the
hand-rolled `ConfirmDialog`/`useConfirm` that consuming apps kept reinventing. Two layers over the
Radix `Dialog`, both fully token-driven (light + dark):

- **`ConfirmDialog`** — declarative, controlled component (you own `open`).
- **`useConfirm()`** — imperative, promise-based wrapper so call sites read like `confirm()`.

It is built on the regular `Dialog` (not `@radix-ui/react-alert-dialog`) — the existing dialog
already gives focus trap, Esc, and overlay dismissal, which is enough for confirmations.

## ConfirmDialog (declarative)

```tsx
import { ConfirmDialog } from "@trf/ui2";

const [open, setOpen] = useState(false);

<Button variant="destructive" onClick={() => setOpen(true)}>Delete</Button>
<ConfirmDialog
  open={open}
  variant="destructive"
  title="Delete invoice #1042?"
  description="The invoice will be permanently removed. This cannot be undone."
  confirmLabel="Delete"
  warning="Linked payments will be detached."
  onConfirm={async () => { await api.delete(id); setOpen(false); }}
  onCancel={() => setOpen(false)}
/>
```

### Props

| Prop | Type | Notes |
| --- | --- | --- |
| `open` | `boolean` | Controlled. |
| `onConfirm` | `() => void \| Promise<void>` | If it returns a promise, the dialog goes **busy** (spinner on confirm, both buttons disabled) until it settles. |
| `onCancel` | `() => void` | Also fired on Esc / overlay click / close button. |
| `description` | `ReactNode` | **Required** — the message. |
| `title?` | `ReactNode` | Default `"Please confirm"`. |
| `confirmLabel?` / `cancelLabel?` | `string` | Default `"Confirm"` / `"Cancel"`. |
| `variant?` | `"default" \| "destructive"` | `"destructive"` → red confirm button. |
| `busy?` | `boolean` | Force the busy state (auto-managed for async `onConfirm`; this prop also forces it). |
| `warning?` | `ReactNode` | Shown in a warning `Alert` above the footer. |

While busy, Esc / overlay / close are blocked so an in-flight action can't be interrupted.

## useConfirm (imperative)

Reads like the native `confirm()` it replaces. Self-contained — **no app-root provider needed**:
call `confirm(opts)`, `await` the boolean, and render the returned `dialog` once.

```tsx
import { useConfirm } from "@trf/ui2";

function Row() {
  const { confirm, dialog } = useConfirm();

  async function remove() {
    const ok = await confirm({
      title: "Delete contract?",
      description: "You can't undo this.",
      variant: "destructive",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    await api.delete(id);
  }

  return (
    <>
      <Button variant="destructive" onClick={remove}>Delete</Button>
      {dialog}
    </>
  );
}
```

`confirm(options)` returns `Promise<boolean>` (`true` = confirmed). `options` is `ConfirmOptions` —
the `ConfirmDialog` props minus `open` / `onConfirm` / `onCancel`.

## When to use which

| | Use |
| --- | --- |
| Plain yes/no before a one-shot action, read inline (`await`) | **`useConfirm()`** |
| You already track open state, or need the dialog declaratively in JSX | **`ConfirmDialog`** |
| A richer modal (forms, custom layout, multiple actions) | the raw [`Dialog`](dialog.md) |

## Rules

- For irreversible actions use `variant="destructive"` and a verb confirm label (`"Delete"`,
  `"Cancel invoice"`) — never a bare `"OK"`.
- Don't hand-roll confirm modals on top of `Dialog` in app code — import these.
- Do the async work in `onConfirm` (declarative) or after `await confirm()` (hook); the busy
  spinner is automatic for promises.

## Related

- [Dialog](dialog.md) · [Feedback (Alert)](feedback.md) · [Button](button.md) ·
  [13 AI Coding Guidelines](../13-ai-coding-guidelines.md)
