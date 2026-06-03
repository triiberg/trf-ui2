import * as React from "react";
import { cn } from "../lib/utils";

const GAP = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
} as const;

const ALIGN = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
} as const;

const JUSTIFY = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
} as const;

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Gap between children (Tailwind spacing step). Default 3. */
  gap?: keyof typeof GAP;
  align?: keyof typeof ALIGN;
  justify?: keyof typeof JUSTIFY;
  wrap?: boolean;
}

/** Horizontal flex row. Put a <Grow> inside to fill remaining space. */
export function Row({
  gap = 3,
  align = "center",
  justify = "start",
  wrap = false,
  className,
  ...props
}: RowProps) {
  return (
    <div
      className={cn(
        "flex flex-row",
        GAP[gap],
        ALIGN[align],
        JUSTIFY[justify],
        wrap && "flex-wrap",
        className
      )}
      {...props}
    />
  );
}

/** Fills remaining horizontal space inside a <Row>. */
export function Grow({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("min-w-0 flex-1", className)} {...props} />;
}
