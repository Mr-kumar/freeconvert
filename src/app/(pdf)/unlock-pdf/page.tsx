import type { Metadata } from "next";
import { PDFToolRoutePage, type PDFToolPageProps } from "../PDFToolRoutePage";
import { buildPDFToolMetadata } from "@/lib/tools";

export const metadata: Metadata = buildPDFToolMetadata("unlock-pdf");

export default function UnlockPDFPage(props: PDFToolPageProps) {
  return <PDFToolRoutePage {...props} slug="unlock-pdf" />;
}
