"use client";

import { FileImage, ImagePlus, Merge, Shrink } from "lucide-react";
import type { ToolConfig } from "@/types";
import { TOOL_META } from "@/config/toolMeta";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  reduce: Shrink,
  compress: ImagePlus,
  "jpg-to-pdf": FileImage,
  merge: Merge,
};

export const TOOLS: ToolConfig[] = TOOL_META.map((meta) => {
  const Icon = ICONS[meta.id];
  return {
    ...meta,
    icon: Icon ? <Icon className="h-6 w-6" /> : <span className="h-6 w-6" />,
  } as ToolConfig;
});

export function getRelatedTools(currentId: string): ToolConfig[] {
  return TOOLS.filter((t) => t.id !== currentId);
}

export function getToolById(id: string): (typeof TOOLS)[number] | undefined {
  return TOOLS.find((t) => t.id === id);
}

export const TOOL_PRIMARY_LABELS: Record<string, string> = {
  reduce: "Reduce PDF size",
  compress: "Compress images",
  "jpg-to-pdf": "Convert to PDF",
  merge: "Merge PDFs",
};
