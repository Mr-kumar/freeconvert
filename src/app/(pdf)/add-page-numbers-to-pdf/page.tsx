import type { Metadata } from "next";
import { PDFToolRoutePage, type PDFToolPageProps } from "../PDFToolRoutePage";
import { buildPDFToolMetadata } from "@/lib/tools";

export const metadata: Metadata = buildPDFToolMetadata("add-page-numbers-to-pdf");

export default function AddPDFPageNumbersPage(props: PDFToolPageProps) {
  return <PDFToolRoutePage {...props} slug="add-page-numbers-to-pdf" />;
}
