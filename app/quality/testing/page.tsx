import Link from "next/link";
import { getBatches, formatDate } from "@/lib/content";
import s from "./ledger.module.css";

export const revalidate = 2592000; // 30 days — batches land monthly at most

export const metadata = {
  title: "Batch test results",
  description:
    "Every New Fast Tea batch we have published a laboratory result for, newest first, with the signed report and the write-up explaining what it covered.",
  /* Without this the root layout canonical ("/") is inherited and this
     page tells crawlers it is the homepage. */
  alternates: { canonical: "/quality/testing" },
};

/* Rows come from the posts, the same source /transparency reads, so a batch
   cannot appear here without a write-up explaining it and a batch can never
   be listed as reported without a PDF behind it.
 *
 * Not from lib/batch.ts: that schema wants a numeric result and a numeric
 * limit per parameter, and the report we actually hold is a qualitative dye
 * panel — "Not Detected" against "Should be Absent". Filling those columns
 * would mean inventing limits. The typed loader and the per-batch detail
 * route stay in place for the first batch that does come back with numbers
 * (heavy metals, pesticide residues); until then this index is the ledger. */
export default function TestingIndex() {
  const batches = getBatches();

  return (
    <main id="main" className={s.page}>
      <h1>Batch test results</h1>
      <p className={s.prose}>
        Every batch we sell is tested by an accredited laboratory before it
        ships. The batches below are the ones with a result published so far —
        the signed report and the write-up covering what the panel did and did
        not include are linked against each one. &ldquo;Pending&rdquo; means a
        report has been commissioned and not yet published. It is not a
        statement that the batch passed.
      </p>

      <div className={s.panel} style={{ marginTop: "var(--s7)" }}>
        {batches.length === 0 ? (
          <p className={s.empty}>
            No batches recorded yet. The published Batch No. 12 analysis is on{" "}
            <Link href="/quality">the quality page</Link>.
          </p>
        ) : (
          <table className={s.table}>
            <caption>
              {batches.length} {batches.length === 1 ? "batch" : "batches"},
              highest batch number first.
            </caption>
            <thead>
              <tr>
                <th scope="col">Batch</th>
                <th scope="col">Report</th>
                <th scope="col">Published</th>
                <th scope="col">Write-up</th>
                <th scope="col">Signed report</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b, i) => (
                <tr
                  key={b.batch}
                  className={s.reveal}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <th scope="row" className="mono">
                    {b.batch}
                  </th>
                  <td>
                    <span
                      className={`${s.verdict} ${
                        b.status === "published" ? s.cleared : s.pending
                      }`}
                    >
                      {b.status === "published" ? "Published" : "Pending"}
                    </span>
                  </td>
                  <td className="mono">
                    <time dateTime={b.publishedAt}>
                      {formatDate(b.publishedAt)}
                    </time>
                  </td>
                  <td>
                    <Link href={`/blog/${b.postSlug}`}>{b.postTitle}</Link>
                  </td>
                  <td>
                    {b.labReport ? (
                      <a href={b.labReport}>PDF</a>
                    ) : (
                      <span className={s.pendingCell}>Not yet published</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
