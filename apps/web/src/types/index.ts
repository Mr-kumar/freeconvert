export type JobStatus = "idle" | "upload" | "processing" | "done" | "error";

export interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
}

import type { ReactNode } from "react";

export interface ToolConfig {
  id: string;
  title: string;
  description: string;
  href: string;
  accept?: string;
  multiple?: boolean;
  icon: ReactNode;
}
