# AsyncCombobox (+ Popover, Command)

> **Status: ready** · `import { AsyncCombobox } from "@trf/ui2"` · source:
> `src/components/async-combobox.tsx` (built on `Popover` + `Command` with `shouldFilter={false}`)

Single-select **autocomplete whose options come from an async/server search** — debounced and
filtered **server-side**. Use this when the option set is too large to ship to the client or lives
behind a query (e.g. a CPA-code picker that hits `searchCpaCodes(query)`).

For a static, client-filtered list use [`Combobox`](combobox.md) instead.

## When to use which

| | `Combobox` | `AsyncCombobox` |
| --- | --- | --- |
| Options | full array, in memory | fetched per query |
| Filtering | client-side (`cmdk`) | server-side (you fetch) |
| Use when | the whole list is small & known | the list is large / remote |

## Usage

The component is **dumb**: it renders, you fetch. You own `query`, the debounce, and the `items`.

```tsx
import { AsyncCombobox, Field, Badge } from "@trf/ui2";

type Cpa = { id: string; code: string; description: string; level: number };

function CpaPicker() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Cpa[]>([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string>();
  const [label, setLabel] = useState<string>();

  useEffect(() => {
    if (query.length < 2) { setItems([]); return; }
    setLoading(true);
    searchCpaCodes(query)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <Field label="CPA code" htmlFor="cpa">
      <AsyncCombobox<Cpa>
        id="cpa"
        items={items}
        getKey={(c) => c.id}
        getLabel={(c) => `${c.code} — ${c.description}`}
        renderItem={(c) => (
          <>
            <span className="shrink-0 font-mono text-primary">{c.code}</span>
            <span className="flex-1 truncate">{c.description}</span>
            <Badge variant="secondary" className="shrink-0">L{c.level}</Badge>
          </>
        )}
        query={query}
        onQueryChange={setQuery}
        debounceMs={250}
        loading={loading}
        minChars={2}
        value={value}
        selectedLabel={label}
        onChange={(v, item) => { setValue(v); setLabel(item ? `${item.code} — ${item.description}` : undefined); }}
        placeholder="Pick a CPA code…"
        searchPlaceholder="Search codes…"
        emptyText="No codes found."
      />
    </Field>
  );
}
```

> Pass `debounceMs` to let the component debounce `onQueryChange` for you (the input stays
> responsive); omit it and debounce in your own effect if you prefer.

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `items` | `T[]` | Latest results. You fetch them. |
| `getKey` | `(item: T) => string` | Stable id — also the selected `value`. |
| `getLabel` | `(item: T) => string` | Trigger text + default row text. |
| `renderItem?` | `(item: T) => ReactNode` | Rich row content (replaces the default check + label). |
| `query` | `string` | Controlled search value. |
| `onQueryChange` | `(q: string) => void` | Fetch trigger. |
| `debounceMs?` | `number` | Built-in debounce for `onQueryChange`. |
| `value?` | `string` | Selected key. |
| `onChange?` | `(value: string, item?: T) => void` | `item` omitted only if absent from `items`. |
| `selectedLabel?` | `string` | Trigger fallback when `value` isn't in the latest `items`. |
| `loading?` | `boolean` | Shows a spinner + `loadingText`. |
| `minChars?` | `number` | Don't prompt a search below N chars (default `0`). |
| `placeholder` / `searchPlaceholder` / `emptyText` / `loadingText` / `minCharsText` | `string` | Copy. |
| `id` / `disabled` / `className` | | Trigger mirrors `Combobox` / `SelectTrigger` styling. |

The popup matches the trigger width.

## Rules

- The component never fetches — keep all I/O (debounce, cancellation, error handling) in the
  consumer. This keeps it dumb and testable.
- `Command` runs with `shouldFilter={false}` because results are already filtered server-side.
  Don't re-add client filtering.
- Use `selectedLabel` so a chosen value still shows a label after a reload, before its row is
  re-fetched.

## Related

- [Combobox](combobox.md) · [Select](select.md) · [13 AI Coding Guidelines](../13-ai-coding-guidelines.md)
