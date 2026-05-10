import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/tools";
import { ToolRoutePage, type ToolPageProps } from "../tools/ToolRoutePage";

export const metadata: Metadata = buildToolMetadata("filters");

export default function ImageFiltersPage(props: ToolPageProps) {
  return <ToolRoutePage {...props} slug="filters" />;
}
