"use client";

import { Card } from "@/components/ui/card";
import { CloudUpload, Settings, Download } from "lucide-react";
import { HOW_IT_WORKS } from "@/config/site";

const ICONS = [CloudUpload, Settings, Download] as const;

export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading">
      <p className="text-sm font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
        How it works
      </p>
      <h2
        id="how-heading"
        className="mt-1 text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]"
      >
        Simple 3-step process
      </h2>
      <div className="mt-6 flex flex-wrap items-stretch justify-center gap-4">
        {HOW_IT_WORKS.map((item, i) => {
          const Icon = ICONS[i] ?? CloudUpload;
          return (
            <div key={item.step} className="flex items-center gap-2">
              <Card className="flex min-w-[140px] flex-col items-center rounded-xl p-4 shadow-sm transition-shadow hover:shadow-md">
                <Icon className="h-8 w-8 text-[hsl(var(--primary))]" aria-hidden />
                <span className="mt-1 font-medium text-[hsl(var(--foreground))]">
                  {item.title}
                </span>
                <span className="mt-0.5 text-center text-xs text-[hsl(var(--muted-foreground))]">
                  {item.description}
                </span>
              </Card>
              {i < HOW_IT_WORKS.length - 1 && (
                <span
                  className="hidden text-[hsl(var(--muted-foreground))] sm:inline"
                  aria-hidden
                >
                  →
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
