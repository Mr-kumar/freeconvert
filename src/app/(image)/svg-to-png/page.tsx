import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/tools";
import { ToolRoutePage, type ToolPageProps } from "../tools/ToolRoutePage";

export const metadata: Metadata = buildToolMetadata("svg-to-png");

export default function Page(props: ToolPageProps) {
  return <ToolRoutePage {...props} slug="svg-to-png" />;
}
