"use client";

import { CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface SuccessScreenProps {
  title?: string;
  fileName?: string;
  onDownload?: () => void;
  onReset?: () => void;
  className?: string;
}

export function SuccessScreen({
  title = "Your file is ready",
  fileName,
  onDownload,
  onReset,
  className,
}: SuccessScreenProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardContent className="flex flex-col items-center justify-center gap-4 p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
            {title}
          </h3>
          {fileName && (
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              {fileName}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          {onDownload && (
            <Button onClick={onDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          )}
          {onReset && (
            <Button variant="outline" onClick={onReset}>
              Convert another
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
