"use client";

import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import {
  ensurePDFName,
  PDFToolShell,
} from "@/components/pdf/PDFToolClientParts";
import { PDFPreview } from "@/components/pdf/PDFPreview";
import {
  Panel,
  PDFInfoPanel,
  SelectControl,
  TextControl,
  ToggleButton,
} from "@/components/pdf/shared";
import type { ToolDefaults } from "@/lib/types";
import { usePDFStore } from "@/store/usePDFStore";

export function ProtectPDFClient({}: { defaults: ToolDefaults }) {
  const {
    clearOutput,
    inputFile,
    outputBatch,
    outputBlob,
    setCurrentStep,
    setError,
    setOutputBlob,
    setProcessing,
    setProgress,
  } = usePDFStore();
  const [outputName, setOutputName] = useState(
    ensurePDFName("freeconvert-protect-pdf", "freeconvert-protect-pdf.pdf"),
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [allowPrinting, setAllowPrinting] = useState(true);
  const [allowCopying, setAllowCopying] = useState(true);
  const [allowEditing, setAllowEditing] = useState(false);
  const [encryptionLevel, setEncryptionLevel] = useState<128 | 256>(256);
  const downloadName = useMemo(
    () => ensurePDFName(outputName, "freeconvert-protect-pdf.pdf"),
    [outputName],
  );

  function progress(value: number, step?: string) {
    setProgress(value);
    if (step) setCurrentStep(step);
  }

  async function processPDF() {
    setError(null);
    clearOutput();
    setProcessing(true, "Preparing...");
    setProgress(5);

    try {
      if (!inputFile) throw new Error("Upload a PDF first.");
      if (!password || password !== confirmPassword) {
        throw new Error("Enter and confirm the same password.");
      }

      const { protectPDF } = await import("@/lib/pdfProcessor");
      const blob = await protectPDF(
        inputFile,
        {
          userPassword: password,
          allowPrinting,
          allowCopying,
          allowEditing,
          encryptionLevel,
        },
        progress,
      );
      setOutputBlob(blob, downloadName);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not process this PDF.");
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  }

  return (
    <PDFToolShell
      controls={(
        <>
          <Panel title="PDF">
            <PDFUploader kind="pdf" label="Add PDF" />
          </Panel>
          <Panel title="Password">
            <div className="relative">
              <TextControl
                label="Password to open"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={setPassword}
              />
              <button
                aria-label="Show password"
                className="icon-button absolute bottom-1 right-1"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <TextControl
              label="Confirm password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
            <SelectControl
              label="Encryption"
              options={[
                { label: "256-bit", value: "256" },
                { label: "128-bit", value: "128" },
              ]}
              value={String(encryptionLevel)}
              onChange={(value) => setEncryptionLevel(Number(value) as 128 | 256)}
            />
            <div className="grid grid-cols-1 gap-2">
              <ToggleButton active={allowPrinting} onClick={() => setAllowPrinting(!allowPrinting)}>
                Allow printing
              </ToggleButton>
              <ToggleButton active={allowCopying} onClick={() => setAllowCopying(!allowCopying)}>
                Allow copying
              </ToggleButton>
              <ToggleButton active={allowEditing} onClick={() => setAllowEditing(!allowEditing)}>
                Allow editing
              </ToggleButton>
            </div>
            <TextControl label="Output file name" value={outputName} onChange={setOutputName} />
          </Panel>
          <PDFInfoPanel />
        </>
      )}
      downloadName={downloadName}
      outputBatch={outputBatch}
      outputBlob={outputBlob}
      preview={<PDFPreview />}
      processLabel="Protect PDF"
      slug="protect-pdf"
      onProcess={processPDF}
    />
  );
}
