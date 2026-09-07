import type { Metadata } from "next";
import Link from "next/link";
import { mentionsByDate } from "@/lib/press";
import s from "./press.module.css";

export const revalidate = 2592000; // 30 days — coverage lands rarely

export const metadata: Metadata = {
  title: "Press & Recognition",
  description:
    "Press coverage and third-party recognition of New Fast Tea — outside write-ups about the tea, the packing, and the testing, each linked to the original.",
  alternates: { canonical: "/press" },
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));

export default function Press() {
  const items = mentionsByDate();

  return (
    <main id="main" className={s.page}>
      <span className={s.eyebrow}>Press &amp; Recognition</span>
      <h1>What other people have written about us.</h1>
      <p className={s.lede}>
        Coverage we did not write. Each entry links to the original so you can
        read it where it was published rather than take our summary for it. The
        summaries below are ours, not the publication&rsquo;s.
      </p>

      {items.length === 0 ? (
        <p className={s.empty}>No coverage published here yet.</p>
      ) : (
        <ul className={s.list}>
          {items.map((m) => (
            <li key={m.url} className={s.entry}>
              <p className={s.meta}>
                <span className={s.source}>{m.source}</span>
                {m.date ? (
                  <time className={`${s.when} mono`} dateTime={m.date}>
                    {formatDate(m.date)}
                  </time>
                ) : null}
              </p>
              <a
                className={s.title}
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {m.title}
                <span className={s.titleIcon} aria-hidden>
                  &#8599;
                </span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <p className={s.excerpt}>{m.excerpt}</p>
            </li>
          ))}
        </ul>
      )}

      <p className={s.foot}>
        The claims these pieces describe are the ones we publish evidence for:
        every batch goes to an accredited laboratory before it is sold, and the
        signed reports are on <Link href="/quality">the quality page</Link>.
      </p>
    </main>
  );
}
