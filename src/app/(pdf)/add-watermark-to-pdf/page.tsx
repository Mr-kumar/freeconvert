import type { Metadata } from "next";
import { PDFToolRoutePage, type PDFToolPageProps } from "../PDFToolRoutePage";
import { buildPDFToolMetadata } from "@/lib/tools";

export const metadata: Metadata = buildPDFToolMetadata("add-watermark-to-pdf");

export default function WatermarkPDFPage(props: PDFToolPageProps) {
  return <PDFToolRoutePage {...props} slug="add-watermark-to-pdf" />;
}
