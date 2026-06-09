# Migrating from trf-ui v1 to trf-ui2

> **Status: ready** · Use this alongside `for-consuming-apps.md` (install steps) and
> `15-migration-infra.md` (branching strategy).

## What stays from v1

Keep `@trf/ui` installed — these non-visual clients have no v2 equivalent yet:

```ts
// Keep importing from @trf/ui:
import { TranslationClient } from "@trf/ui";
import { fetchDiscoveryMenu, fetchDiscoveryMenuItems,
         mapDiscoveryMenuToMenuItems, mapDiscoveryMenuResponse } from "@trf/ui";
import { logout } from "@trf/ui";
import type { AppBaseUrls, AppId, DiscoveryMenuConfig, MenuItem } from "@trf/ui";
```

Everything else — all visual components — moves to `@trf/ui2`.

## Component mapping

### Direct replacements (same name, drop-in with minor prop changes)

| v1 (`@trf/ui`) | v2 (`@trf/ui2`) | Notes |
|---|---|---|
| `Button` | `Button` | Check `variant` values — v2 uses `default/outline/ghost/destructive` |
| `Input` | `Input` | API compatible |
| `Textarea` | `Textarea` | API compatible |
| `Field` | `Field` | API compatible |
| `Select` | `Select` | v2 is Radix-based; use `__none__` sentinel for empty option |
| `Card` | `Card` | API compatible |
| `TableCard` | `TableCard` | API compatible |
| `RadioCard` | `RadioCard` | API compatible |
| `Badge` | `Badge` | API compatible |
| `StatusBadge` | `StatusBadge` | Same `tone` prop pattern |
| `EmptyState` | `EmptyState` | API compatible |
| `LoadingState` | `LoadingState` | API compatible |
| `Spinner` | `Spinner` | API compatible |
| `InfoGrid` + `InfoField` | `InfoGrid` | API compatible |
| `Stack` | `Stack` | API compatible |
| `Row` + `Grow` | `Row` + `Grow` | API compatible |
| `Page` | `Page` | API compatible |
| `PageHeader` | `PageHeader` | API compatible |
| `H1` + `H2` | `H1` + `H2` | API compatible; v2 also has `H3` |
| `Text` | `Text` | API compatible |
| `DataTable` | `DataTable` | v2 adds column-reorder + inline-edit via dnd-kit |

### Renamed / restructured

| v1 | v2 | What to do |
|---|---|---|
| `AppShell` + `SideMenu` | `AppShell` + `Sidebar` | v2 `AppShell` is composable; `Sidebar` is driven by discovery menu (see `08-ui-components/sidebar.md`) |
| `PageContainer` | `Page` | Drop `PageContainer`, use `Page`. Same `size` prop. |
| `LinkButton` | `Button` with `asChild` | `<Button asChild><Link to="...">Label</Link></Button>` |
| `AccountCombobox` | `Combobox` | v2 `Combobox` is generic (Popover + Command); shape items as `{value, label}` |

### No direct v2 equivalent — handle case-by-case

| v1 | What to do |
|---|---|
| `ErrorBox` | Use `Alert` with `variant="destructive"` |
| `InfoPanel` | Use `Card` with a heading `Text` inside, or `InfoGrid` if it's key/value data |
| `FloatingDocViewer` | Keep v1 import temporarily, or build a v2 version when needed |
| `ActionPill` | Deferred in v2 — keep v1 import or use `Button` with `size="sm"` as interim |
| `StepCard` | Deferred in v2 — keep v1 import if used |

## AppShell migration pattern

v1 apps typically build their own `AppLayout` wrapping `AppShell` + `SideMenu`. In v2:

```tsx
// v2 pattern (see trfinvoices AppLayout.tsx for full reference)
import { AppShell, Sidebar } from "@trf/ui2";
import { fetchDiscoveryMenu } from "@trf/ui"; // stays in v1

// Sidebar is driven by discovery menu data; AppShell handles collapse + dark mode toggle
```

See `08-ui-components/sidebar.md` for the full composable API.

## Tailwind + tokens

v1 used inline styles and embedded `<style>` tags. v2 uses Tailwind v4 with token variables.

**Never use hardcoded colors, radii, or font sizes.** Use tokens:

```css
/* wrong */
color: #1a1a1a;
border-radius: 6px;

/* right — via Tailwind utility classes backed by tokens */
text-foreground
rounded  /* resolves to var(--radius) */
```

Read `03-design-tokens.md` before touching any styling.

## Migration process (per app)

1. **Branch:** `git checkout -b feat/trf-ui2-adoption` from `main`
2. **Install:** follow `for-consuming-apps.md` steps 1–3
3. **AppLayout first:** migrate the shell (AppShell + Sidebar) — this sets the visual baseline for all screens
4. **Screens one by one:** migrate each route/page component; swap v1 components for v2 equivalents using the table above
5. **Verify:** run dev server, check light + dark mode on every screen
6. **Add `AGENTS.md`:** copy the template from `for-consuming-apps.md`, add any app-specific notes
7. **PR:** open against `main`

## Common gotchas

- **`node_modules` committed in some repos** (trfinvoices is known): always `git add` specific files, never `git add -A`
- **Radix `Select` empty option:** use `value="__none__"` as sentinel, convert to `""` before sending to API
- **Dark mode toggle:** built into the `AppShell` header — do not add a separate toggle
- **Tailwind scanning:** add `@source "../node_modules/@trf/ui2/src/**/*.{ts,tsx}"` to your CSS or trf-ui2 classes won't generate
- **`@trf/ui` peer deps:** v1 still pulls in its own deps — don't remove them

## Reference implementation

`trfinvoices` (`feat/trf-ui2-adoption`, PR #1) is the canonical reference. When in doubt, look at
how a component was migrated there before inventing a new pattern.
