import type { Metadata } from "next";
import { PDFToolRoutePage, type PDFToolPageProps } from "../PDFToolRoutePage";
import { buildPDFToolMetadata } from "@/lib/tools";

export const metadata: Metadata = buildPDFToolMetadata("convert-pdf-to-image");

export default function PDFToImagePage(props: PDFToolPageProps) {
  return <PDFToolRoutePage {...props} slug="convert-pdf-to-image" />;
}
