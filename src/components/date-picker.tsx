import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { cn } from "../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";

export type { DateRange };

interface DatePickerBaseProps {
  /** Trigger text when nothing is selected. */
  placeholder?: string;
  /** Format a single date for the trigger label. Defaults to a locale medium date. */
  formatDate?: (date: Date) => string;
  id?: string;
  disabled?: boolean;
  className?: string;
}

export interface SingleDatePickerProps extends DatePickerBaseProps {
  mode?: "single";
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

export interface RangeDatePickerProps extends DatePickerBaseProps {
  mode: "range";
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
}

export type DatePickerProps = SingleDatePickerProps | RangeDatePickerProps;

const defaultFormat = (date: Date) =>
  new Intl.DateTimeFormat(undefined, { day: "2-digit", month: "short", year: "numeric" }).format(
    date
  );

/**
 * Token-styled date picker — a `Button`-like trigger that opens a `Popover` with a `Calendar`.
 * The on-system replacement for the native `<input type="date">` when you want a calendar that
 * matches the design system (light + dark). Supports single dates and start–end ranges.
 */
export function DatePicker(props: DatePickerProps) {
  const { placeholder = "Pick a date…", formatDate = defaultFormat, id, disabled, className } = props;
  const [open, setOpen] = React.useState(false);

  let label: string | undefined;
  if (props.mode === "range") {
    const r = props.value;
    if (r?.from) label = r.to ? `${formatDate(r.from)} – ${formatDate(r.to)}` : formatDate(r.from);
  } else if (props.value) {
    label = formatDate(props.value);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-9 w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-50",
            !label && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="size-4 shrink-0 opacity-50" />
          <span className="truncate">{label ?? placeholder}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        {props.mode === "range" ? (
          <Calendar
            mode="range"
            numberOfMonths={2}
            autoFocus
            selected={props.value}
            onSelect={props.onChange}
          />
        ) : (
          <Calendar
            mode="single"
            autoFocus
            selected={props.value}
            onSelect={(date) => {
              props.onChange?.(date);
              setOpen(false);
            }}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
