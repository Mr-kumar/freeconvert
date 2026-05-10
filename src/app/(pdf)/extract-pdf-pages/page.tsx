import type { Metadata } from "next";
import { PDFToolRoutePage, type PDFToolPageProps } from "../PDFToolRoutePage";
import { buildPDFToolMetadata } from "@/lib/tools";

export const metadata: Metadata = buildPDFToolMetadata("extract-pdf-pages");

export default function ExtractPDFPagesPage(props: PDFToolPageProps) {
  return <PDFToolRoutePage {...props} slug="extract-pdf-pages" />;
}
