import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/tools";
import { ToolRoutePage, type ToolPageProps } from "../tools/ToolRoutePage";

export const metadata: Metadata = buildToolMetadata("rotate-flip");

export default function RotateImagePage(props: ToolPageProps) {
  return <ToolRoutePage {...props} slug="rotate-flip" />;
}
