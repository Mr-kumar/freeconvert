import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/tools";
import { ToolRoutePage, type ToolPageProps } from "../tools/ToolRoutePage";

export const metadata: Metadata = buildToolMetadata("metadata");

export default function ImageMetadataPage(props: ToolPageProps) {
  return <ToolRoutePage {...props} slug="metadata" />;
}
