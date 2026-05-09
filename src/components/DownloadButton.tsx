"use client";

import { Download } from "lucide-react";

interface DownloadButtonProps {
  blob: Blob | null;
  filename: string;
  batchBlobs?: { blob: Blob; name: string }[];
}

export function DownloadButton({
  blob,
  filename,
  batchBlobs,
}: DownloadButtonProps) {
  const disabled = !blob && (!batchBlobs || batchBlobs.length === 0);

  async function download() {
    if (batchBlobs?.length) {
      const [{ default: JSZip }, { saveAs }] = await Promise.all([
        import("jszip"),
        import("file-saver"),
      ]);
      const zip = new JSZip();
      batchBlobs.forEach((item) => zip.file(item.name, item.blob));
      const archive = await zip.generateAsync({ type: "blob" });
      saveAs(archive, filename.endsWith(".zip") ? filename : `${filename}.zip`);
      return;
    }

    if (!blob) {
      return;
    }

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      className="button-primary w-full"
      disabled={disabled}
      type="button"
      onClick={download}
    >
      <Download className="h-4 w-4" />
      Download
    </button>
  );
}
