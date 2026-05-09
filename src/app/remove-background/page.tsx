import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/tools";
import { ToolRoutePage, type ToolPageProps } from "../tools/ToolRoutePage";

export const metadata: Metadata = buildToolMetadata("background-removal");

export default function RemoveBackgroundPage(props: ToolPageProps) {
  return <ToolRoutePage {...props} slug="background-removal" />;
}
