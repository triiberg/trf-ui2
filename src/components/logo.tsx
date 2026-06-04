import * as React from "react";
import { cn } from "../lib/utils";

export interface LogoProps extends React.SVGAttributes<SVGSVGElement> {
  /** Square size in px. Default 32. */
  size?: number;
}

/**
 * TRF brand mark. Uses `currentColor`, defaulting to `text-primary` — so it tracks the brand/
 * action color per theme (sea-blue in light, amber in dark). Override via `className` (e.g.
 * `text-primary-foreground` on a primary fill). Source brand orange: #FF9100.
 */
export function Logo({ size = 32, className, ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="TRF"
      className={cn("text-primary", className)}
      {...props}
    >
      <path
        d="M25.333 1.66699C28.0944 1.66699 30.333 3.90557 30.333 6.66699V18.667C30.3329 21.4283 28.0944 23.667 25.333 23.667H21.333V21.667H25.333C26.9898 21.667 28.3329 20.3237 28.333 18.667V6.66699C28.333 5.01014 26.9899 3.66699 25.333 3.66699H6.66699C5.01014 3.66699 3.66699 5.01014 3.66699 6.66699V18.667C3.66712 20.3237 5.01022 21.667 6.66699 21.667H15V11H9V9H23V11H17V25.333C17 28.0944 14.7614 30.333 12 30.333H9V28.333H12C13.6569 28.333 15 26.9899 15 25.333V23.667H6.66699C3.90565 23.667 1.66712 21.4283 1.66699 18.667V6.66699C1.66699 3.90557 3.90557 1.66699 6.66699 1.66699H25.333Z"
        fill="currentColor"
      />
    </svg>
  );
}
