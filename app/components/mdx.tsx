import Link from "next/link";
import type { ReactNode } from "react";
import { formatDate } from "@/lib/content";
import s from "./mdx.module.css";

/* Components available inside MDX. All server components — nothing here
   hydrates, so reading a post costs zero client JS. */

/* ---- lab results ------------------------------------------------------ */

/* Four states, not two. The important one is `not-tested`: a panel that
   didn't cover an analyte is the single most misleading thing a results
   table can hide, so it is rendered as an explicit, visually distinct row
   and never with the pass treatment. `exceeded` exists so the component is
   capable of reporting a failure — a table that can only render "clear" is
   not evidence of anything. */
export type LabState =
  | "not-detected"
  | "within-limit"
  | "exceeded"
  | "not-tested";

const STATE_LABEL: Record<LabState, string> = {
  "not-detected": "Not detected",
  "within-limit": "Within limit",
  exceeded: "Over limit",
  "not-tested": "Not tested",
};

export function LabTable({
  children,
  caption,
}: {
  children: ReactNode;
  caption?: string;
}) {
  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        {caption ? <caption className={s.caption}>{caption}</caption> : null}
        <thead>
          <tr>
            <th scope="col">Analyte</th>
            <th scope="col">Method</th>
            <th scope="col">Result</th>
            <th scope="col">Limit</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function LabResult({
  analyte,
  method,
  result,
  limit,
  state,
  note,
}: {
  analyte: string;
  method: string;
  /** As printed on the report. Omitted for not-tested. */
  result?: string;
  limit?: string;
  state: LabState;
  note?: string;
}) {
  const untested = state === "not-tested";

  return (
    <tr className={s.row} data-state={state}>
      {/* data-label drives the stacked mobile layout, so the table needs no
          horizontal scroll on a phone. */}
      <th scope="row" data-label="Analyte" className={s.analyte}>
        {analyte}
        {note ? <span className={s.note}>{note}</span> : null}
      </th>
      <td data-label="Method" className="mono">
        {method}
      </td>
      <td data-label="Result" className="mono">
        {untested ? <span className={s.absent}>&mdash;</span> : result}
      </td>
      <td data-label="Limit" className="mono">
        {limit ?? <span className={s.absent}>&mdash;</span>}
      </td>
      <td data-label="Status">
        <span className={s.status} data-state={state}>
          {STATE_LABEL[state]}
        </span>
      </td>
    </tr>
  );
}

/* ---- report link ------------------------------------------------------ */

export function ReportLink({
  href,
  lab,
  reportNumber,
  date,
}: {
  href: string;
  lab: string;
  reportNumber: string;
  /** ISO. */
  date: string;
}) {
  return (
    <a className={s.report} href={href}>
      <span className={s.reportMain}>
        <span className={s.reportLab}>{lab}</span>
        <span className={`${s.reportNo} mono`}>{reportNumber}</span>
      </span>
      <span className={s.reportMeta}>
        <time dateTime={date}>{formatDate(date)}</time>
        <span className={s.reportCta}>
          Read the signed report
          <span aria-hidden>&#8599;</span>
        </span>
      </span>
    </a>
  );
}

/* ---- timeline --------------------------------------------------------- */

export function Timeline({ children }: { children: ReactNode }) {
  return <ol className={s.timeline}>{children}</ol>;
}

export function TimelineEntry({
  date,
  title,
  children,
  pending = false,
}: {
  /** ISO, or omit for an entry with no fixed date. */
  date?: string;
  title: string;
  children?: ReactNode;
  pending?: boolean;
}) {
  return (
    <li className={s.entry} data-pending={pending || undefined}>
      <div className={s.when}>
        {date ? (
          <time dateTime={date}>{formatDate(date)}</time>
        ) : (
          <span>Date not stated</span>
        )}
      </div>
      <div className={s.what}>
        <h3 className={s.entryTitle}>{title}</h3>
        {children}
        {pending ? <p className={s.pending}>Result still outstanding.</p> : null}
      </div>
    </li>
  );
}

/* ---- disclosure ------------------------------------------------------- */

/* For stated limitations and gaps. Deliberately not styled as a warning and
   not boxed — this is the site volunteering something against its own
   interest, and dressing it as an alert would read as alarm while boxing it
   would read as an aside to be skipped. It is set as part of the document,
   at body strength. */
export function Disclosure({
  title = "What this does not cover",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className={s.disclosure}>
      <h3 className={s.disclosureTitle}>{title}</h3>
      <div className={s.disclosureBody}>{children}</div>
    </aside>
  );
}

/* ---- the map handed to MDXRemote -------------------------------------- */

export const mdxComponents = {
  LabTable,
  LabResult,
  ReportLink,
  Timeline,
  TimelineEntry,
  Disclosure,
  // Internal links go through next/link; external ones stay plain anchors.
  a: ({ href = "", ...rest }: { href?: string } & Record<string, unknown>) =>
    href.startsWith("/") ? (
      <Link href={href} {...rest} />
    ) : (
      <a href={href} {...rest} />
    ),
};
