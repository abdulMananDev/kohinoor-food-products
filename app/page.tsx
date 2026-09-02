import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, OG_IMAGE } from "@/lib/content";
import HeroVideo from "./hero-video";
import Hero from "./hero";
import Image from "next/image";
import { product, formatPrice, formatWeight } from "@/lib/products";
import s from "./home.module.css";

/* Section rhythm, deliberately no two consecutive alike:
   1 hero      the meadow, full bleed, the page's only h1
   2 proof     four-up figure strip — the reason this site exists
   3 products  cards, 3-across
   4 sourcing  full-bleed --deep, text offset right
   5 ritual    reversed split, video left, on --sunk
   6 closing   the only centred block on the page                        */

export const metadata: Metadata = {
  title: "Assam tea, tested batch by batch",
  description:
    "Instant mix and loose leaf blended from Assam-origin tea, packed in Thane. Every batch is tested by an NABL-accredited laboratory and every report is published in full.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "New Fast Tea — Assam tea, tested batch by batch",
    description:
      "Every batch is tested by an NABL-accredited laboratory and every report is published in full.",
    siteName: SITE_NAME,
    locale: "en_IN",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
};

const figures = [
  { value: "7", label: "dyes tested by HPLC", sub: "Batch No. 12" },
  { value: "0", label: "detected", sub: "specification: absent" },
  { value: "2", label: "accredited laboratories", sub: "NABL, ISO/IEC 17025" },
  { value: "100%", label: "of batches published", sub: "pass or fail" },
];

export default function Home() {
  return (
    <main id="main">
      <Hero />

      {/* The proof strip sits directly under the hero on purpose. Someone who
          arrived from a rumour should not have to scroll to find the answer. */}

      {/* One SKU in two pack sizes, so this is a single offer rather than a
          card grid. The three-product strip that used to sit here was
          placeholder data for products that do not exist. */}
      <section className={s.products} aria-labelledby="products-title">
        <div className={s.inner}>
          <div className={s.sectionHead}>
            <div>
              <span className={s.eyebrow}>What we sell</span>
              <h2 id="products-title">One tea, two pack sizes.</h2>
            </div>
          </div>

          <Link href="/products" className={s.offer}>
            <span className={s.offerMedia}>
              <Image
                src={product.image}
                alt=""
                width={1400}
                height={784}
                sizes="(min-width: 900px) 45vw, 100vw"
              />
            </span>
            <span className={s.offerBody}>
              <span className={s.offerName}>{product.name}</span>
              <span className={s.offerPrices}>
                {product.variants.map((v) => (
                  <span key={v.weightGrams} className={s.offerPrice}>
                    <span className={s.offerWeight}>
                      {formatWeight(v.weightGrams)}
                    </span>
                    <span className="mono">{formatPrice(v.price)}</span>
                  </span>
                ))}
              </span>
              <span className={s.offerCta}>
                View the product
                <span className={s.cardArrow} aria-hidden>
                  &rarr;
                </span>
              </span>
            </span>
          </Link>
        </div>
      </section>

      <section className={s.sourcing} data-ground="deep">
        <div className={s.inner}>
          <div className={s.sourcingGrid}>
            <h2 className={s.sourcingTitle}>
              We do not own the gardens. We choose the leaf.
            </h2>
            <div className={s.sourcingBody}>
              <p>
                The tea comes from Assam — BP, Siliguri and South B.O.P. grades.
                We are a distributor, and that is the whole job: pick the leaf,
                store it properly, pack it clean, and get it to you without
                anything happening to it on the way.
              </p>
              <p>
                No blending in of anything cheaper, no colouring, no shortcuts
                at the packing stage. That is not a slogan — it is the thing the
                lab report is there to check.
              </p>
              <dl className={s.spec}>
                <div>
                  <dt>Origin</dt>
                  <dd>Assam</dd>
                </div>
                <div>
                  <dt>Grades</dt>
                  <dd className="mono">BP · Siliguri · South B.O.P.</dd>
                </div>
                <div>
                  <dt>Packed in</dt>
                  <dd>Thane, Maharashtra</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className={s.ritual}>
        <div className={s.inner}>
          <div className={s.ritualGrid}>
            <HeroVideo
              src="/her-o.mp4"
              poster="/hero-poster.jpg"
              className={s.ritualMedia}
            />
            <div className={s.ritualText}>
              <span className={s.eyebrow}>How it is meant to taste</span>
              <h2>Matka chai, without the matka.</h2>
              <p>
                Slow flame, full boil, a bit of patience that is what makes the
                tea at the stall taste like it does. The instant mix gets most
                of the way there in a minute. The loose leaf is for when you
                have time to do it properly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={s.closing}>
        <div className={s.inner}>
          <h2>Tea you can check.</h2>
          <p className={s.lede}>
            Every batch we sell goes through a laboratory first. If a report
            ever comes back badly, it goes on this site too.
          </p>
          <div className={s.closingActions}>
            <Link href="/products" className={`${s.cta} ${s.ctaPrimary}`}>
              Browse products
            </Link>
            <Link href="/quality" className={`${s.cta} ${s.ctaGhost}`}>
              See the evidence
            </Link>
          </div>
        </div>
      </section>

      <section className={s.proof} aria-labelledby="proof-title">
        <div className={s.inner}>
          <div className={s.proofHead}>
            <span className={s.eyebrow}>Why you can trust this</span>
            <h2 id="proof-title">We publish the lab report, not a promise.</h2>
            <p className={s.lede}>
              An advisory was raised about our tea. Rather than answer it with
              words, we sent a batch to an NABL-accredited laboratory and put
              the signed report on this website, including what it does not
              cover.
            </p>
          </div>

          <ul className={s.figures}>
            {figures.map((f, i) => (
              <li
                key={f.label}
                className={s.figure}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <strong className={`${s.figureValue} mono`}>{f.value}</strong>
                <span className={s.figureLabel}>{f.label}</span>
                <span className={s.figureSub}>{f.sub}</span>
              </li>
            ))}
          </ul>

          <Link href="/quality" className={`${s.cta} ${s.ctaPrimary}`}>
            Read the test results
          </Link>
        </div>
      </section>
    </main>
  );
}
