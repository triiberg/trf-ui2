# Inputs — Input, Textarea, Field

> **Status: ready** · `import { Input, Textarea, Field } from "@trf/ui2"` · source: `src/components/ui/{input,textarea,field}.tsx`

## Input / Textarea

Token-styled native `<input>` / `<textarea>`. All native props pass through (`type`, `value`,
`onChange`, `placeholder`, `disabled`, …).

```tsx
<Input type="email" placeholder="you@trf.is" />
<Textarea placeholder="Free-text notes…" />
```

## Field — the form-row wrapper

Composes a `Label` + control + helper/error text. Wrap every form control in a `Field`.

```tsx
<Field label="Email" htmlFor="email" description="We never share it." required>
  <Input id="email" type="email" />
</Field>

<Field label="Amount" htmlFor="amount" error="Must be a positive number.">
  <Input id="amount" type="number" />
</Field>
```

Props: `label`, `htmlFor`, `description`, `error` (replaces description, turns destructive),
`required` (adds a marker). Works with `Input`, `Textarea`, `Select`, `Combobox`.

## CopyField — read-only value + copy button

A read-only value paired with a copy-to-clipboard button — for secrets, invite links, IDs. Owns
its transient "copied" state (icon + label swap, auto-resets) and selects the text on focus.

```tsx
import { CopyField } from "@trf/ui2";

<CopyField value={apiKey} onCopy={() => toast.success("Copied")} />
<CopyField value="Invoice #1042" mono={false} />
```

Props: `value`, `mono` (default `true`), `size` (copy-button size, default `"sm"`), `copyLabel` /
`copiedLabel`, and `onCopy(value)` / `onCopyError(err)`. The DS stays **toast-free** — fire your
app's toast from `onCopy`. For a one-time secret in a dismissable banner, use
[`SecretReveal`](feedback.md).

## Rules

- Always pair the control's `id` with the `Field`'s `htmlFor` for accessibility.
- Use `Field` for the label/error scaffolding — don't hand-roll label markup.

## Related

- [Select](select.md) · [Combobox](combobox.md) · [form-controls](form-controls.md) ·
  [SecretReveal](feedback.md)
