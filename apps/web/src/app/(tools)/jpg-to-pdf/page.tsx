import type { Metadata } from "next";
import { getToolMeta } from "@/config/toolMeta";
import { ToolPageView } from "../_components/ToolPageView";

const TOOL_ID = "jpg-to-pdf";
const meta = getToolMeta(TOOL_ID);

export const metadata: Metadata = meta
  ? { title: meta.title, description: meta.description }
  : undefined;

export default function Page() {
  return <ToolPageView toolId={TOOL_ID} />;
}
