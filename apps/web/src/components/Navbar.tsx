"use client";

import Link from "next/link";
import { FileStack } from "lucide-react";
import { SITE, NAV_LINKS } from "@/config/site";
import { cn } from "@/lib/utils";

export interface NavbarProps {
  /** Show icon next to logo. Omit on tool pages for a cleaner look. */
  showLogoIcon?: boolean;
  className?: string;
}

export function Navbar({ showLogoIcon = true, className }: NavbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-[hsl(var(--border))] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm",
        className
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-[hsl(var(--primary))] transition-opacity hover:opacity-90"
          aria-label={`${SITE.name} - Home`}
        >
          {showLogoIcon && <FileStack className="h-6 w-6 shrink-0" />}
          <span className="text-xl tracking-tight">{SITE.name}</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-2 flex items-center gap-1 border-l border-[hsl(var(--border))] pl-2">
            <Link
              href="/login"
              className={cn(
                "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md h-9 px-3 text-sm font-medium transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]",
                "text-[hsl(var(--muted-foreground))]"
              )}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className={cn(
                "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md h-9 px-3 text-sm font-medium transition-colors",
                "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm hover:opacity-90",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
              )}
            >
              Sign up
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
