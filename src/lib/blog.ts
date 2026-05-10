import { BASE_URL } from "@/lib/tools";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readTime: string;
  relatedTools?: {
    label: string;
    href: string;
  }[];
  sections: {
    heading: string;
    body: string[];
  }[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "compress-image-without-quality-loss",
    title: "How to Compress an Image Without Losing Quality",
    description:
      "Practical settings for reducing image file size while keeping photos and graphics sharp.",
    publishedAt: "2026-05-09",
    readTime: "4 min read",
    relatedTools: [
      { label: "Compress Image", href: "/compress-image" },
      { label: "Resize Image", href: "/resize-image" },
      { label: "Convert Image", href: "/convert-image" },
    ],
    sections: [
      {
        heading: "Start with the right format",
        body: [
          "Photos usually compress best as JPEG or WebP. Graphics, screenshots and images with transparent backgrounds are usually better as PNG or WebP.",
          "If your upload form accepts WebP, try it first. It often gives a smaller file than JPEG at the same visible quality.",
        ],
      },
      {
        heading: "Use a target size",
        body: [
          "When a form asks for a fixed limit like 35 KB, set that target directly instead of guessing quality values.",
          "If the image still cannot reach the requested size, reduce the pixel dimensions first and then compress again.",
        ],
      },
      {
        heading: "Avoid repeated exports",
        body: [
          "Every lossy export can remove detail. Keep the original image safe, make one resized version, then export the final compressed file once.",
        ],
      },
    ],
  },
  {
    slug: "resize-image-for-online-forms",
    title: "How to Resize an Image for Online Forms",
    description:
      "A simple checklist for resizing photos for exams, applications, IDs and government portals.",
    publishedAt: "2026-05-09",
    readTime: "3 min read",
    relatedTools: [
      { label: "Resize Image", href: "/resize-image" },
      { label: "Compress Image", href: "/compress-image" },
      { label: "Crop Image", href: "/crop-image" },
    ],
    sections: [
      {
        heading: "Check both dimensions and file size",
        body: [
          "Most online forms mention pixel dimensions, file size, or both. Set width and height first, then use target KB if the form has a file-size limit.",
          "Keep aspect ratio locked unless the form specifically asks for an exact width and height.",
        ],
      },
      {
        heading: "Use JPEG for photos",
        body: [
          "Passport photos and document photos are usually accepted as JPEG. A quality level around 70 to 85 is a good starting point.",
        ],
      },
      {
        heading: "Preview before upload",
        body: [
          "After resizing, check the preview for blurred text, cropped faces, or stretched proportions before submitting the form.",
        ],
      },
    ],
  },
  {
    slug: "jpeg-png-webp-avif-differences",
    title: "JPEG vs PNG vs WebP vs AVIF: Which Image Format Should You Use?",
    description:
      "Understand common image formats and choose the best output for photos, screenshots and web uploads.",
    publishedAt: "2026-05-09",
    readTime: "5 min read",
    relatedTools: [
      { label: "Convert Image", href: "/convert-image" },
      { label: "Compress Image", href: "/compress-image" },
      { label: "Image Metadata", href: "/image-metadata" },
    ],
    sections: [
      {
        heading: "JPEG",
        body: [
          "JPEG is widely supported and works well for photos. It does not support transparency and can show artifacts at very low quality.",
        ],
      },
      {
        heading: "PNG",
        body: [
          "PNG is lossless and supports transparency. It is excellent for logos, graphics and screenshots, but file sizes can be larger.",
        ],
      },
      {
        heading: "WebP and AVIF",
        body: [
          "WebP is a strong default for web use because it supports both lossy compression and transparency.",
          "AVIF can be even smaller, but browser and platform support can vary, so always test before using it for strict upload portals.",
        ],
      },
    ],
  },
  {
    slug: "merge-pdf-files-online",
    title: "How to Merge PDF Files Online in the Right Order",
    description:
      "A practical checklist for combining PDFs, arranging pages and keeping the final file easy to share.",
    publishedAt: "2026-05-10",
    readTime: "4 min read",
    relatedTools: [
      { label: "Merge PDF", href: "/merge-pdf" },
      { label: "Compress PDF", href: "/compress-pdf" },
      { label: "Reorder PDF Pages", href: "/reorder-pdf-pages" },
    ],
    sections: [
      {
        heading: "Prepare the files first",
        body: [
          "Rename source PDFs in the order you want them to appear. This makes it easier to check the final sequence before creating the merged file.",
          "Remove duplicate or outdated documents before merging so the output stays clean and smaller.",
        ],
      },
      {
        heading: "Check the final order",
        body: [
          "After adding PDFs, review the order before export. Certificates, invoices and application documents are easiest to read when supporting documents follow the main form.",
          "If scanned pages are mixed up inside one PDF, reorder those pages before or after merging.",
        ],
      },
      {
        heading: "Compress when needed",
        body: [
          "Merged PDFs can become large when they contain scanned pages or photos. Use compression when a portal or email has a strict file-size limit.",
          "For important submissions, open the final PDF once after download and confirm every page is readable.",
        ],
      },
    ],
  },
  {
    slug: "compress-pdf-to-target-kb",
    title: "How to Compress a PDF to a Target KB Size",
    description:
      "Understand when PDF compression works well and how to choose a target size without making pages unreadable.",
    publishedAt: "2026-05-10",
    readTime: "4 min read",
    relatedTools: [
      { label: "Compress PDF", href: "/compress-pdf" },
      { label: "Merge PDF", href: "/merge-pdf" },
      { label: "Convert PDF to Image", href: "/convert-pdf-to-image" },
    ],
    sections: [
      {
        heading: "Know what can be compressed",
        body: [
          "Scanned PDFs and image-heavy documents usually shrink more than clean text-only PDFs.",
          "If the PDF already contains optimized text and vector content, the file may not reduce much without lowering visible quality.",
        ],
      },
      {
        heading: "Use target size carefully",
        body: [
          "A target KB value is best effort. The tool can lower image quality and resolution, but it cannot always hit an exact size without making pages too soft.",
          "Start with a balanced setting, then use a lower target only if the result is still readable.",
        ],
      },
      {
        heading: "Check readability",
        body: [
          "After compression, zoom in on signatures, IDs, stamps and small text before submitting the file.",
          "If readability drops too much, choose a higher target size or reduce only unnecessary image-heavy pages.",
        ],
      },
    ],
  },
  {
    slug: "convert-pdf-to-jpg-or-png",
    title: "When to Convert PDF Pages to JPG or PNG",
    description:
      "Choose the right image format when exporting PDF pages for previews, thumbnails, forms or sharing.",
    publishedAt: "2026-05-10",
    readTime: "3 min read",
    relatedTools: [
      { label: "Convert PDF to Image", href: "/convert-pdf-to-image" },
      { label: "Convert Image to PDF", href: "/convert-image-to-pdf" },
      { label: "Compress Image", href: "/compress-image" },
    ],
    sections: [
      {
        heading: "Use JPG for photos and smaller files",
        body: [
          "JPG is usually a good choice for scanned pages, photo-based PDFs and previews where smaller file size matters.",
          "Lower quality settings reduce size, but very low quality can make text or signatures hard to read.",
        ],
      },
      {
        heading: "Use PNG for sharp text",
        body: [
          "PNG is better for crisp text, screenshots, diagrams and pages where compression artifacts are distracting.",
          "PNG files can be larger, so use it when clarity matters more than file size.",
        ],
      },
      {
        heading: "Export only needed pages",
        body: [
          "When a PDF has many pages, export only the page or range you need instead of creating images for the whole document.",
          "Choose DPI based on the destination. Higher DPI creates larger but sharper images.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function blogCollectionJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/blog#guides`,
    name: "Image, PDF and Online Tool Guides",
    url: `${BASE_URL}/blog`,
    description:
      "Simple guides for resizing, compressing and converting images and PDFs, plus practical online tool tips for everyday use.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: blogPosts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: post.title,
        url: `${BASE_URL}/blog/${post.slug}`,
      })),
    },
  };
}

export function blogPostJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${BASE_URL}/blog/${post.slug}#article`,
    headline: post.title,
    description: post.description,
    image: [`${BASE_URL}/opengraph-image`],
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Organization",
      name: "FreeConvert",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "FreeConvert",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/android-chrome-512x512.png`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: `${BASE_URL}/blog/${post.slug}`,
    articleSection: post.sections.map((section) => section.heading),
  };
}

export function blogPostBreadcrumbJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: `${BASE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${BASE_URL}/blog/${post.slug}`,
      },
    ],
  };
}
