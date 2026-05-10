import type { Metadata } from "next";
import { PDFToolRoutePage, type PDFToolPageProps } from "../PDFToolRoutePage";
import { buildPDFToolMetadata } from "@/lib/tools";

export const metadata: Metadata = buildPDFToolMetadata("split-pdf");

export default function SplitPDFPage(props: PDFToolPageProps) {
  return <PDFToolRoutePage {...props} slug="split-pdf" />;
}
