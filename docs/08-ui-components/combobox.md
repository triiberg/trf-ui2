# Combobox (+ Popover, Command)

> **Status: ready** · `import { Combobox } from "@trf/ui2"` · source: `src/components/combobox.tsx`
> (built on `Popover` + `Command`, also exported)

Single-select **autocomplete** — the accessible, filterable replacement for the old
`AccountCombobox` (e.g. a customer picker). Type to filter; keyboard nav + a11y via `cmdk`.

## Usage

```tsx
import { Combobox, Field } from "@trf/ui2";

const customers = [{ value: "triiberg", label: "Triiberg AS" }, …];

<Field label="Customer" htmlFor="customer">
  <Combobox
    id="customer"
    options={customers}
    value={value}
    onChange={setValue}
    placeholder="Pick a customer…"
    searchPlaceholder="Search customers…"
    emptyText="No customer found."
  />
</Field>
```

Props: `options` (`{ value, label }[]`), `value`, `onChange`, `placeholder`, `searchPlaceholder`,
`emptyText`, `id`, `disabled`, `className`. The popup matches the trigger width.

## Building blocks (use directly for custom cases)

- **`Popover`** / `PopoverTrigger` / `PopoverContent` — floating panel (Radix).
- **`Command`** / `CommandInput` / `CommandList` / `CommandEmpty` / `CommandGroup` /
  `CommandItem` / `CommandSeparator` — filterable command list (`cmdk`). Also powers command
  palettes.

## Rules

- Use `Combobox` for a searchable single select over a **static, in-memory** list; use
  **`Select`** when the list is short and needs no search. When options come from a server/async
  search, use **[`AsyncCombobox`](async-combobox.md)** instead. Wrap in a `Field` for label/error.
- Don't hand-roll autocomplete — these handle filtering, keyboard, and ARIA.

## Related

- [AsyncCombobox](async-combobox.md) · [Select](select.md) · [Field](../../src/components/ui/field.tsx) · [13 AI Coding Guidelines](../13-ai-coding-guidelines.md)
