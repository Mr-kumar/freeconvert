"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Zap, Shield, UserX, Cloud } from "lucide-react";
import { SITE, BENEFITS } from "@/config/site";

const ICONS = [Zap, Shield, UserX, Cloud] as const;

export function FeatureGrid() {
  return (
    <section id="about" aria-labelledby="benefits-heading">
      <p className="text-sm font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
        Benefits
      </p>
      <h2
        id="benefits-heading"
        className="mt-1 text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]"
      >
        Why {SITE.name}?
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((item, i) => {
          const Icon = ICONS[i] ?? Zap;
          return (
            <Card key={item.title} className="rounded-xl shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col gap-2 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--accent))] text-[hsl(var(--primary))]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-[hsl(var(--foreground))]">
                  {item.title}
                </h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
