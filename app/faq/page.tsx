import Link from "next/link";
import { SITE_URL } from "@/lib/content";
import { faq, answerText, type FaqItem } from "@/lib/faq";
import FaqCards from "../components/faq-cards";
import s from "../page-shell.module.css";

export const revalidate = 2592000;

export const metadata = {
  /* absolute: the requested title already carries the brand, and the root
     template would otherwise append it twice. */
  title: { absolute: "Frequently Asked Questions | New Fast Tea" },
  description:
    "Batch-specific answers about New Fast Tea: which batch the advisory named, which batch is on sale now, what the laboratory tested it for, and where to read the signed report.",
  alternates: { canonical: "/faq" },
};

/* Stable anchors, so a single answer can be linked to directly — which is
   what anyone correcting a search result actually needs to send. */
const slug = (f: FaqItem) => `q-${f.id}`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/faq#faq`,
  mainEntity: faq
    .filter((f) => !f.incomplete)
    .map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: answerText(f.a) },
    })),
};

export default function Faq() {
  return (
    <main id="main" className={s.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\u003c"),
        }}
      />

      <header className={s.head}>
        <span className={s.eyebrow}>Questions</span>
        <h1>Frequently asked questions</h1>
        <p className={s.lede}>
          Answers to what people are actually asking, with the batch number
          named in every one of them. Each answer is checkable against{" "}
          <Link href="/quality">the quality page</Link> and{" "}
          <Link href="/blog/batch-12-results">the Batch No. 12 report</Link>,
          which are the sources for everything below.
        </p>
      </header>

      <FaqCards items={faq} slug={slug} />
    </main>
  );
}
