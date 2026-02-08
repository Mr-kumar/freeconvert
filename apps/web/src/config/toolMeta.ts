/**
 * Tool metadata: single source for titles and descriptions. Used for SEO and by tools.tsx.
 * No JSX so safe to import in server components and metadata.
 */

export const TOOL_META = [
  {
    id: "reduce",
    title: "PDF Size Reducer",
    description:
      "Reduce PDF file size without losing quality. Free online PDF compressor.",
    href: "/reduce",
    accept: "application/pdf",
    multiple: false,
  },
  {
    id: "compress",
    title: "Image Compressor",
    description: "Compress images to reduce file size. Free online image optimizer.",
    href: "/compress",
    accept: "image/*",
    multiple: true,
  },
  {
    id: "jpg-to-pdf",
    title: "JPG to PDF",
    description: "Convert JPG images to a single PDF file. Free and fast.",
    href: "/jpg-to-pdf",
    accept: "image/jpeg,image/jpg",
    multiple: true,
  },
  {
    id: "merge",
    title: "Merge PDF",
    description: "Combine multiple PDF files into one document. No file size limits.",
    href: "/merge",
    accept: "application/pdf",
    multiple: true,
  },
] as const;

export function getToolMeta(id: string) {
  return TOOL_META.find((t) => t.id === id);
}
