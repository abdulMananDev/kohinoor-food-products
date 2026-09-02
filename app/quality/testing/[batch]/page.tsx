import { notFound } from "next/navigation";
import { allBatches, getBatch, verdict, share, display } from "@/lib/batch";
import s from "../ledger.module.css";

export const revalidate = 2592000;
export const dynamicParams = false;

export const generateStaticParams = async () =>
  allBatches().map((b) => ({ batch: b.batchId }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ batch: string }>;
}) {
  const b = getBatch((await params).batch);
  if (!b) return {};
  return {
    title: `Batch ${b.batchId} test results — New Fast Tea`,
    description: `Laboratory results for New Fast Tea batch ${b.batchId}, harvested ${b.harvest}, tested ${b.testedOn}: ${b.parameters.length} parameters against ${b.parameters[0].standard} limits.`,
  };
}

export default async function BatchPage({
  params,
}: {
  params: Promise<{ batch: string }>;
}) {
  const b = getBatch((await params).batch);
  if (!b) notFound();
  const v = verdict(b);

  return (
    <main id="main" className={s.page}>
      <div className={s.ledger}>
        <dl className={s.spine}>
          <dt>Batch</dt>
          <dd className="mono">{b.batchId}</dd>
          <dt>Harvest</dt>
          <dd className="mono">{b.harvest}</dd>
          <dt>Tested</dt>
          <dd className="mono">{b.testedOn}</dd>
          <dt>Laboratory</dt>
          <dd>
            {b.lab.name}
            <br />
            <span className="mono">{b.lab.accreditation}</span>
          </dd>
          <dt>Verdict</dt>
          <dd>
            <span className={`${s.verdict} ${s[v]}`}>
              {v === "cleared" ? "Cleared" : "Restricted"}
            </span>
          </dd>
        </dl>

        <div>
          <h1>Batch {b.batchId}</h1>
          <p className={s.prose}>
            Every parameter tested on this batch, the limit it was measured
            against, and how close the result sits to that limit. The signed
            laboratory report is linked below as verification — these numbers
            are transcribed from it, not summarised.
          </p>

          <div className={s.panel} style={{ marginTop: "var(--s6)" }}>
            <table className={s.table}>
              <caption>
                {b.parameters.length} parameters, tested {b.testedOn} by{" "}
                {b.lab.name}.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Parameter</th>
                  <th scope="col" className={s.num}>Result</th>
                  <th scope="col" className={s.num}>Limit</th>
                  <th scope="col">Standard</th>
                  <th scope="col">Share of limit</th>
                </tr>
              </thead>
              <tbody>
                {b.parameters.map((p, i) => (
                  <tr
                    key={p.name}
                    className={s.reveal}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <th scope="row">{p.name}</th>
                    <td className={`${s.num} mono`}>
                      {display(p)} {p.unit}
                    </td>
                    <td className={`${s.num} mono`}>
                      {p.limit} {p.unit}
                    </td>
                    <td>{p.standard}</td>
                    <td>
                      <span
                        className={s.bar}
                        role="img"
                        aria-label={`${Math.round(share(p) * 100)}% of the ${p.standard} limit`}
                      >
                        <span style={{ width: `${share(p) * 100}%` }} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className={s.report} style={{ marginTop: "var(--s5)" }}>
            <a href={b.lab.reportUrl}>
              Signed laboratory report for {b.batchId} (PDF)
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
