import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate, SITE_URL, SITE_NAME } from "@/lib/content";
import s from "../components/prose.module.css";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "How to brew it, what the leaf grades mean, and how New Fast Tea is packed. The product track — laboratory results live under Transparency.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    title: "Blog — New Fast Tea",
    description: "Brewing, leaf grades, and how the tea is packed.",
    siteName: SITE_NAME,
  },
  twitter: { card: "summary_large_image" },
};

const breadcrumbs = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
  ],
};

/* Every post, newest first. /blog is the full index; /transparency stays
   the curated pillar hub, listing only the transparency track alongside
   the batch table. Filtering /blog by track hid transparency-track writing
   from the one page a reader goes to for "everything you have written". */
export default function Blog() {
  const posts = getAllPosts();

  return (
    <main id="main" className={s.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <header className={s.indexHead}>
        <span className={s.eyebrow}>Blog</span>
        <h1>Everything we have written.</h1>
        <p className={s.indexLede}>
          Testing, food colouring, leaf grades and how the tea is packed —
          newest first. For laboratory results organised by batch, with what
          each panel did and did not cover, see{" "}
          <Link href="/transparency">Transparency</Link>.
        </p>
      </header>

      <ol className={s.list}>
        {posts.map((p) => (
          <li key={p.slug} className={s.item}>
            <Link href={`/blog/${p.slug}`}>
              <span className={s.itemDate}>
                <time dateTime={p.publishedAt}>{formatDate(p.publishedAt)}</time>
              </span>
              <span>
                <span className={s.itemTitle}>{p.title}</span>
                <span className={s.itemDesc}>{p.description}</span>
                {/* The index now mixes both tracks, so each row says which
                    one it is — the two read very differently and a reader
                    scanning the list should know before they click. */}
                <span className={s.itemMeta}>
                  <span>
                    {p.track === "transparency"
                      ? "Transparency"
                      : "Brewing & product"}
                  </span>
                  {p.batch ? <span>{p.batch}</span> : null}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
      {posts.length === 0 ? (
        <p className={s.empty}>Nothing published yet.</p>
      ) : null}
    </main>
  );
}
