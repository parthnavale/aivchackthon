import type { Metadata } from "next";
import Link from "next/link";
import { dashboardNavigation } from "@/lib/vc-brain-data";

export const metadata: Metadata = {
  title: "VC Brain",
  description: "VC Brain landing page with navigation to onboarding, pipeline, and auth routes.",
};

const featuredLinks = [
  { label: "Login", href: "/login", tone: "border-[#e0aa42]/35 bg-[#e0aa42]/12 text-[#f1c66d]" },
  { label: "Sign up", href: "/signup", tone: "border-[#273348] bg-[#192334] text-[#f4f1eb]" },
  { label: "Thesis confirmation", href: "/thesis-confirmation", tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-[#090f18] text-[#f4f1eb]">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div
          className="rounded-[28px] border border-[#273348] p-6 shadow-2xl shadow-black/20 lg:p-10"
          style={{
            backgroundImage:
              "radial-gradient(circle_at_top_left,rgba(224,170,66,0.14),transparent_35%),linear-gradient(180deg,#111925,#0b121c)",
          }}
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#273348] bg-[#111925] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8ca2c8]">
                VC Brain platform
              </div>
              <h1 className="text-4xl leading-tight sm:text-5xl" style={{ fontFamily: "Georgia, serif" }}>
                Invest with a clearer thesis, tighter routing, and one place for every decision.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[#c6d3ea] sm:text-base">
                This landing page links every area of the VC Brain app: onboarding, pipeline, search, founder ledger,
                memo, decision log, and account access.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/thesis-confirmation"
                className="inline-flex items-center justify-center rounded-full bg-[#e0aa42] px-5 py-3 text-sm font-semibold text-[#090f18] transition hover:brightness-110"
              >
                Open dashboard
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-[#273348] bg-[#111925] px-5 py-3 text-sm font-semibold text-[#f4f1eb] transition hover:bg-white/5"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full border border-[#273348] bg-transparent px-5 py-3 text-sm font-semibold text-[#8ca2c8] transition hover:border-[#e0aa42]/50 hover:text-[#f4f1eb]"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {featuredLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-[18px] border px-5 py-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 ${item.tone}`}
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8ca2c8]">
                Quick access
              </div>
              <div className="mt-3 text-xl" style={{ fontFamily: "Georgia, serif" }}>
                {item.label}
              </div>
              <div className="mt-2 text-sm text-[#8ca2c8]">Open this route directly.</div>
            </Link>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {dashboardNavigation.map((section) => (
            <section key={section.label} className="rounded-[20px] border border-[#273348] bg-[#111925] p-5">
              <div className="flex items-center justify-between gap-4 border-b border-[#273348] pb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8ca2c8]">{section.label}</p>
                  <h2 className="mt-1 text-xl" style={{ fontFamily: "Georgia, serif" }}>
                    Navigate to {section.label.toLowerCase()}
                  </h2>
                </div>
                <span className="rounded-full border border-[#273348] bg-[#192334] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ca2c8]">
                  {section.items.length} pages
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl border border-[#273348] bg-[#192334] px-4 py-4 transition hover:border-[#e0aa42]/40 hover:bg-[#1b2737]"
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8ca2c8]">
                      {section.label}
                    </div>
                    <div className="mt-2 text-base text-[#f4f1eb]">{item.label}</div>
                    <div className="mt-2 text-sm text-[#8ca2c8]">Open {item.label.toLowerCase()}.</div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
