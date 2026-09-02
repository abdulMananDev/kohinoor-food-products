import Link from "next/link";
import s from "../page-shell.module.css";

export const metadata = {
  title: "About",
  description:
    "New Fast Tea is packed and distributed by M/s INAAM Tea Agency in Thane, Maharashtra, from Assam-origin leaf. What we do, what we don't, and how to reach us.",
};

const facts = [
  { k: "Distributed by", v: "M/s INAAM Tea Agency" },
  { k: "Based in", v: "Thane, Maharashtra" },
  { k: "Leaf origin", v: "Assam" },
  { k: "Grades", v: "BP · Siliguri · South B.O.P." },
  { k: "Testing", v: "NABL-accredited laboratories" },
];

export default function About() {
  return (
    <main id="main" className={s.page}>
      <header className={s.head}>
        <span className={s.eyebrow}>About</span>
        <h1>A packing and distribution agency, not a plantation.</h1>
        <p className={s.lede}>
          It is worth being precise about what we are, because most tea
          companies are vague about it and the difference matters when
          something goes wrong.
        </p>
      </header>

      <div className={s.prose}>
        <p>
          New Fast Tea is packed and distributed by M/s INAAM Tea Agency from
          Thane, Maharashtra. We buy Assam-origin leaf in BP, Siliguri and South
          B.O.P. grades, blend it, pack it as instant mix and loose leaf, and
          move it out to shops and households.
        </p>
        <p>
          We do not own gardens and we have never claimed to. What we control is
          the part after the leaf leaves Assam: which lots we buy, how they are
          stored, what goes into the blend, and how clean the packing line is.
          Every one of those is a place where a tea can be adulterated, and
          every one of them is ours to answer for.
        </p>

        <h2>Why this site is mostly about testing</h2>
        <p>
          An advisory was raised suggesting our instant mix contained synthetic
          colouring. We disagreed, but disagreeing is cheap. So we sent a batch
          to an NABL-accredited laboratory, and we publish what came back —
          including the parts that are incomplete.
        </p>
        <p>
          The commitment we have put in writing is simple: sales of a fresh
          batch begin only after satisfactory test reports are received from an
          NABL-accredited laboratory. The reports go up here either way.{" "}
          <Link href="/quality">Read the current results</Link>.
        </p>

        <h2 id="contact">Contact</h2>
        <p>
          {/* TODO: real contact details — not supplied. Do not invent an
              address, phone number or email on a page about credibility. */}
          Contact details to be published here. If you are writing about a
          specific batch, quote the batch number printed on the packet.
        </p>
      </div>

      <dl className={s.facts}>
        {facts.map((f) => (
          <div key={f.k}>
            <dt>{f.k}</dt>
            <dd>{f.v}</dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
