import * as React from "react";
import { cn } from "../lib/utils";

export interface LogoProps extends React.SVGAttributes<SVGSVGElement> {
  /** Square size in px. Default 32. */
  size?: number;
}

/**
 * TRF brand mark. Uses `currentColor`, defaulting to the brand (`text-primary`) so it shares the
 * `--primary` token with the rest of the system — override via `className` (e.g. `text-white`
 * on a colored header). Source brand orange: #FF9100.
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
        d="M26.667 1.66699C28.6917 1.66719 30.3328 3.30827 30.333 5.33301V20C30.333 22.0249 28.6919 23.6668 26.667 23.667H21.333V21.667H26.667C27.5873 21.6668 28.333 20.9204 28.333 20V5.33301C28.3328 4.41284 27.5872 3.66719 26.667 3.66699H5.33301C4.4128 3.66715 3.66721 4.41282 3.66699 5.33301V20C3.66699 20.9204 4.41266 21.6668 5.33301 21.667H15V13H9V11H23V13H17V26.667C16.9998 28.6919 15.3579 30.333 13.333 30.333H9V28.333H13.333C14.2534 28.333 14.9998 27.5873 15 26.667V23.667H5.33301C3.3081 23.6668 1.66699 22.0249 1.66699 20V5.33301C1.66721 3.30825 3.30823 1.66715 5.33301 1.66699H26.667Z"
        fill="currentColor"
      />
    </svg>
  );
}
