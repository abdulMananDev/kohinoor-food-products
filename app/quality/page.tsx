import Link from "next/link";
import s from "./quality.module.css";
import c from "../home.module.css";

export const revalidate = 2592000;

export const metadata = {
  /* Leads with the batch on sale, not with the advisory. A crawler or an
     answer engine reading title-first previously came away with "Batch 10
     advisory" as this page's subject; the advisory is context here, not the
     topic. It is still covered in full further down. */
  title: "Quality assurance and lab reports",
  description:
    "New Fast Tea Batch No. 12, the batch on sale now, was tested by an NABL-accredited laboratory for synthetic dyes. Seven dyes, all Not Detected, signed report published in full — along with what the panel did not cover.",
  /* Without this the root layout canonical ("/") is inherited and this
     page tells crawlers it is the homepage. */
  alternates: { canonical: "/quality" },
};

/* Transcribed from report OT/TEA/06-01/08/26, values exactly as printed.
   TODO: move into content/ once the schema settles — the flat
   one-JSON-per-batch shape does not cover a claim/response/result timeline
   involving two laboratories. */
const dyes = [
  "Brilliant Blue FCF",
  "Carmoisine",
  "Erythrosine",
  "Fast Green FCF",
  "Indigotine (Indigo Carmine)",
  "Ponceau 4R",
];

const FEATURED = "Sunset Yellow FCF";

const REPORT_PDF = "/reports/nft-batch-12-qss-OT-TEA-06-01-08-26.pdf";
const STATEMENT_PDF = "/reports/new-fast-tea-statement.pdf";

/* Hand-set, not new Date(): this is the date the status below was last
   true, not the date the page was rendered. A build stamp here would claim
   freshness the reports do not have. */
const STATUS_UPDATED = "2026-08-14";

/* The results read as cards rather than a table, so this carries the same
   values in a form answer engines and crawlers can still extract. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Synthetic dye analysis, New Fast Tea Batch No. 12",
  itemListElement: [FEATURED, ...dyes].map((name, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "PropertyValue",
      name,
      value: "Not Detected",
      measurementTechnique: "HPLC",
      description:
        'Specification "Should be Absent". Report OT/TEA/06-01/08/26, QSS Inspection and Testing Private Limited, 11.08.2026.',
    },
  })),
};

function ResultCard({
  name,
  featured = false,
  delay = 0,
  detected = false,
}: {
  name: string;
  featured?: boolean;
  delay?: number;
  /* Every parameter in this report came back Not Detected. The prop exists
     so that a future one that doesn't is a data change, not a redesign —
     the stripe turns red and the value changes with it. A results table
     that can only render "clear" is not evidence of anything. */
  detected?: boolean;
}) {
  return (
    <div
      className={`${s.card} ${featured ? s.cardFeatured : ""} ${s.reveal}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={s.cardCore} data-state={detected ? "detected" : "clear"}>
        <div>
          <p className={s.cardName}>{name}</p>
          {featured ? (
            <span className={s.cardFlag}>
              The compound the advisory named. Tested here, and not found.
            </span>
          ) : null}
        </div>
        <div className={s.cardResult}>
          <strong>{detected ? "Detected" : "Not Detected"}</strong>
          <span className={`${s.cardMeta} mono`}>
            HPLC &middot; Should be Absent
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Quality() {
  return (
    <main id="main" className={s.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <span className={s.eyebrow}>Transparency</span>
      <h1>The tea on sale now is Batch No. 12, tested and clear.</h1>
      <p className={s.lede}>
        Batch No. 12 was sent to an NABL-accredited laboratory for synthetic dye
        analysis and came back with all seven parameters Not Detected. The
        signed report is published below in full, together with the two things
        it does not settle: the panel did not include every dye, and the
        advisory that prompted it concerned an earlier batch.
      </p>

      {/* Declarative and scannable, immediately under the h1. Anything
          summarising this page — a crawler, an answer engine, a reader in a
          hurry — should reach the current status before it reaches the
          history. The gaps are in the same list as the results on purpose:
          a status block that only carries good news is not a status block. */}
      <section className={s.status} aria-labelledby="status-title">
        <div className={s.statusCore}>
          <h2 id="status-title">Current batch status</h2>
          <p className={s.statusWhen}>
            Last updated{" "}
            <time dateTime={STATUS_UPDATED} className="mono">
              14 August 2026
            </time>
            , when the Batch No. 12 report was published.
          </p>
          <ul className={s.statusList}>
            <li>
              <strong>Batch No. 12 is the batch in the market</strong>, packed
              25 July 2026 and shipping now.
            </li>
            <li>
              <strong>
                Seven synthetic dyes tested by HPLC, none detected.
              </strong>{" "}
              Report <span className="mono">OT/TEA/06-01/08/26</span>, QSS
              Inspection and Testing Private Limited, NABL{" "}
              <span className="mono">TC-17494</span>, ISO/IEC 17025:2017.
            </li>
            <li>
              <strong>Tartrazine was not in this panel.</strong> It is untested,
              which is not the same as a pass, and is not presented as one.
            </li>
            <li>
              <strong>A broader panel is still running</strong> through Sadekar
              Enviro Engineers Pvt. Ltd., NABL{" "}
              <span className="mono">TC-12207</span>. Its results will be
              published here whatever they show.
            </li>
            <li>
              <strong>The advisory concerned Batch No. 10</strong>, an earlier
              batch. It has not been retested, and nothing on this site is a
              claim about it.
            </li>
          </ul>
        </div>
      </section>

      <div className={s.figures}>
        <div className={`${s.figure} ${s.reveal}`}>
          <div className={s.figureCore}>
            <strong className="mono">7</strong>
            <span>synthetic dyes tested by HPLC</span>
          </div>
        </div>
        <div
          className={`${s.figure} ${s.reveal}`}
          style={{ animationDelay: "60ms" }}
        >
          <div className={s.figureCore}>
            <strong className="mono">0</strong>
            <span>detected in Batch No. 12</span>
          </div>
        </div>
        <div
          className={`${s.figure} ${s.reveal}`}
          style={{ animationDelay: "120ms" }}
        >
          <div className={s.figureCore}>
            <strong className="mono">1</strong>
            <span>broader panel still running</span>
          </div>
        </div>
      </div>

      <section className={s.section}>
        <h2>What the laboratory found</h2>
        <p className={s.sectionNote}>
          Every parameter in report OT/TEA/06-01/08/26, each tested by HPLC
          against a specification of &ldquo;Should be Absent&rdquo;.
        </p>

        <div className={s.results}>
          <ResultCard name={FEATURED} featured />
          {dyes.map((d, i) => (
            <ResultCard key={d} name={d} delay={80 + i * 50} />
          ))}
        </div>

        <div className={s.provenance}>
          <div className={s.provenanceCore}>
            <div className={s.provHead}>
              <div>
                <h3>
                  Report No. <span className="mono">OT/TEA/06-01/08/26</span>
                </h3>
                <p>
                  Issued 11.08.2026 by QSS Inspection and Testing Private
                  Limited
                </p>
              </div>
              <span className={s.verdict}>Batch 12, dye panel: clear</span>
            </div>

            <dl className={s.meta}>
              <div>
                <dt>Batch</dt>
                <dd>New Fast Tea, No. 12</dd>
              </div>
              <div>
                <dt>Packed</dt>
                <dd className="mono">25.07.2026</dd>
              </div>
              <div>
                <dt>Sample received</dt>
                <dd className="mono">06.08.2026</dd>
              </div>
              <div>
                <dt>Analysis</dt>
                <dd className="mono">06.08 to 11.08.2026</dd>
              </div>
              <div>
                <dt>Discipline</dt>
                <dd>Chemical, Beverages</dd>
              </div>
              <div>
                <dt>Submitted by</dt>
                <dd>Customer</dd>
              </div>
            </dl>

            <div className={s.provFoot}>
              <p>
                The laboratory&rsquo;s own conclusion, as printed:{" "}
                <strong>
                  Based on the above results, the New Fast Tea is safe for
                  consumption.
                </strong>{" "}
                QSS is accredited by NABL under certificate no.{" "}
                <span className="mono">TC-17494</span> to ISO/IEC 17025:2017,
                valid until <span className="mono">26/02/2027</span>.
              </p>
              <div className={s.provActions}>
                <a className={s.action} href={REPORT_PDF}>
                  <span>Read the signed report</span>
                  <span className={s.actionIcon} aria-hidden>
                    &#8599;
                  </span>
                </a>
                <Link className={s.provWriteup} href="/blog/batch-12-results">
                  Read the full write-up &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className={s.scope}>
          <div className={s.scopeCore}>
            <h3>What this panel did not cover</h3>
            <p>
              Tartrazine is not among the seven parameters in this report. This
              round covered Sunset Yellow FCF and six other dyes. If the
              advisory named Tartrazine specifically, that compound has not been
              tested yet. The broader panel below is intended to cover it, and
              we will publish those results here whatever they show.
            </p>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <h2>How this unfolded</h2>

        <div className={s.timeline}>
          <div className={s.entry}>
            <div className={s.when}>
              {/* TODO: real advisory date, not supplied. Precedes 25 July 2026. */}
              <span>Date TODO</span>
            </div>
            <div className={s.what}>
              <h3>An advisory is issued regarding Batch No. 10</h3>
              <p>
                It raised concern about synthetic colouring agents, Sunset
                Yellow FCF among them, in the instant mix. It concerned Batch
                No. 10 specifically. That batch has not been retested, and
                nothing on this page claims otherwise.
              </p>
            </div>
          </div>

          <div className={s.entry}>
            <div className={s.when}>
              <time dateTime="2026-07-25">25 July 2026</time>
            </div>
            <div className={s.what}>
              <h3>Batch No. 12 is packed</h3>
              <p>
                A later production batch, packed after the advisory. This is the
                batch that was sent for analysis.
              </p>
            </div>
          </div>

          <div className={s.entry}>
            <div className={s.when}>
              <time dateTime="2026-08-06">06.08.2026</time>
            </div>
            <div className={s.what}>
              <h3>We meet our legal advisor and an accredited laboratory</h3>
              <p>
                M/s INAAM Tea Agency held a joint meeting with our legal advisor
                and Sadekar Enviro Engineers Pvt. Ltd. Testing Laboratory about
                the advisory, and submitted a fresh sample of Batch No. 12 for
                analysis. Separately, a sample was received by QSS Inspection
                and Testing Private Limited the same day.{" "}
                <a href={STATEMENT_PDF}>Read our statement in full</a>.
              </p>
            </div>
          </div>

          <div className={s.entry}>
            <div className={s.when}>
              <time dateTime="2026-08-11">06.08 to 11.08.2026</time>
            </div>
            <div className={s.what}>
              <h3>Seven dyes tested, none detected</h3>
              <p>
                The results are above, with the signed report linked alongside
                them. The full write-up — what the panel covered, what it did
                not, and why Batch No. 12 is not Batch No. 10 — is at{" "}
                <Link href="/blog/batch-12-results">
                  Batch No. 12: seven dyes tested, none detected
                </Link>
                .
              </p>
            </div>
          </div>

          <div className={s.entry}>
            <div className={s.when}>
              <time dateTime="2026-08-06">Commissioned 06.08.2026</time>
            </div>
            <div className={s.what}>
              <h3>A broader analysis is still running</h3>
              <p>
                A second analysis of Batch No. 12 was commissioned through
                Sadekar Enviro Engineers Pvt. Ltd. Testing Laboratory, which
                holds NABL certificate no.{" "}
                <span className="mono">TC-12207</span> and fulfils FSSAI
                requirements.
              </p>
              <div className={s.pending}>
                <span className={s.pendingLabel}>In progress</span>
                <p>
                  Results expected 10 to 15 working days from 06.08.2026.
                  Nothing has been reported yet. This entry will carry the
                  findings when they arrive.
                </p>
              </div>
            </div>
          </div>

          <div className={s.entry}>
            <div className={s.when}>
              <span>Ongoing</span>
            </div>
            <div className={s.what}>
              <h3>Every batch is tested before it is sold</h3>
              <p>
                Our published commitment: sales of all fresh batches commence
                only after satisfactory test reports are received from an
                NABL-accredited laboratory, and where applicable the necessary
                certification. Every report is published alongside the numbers.{" "}
                <Link href="/transparency">See all batch results</Link>.
              </p>
              <p>
                <Link href="/press">See press coverage &rarr;</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
