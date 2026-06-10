import { useEffect, useMemo, useState } from "react";
import {
  Moon, Sun, Search, Save, Trash2, Info, Inbox,
  BadgeDollarSign, Receipt, ScrollText, Handshake, PieChart, Settings,
  Palette, Atom, Combine, Layers, MoreHorizontal, Copy, Pencil,
} from "lucide-react";
import {
  Alert, AlertDescription, AlertTitle,
  AppShell, Badge, Button, cn, type ColumnDef, DataTable,
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarProvider, SidebarTrigger, useSidebar,
  Combobox, AsyncCombobox, Calendar, DatePicker, DateTimePicker, MonthPicker, type DateRange, RadioCard, TableCard,
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Checkbox, ConfirmDialog, useConfirm, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger,
  EmptyState, Field, Grow, H1, H2, H3, InfoField, InfoGrid, Input, Label, LoadingState,
  Logo, PageHeader, Row, Stack, Text, RadioGroup, RadioGroupItem, Select, SelectContent,
  SelectItem, SelectTrigger, SelectValue, Separator, Skeleton, Spinner, StatusBadge, Switch, Tabs, TabsContent, TabsList,
  TabsTrigger, Table, TableBody, TableCell,
  TableFooter, TableHead, TableHeader, TableRow, Textarea, Tooltip, TooltipContent,
  TooltipProvider, TooltipTrigger,
} from "@trf/ui2";

/* ------------------------------------------------------------------ helpers */

const FONT_SCALE = { S: 0.9, M: 1, L: 1.15 } as const;
type SizeBracket = keyof typeof FONT_SCALE;

// Injected by Vite from the @trf/ui2 package version (tracks the cut tag).
declare const __UI2_VERSION__: string;

function SidebarBrand({ label = "TRF", version }: { label?: string; version?: string }) {
  const { collapsed } = useSidebar();
  return (
    <div className="flex w-full items-center gap-2 overflow-hidden px-4 py-3">
      <Logo size={24} className="shrink-0" />
      <span
        className={cn(
          "flex items-baseline gap-1.5 overflow-hidden whitespace-nowrap font-semibold transition-[max-width,opacity] duration-200",
          collapsed ? "max-w-0 opacity-0" : "max-w-[12rem] opacity-100"
        )}
      >
        {label}
        {version ? (
          <span className="text-xs font-normal text-muted-foreground">v{version}</span>
        ) : null}
      </span>
    </div>
  );
}

/* ----------------------------------------------------- section: Combobox */

const CUSTOMERS = [
  "100 Meedia Brändi OÜ", "Triiberg AS", "Foam Labs", "Northwind OÜ",
  "Põhjala Logistika AS", "Sinilill Kohvik OÜ", "Estkapital Invest AS", "Kalev & Pojad OÜ",
].map((name) => ({ value: name, label: name }));

function ComboboxDemo() {
  const [customer, setCustomer] = useState("Triiberg AS");
  return (
    <Field label="Customer" htmlFor="customer" className="w-72">
      <Combobox
        id="customer"
        options={CUSTOMERS}
        value={customer}
        onChange={setCustomer}
        placeholder="Pick a customer…"
        searchPlaceholder="Search customers…"
        emptyText="No customer found."
      />
    </Field>
  );
}

/* ----------------------------------------------- section: AsyncCombobox */

type Cpa = { id: string; code: string; description: string; level: number };

const CPA_CODES: Cpa[] = [
  { id: "01.11", code: "01.11", description: "Growing of cereals and oil seeds", level: 4 },
  { id: "10.71", code: "10.71", description: "Manufacture of bread; fresh pastry", level: 4 },
  { id: "26.20", code: "26.20", description: "Manufacture of computers", level: 4 },
  { id: "41.00", code: "41.00", description: "Construction of buildings", level: 3 },
  { id: "49.41", code: "49.41", description: "Freight transport by road", level: 4 },
  { id: "62.01", code: "62.01", description: "Computer programming services", level: 4 },
  { id: "62.02", code: "62.02", description: "Computer consultancy services", level: 4 },
  { id: "70.22", code: "70.22", description: "Business & other management consultancy", level: 4 },
];

// Fake server: case-insensitive match on code or description, with latency.
function searchCpaCodes(query: string): Promise<Cpa[]> {
  const q = query.trim().toLowerCase();
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve(
          CPA_CODES.filter(
            (c) => c.code.includes(q) || c.description.toLowerCase().includes(q)
          )
        ),
      600
    )
  );
}

const MIN_CHARS = 2;

function AsyncComboboxDemo() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Cpa[]>([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string>();
  const [label, setLabel] = useState<string>();

  useEffect(() => {
    if (query.trim().length < MIN_CHARS) {
      setItems([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    searchCpaCodes(query).then((res) => {
      if (cancelled) return;
      setItems(res);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [query]);

  const picker = (disabled?: boolean) => (
    <AsyncCombobox<Cpa>
      items={items}
      getKey={(c) => c.id}
      getLabel={(c) => `${c.code} — ${c.description}`}
      renderItem={(c) => (
        <>
          <span className="shrink-0 font-mono text-primary">{c.code}</span>
          <span className="flex-1 truncate">{c.description}</span>
          <Badge variant="secondary" className="shrink-0">L{c.level}</Badge>
        </>
      )}
      query={query}
      onQueryChange={setQuery}
      debounceMs={250}
      loading={loading}
      minChars={MIN_CHARS}
      value={value}
      selectedLabel={label}
      onChange={(v, item) => {
        setValue(v);
        setLabel(item ? `${item.code} — ${item.description}` : undefined);
      }}
      placeholder="Pick a CPA code…"
      searchPlaceholder="Search codes…"
      emptyText="No codes found."
      loadingText="Searching…"
      disabled={disabled}
    />
  );

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Field label="CPA code" htmlFor="cpa" className="w-72">
        {picker()}
      </Field>
      <Text className="text-muted-foreground">
        Idle, then type under {MIN_CHARS} chars (prompt), 2+ chars (loading → rich rows or empty),
        and pick one (selected). Try “xyz” for the empty state.
      </Text>
      <Field label="CPA code (disabled)" htmlFor="cpa-disabled" className="w-72">
        {picker(true)}
      </Field>
    </div>
  );
}

/* ------------------------------------------------ section: ConfirmDialog */

function ConfirmDialogDemo() {
  const [delOpen, setDelOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [last, setLast] = useState<string>();
  const { confirm, dialog } = useConfirm();

  const fakeAsync = () => new Promise<void>((r) => setTimeout(r, 1500));

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Declarative, destructive */}
        <Button variant="destructive" onClick={() => setDelOpen(true)}>
          <Trash2 /> Delete invoice
        </Button>
        <ConfirmDialog
          open={delOpen}
          variant="destructive"
          title="Delete invoice #1042?"
          description="The invoice will be permanently removed. This cannot be undone."
          confirmLabel="Delete"
          warning="Linked payments will be detached from this invoice."
          onConfirm={() => {
            setLast("Deleted #1042");
            setDelOpen(false);
          }}
          onCancel={() => setDelOpen(false)}
        />

        {/* Declarative, non-destructive + async/busy */}
        <Button variant="secondary" onClick={() => setPublishOpen(true)}>
          Publish report…
        </Button>
        <ConfirmDialog
          open={publishOpen}
          title="Publish report?"
          description="This sends the report to all subscribers. It may take a moment."
          confirmLabel="Publish"
          onConfirm={async () => {
            await fakeAsync(); // spinner shows on the confirm button while pending
            setLast("Report published");
            setPublishOpen(false);
          }}
          onCancel={() => setPublishOpen(false)}
        />

        {/* Imperative hook */}
        <Button
          variant="secondary"
          onClick={async () => {
            const ok = await confirm({
              title: "Archive contract?",
              description: "You can restore it later from the archive.",
              confirmLabel: "Archive",
            });
            setLast(ok ? "Archived (via useConfirm)" : "Cancelled (via useConfirm)");
          }}
        >
          Archive (useConfirm)
        </Button>
        {dialog}
      </div>
      {last ? <Text className="text-muted-foreground">Last action: {last}</Text> : null}
    </div>
  );
}

/* --------------------------------------------------- section: DatePicker */

function DatePickerDemo() {
  const [date, setDate] = useState<Date>();
  const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(new Date(2026, 5, 9));
  const [range, setRange] = useState<DateRange>();
  const [period, setPeriod] = useState<Date | undefined>(new Date(2026, 5, 1));
  const [paid, setPaid] = useState<Date>();
  const [fmtDate, setFmtDate] = useState<Date | undefined>(new Date(2026, 5, 9));
  const [filterDate, setFilterDate] = useState<Date | undefined>(new Date(2026, 5, 9));
  const [keepDay, setKeepDay] = useState<Date | undefined>(new Date(2026, 5, 10));
  const [appt, setAppt] = useState<Date | undefined>(new Date(2026, 5, 9, 14, 30));
  const [meeting, setMeeting] = useState<Date>();
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      <Field label="Due date" htmlFor="dp-empty" description="Single date, nothing selected.">
        <DatePicker id="dp-empty" value={date} onChange={setDate} placeholder="Pick a date…" />
      </Field>
      <Field label="Invoice date" htmlFor="dp-selected" description="Single date, preselected.">
        <DatePicker id="dp-selected" value={invoiceDate} onChange={setInvoiceDate} />
      </Field>
      <Field label="Report period" htmlFor="dp-range" className="sm:col-span-2" description="Range mode (two months).">
        <DatePicker mode="range" id="dp-range" value={range} onChange={setRange} placeholder="Pick a range…" />
      </Field>
      <Field label="Birth date" htmlFor="dp-dropdown" description="captionLayout=dropdown — month + year jumping.">
        <DatePicker id="dp-dropdown" value={invoiceDate} onChange={setInvoiceDate} captionLayout="dropdown" />
      </Field>
      <Field label="Payment date" htmlFor="dp-nofuture" description="disabledDates: future dates greyed out.">
        <DatePicker
          id="dp-nofuture"
          value={paid}
          onChange={setPaid}
          disabledDates={{ after: new Date() }}
          placeholder="Pick a past date…"
        />
      </Field>
      <Field label="Custom label" htmlFor="dp-fmt" description="formatDate: weekday + long date.">
        <DatePicker
          id="dp-fmt"
          value={fmtDate}
          onChange={setFmtDate}
          formatDate={(d) =>
            d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "long", year: "numeric" })
          }
        />
      </Field>
      <Field label="Filter by date" htmlFor="dp-clear" description="clearable: ✕ resets to empty.">
        <DatePicker id="dp-clear" value={filterDate} onChange={setFilterDate} clearable />
      </Field>
      <Field label="Keep day on navigate" htmlFor="dp-keep" description="keepDayOnNavigate + dropdown — jump months, keep the day.">
        <DatePicker
          id="dp-keep"
          value={keepDay}
          onChange={setKeepDay}
          captionLayout="dropdown"
          keepDayOnNavigate
        />
      </Field>
      <Field label="Accounting period" htmlFor="mp" description="MonthPicker — picks a whole month.">
        <MonthPicker id="mp" value={period} onChange={setPeriod} minYear={2015} maxYear={2035} />
      </Field>
      <Field label="Disabled" htmlFor="dp-disabled">
        <DatePicker id="dp-disabled" value={invoiceDate} disabled />
      </Field>
      <Field label="Appointment" htmlFor="dt-appt" description="DateTimePicker — date + time, preselected.">
        <DateTimePicker id="dt-appt" value={appt} onChange={setAppt} />
      </Field>
      <Field label="Meeting" htmlFor="dt-meeting" description="DateTimePicker — dropdown nav + 15-min steps.">
        <DateTimePicker
          id="dt-meeting"
          value={meeting}
          onChange={setMeeting}
          captionLayout="dropdown"
          minuteStep={15}
          placeholder="Pick date & time…"
        />
      </Field>
      <div className="sm:col-span-2">
        <Text className="mb-2 text-muted-foreground">Inline calendar (the primitive), dropdown nav:</Text>
        <Calendar
          mode="single"
          captionLayout="dropdown"
          startMonth={new Date(2015, 0)}
          endMonth={new Date(2035, 11)}
          selected={invoiceDate}
          onSelect={setInvoiceDate}
          className="w-fit rounded-md border border-border"
        />
      </div>
    </div>
  );
}

function RadioCardDemo() {
  const [val, setVal] = useState("invoice");
  return (
    <div className="grid w-full max-w-lg gap-3 sm:grid-cols-2">
      <RadioCard selected={val === "invoice"} onClick={() => setVal("invoice")} icon={<Receipt />} title="Invoice" description="A standard sales invoice." />
      <RadioCard selected={val === "offer"} onClick={() => setVal("offer")} icon={<ScrollText />} title="Offer" description="A price quote / proposal." />
    </div>
  );
}

/* ------------------------------------------------------- section: Colors */

const COLOR_TOKENS = [
  "background", "foreground", "card", "popover", "primary", "secondary", "muted", "accent",
  "destructive", "success", "warning", "border", "input", "ring",
];

function ColorsSection() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {COLOR_TOKENS.map((t) => (
          <div key={t} className="flex flex-col gap-1.5">
            <div className="h-14 rounded-lg border border-border" style={{ background: `var(--${t})` }} />
            <Text size="xs" mono>{t}</Text>
          </div>
        ))}
      </div>
      <Text size="xs" tone="muted" className="mt-3">
        Semantic tokens (`--primary` etc.), light + dark. Toggle the theme — everything re-skins
        from these. `--primary` is ink in light, amber in dark.
      </Text>
    </div>
  );
}

/* --------------------------------------------------- section: DataTable */

type Invoice = { number: string; customer: string; status: "Draft" | "Confirmed" | "Paid"; total: number };
const STATUS_VARIANT = { Draft: "secondary", Confirmed: "default", Paid: "success" } as const;

function InvoiceTable() {
  const [rows, setRows] = useState<Invoice[]>([
    { number: "1042", customer: "100 Meedia Brändi OÜ", status: "Paid", total: 1240 },
    { number: "1041", customer: "Triiberg AS", status: "Confirmed", total: 380.5 },
    { number: "1040", customer: "Foam Labs", status: "Draft", total: 96 },
    { number: "1039", customer: "Northwind OÜ", status: "Confirmed", total: 5120 },
  ]);
  const columns: ColumnDef<Invoice>[] = [
    { id: "number", accessorKey: "number", header: "Number" },
    { id: "customer", accessorKey: "customer", header: "Customer", meta: { editable: true } },
    {
      id: "status", accessorKey: "status", header: "Status",
      cell: ({ getValue }) => {
        const s = getValue() as Invoice["status"];
        return <Badge variant={STATUS_VARIANT[s]}>{s}</Badge>;
      },
    },
    {
      id: "total", accessorKey: "total", header: "Total", meta: { editable: true, align: "right" },
      cell: ({ getValue }) => `€${(getValue() as number).toLocaleString("en", { minimumFractionDigits: 2 })}`,
    },
  ];
  return (
    <div className="w-full">
      <Text size="xs" tone="muted" className="mb-2">
        Click headers to sort · type to filter · drag the grip to reorder columns · click Customer
        or Total to edit inline.
      </Text>
      <DataTable
        columns={columns}
        data={rows}
        enableSorting
        enableGlobalFilter
        enableColumnReorder
        onCellEdit={(rowIndex, columnId, value) =>
          setRows((prev) =>
            prev.map((r, i) =>
              i === rowIndex ? { ...r, [columnId]: columnId === "total" ? Number(value) || 0 : value } : r
            )
          )
        }
      />
    </div>
  );
}

/* ------------------------------------------------ section: Sidebar (organism) */

function SidebarDemo() {
  const [active, setActive] = useState("invoices");
  const leaf = (id: string, label: string) => (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={active === id} onClick={() => setActive(id)}>{label}</SidebarMenuButton>
    </SidebarMenuItem>
  );
  return (
    <div className="h-[540px] w-full overflow-hidden rounded-lg border border-border">
      <SidebarProvider defaultOpenGroups={["sales"]}>
        <div className="flex h-full w-full">
          <Sidebar>
            <SidebarHeader><SidebarBrand /></SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton groupId="sales" icon={<BadgeDollarSign />} tooltip="Sales">Sales</SidebarMenuButton>
                  <SidebarMenuSub groupId="sales">
                    {leaf("invoices", "Invoices")}{leaf("offers", "Offers")}{leaf("waybills", "Waybills")}
                  </SidebarMenuSub>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton groupId="purchase" icon={<Receipt />} tooltip="Purchase">Purchase</SidebarMenuButton>
                  <SidebarMenuSub groupId="purchase">{leaf("bills", "Bills")}{leaf("orders", "Orders")}</SidebarMenuSub>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton icon={<ScrollText />} tooltip="Ledger" isActive={active === "ledger"} onClick={() => setActive("ledger")}>Ledger</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton icon={<Handshake />} tooltip="CRM" isActive={active === "crm"} onClick={() => setActive("crm")}>CRM</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton icon={<PieChart />} tooltip="Reports" isActive={active === "reports"} onClick={() => setActive("reports")}>Reports</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton icon={<Settings />} tooltip="Settings" isActive={active === "settings"} onClick={() => setActive("settings")}>Settings</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter><SidebarTrigger /></SidebarFooter>
          </Sidebar>
          <main className="min-w-0 flex-1 overflow-y-auto p-6">
            <H1 className="capitalize">{active}</H1>
            <Text tone="muted" className="mt-1">
              Collapse the rail (bottom-left): sub-items close first, then it narrows to icons —
              which stay centered and never move. Open a group to see the grid accordion.
            </Text>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

/* ------------------------------------------------- atomic-design registry */

type SectionDef = { id: string; label: string; render: () => React.ReactNode };
type GroupDef = { id: string; label: string; icon: React.ReactNode; sections: SectionDef[] };

const GROUPS: GroupDef[] = [
  {
    id: "foundations", label: "Foundations", icon: <Palette />,
    sections: [
      {
        id: "brand", label: "Brand", render: () => (
          <>
            <div className="flex items-end gap-6">
              <Logo size={48} /><Logo size={32} /><Logo size={24} /><Logo size={16} />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-14 items-center justify-center rounded-lg bg-primary"><Logo size={32} className="text-primary-foreground" /></div>
              <div className="flex size-14 items-center justify-center rounded-lg bg-foreground"><Logo size={32} className="text-background" /></div>
              <div className="flex size-14 items-center justify-center rounded-lg border border-border"><Logo size={32} /></div>
            </div>
            <Text size="xs" tone="muted" className="w-full">
              `Logo` defaults to `text-primary` — tracks the brand/action color per theme (ink in
              light, amber in dark). Override via `className`.
            </Text>
          </>
        ),
      },
      { id: "colors", label: "Colors", render: () => <ColorsSection /> },
      {
        id: "typography", label: "Typography", render: () => (
          <div className="flex w-full max-w-xl flex-col gap-3">
            <Text size="xs" tone="muted">
              Use the <strong>text S/M/L</strong> control (top-right) — one knob (`--font-scale`)
              scales everything and respects your browser font size.
            </Text>
            <H1>H1 — Page title (24)</H1>
            <H2>H2 — Section heading (20)</H2>
            <H3>H3 — Subsection (16, weight-driven)</H3>
            <Text size="lg">Text lg — 18px</Text>
            <Text>Text — body, 14px (default)</Text>
            <Text size="xs" tone="muted">Text xs muted — 12px, captions & meta</Text>
            <Text weight="medium">Text — medium weight for emphasis</Text>
            <Text mono>Text mono — 1234567890 · €1,240.00 (tabular figures)</Text>
            <Separator className="my-1" />
            <Label>Standalone Label</Label>
            <div className="flex h-5 items-center gap-3">
              <Text as="span">Left</Text><Separator orientation="vertical" /><Text as="span">Right</Text>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "atoms", label: "Atoms", icon: <Atom />,
    sections: [
      {
        id: "buttons", label: "Buttons", render: () => (
          <>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="Search"><Search /></Button>
            <Button disabled>Disabled</Button>
            <Button><Save /> With icon</Button>
          </>
        ),
      },
      {
        id: "badges", label: "Badges", render: () => (
          <>
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </>
        ),
      },
      {
        id: "inputs", label: "Inputs & Field", render: () => (
          <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
            <Field label="Email" htmlFor="email" description="We never share it." required>
              <Input id="email" type="email" placeholder="you@trf.is" />
            </Field>
            <Field label="Amount" htmlFor="amount" error="Must be a positive number.">
              <Input id="amount" type="number" defaultValue={-5} />
            </Field>
            <Field label="Due date" htmlFor="due" description="Native date input — calendar icon follows the theme.">
              <Input id="due" type="date" defaultValue="2026-06-09" />
            </Field>
            <Field label="Comment" htmlFor="comment" className="sm:col-span-2">
              <Textarea id="comment" placeholder="Free-text notes…" />
            </Field>
          </div>
        ),
      },
      {
        id: "choices", label: "Choice controls", render: () => (
          <>
            <label className="flex items-center gap-2 text-sm"><Checkbox defaultChecked /> Send a copy by email</label>
            <label className="flex items-center gap-2 text-sm"><Switch defaultChecked /> Auto-confirm</label>
            <RadioGroup defaultValue="net14" className="gap-2">
              <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="net14" /> Net 14</label>
              <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="net30" /> Net 30</label>
            </RadioGroup>
          </>
        ),
      },
      {
        id: "select", label: "Select", render: () => (
          <Field label="Document type" htmlFor="doctype" className="w-64">
            <Select defaultValue="invoice">
              <SelectTrigger id="doctype"><SelectValue placeholder="Pick a type…" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="waybill">Waybill</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        ),
      },
      {
        id: "statusbadge", label: "Status badge", render: () => (
          <>
            <StatusBadge tone="neutral">Draft</StatusBadge>
            <StatusBadge tone="info">Confirmed</StatusBadge>
            <StatusBadge tone="success">Paid</StatusBadge>
            <StatusBadge tone="warning">Overdue</StatusBadge>
            <StatusBadge tone="error">Cancelled</StatusBadge>
          </>
        ),
      },
      { id: "combobox", label: "Combobox", render: () => <ComboboxDemo /> },
      { id: "async-combobox", label: "Async combobox", render: () => <AsyncComboboxDemo /> },
      { id: "datepicker", label: "Date & time pickers", render: () => <DatePickerDemo /> },
      {
        id: "spinner", label: "Spinner", render: () => (
          <><Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" /></>
        ),
      },
      {
        id: "tooltip", label: "Tooltip", render: () => (
          <Tooltip>
            <TooltipTrigger asChild><Button variant="secondary" size="sm"><Info /> Hover me</Button></TooltipTrigger>
            <TooltipContent>Reference number is optional.</TooltipContent>
          </Tooltip>
        ),
      },
      {
        id: "dropdown", label: "Dropdown menu", render: () => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" aria-label="Row actions"><MoreHorizontal /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Invoice #1042</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Pencil /> Edit <DropdownMenuShortcut>⌘E</DropdownMenuShortcut></DropdownMenuItem>
              <DropdownMenuItem><Copy /> Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive><Trash2 /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
  },
  {
    id: "molecules", label: "Molecules", icon: <Combine />,
    sections: [
      {
        id: "alerts", label: "Alerts", render: () => (
          <div className="flex w-full max-w-xl flex-col gap-3">
            <Alert><Info /><div><AlertTitle>Heads up</AlertTitle><AlertDescription>This invoice has no line items yet.</AlertDescription></div></Alert>
            <Alert variant="destructive"><Trash2 /><div><AlertTitle>Could not save</AlertTitle><AlertDescription>The customer field is required.</AlertDescription></div></Alert>
          </div>
        ),
      },
      {
        id: "skeleton", label: "Skeleton", render: () => (
          <div className="w-full max-w-sm rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
            <Skeleton className="mt-4 h-20 w-full" />
          </div>
        ),
      },
      {
        id: "states", label: "Empty & Loading", render: () => (
          <>
            <LoadingState className="w-64 rounded-lg border border-border" />
            <EmptyState
              className="w-72"
              icon={<Inbox />}
              title="No invoices yet"
              description="Create your first invoice to get started."
              action={<Button size="sm">New invoice</Button>}
            />
          </>
        ),
      },
      {
        id: "infogrid", label: "Info grid", render: () => (
          <div className="w-full max-w-lg rounded-lg border border-border p-5">
            <InfoGrid columns={2}>
              <InfoField label="Customer">Triiberg AS</InfoField>
              <InfoField label="Status"><Badge variant="success">Paid</Badge></InfoField>
              <InfoField label="Issued">2026-05-14</InfoField>
              <InfoField label="Due">2026-05-28</InfoField>
              <InfoField label="Reference">INV-1042</InfoField>
              <InfoField label="Payable"><Text mono>€1,240.00</Text></InfoField>
            </InfoGrid>
          </div>
        ),
      },
      { id: "radiocard", label: "Radio card", render: () => <RadioCardDemo /> },
      {
        id: "tabs", label: "Tabs", render: () => (
          <Tabs defaultValue="overview" className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="lines">Line items</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="overview"><Text tone="muted">Invoice summary, customer, totals.</Text></TabsContent>
            <TabsContent value="lines"><Text tone="muted">The editable line items table.</Text></TabsContent>
            <TabsContent value="history"><Text tone="muted">Status changes and audit trail.</Text></TabsContent>
          </Tabs>
        ),
      },
      {
        id: "card", label: "Card & Dialog", render: () => (
          <Card className="w-full max-w-sm">
            <CardHeader><CardTitle>Invoice #1042</CardTitle><CardDescription>Confirmed · 100 Meedia Brändi OÜ</CardDescription></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Payable</span>
                <span className="font-mono font-medium tabular-nums">€1,240.00</span>
              </div>
              <Separator className="my-3" />
              <Badge variant="success">Paid</Badge>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Dialog>
                <DialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 /> Cancel</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel invoice #1042?</DialogTitle>
                    <DialogDescription>This action cannot be undone. Focus is trapped here; press Esc to close.</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild><Button variant="secondary">Keep it</Button></DialogClose>
                    <DialogClose asChild><Button variant="destructive">Yes, cancel</Button></DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button size="sm">View</Button>
            </CardFooter>
          </Card>
        ),
      },
      { id: "confirm", label: "Confirm dialog", render: () => <ConfirmDialogDemo /> },
    ],
  },
  {
    id: "organisms", label: "Organisms", icon: <Layers />,
    sections: [
      {
        id: "layout", label: "Layout & page", render: () => (
          <div className="flex w-full flex-col gap-5">
            <div className="rounded-lg border border-border p-4">
              <PageHeader
                title="Invoices"
                description="Sales documents for this organisation."
                actions={<><Button variant="secondary" size="sm">Export</Button><Button size="sm">New invoice</Button></>}
              />
              <Text size="xs" tone="muted">↑ `PageHeader` — title · description · actions</Text>
            </div>
            <div className="rounded-lg border border-border p-4">
              <Row gap={3}>
                <Button variant="secondary" size="sm">Back</Button>
                <Grow><Input placeholder="Grow fills the remaining space" /></Grow>
                <Button size="sm">Save</Button>
              </Row>
              <Text size="xs" tone="muted" className="mt-2">↑ `Row` with a `Grow` in the middle</Text>
            </div>
            <div className="rounded-lg border border-border p-4">
              <Stack gap={2}>
                <div className="rounded-md bg-muted px-3 py-2 text-sm">Stack item 1</div>
                <div className="rounded-md bg-muted px-3 py-2 text-sm">Stack item 2</div>
                <div className="rounded-md bg-muted px-3 py-2 text-sm">Stack item 3</div>
              </Stack>
              <Text size="xs" tone="muted" className="mt-2">↑ `Stack` — vertical, even gap. `Page` wraps it in a centered, width-capped container.</Text>
            </div>
          </div>
        ),
      },
      {
        id: "table", label: "Table (primitive)", render: () => (
          <div className="w-full max-w-md overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader><TableRow><TableHead>Line</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
              <TableBody>
                <TableRow><TableCell>Net</TableCell><TableCell className="text-right font-mono tabular-nums">€1,000.00</TableCell></TableRow>
                <TableRow><TableCell>VAT 22%</TableCell><TableCell className="text-right font-mono tabular-nums">€220.00</TableCell></TableRow>
              </TableBody>
              <TableFooter><TableRow><TableCell>Total</TableCell><TableCell className="text-right font-mono tabular-nums">€1,220.00</TableCell></TableRow></TableFooter>
            </Table>
          </div>
        ),
      },
      {
        id: "tablecard", label: "Table card", render: () => (
          <TableCard
            className="w-full max-w-md"
            title="Recent invoices"
            actions={<Button size="sm" variant="secondary">Export</Button>}
            footer={<Text size="xs" tone="muted">3 documents</Text>}
          >
            <Table>
              <TableHeader><TableRow><TableHead>Number</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
              <TableBody>
                <TableRow><TableCell>1042</TableCell><TableCell className="text-right font-mono tabular-nums">€1,240.00</TableCell></TableRow>
                <TableRow><TableCell>1041</TableCell><TableCell className="text-right font-mono tabular-nums">€380.50</TableCell></TableRow>
                <TableRow><TableCell>1040</TableCell><TableCell className="text-right font-mono tabular-nums">€96.00</TableCell></TableRow>
              </TableBody>
            </Table>
          </TableCard>
        ),
      },
      { id: "datatable", label: "DataTable", render: () => <InvoiceTable /> },
      { id: "sidebar", label: "App shell / Sidebar", render: () => <SidebarDemo /> },
    ],
  },
];

/* ------------------------------------------------------------------ app */

function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  const { collapsed } = useSidebar();
  return (
    <div
      className={cn(
        "flex items-center overflow-hidden transition-[max-width,opacity] duration-200",
        collapsed ? "max-w-0 opacity-0" : "max-w-[100px] opacity-100"
      )}
    >
      <Button variant="ghost" size="icon" onClick={onToggle} title="Toggle theme" aria-label="Toggle theme">
        {dark ? <Sun /> : <Moon />}
      </Button>
    </div>
  );
}

export function App() {
  const [dark, setDark] = useState(false);
  const [radius, setRadius] = useState(8);
  const [textSize, setTextSize] = useState<SizeBracket>("M");
  const [active, setActive] = useState("buttons");

  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  useEffect(() => { document.documentElement.style.setProperty("--radius", `${radius}px`); }, [radius]);
  useEffect(() => { document.documentElement.style.setProperty("--font-scale", String(FONT_SCALE[textSize])); }, [textSize]);

  const activeSection = useMemo(() => {
    for (const g of GROUPS) for (const s of g.sections) if (s.id === active) return s;
    return GROUPS[0].sections[0];
  }, [active]);

  return (
    <TooltipProvider delayDuration={200}>
      <AppShell
        defaultOpenGroups={GROUPS.map((g) => g.id)}
        sidebar={
          <Sidebar>
            <SidebarHeader><SidebarBrand label="trf-ui2" version={__UI2_VERSION__} /></SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {GROUPS.map((g) => (
                  <SidebarMenuItem key={g.id}>
                    <SidebarMenuButton groupId={g.id} icon={g.icon} tooltip={g.label}>{g.label}</SidebarMenuButton>
                    <SidebarMenuSub groupId={g.id}>
                      {g.sections.map((s) => (
                        <SidebarMenuItem key={s.id}>
                          <SidebarMenuButton isActive={active === s.id} onClick={() => setActive(s.id)}>{s.label}</SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <ThemeToggle dark={dark} onToggle={() => setDark((d) => !d)} />
              <SidebarTrigger />
            </SidebarFooter>
          </Sidebar>
        }
      >
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-background/80 px-6 py-3 backdrop-blur">
          <div className="flex items-baseline gap-2">
            <H2>{activeSection.label}</H2>
            <Text size="xs" tone="muted">kitchen sink</Text>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              text
              {(Object.keys(FONT_SCALE) as SizeBracket[]).map((b) => (
                <Button key={b} variant={textSize === b ? "primary" : "secondary"} size="sm" onClick={() => setTextSize(b)}>{b}</Button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              radius {radius}px
              <input type="range" min={0} max={20} value={radius} onChange={(e) => setRadius(Number(e.target.value))} />
            </label>
          </div>
        </div>

        {/* Active section */}
        <div className="mx-auto w-full max-w-5xl px-6 py-8">
          <div className="flex flex-wrap items-start gap-4">{activeSection.render()}</div>
        </div>
      </AppShell>
    </TooltipProvider>
  );
}
