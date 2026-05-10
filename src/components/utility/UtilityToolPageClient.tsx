"use client";

import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import {
  utilityToolConfigs,
  type UtilityToolConfig,
  type UtilityToolSlug,
} from "@/lib/utilityTools";
import {
  AgeCalculator,
  EmiCalculator,
  GstCalculator,
  PercentageCalculator,
  SipCalculator,
} from "@/components/utility/tools/calculator-tools";
import {
  ColorContrastChecker,
  ColorPickerTool,
} from "@/components/utility/tools/color-tools";
import { UnitConverterTool } from "@/components/utility/tools/converter-tools";
import {
  Base64EncoderDecoder,
  JsonFormatter,
  UrlEncoderDecoder,
} from "@/components/utility/tools/developer-tools";
import {
  FileHashChecksum,
  ZipExtractor,
} from "@/components/utility/tools/file-tools";
import {
  PasswordGenerator,
  PasswordStrengthChecker,
} from "@/components/utility/tools/password-tools";
import {
  QrCodeGenerator,
  UpiQrCodeGenerator,
} from "@/components/utility/tools/qr-tools";
import {
  RemoveDuplicateLines,
  TextCaseConverter,
  WordCounter,
} from "@/components/utility/tools/text-tools";

const componentMap: Record<
  UtilityToolSlug,
  ComponentType<{ tool: UtilityToolConfig }>
> = {
  "qr-code-generator": QrCodeGenerator,
  "upi-qr-code-generator": UpiQrCodeGenerator,
  "word-counter": WordCounter,
  "text-case-converter": TextCaseConverter,
  "remove-duplicate-lines": RemoveDuplicateLines,
  "emi-calculator": EmiCalculator,
  "gst-calculator": GstCalculator,
  "percentage-calculator": PercentageCalculator,
  "age-calculator": AgeCalculator,
  "sip-calculator": SipCalculator,
  "color-picker": ColorPickerTool,
  "color-contrast-checker": ColorContrastChecker,
  "length-converter": UnitConverterTool as ComponentType<{
    tool: UtilityToolConfig;
  }>,
  "weight-converter": UnitConverterTool as ComponentType<{
    tool: UtilityToolConfig;
  }>,
  "area-converter": UnitConverterTool as ComponentType<{
    tool: UtilityToolConfig;
  }>,
  "password-generator": PasswordGenerator,
  "password-strength-checker": PasswordStrengthChecker,
  "json-formatter": JsonFormatter,
  "base64-encoder-decoder": Base64EncoderDecoder,
  "url-encoder-decoder": UrlEncoderDecoder,
  "file-hash-checksum": FileHashChecksum,
  "zip-extractor": ZipExtractor,
};

export function UtilityToolPageClient({ slug }: { slug: UtilityToolSlug }) {
  const tool = utilityToolConfigs[slug];
  const ToolComponent = componentMap[slug];

  if (!tool || !ToolComponent) {
    notFound();
  }

  return <ToolComponent tool={tool} />;
}
