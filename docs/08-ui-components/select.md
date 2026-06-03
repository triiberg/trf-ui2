# Select

> **Status: ready** · `import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@trf/ui2"` · source: `src/components/ui/select.tsx`

Accessible dropdown select (Radix). Keyboard nav, typeahead, and portal handled for you.

## Parts

`Select` (root) · `SelectTrigger` + `SelectValue` (the closed control) · `SelectContent` (the
popup) · `SelectItem` · optional `SelectGroup`, `SelectLabel`, `SelectSeparator`.

## Usage

```tsx
<Field label="Document type" htmlFor="doctype">
  <Select defaultValue="invoice" onValueChange={setType}>
    <SelectTrigger id="doctype"><SelectValue placeholder="Pick a type…" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="invoice">Invoice</SelectItem>
      <SelectItem value="offer">Offer</SelectItem>
    </SelectContent>
  </Select>
</Field>
```

## Rules

- Controlled via `value` + `onValueChange`, or uncontrolled via `defaultValue`.
- Always give a `SelectValue placeholder` for the empty state.
- Wrap in [`Field`](../../src/components/ui/field.tsx) for label/error. Don't build a custom dropdown.

## Related

- [13 AI Coding Guidelines](../13-ai-coding-guidelines.md)
