import type { Metadata } from "next";
import { PDFToolRoutePage, type PDFToolPageProps } from "../PDFToolRoutePage";
import { buildPDFToolMetadata } from "@/lib/tools";

export const metadata: Metadata = buildPDFToolMetadata("jpg-to-pdf");

export default function Page(props: PDFToolPageProps) {
  return <PDFToolRoutePage {...props} slug="jpg-to-pdf" />;
}
