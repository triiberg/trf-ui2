import { cn } from "../lib/utils";

/*
 * Avatar — a round, bordered badge showing the first letter of a name (e.g. the
 * active organisation). The background colour is derived deterministically from a
 * key (pass the org slug/id as `colorKey` so it stays stable across renames), so
 * the same org always gets the same colour everywhere — no storage needed.
 */

export interface AvatarProps {
  /** Name to take the initial from. */
  name?: string | null;
  /** Stable key for the colour (defaults to `name`). Pass an org slug/id so the
   *  colour survives renames. */
  colorKey?: string | null;
  /** Diameter in px. */
  size?: number;
  className?: string;
}

// A spread of distinct hues; pleasant and legible with white text in both themes.
const HUES = [4, 25, 45, 95, 150, 175, 200, 220, 260, 290, 330];

function hueFor(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (Math.imul(h, 31) + key.charCodeAt(i)) >>> 0;
  return HUES[h % HUES.length];
}

export function Avatar({ name, colorKey, size = 28, className }: AvatarProps) {
  const initial = (name?.trim()?.[0] ?? "?").toUpperCase();
  const hue = hueFor((colorKey ?? name ?? "").toLowerCase());
  return (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.44),
        backgroundColor: `hsl(${hue} 52% 46%)`,
        borderColor: `hsl(${hue} 52% 34%)`,
        color: "#fff",
      }}
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full border font-semibold leading-none",
        className
      )}
    >
      {initial}
    </span>
  );
}
