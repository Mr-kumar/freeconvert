import type { Metadata } from "next";
import { PDFToolRoutePage, type PDFToolPageProps } from "../PDFToolRoutePage";
import { buildPDFToolMetadata } from "@/lib/tools";

export const metadata: Metadata = buildPDFToolMetadata("pdf-to-text");

export default function Page(props: PDFToolPageProps) {
  return <PDFToolRoutePage {...props} slug="pdf-to-text" />;
}
