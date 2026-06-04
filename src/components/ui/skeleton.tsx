import * as React from "react";
import { cn } from "../../lib/utils";

/** A pulsing placeholder for content that's still loading. Size it with width/height classes. */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}
