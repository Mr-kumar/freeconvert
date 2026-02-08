"use client";

import { useToolFlow } from "@/hooks/useToolFlow";
import { ToolTemplate } from "@/components/ToolTemplate";
import { ToolFlowView } from "@/components/ToolFlowView";
import {
  getToolById,
  getRelatedTools,
  TOOL_PRIMARY_LABELS,
} from "@/config/tools";

const MIN_FILES: Record<string, number> = {
  merge: 2,
  reduce: 1,
  compress: 1,
  "jpg-to-pdf": 1,
};

export interface ToolPageViewProps {
  toolId: string;
}

export function ToolPageView({ toolId }: ToolPageViewProps) {
  const flow = useToolFlow({
    minFiles: MIN_FILES[toolId] ?? 1,
    simulateDuration: 2500,
  });
  const tool = getToolById(toolId);
  if (!tool) return null;

  const fileListType = tool.accept?.startsWith("image") ? "image" : "pdf";

  return (
    <ToolTemplate
      title={tool.title}
      description={tool.description}
      relatedTools={getRelatedTools(toolId)}
    >
      <ToolFlowView
        step={flow.step}
        progress={flow.progress}
        resultFileName={flow.resultFileName}
        files={flow.files}
        accept={tool.accept}
        multiple={tool.multiple}
        fileListType={fileListType}
        primaryLabel={TOOL_PRIMARY_LABELS[toolId] ?? "Convert"}
        onFiles={flow.addFiles}
        onRemove={flow.removeFile}
        onPrimary={flow.startProcessing}
        onReset={flow.reset}
        onDownload={() => window.alert("Download (frontend-only demo)")}
        canSubmit={flow.canSubmit}
      />
    </ToolTemplate>
  );
}
