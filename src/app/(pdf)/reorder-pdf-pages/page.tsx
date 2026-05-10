import type { Metadata } from "next";
import { PDFToolRoutePage, type PDFToolPageProps } from "../PDFToolRoutePage";
import { buildPDFToolMetadata } from "@/lib/tools";

export const metadata: Metadata = buildPDFToolMetadata("reorder-pdf-pages");

export default function ReorderPDFPagesPage(props: PDFToolPageProps) {
  return <PDFToolRoutePage {...props} slug="reorder-pdf-pages" />;
}
