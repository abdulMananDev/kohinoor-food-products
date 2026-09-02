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
    /* Unlike the other pages this one keeps its openGraph block, because
       type/publishedTime/tags are worth having on an article. The cost is
       that a page-level block replaces the inherited one instead of merging,
       so the card from app/opengraph-image.tsx has to be named explicitly or
       the post ends up with no og:image at all. */
    openGraph: {
      type: "article",
      url,
      title: `${post.title} — ${SITE_NAME}`,
      description: post.description,
      siteName: SITE_NAME,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      locale: "en_IN",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} — ${SITE_NAME}`,
      description: post.description,
      images: ["/opengraph-image"],
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

  /* The page already renders a visual breadcrumb; this is the machine-
     readable twin, so the trail shows in results rather than a bare URL. */
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: backLabel,
        item: `${SITE_URL}${backHref}`,
      },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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
