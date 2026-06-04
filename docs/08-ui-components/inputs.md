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

## Rules

- Always pair the control's `id` with the `Field`'s `htmlFor` for accessibility.
- Use `Field` for the label/error scaffolding — don't hand-roll label markup.

## Related

- [Select](select.md) · [Combobox](combobox.md) · [form-controls](form-controls.md)
