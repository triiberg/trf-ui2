import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/utils";
import { Card, CardContent } from "./ui/card";

export interface StepCardProps {
  /** 1-based step number shown in the leading circle. */
  step: number;
  title: React.ReactNode;
  /** Muted line under the title. */
  subtitle?: React.ReactNode;
  /** Muted text on the right while collapsed — recap of what was chosen in this step. */
  summary?: React.ReactNode;
  /** Controlled: is this step's body expanded? */
  open: boolean;
  /** Header click — typically jumps the wizard back/forward to this step. */
  onOpen: () => void;
  /** Renders a check instead of the number and tones the circle success. */
  completed?: boolean;
  /** Header not clickable (e.g. steps ahead of the current one). */
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Numbered, collapsible wizard section with a collapsed-state summary. Controlled — the parent
 * owns which step is open (classic accordion wizard: one open at a time, completed steps show
 * their summary). Graduated from trffrontlogin's CreateOrganization and trffrontpayments'
 * payment wizard.
 */
export function StepCard({
  step,
  title,
  subtitle,
  summary,
  open,
  onOpen,
  completed = false,
  disabled = false,
  className,
  children,
}: StepCardProps) {
  return (
    <Card className={className}>
      <button
        type="button"
        onClick={onOpen}
        disabled={disabled}
        aria-expanded={open}
        className={cn(
          "flex w-full items-start gap-3 p-5 text-left",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
            completed
              ? "bg-success/15 text-success"
              : open
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
          )}
        >
          {completed ? <Check className="size-4" /> : step}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-base font-semibold">{title}</span>
            {summary != null && !open && (
              <span className="truncate text-sm text-muted-foreground">{summary}</span>
            )}
          </div>
          {subtitle != null && (
            <span className="mt-0.5 block text-sm text-muted-foreground">{subtitle}</span>
          )}
        </div>
      </button>
      {open && <CardContent className="px-5 pb-5 pt-0">{children}</CardContent>}
    </Card>
  );
}
