import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/tools";
import { ToolRoutePage, type ToolPageProps } from "../tools/ToolRoutePage";

export const metadata: Metadata = buildToolMetadata("avif-to-jpg");

export default function Page(props: ToolPageProps) {
  return <ToolRoutePage {...props} slug="avif-to-jpg" />;
}
