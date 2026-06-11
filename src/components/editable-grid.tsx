import * as React from "react";
import { Check, ChevronLeft, ChevronRight, Plus, Trash2, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { DatePicker } from "./date-picker";

export type EditableGridDataType = "string" | "number" | "date" | "boolean";

export interface EditableGridColumn {
  id: string;
  name: string;
  dataType: EditableGridDataType;
}

export interface EditableGridRow {
  id: string;
  /**
   * Cell values keyed by column id, all as strings:
   * dates ISO `YYYY-MM-DD`, booleans `"true"` / `"false"`, missing cells omitted or `""`.
   */
  values: Record<string, string>;
}

export interface EditableGridProps {
  columns: EditableGridColumn[];
  rows: EditableGridRow[];
  /** Single-cell edit committed (Enter/blur, or a date/boolean change). Persist + update `rows`. */
  onCellChange: (rowId: string, columnId: string, value: string) => void;
  /** Inline new-row submitted. May be async — the add button shows a busy state while pending. */
  onRowAdd?: (values: Record<string, string>) => void | Promise<void>;
  onRowDelete?: (rowId: string) => void;
  /** Add-column form submitted. Omit to hide the add-column control. */
  onColumnAdd?: (name: string, dataType: EditableGridDataType) => void;
  /** Column-header ✕ pressed. Confirm in the consumer (e.g. `useConfirm`) before removing. */
  onColumnDelete?: (column: EditableGridColumn) => void;

  /** 1-based current page. Pagination strip renders only when `totalPages > 1`. */
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;

  /** Override UI strings (i18n). */
  labels?: Partial<{
    addRow: string;
    addingRow: string;
    addColumn: string;
    columnName: string;
    add: string;
    prev: string;
    next: string;
    page: (page: number, totalPages: number) => string;
  }>;
  className?: string;
}

const DATA_TYPES: EditableGridDataType[] = ["string", "number", "date", "boolean"];
// Radix Select can't hold an empty string value — sentinel for the blank boolean choice.
const NONE = "__none__";

const inputTypeFor = (dt: EditableGridDataType): React.HTMLInputTypeAttribute =>
  dt === "number" ? "number" : dt === "date" ? "date" : "text";

const isoToDate = (iso?: string): Date | undefined => {
  if (!iso) return undefined;
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? undefined : d;
};

const dateToIso = (d?: Date): string => {
  if (!d) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/**
 * Spreadsheet-style editable grid: per-type inline cell editing (text/number/date/boolean),
 * an inline new-row, row delete, dynamic add/remove columns, and a server-side pagination strip.
 * Presentational — the consumer owns persistence and passes updated `columns`/`rows` back in.
 * Graduated from trffronttables' TableDetailPage.
 *
 * For read-mostly data with sorting/filtering, use `DataTable` instead.
 */
export function EditableGrid({
  columns,
  rows,
  onCellChange,
  onRowAdd,
  onRowDelete,
  onColumnAdd,
  onColumnDelete,
  page = 1,
  totalPages = 1,
  onPageChange,
  labels,
  className,
}: EditableGridProps) {
  const L = {
    addRow: "Add row",
    addingRow: "Adding…",
    addColumn: "Column",
    columnName: "Column name",
    add: "Add",
    prev: "Prev",
    next: "Next",
    page: (p: number, t: number) => `Page ${p} / ${t}`,
    ...labels,
  };

  const [editingCell, setEditingCell] = React.useState<{ rowId: string; colId: string } | null>(null);
  const [cellDraft, setCellDraft] = React.useState("");
  const [addingCol, setAddingCol] = React.useState(false);
  const [newColName, setNewColName] = React.useState("");
  const [newColType, setNewColType] = React.useState<EditableGridDataType>("string");
  const [newRowValues, setNewRowValues] = React.useState<Record<string, string>>({});
  const [savingNewRow, setSavingNewRow] = React.useState(false);
  const newColRef = React.useRef<HTMLInputElement>(null);

  const startEdit = (rowId: string, colId: string, current: string) => {
    setEditingCell({ rowId, colId });
    setCellDraft(current);
  };

  const commitEdit = () => {
    if (!editingCell) return;
    const { rowId, colId } = editingCell;
    setEditingCell(null);
    const current = rows.find((r) => r.id === rowId)?.values[colId] ?? "";
    if (cellDraft !== current) onCellChange(rowId, colId, cellDraft);
  };

  const handleCellKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      commitEdit();
    }
    if (e.key === "Escape") setEditingCell(null);
  };

  const addColumn = () => {
    if (!newColName.trim()) return;
    onColumnAdd?.(newColName.trim(), newColType);
    setNewColName("");
    setAddingCol(false);
  };

  const anyNewValue = columns.some((col) => (newRowValues[col.id] ?? "") !== "");

  const saveNewRow = async () => {
    if (!onRowAdd || !anyNewValue || savingNewRow) return;
    setSavingNewRow(true);
    try {
      await onRowAdd(newRowValues);
      setNewRowValues({});
    } finally {
      setSavingNewRow(false);
    }
  };

  const setNewValue = (colId: string, value: string) =>
    setNewRowValues((prev) => ({ ...prev, [colId]: value }));

  return (
    <div className={className}>
      <div className="rounded-lg border border-border">
        <Table style={{ minWidth: `${Math.max(480, columns.length * 160)}px` }}>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.id}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-foreground">{col.name}</span>
                    <span className="font-normal opacity-60">({col.dataType})</span>
                    {onColumnDelete && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove column ${col.name}`}
                        className="size-5 text-muted-foreground hover:text-destructive [&_svg]:size-3"
                        onClick={() => onColumnDelete(col)}
                      >
                        <X />
                      </Button>
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead className="w-px">
                {onColumnAdd &&
                  (addingCol ? (
                    <div className="flex min-w-[280px] items-center gap-1.5">
                      <Input
                        ref={newColRef}
                        value={newColName}
                        onChange={(e) => setNewColName(e.target.value)}
                        placeholder={L.columnName}
                        className="h-8 flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") addColumn();
                          if (e.key === "Escape") setAddingCol(false);
                        }}
                      />
                      <Select
                        value={newColType}
                        onValueChange={(v) => setNewColType(v as EditableGridDataType)}
                      >
                        <SelectTrigger className="h-8 w-auto">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DATA_TYPES.map((dt) => (
                            <SelectItem key={dt} value={dt}>
                              {dt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button type="button" size="sm" onClick={addColumn} disabled={!newColName.trim()}>
                        {L.add}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Cancel adding column"
                        className="size-8"
                        onClick={() => setAddingCol(false)}
                      >
                        <X />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="whitespace-nowrap"
                      onClick={() => {
                        setAddingCol(true);
                        setTimeout(() => newColRef.current?.focus(), 0);
                      }}
                    >
                      <Plus /> {L.addColumn}
                    </Button>
                  ))}
              </TableHead>
              {onRowDelete && <TableHead className="w-8" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                {columns.map((col) => {
                  const isEditing =
                    editingCell?.rowId === row.id && editingCell?.colId === col.id;
                  const value = row.values[col.id] ?? "";
                  return (
                    <TableCell key={col.id} className="p-0">
                      {col.dataType === "date" ? (
                        <div className="px-2 py-1">
                          <DatePicker
                            value={isoToDate(value)}
                            onChange={(d) => onCellChange(row.id, col.id, dateToIso(d))}
                            clearable
                            captionLayout="dropdown"
                            placeholder="—"
                            className="h-8 border-transparent bg-transparent shadow-none hover:bg-muted/60"
                          />
                        </div>
                      ) : isEditing ? (
                        <Input
                          autoFocus
                          value={cellDraft}
                          onChange={(e) => setCellDraft(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={handleCellKeyDown}
                          type={inputTypeFor(col.dataType)}
                          className="h-9 rounded-none border-x-0 border-y-0 ring-2 ring-ring ring-inset"
                        />
                      ) : (
                        <div
                          onClick={() => startEdit(row.id, col.id, value)}
                          className="min-h-9 cursor-text px-3 py-2 text-sm"
                        >
                          {col.dataType === "boolean" ? (
                            value === "true" ? (
                              <Check className="size-4 text-success" />
                            ) : value === "false" ? (
                              <X className="size-4 text-muted-foreground" />
                            ) : null
                          ) : (
                            value
                          )}
                        </div>
                      )}
                    </TableCell>
                  );
                })}
                <TableCell />
                {onRowDelete && (
                  <TableCell className="w-8 px-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Delete row"
                      className="size-7 text-muted-foreground hover:text-destructive [&_svg]:size-3.5"
                      onClick={() => onRowDelete(row.id)}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}

            {onRowAdd && (
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.id} className="px-2 py-1.5">
                    {col.dataType === "date" ? (
                      <DatePicker
                        value={isoToDate(newRowValues[col.id])}
                        onChange={(d) => setNewValue(col.id, dateToIso(d))}
                        clearable
                        captionLayout="dropdown"
                        placeholder={col.name}
                        className="h-8"
                      />
                    ) : col.dataType === "boolean" ? (
                      <Select
                        value={newRowValues[col.id] || NONE}
                        onValueChange={(v) => setNewValue(col.id, v === NONE ? "" : v)}
                      >
                        <SelectTrigger className="h-8 min-w-28">
                          <SelectValue placeholder="—" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={NONE}>—</SelectItem>
                          <SelectItem value="true">true</SelectItem>
                          <SelectItem value="false">false</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={inputTypeFor(col.dataType)}
                        value={newRowValues[col.id] ?? ""}
                        onChange={(e) => setNewValue(col.id, e.target.value)}
                        placeholder={col.name}
                        className="h-8"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") void saveNewRow();
                        }}
                      />
                    )}
                  </TableCell>
                ))}
                <TableCell className="px-2 py-1.5">
                  <Button
                    type="button"
                    size="sm"
                    disabled={savingNewRow || !anyNewValue}
                    onClick={() => void saveNewRow()}
                  >
                    <Plus /> {savingNewRow ? L.addingRow : L.addRow}
                  </Button>
                </TableCell>
                {onRowDelete && <TableCell className="w-8" />}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft /> {L.prev}
          </Button>
          <span>{L.page(page, totalPages)}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            {L.next} <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  );
}
