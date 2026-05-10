import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/tools";
import { ToolRoutePage, type ToolPageProps } from "../tools/ToolRoutePage";

export const metadata: Metadata = buildToolMetadata("merge");

export default function MergeImagesPage(props: ToolPageProps) {
  return <ToolRoutePage {...props} slug="merge" />;
}
