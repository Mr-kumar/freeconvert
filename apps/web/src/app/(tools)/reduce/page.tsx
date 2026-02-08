import type { Metadata } from "next";
import { getToolMeta } from "@/config/toolMeta";
import { ToolPageView } from "../_components/ToolPageView";

const TOOL_ID = "reduce";
const meta = getToolMeta(TOOL_ID);

export const metadata: Metadata = {
  title: meta?.title || "PDF Size Reducer",
  description:
    meta?.description ||
    "Reduce PDF file size without losing quality. Free online PDF compressor.",
};

export default function Page() {
  return <ToolPageView toolId={TOOL_ID} />;
}
