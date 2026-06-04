import * as React from "react";
import { ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "../lib/utils";

/*
 * Composable sidebar (shadcn-shaped), presentational only — no routing/auth/data inside.
 * The polish (inspired by trf-ui v1) is CSS-only:
 *  - rail animates width 16rem <-> 3.5rem; icons never move (icon column left-offset = 20px =
 *    (56-16)/2, identical expanded vs collapsed); labels fade via max-width + opacity.
 *  - collapsing is STAGED: accordions close first, then the rail narrows (and reverse on expand).
 *  - sub-menus animate with the grid-template-rows 0fr->1fr trick (no JS height measuring).
 *  - header + footer are flex-fixed; only the middle scrolls.
 */

const COLLAPSE_KEY = "trf-ui2-sidebar-collapsed";
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_ICON = "3.5rem"; // 56px; icon (16px) centers at 20px left — see label note

type SidebarContextValue = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  toggleCollapsed: () => void;
  openGroups: Set<string>;
  toggleGroup: (id: string, forceOpen?: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within <SidebarProvider>");
  return ctx;
}

export interface SidebarProviderProps {
  defaultCollapsed?: boolean;
  defaultOpenGroups?: string[];
  children: React.ReactNode;
}

export function SidebarProvider({
  defaultCollapsed = false,
  defaultOpenGroups = [],
  children,
}: SidebarProviderProps) {
  const [collapsed, setCollapsedState] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return defaultCollapsed;
    const stored = window.localStorage.getItem(COLLAPSE_KEY);
    return stored == null ? defaultCollapsed : stored === "1";
  });
  const [openGroups, setOpenGroups] = React.useState<Set<string>>(
    () => new Set(defaultOpenGroups)
  );
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const savedGroups = React.useRef<Set<string> | null>(null);

  const setCollapsed = React.useCallback((v: boolean) => {
    setCollapsedState(v);
    if (typeof window !== "undefined") window.localStorage.setItem(COLLAPSE_KEY, v ? "1" : "0");
  }, []);

  const toggleGroup = React.useCallback((id: string, forceOpen?: boolean) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (forceOpen) next.add(id);
      else if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Staged collapse: close accordions first, then narrow (and reverse on expand).
  const toggleCollapsed = React.useCallback(() => {
    if (!collapsed) {
      savedGroups.current = openGroups;
      setOpenGroups(new Set());
      window.setTimeout(() => setCollapsed(true), 180);
    } else {
      setCollapsed(false);
      const restore = savedGroups.current;
      if (restore) window.setTimeout(() => setOpenGroups(restore), 220);
    }
  }, [collapsed, openGroups, setCollapsed]);

  const value = React.useMemo<SidebarContextValue>(
    () => ({
      collapsed,
      setCollapsed,
      toggleCollapsed,
      openGroups,
      toggleGroup,
      mobileOpen,
      setMobileOpen,
    }),
    [collapsed, setCollapsed, toggleCollapsed, openGroups, toggleGroup, mobileOpen]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

/** The rail. Desktop: width-animating aside. Mobile: an overlay drawer when mobileOpen. */
export function Sidebar({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { collapsed, mobileOpen, setMobileOpen } = useSidebar();
  return (
    <>
      {/* Desktop rail */}
      <aside
        data-collapsed={collapsed || undefined}
        style={{ width: collapsed ? SIDEBAR_WIDTH_ICON : SIDEBAR_WIDTH }}
        className={cn(
          "hidden h-full shrink-0 flex-col overflow-hidden border-r border-border bg-card text-card-foreground",
          "transition-[width] duration-300 ease-in-out md:flex",
          className
        )}
      >
        {children}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <aside
            onClick={(e) => e.stopPropagation()}
            style={{ width: SIDEBAR_WIDTH }}
            className="absolute left-0 top-0 flex h-full flex-col overflow-hidden border-r border-border bg-card text-card-foreground"
          >
            {children}
          </aside>
        </div>
      )}
    </>
  );
}

export function SidebarHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex shrink-0 items-center border-b border-border", className)}
      {...props}
    />
  );
}

export function SidebarContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-2", className)}
      {...props}
    />
  );
}

export function SidebarFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-0.5 overflow-hidden border-t border-border p-2",
        className
      )}
      {...props}
    />
  );
}

export function SidebarMenu({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("flex flex-col gap-0.5 px-2", className)} {...props} />;
}

export function SidebarMenuItem({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li className={cn("list-none", className)} {...props} />;
}

/** Label that fades to zero width when collapsed (so the icon never shifts). */
function FadeLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  const { collapsed } = useSidebar();
  return (
    <span
      className={cn(
        "min-w-0 flex-1 overflow-hidden whitespace-nowrap text-ellipsis transition-[max-width,opacity] duration-200 ease-in-out",
        collapsed ? "max-w-0 opacity-0" : "max-w-[12rem] opacity-100",
        className
      )}
    >
      {children}
    </span>
  );
}

export interface SidebarMenuButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  /** Leading icon (Lucide). Stays pixel-fixed; the label fades around it. */
  icon?: React.ReactNode;
  /** Active (current route) styling. */
  isActive?: boolean;
  /** If set, this row is an expandable group: clicking toggles it, a chevron is shown. */
  groupId?: string;
  /** If set, render as an `<a href>` link instead of a button. */
  href?: string;
  /** Shown as a native tooltip when collapsed (icon-only). */
  tooltip?: string;
}

export function SidebarMenuButton({
  icon,
  isActive,
  groupId,
  href,
  tooltip,
  className,
  children,
  onClick,
  ...props
}: SidebarMenuButtonProps) {
  const { collapsed, setCollapsed, openGroups, toggleGroup } = useSidebar();
  const isOpen = groupId ? openGroups.has(groupId) : false;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement & HTMLAnchorElement>) => {
    if (collapsed) {
      // Clicking a collapsed rail expands it first (then opens the group, if any).
      setCollapsed(false);
      if (groupId) toggleGroup(groupId, true);
    } else if (groupId) {
      toggleGroup(groupId);
    }
    onClick?.(e as React.MouseEvent<HTMLButtonElement>);
  };

  const classes = cn(
    "flex w-full items-center rounded-md py-1.5 pl-5 pr-3 text-left text-sm transition-colors",
    isActive
      ? "bg-primary/10 font-medium text-primary"
      : "text-foreground hover:bg-accent hover:text-accent-foreground",
    "[&_svg]:size-4 [&_svg]:shrink-0",
    className
  );

  const inner = (
    <>
      {icon}
      <FadeLabel className={icon ? "ml-2" : undefined}>{children}</FadeLabel>
      {groupId && (
        <span
          className={cn(
            "ml-1 flex overflow-hidden transition-[max-width,opacity] duration-200",
            collapsed ? "max-w-0 opacity-0" : "max-w-4 opacity-100"
          )}
        >
          <ChevronRight
            className={cn(
              "size-3.5 transition-transform duration-200",
              isOpen && "rotate-90"
            )}
          />
        </span>
      )}
    </>
  );

  if (href && !groupId) {
    return (
      <a
        href={href}
        title={collapsed ? tooltip : undefined}
        className={classes}
        onClick={handleClick}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type="button"
      title={collapsed ? tooltip : undefined}
      className={classes}
      onClick={handleClick}
      {...props}
    >
      {inner}
    </button>
  );
}

/** Animated container for a group's children. Open/closed by `groupId` via the grid 0fr/1fr trick. */
export function SidebarMenuSub({
  groupId,
  className,
  children,
}: {
  groupId: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { collapsed, openGroups } = useSidebar();
  const open = !collapsed && openGroups.has(groupId);
  return (
    <div
      className="grid transition-[grid-template-rows] duration-200 ease-in-out"
      style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
    >
      <div className="overflow-hidden">
        <ul className={cn("ml-7 mt-0.5 flex flex-col gap-0.5 border-l border-border pl-1.5", className)}>
          {children}
        </ul>
      </div>
    </div>
  );
}

/** Collapse/expand toggle (the staged animation lives in the provider). */
export function SidebarTrigger({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { collapsed, toggleCollapsed } = useSidebar();
  return (
    <button
      type="button"
      title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      onClick={toggleCollapsed}
      className={cn(
        "flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground [&_svg]:size-4",
        collapsed ? "mx-auto" : "ml-auto",
        className
      )}
      {...props}
    >
      {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
    </button>
  );
}

/** The main content area beside the sidebar. */
export function SidebarInset({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <main
      className={cn("flex min-w-0 flex-1 flex-col overflow-y-auto", className)}
      {...props}
    />
  );
}

/** Convenience frame: provider + flex row. Pass the <Sidebar> and page content as children. */
export interface AppShellProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  defaultOpenGroups?: string[];
  className?: string;
}

export function AppShell({
  sidebar,
  children,
  defaultCollapsed,
  defaultOpenGroups,
  className,
}: AppShellProps) {
  return (
    <SidebarProvider defaultCollapsed={defaultCollapsed} defaultOpenGroups={defaultOpenGroups}>
      <div className={cn("flex h-dvh w-full overflow-hidden", className)}>
        {sidebar}
        <SidebarInset>{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
