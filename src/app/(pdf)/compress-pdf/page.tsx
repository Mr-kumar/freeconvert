import type { Metadata } from "next";
import { PDFToolRoutePage, type PDFToolPageProps } from "../PDFToolRoutePage";
import { buildPDFToolMetadata } from "@/lib/tools";

export const metadata: Metadata = buildPDFToolMetadata("compress-pdf");

export default function CompressPDFPage(props: PDFToolPageProps) {
  return <PDFToolRoutePage {...props} slug="compress-pdf" />;
}
