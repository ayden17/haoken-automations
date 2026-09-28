"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  LayoutDashboard,
  Megaphone,
  Menu,
  Moon,
  Receipt,
  Search,
  Sparkles,
  Sun,
  Target,
  Users,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { GeneratePanel } from "@/components/generate-panel";
import { cn } from "@/lib/utils";

const groups = [
  {
    title: "Overview",
    items: [{ href: "/", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Accounts",
    items: [
      { href: "/klien", label: "Klien", icon: Users },
      { href: "/invoice", label: "Invoice", icon: Receipt },
    ],
  },
  {
    title: "Growth",
    items: [
      { href: "/pemasaran", label: "Pemasaran", icon: Megaphone },
      { href: "/prospek", label: "Prospek", icon: Target },
      { href: "/automasi", label: "Automasi", icon: Workflow },
    ],
  },
] as const;

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/klien": "Klien",
  "/invoice": "Invoice",
  "/pemasaran": "Pemasaran",
  "/prospek": "Prospek",
  "/automasi": "Automasi",
};

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function Brand() {
  return (
    <Link className="flex items-center gap-2.5 px-2" href="/">
      <span className="flex size-8 items-center justify-center rounded-lg bg-foreground font-semibold text-background text-sm">
        H
      </span>
      <span className="min-w-0">
        <span className="block truncate font-medium text-sm leading-none">Haoken</span>
        <span className="mt-1 block text-muted-foreground text-xs">Marketing agency</span>
      </span>
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="flex flex-col gap-3">
      {groups.map((group) => (
        <Collapsible defaultOpen key={group.title}>
          <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1 text-muted-foreground text-xs">
            {group.title}
            <ChevronDown className="size-3" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1 flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-8 items-center gap-2 rounded-lg px-2 text-sm transition-colors",
                    active
                      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/70",
                  )}
                  href={item.href}
                  key={item.href}
                  onClick={onNavigate}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center px-3">
        <Brand />
      </div>
      <Separator />
      <div className="flex-1 overflow-y-auto px-2 py-3">
        <NavLinks onNavigate={onNavigate} />
      </div>
      <Separator />
      <div className="flex items-center gap-2 p-3">
        <img
          alt=""
          className="size-8 rounded-full object-cover"
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80"
        />
        <div className="min-w-0">
          <p className="truncate text-sm">Ayden Haoken</p>
          <p className="truncate text-muted-foreground text-xs">Agency owner</p>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  }

  return (
    <div className="flex min-h-svh bg-background text-foreground">
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 border-sidebar-border border-r md:block">
        <SidebarBody />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background px-3 md:px-4">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button className="md:hidden" size="icon" variant="ghost">
                <Menu />
                <span className="sr-only">Open navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-72 p-0 data-[side=left]:sm:max-w-xs" side="left">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <SidebarBody onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="min-w-0">
            <p className="truncate font-medium text-sm">
              {pathname.startsWith("/klien") ? "Klien" : (titles[pathname] ?? "Haoken")}
            </p>
          </div>
          <form
            className="ms-auto hidden max-w-xs flex-1 sm:block"
            onSubmit={(event) => {
              event.preventDefault();
              const next = query.trim();
              router.push(next ? `/prospek?q=${encodeURIComponent(next)}` : "/prospek");
            }}
          >
            <label className="relative block">
              <span className="sr-only">Search prospek</span>
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-8"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search prospek"
                value={query}
              />
            </label>
          </form>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={toggleTheme} size="icon" variant="ghost">
                {dark ? <Sun /> : <Moon />}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle theme</TooltipContent>
          </Tooltip>
          <Sheet open={generateOpen} onOpenChange={setGenerateOpen}>
            <SheetTrigger asChild>
              <Button size="sm">
                <Sparkles />
                Generate
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full overflow-y-auto data-[side=right]:sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Automation template</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-4">
                <GeneratePanel />
              </div>
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
