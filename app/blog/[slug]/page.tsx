import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getAllPosts,
  getPostBySlug,
  formatDate,
  entityRef,
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

  /* One @graph, not three loose scripts.
   *
   * The Article, the breadcrumb and the FAQ all hang off the Organization
   * and WebSite nodes declared in the root layout, by @id. Emitted
   * separately they were three unlinked "New Fast Tea" entities as far as a
   * parser is concerned; referenced by @id they are one publisher with a
   * body of work, which is the whole point of publishing this evidence
   * under one roof. */
  const orgId = `${SITE_URL}/#organization`;
  const siteId = `${SITE_URL}/#website`;

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
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

  const article = {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@id": siteId },
    author: { "@id": orgId },
    publisher: { "@id": orgId },
    inLanguage: "en-IN",
    articleSection: backLabel,
    image: `${SITE_URL}/opengraph-image`,
    breadcrumb: { "@id": `${url}#breadcrumb` },
    keywords: post.tags.join(", "),
    /* The result set this post was written about, on the page that owns it
       as standing status rather than as a dated record. Reciprocated there
       with `subjectOf`. */
    ...(post.about ? { about: { "@id": `${SITE_URL}${post.about}` } } : {}),
    /* The named compounds and bodies the post discusses, each resolved to a
       sameAs URL. This is what lets an engine treat the page as a source on
       "Ponceau 4R" rather than as a page containing that string. */
    ...(post.entities.length > 0
      ? { mentions: post.entities.map(entityRef) }
      : {}),
    /* The signed PDF the post is reporting on. It is the evidence; the
       article without it is an assertion. */
    ...(post.labReport ? { citation: `${SITE_URL}${post.labReport}` } : {}),
  };

  const faqPage =
    post.faq.length > 0
      ? {
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          /* Every answer below is rendered on the page verbatim. Marking up
             an answer that is not visible is a Google violation, and on this
             site it would also be the exact dishonesty the site exists to
             avoid. */
          mainEntity: post.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [article, breadcrumb, ...(faqPage ? [faqPage] : [])],
  };

  return (
    <main id="main" className={s.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
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

      {/* Answer-first. Each answer is written to stand alone out of
          context, because that is how it will be quoted — no "those are two
          different batches" with no antecedent. Same text as the FAQPage
          markup above. */}
      {post.faq.length > 0 ? (
        <section className={s.answers} aria-labelledby="in-short">
          <h2 className={s.answersTitle} id="in-short">
            In short
          </h2>
          <dl>
            {post.faq.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

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
