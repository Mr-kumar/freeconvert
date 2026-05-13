import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/tools";
import { ToolRoutePage, type ToolPageProps } from "../tools/ToolRoutePage";

export const metadata: Metadata = buildToolMetadata("webp-to-jpg");

export default function Page(props: ToolPageProps) {
  return <ToolRoutePage {...props} slug="webp-to-jpg" />;
}
