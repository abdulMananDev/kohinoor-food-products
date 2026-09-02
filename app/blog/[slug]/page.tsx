import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getAllPosts,
  getPostBySlug,
  formatDate,
  SITE_URL,
  SITE_NAME,
} from "@/lib/content";
import { mdxComponents } from "@/app/components/mdx";
import s from "../../components/prose.module.css";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      siteName: SITE_NAME,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  const backHref = post.track === "transparency" ? "/transparency" : "/blog";
  const backLabel = post.track === "transparency" ? "Transparency" : "Blog";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    keywords: post.tags.join(", "),
  };

  return (
    <main id="main" className={s.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className={s.crumbs}>
        <Link href={backHref}>{backLabel}</Link>
        <span aria-hidden>/</span>
        <span aria-current="page">{post.title}</span>
      </nav>

      <header className={s.head}>
        <span className={s.track}>
          {post.track === "transparency" ? "Transparency" : "Brewing & product"}
        </span>
        <h1>{post.title}</h1>
        <p className={s.description}>{post.description}</p>

        {/* Dates are not optional furniture on this site. A transparency
            post without a visible date is an undated claim. */}
        <dl className={s.dates}>
          <div>
            <dt>Published</dt>
            <dd>
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            </dd>
          </div>
          {post.updatedAt ? (
            <div>
              <dt>Updated</dt>
              <dd>
                <time dateTime={post.updatedAt}>
                  {formatDate(post.updatedAt)}
                </time>
              </dd>
            </div>
          ) : null}
          {post.batch ? (
            <div>
              <dt>Batch</dt>
              <dd className="mono">{post.batch}</dd>
            </div>
          ) : null}
        </dl>
      </header>

      <article className={s.prose}>
        <MDXRemote source={post.content} components={mdxComponents} />
      </article>

      {post.tags.length > 0 ? (
        <footer className={s.tags}>
          <h2 className={s.tagsTitle}>Tags</h2>
          <ul>
            {post.tags.map((t) => (
              <li key={t} className="mono">
                {t}
              </li>
            ))}
          </ul>
        </footer>
      ) : null}
    </main>
  );
}
