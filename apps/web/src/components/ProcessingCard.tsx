"use client";

import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface ProcessingCardProps {
  title?: string;
  subtitle?: string;
  fileName?: string;
  progress?: number;
  className?: string;
}

export function ProcessingCard({
  title = "Processing your file",
  subtitle = "This may take a few seconds.",
  fileName,
  progress = 0,
  className,
}: ProcessingCardProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardContent className="flex flex-col items-center gap-4 p-8">
        <Loader2 className="h-12 w-12 animate-spin text-[hsl(var(--primary))]" />
        <div className="text-center">
          <h3 className="font-semibold text-[hsl(var(--foreground))]">{title}</h3>
          <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
            {subtitle}
          </p>
        </div>
        <div className="w-full max-w-xs space-y-2">
          <Progress value={progress} max={100} />
          {fileName != null && (
            <p className="text-center text-xs text-[hsl(var(--muted-foreground))]">
              {Math.round(progress)}% - {fileName}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
