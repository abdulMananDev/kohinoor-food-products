import type { Metadata } from "next";
import { otherTeas } from "@/lib/products";
import { SITE_URL, SITE_NAME } from "@/lib/content";
import TeaCard from "./tea-card";
import s from "./our-teas.module.css";

/* The rest of the Inaam Tea range. New Fast Tea is not listed here — it has
   its own page at /products. Listing only: no prices, no batch or lab
   content, nothing that would read as a claim. */

export const metadata: Metadata = {
  title: "Our Tea Range",
  description:
    "Liberty Strong Tea, Saaf Noon Chai and Lamsa Tea from Inaam Tea, Thane. Order over WhatsApp.",
  alternates: { canonical: "/our-teas" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/our-teas`,
    title: `Our Tea Range — ${SITE_NAME}`,
    description:
      "Liberty Strong Tea, Saaf Noon Chai and Lamsa Tea from Inaam Tea, Thane.",
    siteName: SITE_NAME,
  },
  twitter: { card: "summary_large_image" },
};

/* No offers, price or availability: we are not making commercial or stock
   claims for these three yet. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Our Tea Range",
  itemListElement: otherTeas.map((tea, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Product",
      name: tea.name,
      description: tea.description,
      brand: { "@type": "Brand", name: "Inaam Tea" },
      image: `${SITE_URL}${tea.image.src}`,
    },
  })),
};

export default function OurTeas() {
  return (
    <main id="main" className={s.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\u003c"),
        }}
      />

      <header className={s.head}>
        <span className={s.eyebrow}>Our teas</span>
        <h1>Our Tea Range</h1>
        <p className={s.lede}>
          Alongside New Fast Tea, Inaam Tea packs three other blends in Thane.
          Pick a quantity and send us a message on WhatsApp.
        </p>
      </header>

      <div className={s.grid}>
        {otherTeas.map((tea, i) => (
          // First card is above the fold on mobile; the rest load lazily.
          <TeaCard key={tea.slug} tea={tea} priority={i === 0} />
        ))}
      </div>
    </main>
  );
}
