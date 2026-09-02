import Link from "next/link";
import { allBatches, verdict } from "@/lib/batch";
import s from "./ledger.module.css";

export const revalidate = 2592000; // 30 days — batches land monthly at most

export const metadata = {
  title: "Batch test results",
  description:
    "Every New Fast Tea batch, with the full lab report for heavy metals and pesticide residues.",
  /* Without this the root layout canonical ("/") is inherited and this
     page tells crawlers it is the homepage. */
  alternates: { canonical: "/quality/testing" },
};

export default function TestingIndex() {
  const batches = allBatches();

  return (
    <main id="main" className={s.page}>
      <h1>Batch test results</h1>
      <p className={s.prose}>
        Every batch we sell is tested by an accredited laboratory before it
        ships. The full parameter list, the limit each result is measured
        against, and the signed report are published here — passing or not.
      </p>

      <div className={s.panel} style={{ marginTop: "var(--s7)" }}>
        {batches.length === 0 ? (
          <p className={s.empty}>
            {/* TODO: remove once Batch 12 is in content/batches/ — pending the
                schema reshape for qualitative results and multiple reports. */}
            This index is not populated yet. The published Batch No. 12
            analysis, with the full dye panel and the signed report, is on{" "}
            <Link href="/quality">the quality page</Link>.
          </p>
        ) : (
          <table className={s.table}>
            <caption>{batches.length} batches, most recently tested first.</caption>
            <thead>
              <tr>
                <th scope="col">Batch</th>
                <th scope="col">Harvest</th>
                <th scope="col">Tested</th>
                <th scope="col">Laboratory</th>
                <th scope="col">Parameters</th>
                <th scope="col">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b, i) => (
                <tr
                  key={b.batchId}
                  className={s.reveal}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <th scope="row" className="mono">
                    <Link href={`/quality/testing/${b.batchId}`}>{b.batchId}</Link>
                  </th>
                  <td className="mono">{b.harvest}</td>
                  <td className="mono">{b.testedOn}</td>
                  <td>{b.lab.name}</td>
                  <td className={`${s.num} mono`}>{b.parameters.length}</td>
                  <td>
                    <span className={`${s.verdict} ${s[verdict(b)]}`}>
                      {verdict(b) === "cleared" ? "Cleared" : "Restricted"}
                    </span>
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
