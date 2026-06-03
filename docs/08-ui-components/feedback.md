# Feedback — Alert, EmptyState, LoadingState, Tooltip

> **Status: ready** · source: `src/components/ui/{alert,tooltip}.tsx`, `src/components/{empty-state,loading-state}.tsx`

## Alert — inline message tied to a context

```tsx
import { Alert, AlertTitle, AlertDescription } from "@trf/ui2";
import { Info } from "lucide-react";

<Alert variant="destructive">
  <Info />
  <div>
    <AlertTitle>Could not save</AlertTitle>
    <AlertDescription>The customer field is required.</AlertDescription>
  </div>
</Alert>
```
Variants: `default | destructive | success | warning`. Use **Alert** for persistent, in-page
messages. For transient confirmations ("Invoice saved") use a **toast** (the apps use
`react-hot-toast`) — don't build a toast primitive here.

## EmptyState — a list/area with no content

```tsx
import { EmptyState, Button } from "@trf/ui2";
import { Inbox } from "lucide-react";

<EmptyState icon={<Inbox />} title="No invoices yet"
  description="Create your first invoice to get started."
  action={<Button size="sm">New invoice</Button>} />
```

## LoadingState — full-area loading

```tsx
import { LoadingState } from "@trf/ui2";
<LoadingState label="Loading invoices…" />
```
For tiny inline loading use `Spinner` directly.

## Tooltip — hover hint

```tsx
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@trf/ui2";

// Once, near the app root:
<TooltipProvider>{app}</TooltipProvider>

<Tooltip>
  <TooltipTrigger asChild><Button size="icon" aria-label="Info"><Info /></Button></TooltipTrigger>
  <TooltipContent>Reference number is optional.</TooltipContent>
</Tooltip>
```
Tooltips are for **supplementary** hints only — never put essential info or actions in them.

## Related

- [05 Iconography](../05-iconography.md) · [13 AI Coding Guidelines](../13-ai-coding-guidelines.md)
