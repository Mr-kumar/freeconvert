import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdRailSlots } from "@/components/AdRailSlots";
import { AdSlot } from "@/components/AdSlot";
import {
  blogPostImagePath,
  blogPostBreadcrumbJsonLd,
  blogPostJsonLd,
  blogPosts,
  getBlogPost,
} from "@/lib/blog";
import { BASE_URL } from "@/lib/tools";
import { safeJsonLd } from "@/lib/utils";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  const imagePath = blogPostImagePath(post);

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: "FreeConvert Editorial Team", url: `${BASE_URL}/editorial-policy` }],
    alternates: {
      canonical: `${BASE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | FreeConvert`,
      description: post.description,
      url: `${BASE_URL}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      siteName: "FreeConvert",
      images: [
        {
          url: imagePath,
          width: 1200,
          height: 630,
          alt: `${post.title} - FreeConvert guide`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [imagePath],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(blogPostJsonLd(post)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(blogPostBreadcrumbJsonLd(post)),
        }}
      />
      <AdRailSlots
        leftSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_RAIL_LEFT}
        rightSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_RAIL_RIGHT}
      />
      <Link
        className="text-sm font-bold text-[var(--accent)]"
        href="/blog"
      >
        Back to guides
      </Link>
      <article className="mt-6 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold text-[var(--muted)]">
          {new Date(post.publishedAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          / {post.readTime}
        </p>
        <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-[var(--text)]">
          {post.title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
          {post.description}
        </p>
        <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm leading-6 text-[var(--muted)]">
          <p>
            Written and reviewed by{" "}
            <Link
              className="font-bold text-[var(--accent)]"
              href="/editorial-policy"
            >
              FreeConvert Editorial Team
            </Link>
            . Updated{" "}
            {new Date(post.updatedAt ?? post.publishedAt).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              },
            )}
            .
          </p>
        </div>

        <div className="mt-10 space-y-8">
          {post.sections.map((section, index) => (
            <div key={section.heading}>
              <section>
                <h2 className="text-2xl font-extrabold text-[var(--text)]">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((paragraph) => (
                    <p
                      className="text-base leading-8 text-[var(--muted)]"
                      key={paragraph}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.table ? (
                  <div className="mt-5 overflow-hidden rounded-xl border border-[var(--border)]">
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse bg-white text-left text-sm">
                        <caption className="bg-[var(--surface-2)] px-4 py-3 text-left font-bold text-[var(--text)]">
                          {section.table.caption}
                        </caption>
                        <thead className="bg-[var(--surface-2)] text-[var(--text)]">
                          <tr>
                            {section.table.headers.map((header) => (
                              <th
                                className="border-t border-[var(--border)] px-4 py-3 font-extrabold"
                                key={header}
                                scope="col"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.table.rows.map((row) => (
                            <tr
                              className="border-t border-[var(--border)]"
                              key={row.join("|")}
                            >
                              {row.map((cell) => (
                                <td
                                  className="px-4 py-3 leading-6 text-[var(--muted)]"
                                  key={cell}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
              </section>
              {index === 0 ? (
                <AdSlot
                  className="mt-8 px-0 sm:px-0"
                  minHeight={120}
                  slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_IN_ARTICLE}
                />
              ) : null}
            </div>
          ))}
        </div>

        {post.relatedTools?.length ? (
          <section className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
            <h2 className="text-xl font-extrabold text-[var(--text)]">
              Related tools
            </h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {post.relatedTools.map((tool) => (
                <Link
                  className="rounded-lg border border-[var(--border)] bg-white p-4 text-sm font-bold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  href={tool.href}
                  key={tool.href}
                >
                  {tool.label}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {post.relatedPosts?.length ? (
          <section className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
            <h2 className="text-xl font-extrabold text-[var(--text)]">
              Continue reading
            </h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {post.relatedPosts.map((relatedPost) => (
                <Link
                  className="rounded-lg border border-[var(--border)] bg-white p-4 text-sm font-bold leading-6 text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  href={`/blog/${relatedPost.slug}`}
                  key={relatedPost.slug}
                >
                  {relatedPost.title}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
      <AdSlot
        className="mt-8 px-0 sm:px-0"
        format="horizontal"
        minHeight={120}
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_BOTTOM}
      />
    </main>
  );
}
