"use client";

import { useCallback, useRef } from "react";
import { CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface UploadZoneProps {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
}

export function UploadZone({
  accept,
  multiple = true,
  onFiles,
  disabled,
  className,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      if (files.length) onFiles(files);
      e.target.value = "";
    },
    [onFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled) return;
      const files = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
      if (files.length) onFiles(files);
    },
    [onFiles, disabled]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[hsl(var(--primary))]/40 bg-[hsl(var(--accent))] p-8 transition-colors hover:border-[hsl(var(--primary))]",
        disabled && "pointer-events-none opacity-60",
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--primary))]/10">
        <CloudUpload className="h-8 w-8 text-[hsl(var(--primary))]" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-[hsl(var(--foreground))]">
          Drag and drop files here
        </p>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          or click to select files from your device.
        </p>
      </div>
      <Button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className="gap-2"
      >
        <CloudUpload className="h-4 w-4" />
        Choose Files
      </Button>
    </div>
  );
}
