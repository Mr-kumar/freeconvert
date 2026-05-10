import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/tools";
import { ToolRoutePage, type ToolPageProps } from "../ToolRoutePage";

export const metadata: Metadata = buildToolMetadata("merge");

export default function MergePage(props: ToolPageProps) {
  return <ToolRoutePage {...props} slug="merge" />;
}
