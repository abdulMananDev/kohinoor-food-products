import type { Metadata } from "next";
import Link from "next/link";
import {
  getPostsByTrack,
  getBatches,
  formatDate,
  SITE_URL,
  SITE_NAME,
} from "@/lib/content";
import s from "../components/prose.module.css";

export const metadata: Metadata = {
  title: "Transparency",
  description:
    "Every laboratory result New Fast Tea has published, newest first, with the batch each one covers and what it did not test.",
  alternates: { canonical: `${SITE_URL}/transparency` },
  /* `images` is named explicitly — see the note in app/blog/page.tsx. */
  openGraph: {
    type: "website",
    url: `${SITE_URL}/transparency`,
    title: "Transparency — New Fast Tea",
    description:
      "Every laboratory result New Fast Tea has published, newest first.",
    siteName: SITE_NAME,
    locale: "en_IN",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
};

const breadcrumbs = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Transparency",
      item: `${SITE_URL}/transparency`,
    },
  ],
};

export default function Transparency() {
  const posts = getPostsByTrack("transparency");
  const batches = getBatches();

  return (
    <main id="main" className={s.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <header className={s.indexHead}>
        <span className={s.eyebrow}>Transparency</span>
        <h1>Every test, and every gap in it.</h1>
        <p className={s.indexLede}>
          This is the full record: what was tested, by which laboratory, on
          which batch, and what the panel did not cover. Posts are listed
          newest first. Where a result is still outstanding it says so, and it
          is never shown as a pass.
        </p>
      </header>

      <h2 className={s.sectionTitle}>Batches</h2>
      <div className={s.batchWrap}>
        <table className={s.batchTable}>
          <caption>
            Report status by batch. &ldquo;Pending&rdquo; means a laboratory
            report has been commissioned but not yet published here — it is not
            a statement that the batch passed.
          </caption>
          <thead>
            <tr>
              <th scope="col">Batch</th>
              <th scope="col">Report</th>
              <th scope="col">Published</th>
              <th scope="col">Write-up</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((b) => (
              <tr key={b.batch}>
                <th scope="row" className="mono">
                  {b.batch}
                </th>
                <td data-label="Report">
                  <span className={s.batchStatus} data-status={b.status}>
                    {b.status === "published" ? "Published" : "Pending"}
                  </span>
                </td>
                <td data-label="Published">
                  <time dateTime={b.publishedAt}>
                    {formatDate(b.publishedAt)}
                  </time>
                </td>
                <td data-label="Write-up">
                  <Link href={`/blog/${b.postSlug}`}>{b.postTitle}</Link>
                </td>
              </tr>
            ))}
            {batches.length === 0 ? (
              <tr>
                <td colSpan={4} className={s.empty}>
                  No batches recorded yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <h2 className={s.sectionTitle}>Posts</h2>
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
                <span className={s.itemMeta}>
                  {p.batch ? <span>{p.batch}</span> : null}
                  {p.labReport ? <span>Report attached</span> : null}
                  {p.updatedAt ? (
                    <span>Updated {formatDate(p.updatedAt)}</span>
                  ) : null}
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
