export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readTime: string;
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
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
