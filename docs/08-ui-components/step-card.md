# StepCard

> **Status: ready** · `import { StepCard } from "@trf/ui2"` · source:
> `src/components/step-card.tsx` (built on `Card`)

**Numbered, collapsible wizard section** with a collapsed-state summary. Controlled — the parent
owns which step is open. The classic accordion wizard: one step open at a time; completed steps
collapse to a one-line recap.

Graduated from trffrontlogin (`CreateOrganization`) and trffrontpayments (payment wizard).

## Usage

```tsx
import { StepCard, Stack } from "@trf/ui2";

function PaymentWizard() {
  const [step, setStep] = useState(1);

  return (
    <Stack gap={3}>
      <StepCard
        step={1}
        title="Payment details"
        subtitle="Date, amount and direction."
        summary={step > 1 ? `${date} · €${amount}` : undefined}
        open={step === 1}
        onOpen={() => setStep(1)}
        completed={step > 1}
      >
        {/* step 1 form… */}
      </StepCard>
      <StepCard
        step={2}
        title="Match invoices"
        open={step === 2}
        onOpen={() => setStep(2)}
        disabled={step < 2}
      >
        {/* step 2 content… */}
      </StepCard>
    </Stack>
  );
}
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `step` | `number` | 1-based number in the leading circle |
| `title` / `subtitle` | `ReactNode` | Subtitle is muted, under the title |
| `summary` | `ReactNode` | Muted right-aligned recap, shown only while collapsed |
| `open` / `onOpen` | controlled | Parent owns the active step |
| `completed` | `boolean` | Check icon + success tone instead of the number |
| `disabled` | `boolean` | Header not clickable (steps ahead of the current one) |

## Rules

- One open step at a time — drive all `open` props from a single piece of state.
- Set `summary` once a step is done so the collapsed card recaps the choice.
- Mark earlier steps `completed`, later steps `disabled`.

## Related

- [Cards](cards.md) · [13 AI Coding Guidelines](../13-ai-coding-guidelines.md)
