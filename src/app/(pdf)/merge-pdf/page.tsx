import type { Metadata } from "next";
import { PDFToolRoutePage, type PDFToolPageProps } from "../PDFToolRoutePage";
import { buildPDFToolMetadata } from "@/lib/tools";

export const metadata: Metadata = buildPDFToolMetadata("merge-pdf");

export default function MergePDFPage(props: PDFToolPageProps) {
  return <PDFToolRoutePage {...props} slug="merge-pdf" />;
}
