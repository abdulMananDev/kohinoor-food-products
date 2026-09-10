import Link from "next/link";
import type { FaqAnswer, FaqItem } from "@/lib/faq";
import s from "./faq-cards.module.css";

export type { FaqItem };

/* A definition list, not a set of <details>: an answer you have to click to
   open is an answer a crawler and a hurried reader both miss, which is the
   whole reason these questions exist.

   The answer renders as short paragraphs with the first set apart, so the
   direct answer ("No.", "Yes.", "Batch No. 12") is readable on its own and
   the qualifications follow underneath. They used to be single paragraphs
   of six or seven sentences, which on a page people arrive at mid-panic is
   the same as no answer at all. */
export default function FaqCards({
  items,
  id,
  slug,
}: {
  items: FaqItem[];
  id?: string;
  /* Optional per-question anchor, so a single answer can be linked to
     directly — what anyone correcting a search result actually needs to
     send. Only /faq passes it; the homepage and /quality excerpts must not
     mint competing ids for the same questions. */
  slug?: (item: FaqItem) => string;
}) {
  return (
    <dl className={s.grid} id={id}>
      {items.map((f, i) => (
        <div
          key={f.id}
          className={s.card}
          data-state={f.incomplete ? "incomplete" : undefined}
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className={s.core}>
            <dt className={s.q} id={slug?.(f)}>
              {f.q}
            </dt>
            <dd className={s.a}>
              <Answer a={f.a} />
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

function Answer({ a }: { a: FaqAnswer }) {
  return (
    <>
      {a.map((para, i) => (
        <p key={i} className={i === 0 ? s.lead : undefined}>
          {para.map((part, j) =>
            typeof part === "string" ? (
              part
            ) : (
              <Link key={j} href={part.href} className={s.link}>
                {part.text}
              </Link>
            ),
          )}
        </p>
      ))}
    </>
  );
}
