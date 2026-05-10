import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/tools";
import { ToolRoutePage, type ToolPageProps } from "../ToolRoutePage";

export const metadata: Metadata = buildToolMetadata("convert");

export default function ConvertPage(props: ToolPageProps) {
  return <ToolRoutePage {...props} slug="convert" />;
}
