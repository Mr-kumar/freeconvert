"use client";

import Link from "next/link";
import { SITE, FOOTER_LINKS, COPYRIGHT } from "@/config/site";

export function Footer() {
  return (
    <footer
      className="border-t border-[hsl(var(--border))] bg-[hsl(var(--muted))]/40 py-12"
      role="contentinfo"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="space-y-3">
            <Link
              href="/"
              className="text-lg font-semibold text-[hsl(var(--primary))] hover:opacity-90"
            >
              {SITE.name}
            </Link>
            <p className="max-w-xs text-sm text-[hsl(var(--muted-foreground))]">
              {SITE.tagline}
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-[hsl(var(--foreground))]">
                Product
              </h3>
              <ul className="space-y-2">
                {FOOTER_LINKS.product.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-[hsl(var(--foreground))]">
                Company
              </h3>
              <ul className="space-y-2">
                {FOOTER_LINKS.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-[hsl(var(--foreground))]">
                Legal
              </h3>
              <ul className="space-y-2">
                {FOOTER_LINKS.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-10 border-t border-[hsl(var(--border))] pt-6 text-center text-xs text-[hsl(var(--muted-foreground))]">
          {COPYRIGHT}
        </p>
      </div>
    </footer>
  );
}
