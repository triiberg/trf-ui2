# Component Graduation Plan (post-migration)

> **Status: draft** · Created 2026-06-11, after all 14 apps merged trf-ui2 adoption to main.
> Source: findings from each app's AGENTS.md "net-new" notes.

## Process (in this order)

1. **Sync** — all repos pull latest `main` (`master` for trffrontledger). No stale branches.
2. **Build** — implement each component below in trf-ui2 (source + barrel export + doc in
   `08-ui-components/` + `STRUCTURE.json` entry + demo sink section).
3. **Manual test** — Jaak verifies each component in the demo app (`demo/`, port 5180),
   light + dark mode. Then cut a tag (target: **v0.7.0**).
4. **Replace** — bump the pin in each affected app, swap the local component for the ui2 one,
   delete the local copy, and clean the stale "Active branch" section from that app's AGENTS.md
   in the same pass.

Do NOT start phase 4 until phase 3 sign-off.

## Components to build (priority order)

| # | Component | Replaces | Apps affected | Notes |
|---|-----------|----------|---------------|-------|
| 1 | `EntityCombobox` | `ContactAutocomplete` (crm), `SupplierCombobox` (purchase), `CustomerCombobox` (invoices) | 3 | Async search combobox: CRM contacts + EE business-registry fallback. Build on `AsyncCombobox`. The triple duplication makes this #1. |
| 2 | `Select` empty-value support | `SimpleSelect` (crm), `AccountSelect` (items), hand-rolled `__none__` sentinel in every app | all | Either an `allowEmpty` prop on the ui2 `Select` or a documented `SelectClearable`. Kills the most widespread boilerplate. |
| 3 | `StepCard` | payment wizard accordion (payments), CreateOrganization accordion (login) | 2 | Deferred twice — clearly needed. Accordion step card with status per step. |
| 4 | `StatementTable` | `FinancialStatementTable` (reports) | 1 | Header/line/total rows with indent depth. Explicitly flagged for graduation in reports' AGENTS.md. |
| 5 | `ActionPill` | `Button size="sm"` workarounds (payments) | 1+ | Was in v1; deferred. Small pill-shaped action chip with optional badge. |
| 6 | `EditableGrid` (or `DataTable` extension) | `TableDetailPage` grid (tables) | 1 | Dynamic add/remove columns, per-type inline cell editing, inline new-row, row delete, server-side pagination. Biggest build — possibly split into DataTable feature flags. |

### Deliberately NOT graduating (app-specific compositions)

- Public auth/login layout (login `Home.tsx`) — one app, marketing-specific
- OAuth consent UI (login, ai) — flows differ enough; revisit if a third consumer appears
- Deal-stage pipeline visuals (crm) — domain-specific

## Per-component definition of done

- [ ] Source in `src/components/`, exported from `src/index.ts`
- [ ] Tokens only, Lucide only, light + dark verified
- [ ] CVA variants where applicable, `asChild`/composition per docs/07
- [ ] Doc in `docs/08-ui-components/<name>.md`
- [ ] `STRUCTURE.json`: components map + status entry
- [ ] Demo sink section (atomic-design placement)
- [ ] Manually tested by Jaak in demo before tagging

## Phase 4 replacement checklist (per app)

- [ ] Bump `@trf/ui2` pin to the new tag
- [ ] Swap local component → ui2 import; delete local file
- [ ] Remove stale "Active branch" section from AGENTS.md (migration is merged)
- [ ] Fix any AGENTS.md tag references that drifted from package.json
- [ ] Verify in dev (JWT cookie + proxies), light + dark
- [ ] Commit specific files, push to main (small change, direct or PR per repo owner's call)
