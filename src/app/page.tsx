import type { Metadata } from "next";
import Link from "next/link";
import {
  Crop,
  Eraser,
  FileImage,
  Grid3X3,
  ImageDown,
  ImagePlus,
  Maximize,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "FreeConvert - Every Image Tool. Zero Uploads.",
  description:
    "All-in-one client-side image toolkit for resizing, compressing, converting, cropping, background removal, watermarking, merging, filters and metadata.",
};

const iconMap = {
  resize: Maximize,
  compress: ImageDown,
  convert: RefreshCw,
  crop: Crop,
  "rotate-flip": RefreshCw,
  "background-removal": Eraser,
  watermark: ImagePlus,
  merge: Grid3X3,
  filters: SlidersHorizontal,
  metadata: FileImage,
};

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-64px)]">
      <section className="bg-[var(--bg)]">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <p className="mb-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--accent)] shadow-sm ring-1 ring-[var(--border)]">
            100% client-side / no account / no limits
          </p>
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-extrabold leading-tight text-[var(--text)] sm:text-6xl">
            Every image tool you need in one place
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
            Resize, compress, convert, crop, remove backgrounds, watermark,
            merge, filter and inspect images directly in your browser.
          </p>
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 overflow-hidden rounded-2xl border border-[var(--border)] bg-white text-left shadow-sm sm:grid-cols-3">
            {[
              ["1", "Upload", "Drop a local image"],
              ["2", "Adjust", "Choose size, format or quality"],
              ["3", "Download", "Save the finished file"],
            ].map(([step, title, description]) => (
              <div
                className="border-b border-[var(--border)] p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
                key={step}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff1f0] text-sm font-extrabold text-[var(--accent)]">
                  {step}
                </span>
                <p className="mt-3 text-sm font-bold text-[var(--text)]">
                  {title}
                </p>
                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {tools.map((tool) => {
            const Icon = iconMap[tool.slug];

            return (
              <Link
                className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#f3b5b1] hover:shadow-lg hover:shadow-slate-200/70"
                href={tool.href}
                key={tool.slug}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff1f0] text-[var(--accent)]">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-6 text-xl font-bold text-[var(--text)]">
                  {tool.shortName}
                </h2>
                <p className="mt-3 min-h-12 text-sm leading-6 text-[var(--muted)]">
                  {tool.homeDescription}
                </p>
                <span className="mt-5 inline-flex text-sm font-bold text-[var(--accent)]">
                  Open tool
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 grid gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm md:grid-cols-3">
          {[
            ["Private", "Files stay in your browser."],
            ["Fast", "Canvas and WebAssembly power the tools."],
            ["Simple", "Upload, adjust settings, download."],
          ].map(([title, description]) => (
            <div className="rounded-xl bg-[var(--surface-2)] p-5" key={title}>
              <h2 className="text-base font-bold text-[var(--text)]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
