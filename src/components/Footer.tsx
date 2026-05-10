import Link from "next/link";
import { pdfTools, tools } from "@/lib/tools";

const legal = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "DMCA", href: "/dmca" },
];

const company = [
  { label: "About", href: "/about" },
  { label: "Search", href: "/search" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link className="text-xl font-extrabold text-[var(--text)]" href="/">
              Free<span className="text-[var(--accent)]">Convert</span>.in
            </Link>
            <p className="mt-3 max-w-60 text-sm leading-6 text-[var(--muted)]">
              Free online image and PDF tools. 100% client-side. Your files
              never leave your device.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
              <span className="text-xs font-semibold text-[var(--success)]">
                No upload / no signup
              </span>
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              Image Tools
            </p>
            <ul className="space-y-2.5">
              {tools.map((tool) => (
                <li key={tool.href}>
                  <Link
                    className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                    href={tool.href}
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              PDF Tools
            </p>
            <ul className="space-y-2.5">
              {pdfTools.slice(0, 10).map((tool) => (
                <li key={tool.href}>
                  <Link
                    className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                    href={tool.href}
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  className="text-sm font-semibold text-[var(--accent)]"
                  href="/pdf-tools"
                >
                  View all PDF tools
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              Company
            </p>
            <ul className="space-y-2.5">
              {company.map((item) => (
                <li key={item.href}>
                  <Link
                    className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--border)] pt-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            Legal
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legal.map((item) => (
              <li key={item.href}>
                <Link
                  className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--border)] pt-6 text-xs text-[var(--muted)] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} FreeConvert.in. All rights reserved.</p>
          <p>Made in India.</p>
          <p className="max-w-sm md:text-right">
            Ads may be served by Google AdSense after consent.{" "}
            <Link className="font-semibold text-[var(--accent)]" href="/privacy-policy">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
