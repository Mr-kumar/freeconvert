import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/tools";
import { ToolRoutePage, type ToolPageProps } from "../tools/ToolRoutePage";

export const metadata: Metadata = buildToolMetadata("resize");

export default function ResizeImagePage(props: ToolPageProps) {
  return <ToolRoutePage {...props} slug="resize" />;
}
