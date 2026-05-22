"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { CrawlableToolFallback } from "@/components/CrawlableToolFallback";
import { useHydrated } from "@/components/useHydrated";
import { toolConfigs } from "@/lib/tools";
import type { ToolDefaults, ToolSlug } from "@/lib/types";

interface ToolClientProps {
  slug: ToolSlug;
  defaults: ToolDefaults;
}

function ToolClientLoading() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[360px_1fr]">
      <aside className="space-y-4 border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="h-5 w-32 animate-pulse rounded bg-[var(--surface-2)]" />
        <div className="h-28 animate-pulse rounded bg-[var(--surface-2)]" />
        <div className="h-44 animate-pulse rounded bg-[var(--surface-2)]" />
      </aside>
      <section className="h-[560px] animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)]" />
    </main>
  );
}

const toolClients: Record<ToolSlug, ComponentType<ToolClientProps>> = {
  resize: dynamic(() => import("./ResizeClient").then((mod) => mod.ResizeClient), {
    loading: ToolClientLoading,
    ssr: false,
  }),
  compress: dynamic(() => import("./CompressClient").then((mod) => mod.CompressClient), {
    loading: ToolClientLoading,
    ssr: false,
  }),
  convert: dynamic(() => import("./ConvertClient").then((mod) => mod.ConvertClient), {
    loading: ToolClientLoading,
    ssr: false,
  }),
  "webp-to-jpg": dynamic(() => import("./ConvertClient").then((mod) => mod.ConvertClient), {
    loading: ToolClientLoading,
    ssr: false,
  }),
  "png-to-jpg": dynamic(() => import("./ConvertClient").then((mod) => mod.ConvertClient), {
    loading: ToolClientLoading,
    ssr: false,
  }),
  "jpg-to-png": dynamic(() => import("./ConvertClient").then((mod) => mod.ConvertClient), {
    loading: ToolClientLoading,
    ssr: false,
  }),
  "avif-to-jpg": dynamic(() => import("./ConvertClient").then((mod) => mod.ConvertClient), {
    loading: ToolClientLoading,
    ssr: false,
  }),
  "png-to-webp": dynamic(() => import("./ConvertClient").then((mod) => mod.ConvertClient), {
    loading: ToolClientLoading,
    ssr: false,
  }),
  "heic-to-jpg": dynamic(() => import("./ConvertClient").then((mod) => mod.ConvertClient), {
    loading: ToolClientLoading,
    ssr: false,
  }),
  "heic-to-png": dynamic(() => import("./ConvertClient").then((mod) => mod.ConvertClient), {
    loading: ToolClientLoading,
    ssr: false,
  }),
  "compress-jpg": dynamic(() => import("./CompressClient").then((mod) => mod.CompressClient), {
    loading: ToolClientLoading,
    ssr: false,
  }),
  "compress-png": dynamic(() => import("./CompressClient").then((mod) => mod.CompressClient), {
    loading: ToolClientLoading,
    ssr: false,
  }),
  crop: dynamic(() => import("./CropClient").then((mod) => mod.CropClient), {
    loading: ToolClientLoading,
    ssr: false,
  }),
  "rotate-flip": dynamic(
    () => import("./RotateFlipClient").then((mod) => mod.RotateFlipClient),
    {
      loading: ToolClientLoading,
      ssr: false,
    },
  ),
  "background-removal": dynamic(
    () => import("./BackgroundRemovalClient").then((mod) => mod.BackgroundRemovalClient),
    {
      loading: ToolClientLoading,
      ssr: false,
    },
  ),
  watermark: dynamic(() => import("./WatermarkClient").then((mod) => mod.WatermarkClient), {
    loading: ToolClientLoading,
    ssr: false,
  }),
  merge: dynamic(() => import("./MergeClient").then((mod) => mod.MergeClient), {
    loading: ToolClientLoading,
    ssr: false,
  }),
  filters: dynamic(() => import("./FiltersClient").then((mod) => mod.FiltersClient), {
    loading: ToolClientLoading,
    ssr: false,
  }),
  metadata: dynamic(() => import("./MetadataClient").then((mod) => mod.MetadataClient), {
    loading: ToolClientLoading,
    ssr: false,
  }),
  "image-to-text": dynamic(() => import("./ImageOcrClient").then((mod) => mod.ImageOcrClient), {
    loading: ToolClientLoading,
    ssr: false,
  }),
  "svg-to-png": dynamic(() => import("./SvgToPngClient").then((mod) => mod.SvgToPngClient), {
    loading: ToolClientLoading,
    ssr: false,
  }),
  "favicon-generator": dynamic(() => import("./FaviconGeneratorClient").then((mod) => mod.FaviconGeneratorClient), {
    loading: ToolClientLoading,
    ssr: false,
  }),
  "blur-image": dynamic(() => import("./BlurImageClient").then((mod) => mod.BlurImageClient), {
    loading: ToolClientLoading,
    ssr: false,
  }),
  "image-collage-maker": dynamic(() => import("./ImageCollageClient").then((mod) => mod.ImageCollageClient), {
    loading: ToolClientLoading,
    ssr: false,
  }),
};

export function ToolPageClient({ slug, defaults }: ToolClientProps) {
  const Client = toolClients[slug];
  const tool = toolConfigs[slug];
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <CrawlableToolFallback
        backHref="/#image-tools"
        backLabel="Image Tools"
        badgeLabel="Browser only"
        description={tool.description}
        features={tool.features}
        title={tool.name}
      />
    );
  }

  return <Client defaults={defaults} slug={slug} />;
}
