/* The FAQ content, in one place because three pages render subsets of it:
   /faq (all of it), the homepage (two entries, above the fold) and the
   JSON-LD on both. When these lived as separate string literals per page
   they were already drifting apart, on a site whose entire argument is that
   its statements match each other.

   An answer is paragraphs, and a paragraph is a run of text and links,
   rather than one long string. Two reasons: the answers had grown into
   walls nobody reads, and a URL written out as prose ("newfasttea.com/
   quality") is not a link — it is a thing the reader has to retype. The
   same structure produces the visible markup and the schema text, so they
   cannot disagree.

   Sourcing: everything here is checkable against /quality and
   /blog/batch-12-results, except that Batch No. 10 was banned and its stock
   withdrawn, which was supplied directly by the operator. No date or
   issuing authority is named for the ban because none was supplied. Do not
   add one without a document to cite. */

export type FaqPart = string | { text: string; href: string };
export type FaqAnswer = FaqPart[][];

export type FaqItem = {
  id: string;
  q: string;
  a: FaqAnswer;
  /* Set when an answer cannot be written in full from a verified source.
     Renders as visibly unfinished and is held out of the JSON-LD — a
     placeholder published as an acceptedAnswer would be both broken markup
     and a false answer. None are outstanding; the flag stays so the next
     unanswerable question fails this way rather than being guessed at. */
  incomplete?: boolean;
};

const QUALITY = { text: "the quality page", href: "/quality" };
const TRANSPARENCY = { text: "the transparency page", href: "/transparency" };
const WRITEUP = {
  text: "the Batch No. 12 write-up",
  href: "/blog/batch-12-results",
};

export const faq: FaqItem[] = [
  {
    id: "banned",
    q: "Is New Fast Tea banned?",
    a: [
      ["No. The brand is not banned, and the batch on sale is not banned."],
      [
        "What was banned is Batch No. 10, a single earlier batch. That stock has been withdrawn from the market.",
      ],
      [
        "The batch on sale now is Batch No. 12, packed on 25 July 2026, after the advisory that concerned Batch No. 10. It was tested by an NABL-accredited laboratory for seven synthetic dyes, and none were detected.",
      ],
    ],
  },
  {
    id: "advisory",
    q: "What did the advisory concerning Batch No. 10 say?",
    a: [
      [
        "It raised concern about synthetic colouring agents in the New Fast Tea instant mix, Sunset Yellow FCF among them.",
      ],
      ["It concerned Batch No. 10, and no other batch."],
    ],
  },
  {
    id: "affected-batch",
    q: "What happened to the affected batch?",
    a: [
      [
        "Batch No. 10 was banned, and that stock has been withdrawn from the market.",
      ],
    ],
  },
  {
    id: "current-batch",
    q: "What batch is being sold now?",
    a: [
      ["Batch No. 12, packed on 25 July 2026."],
      [
        "It is a later production batch than Batch No. 10, packed after the advisory. It is the batch shipping to shops and households now, and it is the batch the published dye analysis was run on.",
      ],
    ],
  },
  {
    id: "tested",
    q: "Was the current batch tested?",
    a: [
      [
        "Yes. Batch No. 12 was tested by QSS Inspection and Testing Private Limited, an NABL-accredited laboratory holding certificate TC-17494 to ISO/IEC 17025:2017.",
      ],
      [
        "Seven synthetic dyes were each tested by HPLC against a specification of absent: Sunset Yellow FCF, Brilliant Blue FCF, Carmoisine, Erythrosine, Fast Green FCF, Indigotine (Indigo Carmine) and Ponceau 4R. All seven returned Not Detected, in report OT/TEA/06-01/08/26 dated 11 August 2026.",
      ],
      [
        "Tartrazine was not among the seven parameters in that report, so it is untested rather than cleared.",
      ],
    ],
  },
  {
    id: "lab-report",
    q: "Can I see the actual lab report?",
    a: [
      ["Yes, in full, not as a summary."],
      [
        "The signed report for Batch No. 12, OT/TEA/06-01/08/26 from QSS Inspection and Testing Private Limited, is published as a PDF on ",
        QUALITY,
        ".",
      ],
      [
        "Every batch report New Fast Tea has published is listed on ",
        TRANSPARENCY,
        ".",
      ],
    ],
  },
  {
    id: "future-batches",
    q: "Will future batches be tested too?",
    a: [
      [
        "Yes. Every batch is tested before it is sold, and that applies to every future batch without exception.",
      ],
      [
        "The published commitment is that sales of a fresh batch commence only after satisfactory test reports are received from an NABL-accredited laboratory, and where applicable the necessary certification. Every report is published alongside the numbers, whether it passes or fails.",
      ],
      [
        "A broader panel on Batch No. 12 is also outstanding, commissioned on 6 August 2026 through Sadekar Enviro Engineers Pvt. Ltd. Testing Laboratory, NABL certificate TC-12207, with results stated at the time as expected in 10 to 15 working days. No results from it have been published yet, and they will be published whatever they show.",
      ],
    ],
  },
  {
    id: "check-yourself",
    q: "Where can I check all of this myself?",
    a: [
      ["Four places, none of which require taking our word for anything."],
      [
        "The signed PDF of report OT/TEA/06-01/08/26 is linked in full on ",
        QUALITY,
        ", alongside the current batch status.",
      ],
      [
        "The dated record of what happened, and the full result table, is in ",
        WRITEUP,
        ".",
      ],
      ["Every batch report published so far is listed on ", TRANSPARENCY, "."],
      [
        "If you have not read a lab report before, ",
        {
          text: "how to read an NABL lab report",
          href: "/blog/how-to-read-an-nabl-lab-report",
        },
        " walks through what each field on the PDF means, and how to verify the accreditation yourself.",
      ],
    ],
  },
];

/* The schema string for one answer. Plain text, not HTML: the link
   destinations are already crawlable as real anchors in the page body, and
   a plain string is one less thing that can disagree with what is on
   screen. Joined with a space so it matches the rendered text once
   whitespace is collapsed. */
export const answerText = (a: FaqAnswer) =>
  a
    .map((p) => p.map((x) => (typeof x === "string" ? x : x.text)).join(""))
    .join(" ");

export const pick = (...ids: string[]) =>
  ids.map((id) => {
    const item = faq.find((f) => f.id === id);
    if (!item) throw new Error(`No FAQ entry with id "${id}"`);
    return item;
  });
