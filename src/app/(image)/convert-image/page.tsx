import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/tools";
import { ToolRoutePage, type ToolPageProps } from "../tools/ToolRoutePage";

export const metadata: Metadata = buildToolMetadata("convert");

export default function ConvertImagePage(props: ToolPageProps) {
  return <ToolRoutePage {...props} slug="convert" />;
}
