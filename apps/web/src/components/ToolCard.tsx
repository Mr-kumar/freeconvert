"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ToolConfig } from "@/types";

export interface ToolCardProps {
  tool: ToolConfig;
  compact?: boolean;
}

export function ToolCard({ tool, compact }: ToolCardProps) {
  const content = (
    <>
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--accent))] text-[hsl(var(--primary))]">
        {tool.icon}
      </div>
      <h3 className="font-semibold text-[hsl(var(--foreground))]">{tool.title}</h3>
      {!compact && (
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          {tool.description}
        </p>
      )}
    </>
  );

  if (compact) {
    return (
      <Link href={tool.href}>
        <Card className="flex flex-col items-center gap-2 rounded-xl p-4 shadow-sm transition-shadow hover:shadow-md">
          <CardContent className="flex flex-col items-center gap-2 p-0 text-center">
            {content}
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={tool.href}>
      <Card className="flex flex-col gap-3 rounded-xl p-4 shadow-sm transition-shadow hover:shadow-md">
        <CardContent className="flex flex-col gap-3 p-0">
          {content}
        </CardContent>
      </Card>
    </Link>
  );
}
