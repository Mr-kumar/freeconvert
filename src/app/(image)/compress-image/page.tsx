import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/tools";
import { ToolRoutePage, type ToolPageProps } from "../tools/ToolRoutePage";

export const metadata: Metadata = buildToolMetadata("compress");

export default function CompressImagePage(props: ToolPageProps) {
  return <ToolRoutePage {...props} slug="compress" />;
}
