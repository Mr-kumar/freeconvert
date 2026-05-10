import type { Metadata } from "next";
import { PDFToolRoutePage, type PDFToolPageProps } from "../PDFToolRoutePage";
import { buildPDFToolMetadata } from "@/lib/tools";

export const metadata: Metadata = buildPDFToolMetadata("protect-pdf");

export default function ProtectPDFPage(props: PDFToolPageProps) {
  return <PDFToolRoutePage {...props} slug="protect-pdf" />;
}
