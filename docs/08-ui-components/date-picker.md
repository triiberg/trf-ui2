# DatePicker (+ Calendar)

> **Status: ready** · `import { DatePicker, Calendar } from "@trf/ui2"` · source:
> `src/components/date-picker.tsx` (built on `Popover` + `Calendar`) and
> `src/components/ui/calendar.tsx` (`react-day-picker`, skinned with tokens)

A token-styled date picker — a `Button`-like trigger that opens a `Popover` with a month-grid
`Calendar`. The **on-system replacement for the native `<input type="date">`** when you want a
calendar that matches the design system (light + dark, Geist, rounded, Lucide chevrons) instead of
the unstyleable browser picker. Supports single dates and start–end ranges.

## When to use which

| | `<input type="date">` | `DatePicker` |
| --- | --- | --- |
| Calendar popup | browser-native (unstyleable, varies per OS) | our `Calendar`, fully themed |
| Range selection | no | yes (`mode="range"`) |
| Weight | zero JS | adds `react-day-picker` |
| Use when | a quick, low-stakes date field is fine | the picker should look on-system / needs a range |

## Usage

```tsx
import { DatePicker, type DateRange, Field } from "@trf/ui2";

// Single date
const [due, setDue] = useState<Date>();
<Field label="Due date" htmlFor="due">
  <DatePicker id="due" value={due} onChange={setDue} placeholder="Pick a date…" />
</Field>

// Range
const [period, setPeriod] = useState<DateRange>();
<Field label="Report period" htmlFor="period">
  <DatePicker mode="range" id="period" value={period} onChange={setPeriod} />
</Field>
```

### Props

| Prop | Type | Notes |
| --- | --- | --- |
| `mode?` | `"single"` \| `"range"` | Default `"single"`. |
| `value?` | `Date` (single) / `DateRange` (range) | Controlled selection. |
| `onChange?` | `(date \| undefined)` / `(range \| undefined)` | Fires on select. Single mode closes the popover. |
| `placeholder?` | `string` | Trigger text when empty. |
| `formatDate?` | `(date: Date) => string` | Trigger label formatter. Defaults to a locale medium date (`09 Jun 2026`). |
| `id` / `disabled` / `className` | | Trigger mirrors the Combobox / Select trigger styling. |

`DateRange` is `{ from: Date | undefined; to?: Date | undefined }` (re-exported from
`react-day-picker`).

## Calendar (the primitive)

`Calendar` wraps `react-day-picker`, skinned entirely from tokens (no default stylesheet imported).
Use it directly for an **inline** calendar; otherwise prefer `DatePicker`.

```tsx
import { Calendar } from "@trf/ui2";

<Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border border-border" />
```

It forwards all `react-day-picker` props (`mode`, `numberOfMonths`, `disabled`, `min`/`max`, …).

## Rules

- Use `DatePicker` (not native `<input type="date">`) when the calendar should match the system or
  you need a range. Wrap in a `Field` for label/error.
- Don't import `react-day-picker/style.css` — the skin is token-driven; the default stylesheet
  would fight it.
- Don't hand-roll a calendar grid — `Calendar` handles layout, keyboard nav, and ARIA.

## Related

- [Combobox](combobox.md) · [Select](select.md) · [Inputs & Field](inputs.md) ·
  [13 AI Coding Guidelines](../13-ai-coding-guidelines.md)
