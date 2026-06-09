import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const statusVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium [&>span]:size-1.5 [&>span]:rounded-full",
  {
    variants: {
      tone: {
        neutral: "bg-muted text-muted-foreground [&>span]:bg-muted-foreground",
        info: "bg-primary/10 text-primary [&>span]:bg-primary",
        success: "bg-success/10 text-success [&>span]:bg-success",
        warning: "bg-warning/15 text-warning-foreground dark:text-warning [&>span]:bg-warning",
        error: "bg-destructive/10 text-destructive [&>span]:bg-destructive",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
);

export type StatusTone = NonNullable<VariantProps<typeof statusVariants>["tone"]>;

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusVariants> {}

/**
 * A soft status pill with a leading dot (e.g. "● Paid"). Map your domain statuses to a `tone`
 * (neutral/info/success/warning/error) in one place per app, then use this everywhere.
 */
export function StatusBadge({ tone, className, children, ...props }: StatusBadgeProps) {
  return (
    <span className={cn(statusVariants({ tone }), className)} {...props}>
      <span />
      {children}
    </span>
  );
}

export { statusVariants };
