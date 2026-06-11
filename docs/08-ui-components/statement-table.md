# StatementTable

> **Status: ready** · `import { StatementTable } from "@trf/ui2"` · source:
> `src/components/statement-table.tsx` (built on the `Table` primitives)

**Financial statement renderer** — balance sheets, income statements, and similar reports where
rows nest by indent depth and split into section headers, figure lines, and emphasised totals.
Figures are right-aligned monospace with tabular figures.

Graduated from trffrontreports' `FinancialStatementTable`.

## Usage

```tsx
import { StatementTable, type StatementRow } from "@trf/ui2";

const rows: StatementRow[] = [
  { type: "header", label: "ASSETS" },
  { type: "header", label: "Current assets", indent: 1 },
  { type: "line", label: "Cash and cash equivalents", indent: 2, values: [125000, 98000] },
  { type: "line", label: "Receivables", indent: 2, values: [40250, 35900] },
  { type: "total", label: "Total current assets", indent: 1, values: [165250, 133900] },
  { type: "total", label: "TOTAL ASSETS", values: [165250, 133900] },
];

<StatementTable
  rows={rows}
  labelHeader="Item"
  valueHeaders={["31.12.2026", "31.12.2025"]}
/>
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `rows` | `StatementRow[]` | `{ type, label, indent?, values? }` |
| `labelHeader` | `ReactNode` | Label column header |
| `valueHeaders` | `ReactNode[]` | One header per figure column (1+: current, prior, …) |
| `formatValue` | `(v) => string` | Default: locale number, no decimals, `—` for zero/empty |

## Row types

- `header` — spans the table, muted uppercase section title
- `line` — regular figure row, muted label
- `total` — emphasised label + figures

`indent` is 0–3 (deeper clamps to 3).

## Related

- [Table](table.md) · [13 AI Coding Guidelines](../13-ai-coding-guidelines.md)
