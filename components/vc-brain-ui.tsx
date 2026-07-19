"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { dashboardNavigation } from "@/lib/vc-brain-data";
import { LogoutButton } from "@/components/auth/logout-button";

const cn = (...classes: Array<string | false | undefined | null>) =>
  classes.filter(Boolean).join(" ");

type BadgeTone = "gold" | "green" | "blue" | "red" | "muted";

type StatusBadgeProps = {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
};

export function StatusBadge({ tone = "muted", children, className }: StatusBadgeProps) {
  const tones: Record<BadgeTone, string> = {
    gold: "border-[#e0aa42]/35 bg-[#e0aa42]/12 text-[#f1c66d]",
    green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    blue: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    red: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    muted: "border-[#273348] bg-[#192334] text-[#8ca2c8]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SourceTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#273348] bg-[#111925] px-2.5 py-1 text-[11px] font-medium text-[#8ca2c8]">
      {children}
    </span>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-[14px] border border-[#273348] bg-[#111925] p-5", className)}>
      {children}
    </section>
  );
}

export function PageHeader({
  label,
  title,
  description,
  actions,
}: {
  label: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#e0aa42]">{label}</p>
        <h1
          className="mt-3 text-[30px] leading-none text-[#f4f1eb] sm:text-[32px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#8ca2c8]">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        <div className="flex items-center gap-3">
  <LogoutButton />
</div>
    </div>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  tone = "muted",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: BadgeTone;
}) {
  const valueColor: Record<BadgeTone, string> = {
    gold: "text-[#f1c66d]",
    green: "text-emerald-300",
    blue: "text-sky-300",
    red: "text-rose-300",
    muted: "text-[#f4f1eb]",
  };

  return (
    <Panel className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#8ca2c8]">{label}</p>
          <div className={cn("mt-2 text-3xl font-semibold", valueColor[tone])} style={{ fontFamily: "Georgia, serif" }}>
            {value}
          </div>
        </div>
        <span className="rounded-full border border-[#273348] bg-[#192334] px-2.5 py-1 font-mono text-xs text-[#8ca2c8]">
          {tone === "red" ? "risk" : tone === "green" ? "go" : tone === "gold" ? "priority" : tone === "blue" ? "signal" : "note"}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-[#8ca2c8]">{detail}</p>
    </Panel>
  );
}

export function ConfidenceMeter({ value, label }: { value: number; label?: string }) {
  const width = `${Math.max(0, Math.min(100, value))}%`;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-[#8ca2c8]">
        <span>{label ?? "Confidence"}</span>
        <span className="font-mono text-[#f4f1eb]">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-[#192334]">
        <div className="h-2 rounded-full bg-linear-to-r from-[#7b63ff] via-[#5f8dff] to-[#e0aa42]" style={{ width }} />
      </div>
    </div>
  );
}

export function EmptyAdjustmentNote({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#39495f] bg-[#0d141f] px-4 py-3 text-sm leading-6 text-[#8ca2c8]">
      {text}
    </div>
  );
}

export function AccordionSection({
  title,
  summary,
  children,
  defaultOpen = false,
}: {
  title: string;
  summary: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group rounded-2xl border border-[#273348] bg-[#111925]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
        <div>
          <h3 className="text-base font-semibold text-[#f4f1eb]">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-[#8ca2c8]">{summary}</p>
        </div>
        <span className="text-[#e0aa42] transition group-open:rotate-180">▾</span>
      </summary>
      <div className="border-t border-[#273348] px-5 py-4 text-sm leading-7 text-[#c6d3ea]">{children}</div>
    </details>
  );
}

export function FounderTabs({ tabs, active }: { tabs: string[]; active: string }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-[#273348] bg-[#111925] p-2">
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            type="button"
            className={cn(
              "rounded-full px-3 py-1.5 text-sm transition",
              isActive
                ? "bg-[#192334] text-[#f1c66d]"
                : "text-[#8ca2c8] hover:bg-white/5 hover:text-[#f4f1eb]",
            )}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col justify-between gap-8">
      <div className="space-y-8">
        <Link href="/thesis-confirmation" onClick={onNavigate} className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e0aa42] text-[18px] font-bold text-[#090f18] shadow-sm shadow-black/20">
            VC
          </div>
          <div>
            <div className="text-[18px] leading-none text-[#f4f1eb]" style={{ fontFamily: "Georgia, serif" }}>
              VC Brain
            </div>
            <div className="mt-1 text-xs text-[#8ca2c8]">Maschmeyer Group demo</div>
          </div>
        </Link>

        <div className="space-y-6">
          {dashboardNavigation.map((section) => (
            <nav key={section.label} className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#536887]">{section.label}</p>
              <div className="space-y-1.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition",
                        isActive
                          ? "border-[#36465e] bg-[#192334] text-[#f1c66d]"
                          : "border-transparent text-[#8ca2c8] hover:border-[#273348] hover:bg-white/5 hover:text-[#f4f1eb]",
                      )}
                    >
                      <span className={cn("h-2 w-2 rounded-full", isActive ? "bg-[#e0aa42]" : "bg-[#536887]")} />
                      <span className="leading-5">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          ))}
        </div>
      </div>

      <p className="whitespace-pre-line border-t border-[#273348] pt-5 text-sm leading-6 text-[#536887]">
        Sourcing → Screening →{"\n"}Diligence → Decision.{"\n"}One human in the loop, for oversight — not execution.
      </p>
    </div>
  );
}

export function DashboardSidebar({
  mobile = false,
  open = true,
  onNavigate,
}: {
  mobile?: boolean;
  open?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const baseClass = mobile
    ? cn(
        "fixed inset-y-0 left-0 z-50 w-[280px] border-r border-[#273348] bg-[#111925] p-5 transition-transform duration-200 lg:hidden",
        open ? "translate-x-0" : "-translate-x-full",
      )
    : "fixed inset-y-0 left-0 z-30 hidden w-[230px] border-r border-[#273348] bg-[#111925] px-5 py-6 lg:flex";

  return (
    <aside className={baseClass}>
      <SidebarContent pathname={pathname} onNavigate={onNavigate} />
    </aside>
  );
}

export function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#273348] bg-[#090f18]/90 px-4 py-4 backdrop-blur lg:hidden">
      <Link href="/thesis-confirmation" className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e0aa42] text-sm font-bold text-[#090f18]">
          VC
        </div>
        <div>
          <div className="text-sm font-semibold text-[#f4f1eb]">VC Brain</div>
          <div className="text-[11px] text-[#8ca2c8]">Maschmeyer Group demo</div>
        </div>
      </Link>
      <button
        type="button"
        onClick={onMenuClick}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#273348] bg-[#111925] text-xl text-[#f4f1eb]"
        aria-label="Open navigation menu"
      >
        ☰
      </button>
    </header>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090f18] text-[#f4f1eb]">
      <MobileHeader onMenuClick={() => setMobileOpen(true)} />
      <DashboardSidebar mobile open={mobileOpen} onNavigate={() => setMobileOpen(false)} />
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      ) : null}
      <div className="lg:pl-57.5">
        <main className="mx-auto min-h-screen w-full max-w-275 px-4 pb-10 pt-6 sm:px-6 lg:px-12 lg:pb-12 lg:pt-10">
          {children}
        </main>
      </div>
    </div>
  );
}
