import type { Metadata } from "next";
import { getToolMeta } from "@/config/toolMeta";
import { ToolPageView } from "../_components/ToolPageView";

const TOOL_ID = "jpg-to-pdf";
const meta = getToolMeta(TOOL_ID);

export const metadata: Metadata = {
  title: meta?.title || "JPG to PDF",
  description:
    meta?.description ||
    "Convert JPG images to a single PDF file. Free and fast.",
};

export default function Page() {
  return <ToolPageView toolId={TOOL_ID} />;
}
