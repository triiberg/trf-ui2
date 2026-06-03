# Form controls — Checkbox, Switch, RadioGroup

> **Status: ready** · `import { Checkbox, Switch, RadioGroup, RadioGroupItem } from "@trf/ui2"`
> source: `src/components/ui/{checkbox,switch,radio-group}.tsx`

All three are Radix-based, token-styled, and work in light + dark.

## Checkbox — a single boolean

```tsx
<label className="flex items-center gap-2 text-sm">
  <Checkbox checked={copy} onCheckedChange={setCopy} /> Send a copy by email
</label>
```

## Switch — a boolean that takes effect immediately (toggles a setting)

```tsx
<label className="flex items-center gap-2 text-sm">
  <Switch checked={auto} onCheckedChange={setAuto} /> Auto-confirm
</label>
```

Checkbox vs Switch: **Checkbox** for form selections submitted later; **Switch** for an instant
on/off setting.

## RadioGroup — one choice from a small set

```tsx
<RadioGroup value={terms} onValueChange={setTerms}>
  <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="net14" /> Net 14</label>
  <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="net30" /> Net 30</label>
</RadioGroup>
```

Use a `Select` instead when there are many options.

## Rules

- Wrap each control + its text in a `<label>` so the text is clickable.
- Controlled via `checked`/`value` + `onCheckedChange`/`onValueChange`; uncontrolled via `defaultChecked`/`defaultValue`.
- Never build custom checkbox/radio/toggle visuals — use these.

## Related

- [Select](select.md) · [13 AI Coding Guidelines](../13-ai-coding-guidelines.md)
