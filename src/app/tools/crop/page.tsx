import type { Metadata } from "next";
import "cropperjs/dist/cropper.css";
import { buildToolMetadata } from "@/lib/tools";
import { ToolRoutePage, type ToolPageProps } from "../ToolRoutePage";

export const metadata: Metadata = buildToolMetadata("crop");

export default function CropPage(props: ToolPageProps) {
  return <ToolRoutePage {...props} slug="crop" />;
}
