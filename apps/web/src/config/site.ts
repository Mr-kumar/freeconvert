/**
 * Single source of truth for site copy and SEO. Used by Navbar, Footer, landing, and metadata.
 */

export const SITE = {
  name: "FreeConvert",
  tagline:
    "Convert and edit PDFs and images in seconds. Free, fast, and secure.",
  description:
    "Free online PDF tools: merge PDFs, reduce PDF size, compress images, convert JPG to PDF. No signup required. Fast and secure file conversion.",
  url: "https://freeconvert.com",
} as const;

export const NAV_LINKS = [
  { label: "Tools", href: "/#tools" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
] as const;

export const BENEFITS = [
  {
    title: "Fast processing",
    description:
      "Get your converted files in seconds with our optimized engine.",
  },
  {
    title: "Secure & private",
    description: "Files are processed securely and not stored on our servers.",
  },
  {
    title: "No signup required",
    description:
      "Start converting right away. Create an account only if you need more.",
  },
  {
    title: "Works everywhere",
    description: "Use any device or browser. All tools run in the cloud.",
  },
] as const;

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Upload",
    description: "Drag and drop your file or click to browse.",
  },
  {
    step: 2,
    title: "Process",
    description: "Choose your tool and apply the conversion.",
  },
  {
    step: 3,
    title: "Download",
    description: "Save your new file to your device.",
  },
] as const;

export const FOOTER_LINKS = {
  product: [
    { label: "Tools", href: "/#tools" },
    { label: "Pricing", href: "/pricing" },
    { label: "API", href: "/docs" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/pricing" },
  ],
  legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
} as const;

export const COPYRIGHT = "© 2025 FreeConvert. All rights reserved.";
