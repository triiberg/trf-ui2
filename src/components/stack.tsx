import * as React from "react";
import { cn } from "../lib/utils";

// Literal classes so Tailwind generates them. Keys = Tailwind spacing steps.
const GAP = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
} as const;

const ALIGN = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
} as const;

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Gap between children (Tailwind spacing step). Default 4. */
  gap?: keyof typeof GAP;
  align?: keyof typeof ALIGN;
}

/** Vertical flex column with an even gap between children. */
export function Stack({ gap = 4, align, className, ...props }: StackProps) {
  return (
    <div
      className={cn("flex flex-col", GAP[gap], align && ALIGN[align], className)}
      {...props}
    />
  );
}
