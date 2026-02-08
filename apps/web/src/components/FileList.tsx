"use client";

import { GripVertical, X, FileText, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FileItem } from "@/types";

export interface FileListProps {
  files: FileItem[];
  onRemove: (id: string) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  type?: "pdf" | "image";
  className?: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileList({
  files,
  onRemove,
  type = "pdf",
  className,
}: FileListProps) {
  const Icon = type === "pdf" ? FileText : ImageIcon;

  return (
    <ul className={cn("space-y-2", className)}>
      {files.map((item) => (
        <li
          key={item.id}
          className="flex items-center gap-3 rounded-lg border border-[hsl(var(--border))] bg-white px-3 py-2 shadow-sm"
        >
          <GripVertical className="h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))]" />
          <Icon className="h-5 w-5 shrink-0 text-red-500" />
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-[hsl(var(--foreground))]">
            {item.name}
          </span>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            {formatSize(item.size)}
          </span>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="rounded p-1 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
            aria-label={`Remove ${item.name}`}
          >
            <X className="h-4 w-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}
