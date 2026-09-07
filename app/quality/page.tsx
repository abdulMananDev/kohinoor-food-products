import Link from "next/link";
import { SITE_URL } from "@/lib/content";
import s from "./quality.module.css";
import c from "../home.module.css";

export const revalidate = 2592000;

export const metadata = {
  /* Leads with the batch on sale, not with the advisory. A crawler or an
     answer engine reading title-first previously came away with "Batch 10
     advisory" as this page's subject; the advisory is context here, not the
     topic. It is still covered in full further down.

     It also has to be visibly a different page from the Batch 12 write-up,
     which competes for the same words. That post is titled as a dated
     finding ("seven dyes tested, none detected"); this one is titled as a
     standing status, which is the question it actually answers and the one
     the h1 below answers too. The old "Quality assurance and lab reports"
     matched neither its own h1 nor any question a reader asks. */
  title: "Batch No. 12 is the tea on sale now, and it is clear",
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

const PANEL_ID = `${SITE_URL}/quality#dye-panel`;
const WRITEUP_ID = `${SITE_URL}/blog/batch-12-results#article`;

/* The results read as cards rather than a table, so this carries the same
   values in a form answer engines and crawlers can still extract.
 *
 * `subjectOf` is the half that matters for this page's relationship to the
 * Batch 12 write-up. Both pages carry these seven results and both name the
 * batch in their heading, which without a stated relationship reads as two
 * pages competing for one query. Stated, it reads as what it is: one result
 * set, and the article written about it. The write-up points back with
 * `about`. */
const dyePanel = {
  "@type": "ItemList",
  "@id": PANEL_ID,
  name: "Synthetic dye analysis, New Fast Tea Batch No. 12",
  subjectOf: { "@id": WRITEUP_ID },
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

/* 4. The questions this page answers that the write-up deliberately does
   not: which batch is in my hand, and where is its paperwork. The write-up
   owns the findings questions ("what did the report say", "was Tartrazine
   tested"). Splitting them this way is the same separation the titles make,
   said again in a form an answer engine can lift.

   Every answer below is rendered verbatim in the FAQ section at the foot of
   the page, alongside its question. */
const faq = [
  {
    q: "Which batch of New Fast Tea is on sale right now?",
    a: "Batch No. 12, packed on 25 July 2026. It is the batch shipping to shops and households now, and it is the batch the published dye analysis was run on.",
  },
  {
    q: "Where can I read the lab report for the New Fast Tea I am buying?",
    a: "The signed report for Batch No. 12, OT/TEA/06-01/08/26 from QSS Inspection and Testing Private Limited, is published in full on this page as a PDF. Every batch report New Fast Tea has published is listed at newfasttea.com/transparency.",
  },
  {
    q: "Is New Fast Tea still selling the batch the advisory named?",
    a: "No. The advisory concerned Batch No. 10. The batch on sale is Batch No. 12, a later production batch packed after the advisory. Batch No. 10 has not been retested and New Fast Tea makes no claim about it.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    dyePanel,
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/quality#faq`,
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
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
              <span className="mono">TC-12207</span>, commissioned 6 August 2026
              with results expected in 10 to 15 working days. Nothing has been
              reported yet. Its results will be published here whatever they
              show.
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

      {/* The chronology used to be duplicated here, entry for entry, from
          the Batch 12 write-up — same events, same dates, reworded. Two
          pages telling one story is two pages competing for it, and a
          reader who spots the wording drift between them has been given a
          reason to doubt both. The write-up is the dated record and keeps
          it; this page keeps the standing commitment, which is the part
          that is about every batch rather than about this one. */}
      <section className={s.section}>
        <h2>The record, and the commitment</h2>
        <p className={s.sectionNote}>
          The dated chronology — the advisory, the packing of Batch No. 12 on 25
          July 2026, both laboratory submissions on 6 August — is kept as a
          single record in{" "}
          <Link href="/blog/batch-12-results">
            Batch No. 12: seven dyes tested, none detected
          </Link>
          , so there is one version of it rather than two.{" "}
          <a href={STATEMENT_PDF}>Read our statement in full</a>.
        </p>

        <div className={s.scope}>
          <div className={s.scopeCore}>
            <h3>Every batch is tested before it is sold</h3>
            <p>
              Our published commitment: sales of all fresh batches commence only
              after satisfactory test reports are received from an
              NABL-accredited laboratory, and where applicable the necessary
              certification. Every report is published alongside the numbers.{" "}
              <Link href="/transparency">See all batch results</Link>, or{" "}
              <Link href="/press">see press coverage</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Answers to the two things someone holding a packet actually wants
          to know. Deliberately not the findings questions — those belong to
          the write-up, and answering them in both places is how the two
          pages ended up competing in the first place. Same text as the
          FAQPage markup at the top of this file. */}
      <section className={s.section} aria-labelledby="faq-title">
        <h2 id="faq-title">Questions we get asked</h2>
        <dl className={s.faq}>
          {faq.map((f) => (
            <div key={f.q}>
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
