"use client";

import { ToolCard } from "@/components/ToolCard";
import type { ToolConfig } from "@/types";

export interface ToolGridProps {
  /** Small label above the title (e.g. "Popular Tools") */
  eyebrow?: string;
  /** Main heading (e.g. "Most used tools") */
  title: string;
  tools: ToolConfig[];
  /** Compact cards for related tools; full cards for landing */
  compact?: boolean;
  className?: string;
}

export function ToolGrid({
  eyebrow,
  title,
  tools,
  compact = false,
  className,
}: ToolGridProps) {
  return (
    <section className={className} aria-labelledby="tool-grid-title">
      {eyebrow && (
        <p className="text-sm font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
          {eyebrow}
        </p>
      )}
      <h2
        id="tool-grid-title"
        className="mt-1 text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]"
      >
        {title}
      </h2>
      <div
        className={
          compact
            ? "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"
            : "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        }
      >
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} compact={compact} />
        ))}
      </div>
    </section>
  );
}
