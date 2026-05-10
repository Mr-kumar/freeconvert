import type { Metadata } from "next";
import { PDFToolRoutePage, type PDFToolPageProps } from "../PDFToolRoutePage";
import { buildPDFToolMetadata } from "@/lib/tools";

export const metadata: Metadata = buildPDFToolMetadata("rotate-pdf");

export default function RotatePDFPage(props: PDFToolPageProps) {
  return <PDFToolRoutePage {...props} slug="rotate-pdf" />;
}
