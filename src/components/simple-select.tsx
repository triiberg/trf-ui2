import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

export interface SimpleSelectOption {
  value: string;
  label: string;
}

export interface SimpleSelectProps {
  /** Controlled value. `""` means nothing selected (bridged to a sentinel internally). */
  value: string;
  onChange: (value: string) => void;
  options: SimpleSelectOption[];
  /** Placeholder shown while the value is empty. */
  placeholder?: string;
  /** When set, renders an explicit clear-to-empty item with this label. */
  noneLabel?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Radix Select can't represent an empty-string value, so we bridge "" <-> "__none__".
const NONE = "__none__";

/**
 * Flat-options select for the common "pick one of a fixed list" case that v1 expressed with a
 * native `<select>`. Handles the empty-value sentinel so consumers never see `__none__` — state
 * in and out is plain `""` for "nothing selected". For grouped/custom content use the composable
 * `Select` primitives instead.
 */
export function SimpleSelect({
  value,
  onChange,
  options,
  placeholder,
  noneLabel,
  id,
  required,
  disabled,
  className,
}: SimpleSelectProps) {
  return (
    <Select
      value={value === "" ? NONE : value}
      onValueChange={(v) => onChange(v === NONE ? "" : v)}
      required={required}
      disabled={disabled}
    >
      <SelectTrigger id={id} className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {noneLabel != null && <SelectItem value={NONE}>{noneLabel}</SelectItem>}
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
