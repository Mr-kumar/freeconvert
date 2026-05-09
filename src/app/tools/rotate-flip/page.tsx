import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/tools";
import { ToolRoutePage, type ToolPageProps } from "../ToolRoutePage";

export const metadata: Metadata = buildToolMetadata("rotate-flip");

export default function RotateFlipPage(props: ToolPageProps) {
  return <ToolRoutePage {...props} slug="rotate-flip" />;
}
