import { ImageResponse } from "next/og";
import { blogPosts, getBlogPost } from "@/lib/blog";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#fff7f6",
          color: "#172033",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "64px",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "2px solid #f3d7d3",
            borderRadius: 28,
            display: "flex",
            flexDirection: "column",
            gap: 28,
            height: "100%",
            justifyContent: "space-between",
            padding: "52px",
            width: "100%",
          }}
        >
          <div
            style={{
              color: "#de4d43",
              display: "flex",
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 0,
            }}
          >
            FreeConvert Guide
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 62,
                fontWeight: 900,
                letterSpacing: 0,
                lineHeight: 1.08,
                maxWidth: 950,
              }}
            >
              {post?.title ?? "Image, PDF and Online Tool Guide"}
            </div>
            <div
              style={{
                color: "#5d6a7c",
                display: "flex",
                fontSize: 30,
                lineHeight: 1.35,
                maxWidth: 930,
              }}
            >
              {post?.description ??
                "Practical browser-based file preparation tips."}
            </div>
          </div>
          <div
            style={{
              color: "#5d6a7c",
              display: "flex",
              fontSize: 26,
              fontWeight: 700,
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span>freeconvert.in</span>
            <span>{post?.readTime ?? "Guide"}</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
