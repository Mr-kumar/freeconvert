import type { Metadata } from "next";
import { getToolMeta } from "@/config/toolMeta";
import { ToolPageView } from "../_components/ToolPageView";

const TOOL_ID = "compress";
const meta = getToolMeta(TOOL_ID);

export const metadata: Metadata = {
  title: meta?.title || "Image Compressor",
  description:
    meta?.description ||
    "Compress images to reduce file size. Free online image optimizer.",
};

export default function Page() {
  return <ToolPageView toolId={TOOL_ID} />;
}
