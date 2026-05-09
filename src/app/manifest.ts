import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FreeConvert - Free Online Image Tools",
    short_name: "FreeConvert",
    description:
      "Resize, compress, convert, crop, remove background and more. Free browser-based image tools.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f5fa",
    theme_color: "#e5322d",
    orientation: "portrait",
    scope: "/",
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/maskable-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    categories: ["utilities", "productivity", "photo"],
  };
}
