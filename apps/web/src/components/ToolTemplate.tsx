"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ToolGrid } from "@/components/ToolGrid";
import type { ToolConfig } from "@/types";

export interface ToolTemplateProps {
  title: string;
  description: string;
  children: React.ReactNode;
  relatedTools: ToolConfig[];
}

export function ToolTemplate({
  title,
  description,
  children,
  relatedTools,
}: ToolTemplateProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Card className="rounded-2xl shadow-md">
        <CardHeader className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
            {title}
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {description}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">{children}</CardContent>
      </Card>
      {relatedTools.length > 0 && (
        <div className="mt-8">
          <ToolGrid
            title="Related tools"
            tools={relatedTools}
            compact
          />
        </div>
      )}
    </div>
  );
}
