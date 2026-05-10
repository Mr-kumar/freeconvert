import type { Metadata } from "next";
import { PDFToolRoutePage, type PDFToolPageProps } from "../PDFToolRoutePage";
import { buildPDFToolMetadata } from "@/lib/tools";

export const metadata: Metadata = buildPDFToolMetadata("convert-image-to-pdf");

export default function ImageToPDFPage(props: PDFToolPageProps) {
  return <PDFToolRoutePage {...props} slug="convert-image-to-pdf" />;
}
