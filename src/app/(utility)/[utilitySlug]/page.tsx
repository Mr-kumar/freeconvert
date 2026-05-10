import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UtilityToolRoutePage } from "@/app/(utility)/UtilityToolRoutePage";
import {
  buildUtilityToolMetadata,
  isUtilityToolSlug,
  utilityTools,
} from "@/lib/utilityTools";

type Props = {
  params: Promise<{ utilitySlug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return utilityTools.map((tool) => ({ utilitySlug: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { utilitySlug } = await params;

  if (!isUtilityToolSlug(utilitySlug)) {
    notFound();
  }

  return buildUtilityToolMetadata(utilitySlug);
}

export default async function Page({ params }: Props) {
  const { utilitySlug } = await params;

  if (!isUtilityToolSlug(utilitySlug)) {
    notFound();
  }

  return <UtilityToolRoutePage slug={utilitySlug} />;
}
