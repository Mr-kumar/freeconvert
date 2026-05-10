import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/tools";
import { ToolRoutePage, type ToolPageProps } from "../ToolRoutePage";

export const metadata: Metadata = buildToolMetadata("watermark");

export default function WatermarkPage(props: ToolPageProps) {
  return <ToolRoutePage {...props} slug="watermark" />;
}
