import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  async redirects() {
    return [
      { source: "/tools", destination: "/", permanent: false },
      { source: "/pdf", destination: "/pdf-tools", permanent: true },
      { source: "/pdf/merge", destination: "/merge-pdf", permanent: true },
      { source: "/pdf-merge", destination: "/merge-pdf", permanent: true },
      { source: "/pdf/compress", destination: "/compress-pdf", permanent: true },
      { source: "/pdf-compress", destination: "/compress-pdf", permanent: true },
      { source: "/pdf/split", destination: "/split-pdf", permanent: true },
      { source: "/pdf-split", destination: "/split-pdf", permanent: true },
      { source: "/pdf/pdf-to-image", destination: "/convert-pdf-to-image", permanent: true },
      { source: "/pdf/convert-pdf-to-image", destination: "/convert-pdf-to-image", permanent: true },
      { source: "/pdf-to-image", destination: "/convert-pdf-to-image", permanent: true },
      { source: "/pdf/image-to-pdf", destination: "/convert-image-to-pdf", permanent: true },
      { source: "/pdf/convert-image-to-pdf", destination: "/convert-image-to-pdf", permanent: true },
      { source: "/image-to-pdf", destination: "/convert-image-to-pdf", permanent: true },
      { source: "/pdf/rotate", destination: "/rotate-pdf", permanent: true },
      { source: "/pdf-rotate", destination: "/rotate-pdf", permanent: true },
      { source: "/pdf/watermark", destination: "/add-watermark-to-pdf", permanent: true },
      { source: "/pdf/add-watermark-to-pdf", destination: "/add-watermark-to-pdf", permanent: true },
      { source: "/pdf-watermark", destination: "/add-watermark-to-pdf", permanent: true },
      { source: "/pdf/protect", destination: "/protect-pdf", permanent: true },
      { source: "/pdf-protect", destination: "/protect-pdf", permanent: true },
      { source: "/pdf/unlock", destination: "/unlock-pdf", permanent: true },
      { source: "/pdf-unlock", destination: "/unlock-pdf", permanent: true },
      { source: "/pdf/extract-pages", destination: "/extract-pdf-pages", permanent: true },
      { source: "/pdf/extract-pdf-pages", destination: "/extract-pdf-pages", permanent: true },
      { source: "/pdf-extract-pages", destination: "/extract-pdf-pages", permanent: true },
      { source: "/pdf/reorder-pages", destination: "/reorder-pdf-pages", permanent: true },
      { source: "/pdf/reorder-pdf-pages", destination: "/reorder-pdf-pages", permanent: true },
      { source: "/pdf-reorder-pages", destination: "/reorder-pdf-pages", permanent: true },
      {
        source: "/pdf/add-page-numbers",
        destination: "/add-page-numbers-to-pdf",
        permanent: true,
      },
      {
        source: "/pdf/add-page-numbers-to-pdf",
        destination: "/add-page-numbers-to-pdf",
        permanent: true,
      },
      {
        source: "/pdf-add-page-numbers",
        destination: "/add-page-numbers-to-pdf",
        permanent: true,
      },
      { source: "/pdf/metadata", destination: "/view-pdf-metadata", permanent: true },
      { source: "/pdf/view-pdf-metadata", destination: "/view-pdf-metadata", permanent: true },
      { source: "/pdf-metadata", destination: "/view-pdf-metadata", permanent: true },
      { source: "/tools/resize", destination: "/resize-image", permanent: true },
      { source: "/tools/compress", destination: "/compress-image", permanent: true },
      { source: "/tools/convert", destination: "/convert-image", permanent: true },
      { source: "/tools/crop", destination: "/crop-image", permanent: true },
      {
        source: "/tools/rotate-flip",
        destination: "/rotate-image",
        permanent: true,
      },
      {
        source: "/tools/background-removal",
        destination: "/remove-background",
        permanent: true,
      },
      {
        source: "/tools/watermark",
        destination: "/add-watermark-to-image",
        permanent: true,
      },
      { source: "/tools/merge", destination: "/merge-images", permanent: true },
      { source: "/tools/filters", destination: "/image-filters", permanent: true },
      { source: "/tools/metadata", destination: "/image-metadata", permanent: true },
      { source: "/resize", destination: "/resize-image", permanent: true },
      { source: "/compress", destination: "/compress-image", permanent: true },
      { source: "/convert", destination: "/convert-image", permanent: true },
      { source: "/crop", destination: "/crop-image", permanent: true },
      {
        source: "/rotate-flip",
        destination: "/rotate-image",
        permanent: true,
      },
      {
        source: "/background-removal",
        destination: "/remove-background",
        permanent: true,
      },
      {
        source: "/watermark",
        destination: "/add-watermark-to-image",
        permanent: true,
      },
      { source: "/merge", destination: "/merge-images", permanent: true },
      { source: "/filters", destination: "/image-filters", permanent: true },
      { source: "/metadata", destination: "/image-metadata", permanent: true },
    ];
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
      },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.googleadservices.com https://*.doubleclick.net https://fundingchoicesmessages.google.com https://www.googletagmanager.com https://www.google-analytics.com https://js.hcaptcha.com https://hcaptcha.com https://*.hcaptcha.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data: blob: https:",
          "connect-src 'self' https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.googleadservices.com https://*.doubleclick.net https://fundingchoicesmessages.google.com https://www.google-analytics.com https://stats.g.doubleclick.net https://api.web3forms.com https://hcaptcha.com https://*.hcaptcha.com https://staticimgly.com",
          "frame-src 'self' blob: https://googleads.g.doubleclick.net https://*.doubleclick.net https://tpc.googlesyndication.com https://*.googlesyndication.com https://fundingchoicesmessages.google.com https://hcaptcha.com https://*.hcaptcha.com",
          "worker-src 'self' blob:",
          "wasm-src 'self' blob:",
        ].join("; "),
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
    ];

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/icons/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

export default nextConfig;
