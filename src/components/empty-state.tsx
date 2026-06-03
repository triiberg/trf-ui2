import * as React from "react";
import { cn } from "../lib/utils";

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** A Lucide icon element, e.g. <Inbox />. */
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Optional action (usually a Button). */
  action?: React.ReactNode;
}

/** Shown when a list/area has no content. Composed from primitives. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border px-6 py-12 text-center",
        className
      )}
      {...props}
    >
      {icon != null && (
        <div className="text-muted-foreground [&_svg]:size-8">{icon}</div>
      )}
      <div className="flex flex-col gap-1">
        <p className="font-medium">{title}</p>
        {description != null && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action != null && <div className="mt-1">{action}</div>}
    </div>
  );
}
