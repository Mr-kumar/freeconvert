import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/tools";
import { ToolRoutePage, type ToolPageProps } from "../ToolRoutePage";

export const metadata: Metadata = buildToolMetadata("resize");

export default function ResizePage(props: ToolPageProps) {
  return <ToolRoutePage {...props} slug="resize" />;
}
