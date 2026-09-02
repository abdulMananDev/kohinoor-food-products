import type { Metadata } from "next";
import { product, formatPrice, formatWeight } from "@/lib/products";
import { SITE_URL, SITE_NAME } from "@/lib/content";
import ProductView from "./product-view";
import s from "./product.module.css";

/* Single SKU, two pack sizes — so /products is the product page itself.
   There is no catalogue index and no /products/[slug] detail route; both
   were removed with the placeholder three-product list. */

const cheapest = product.variants.reduce((a, b) => (a.price < b.price ? a : b));

export const metadata: Metadata = {
  title: product.name,
  description: `Instant mix tea from Assam leaf, packed in Thane. ${product.variants
    .map((v) => `${formatWeight(v.weightGrams)} ${formatPrice(v.price)}`)
    .join(", ")}. Batch ${product.batchNumber}, tested clear for synthetic colours.`,
  alternates: { canonical: `${SITE_URL}/products` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/products`,
    title: product.name,
    description: "Instant mix tea from Assam leaf, packed in Thane.",
    siteName: SITE_NAME,
    images: [{ url: product.image }],
  },
  twitter: { card: "summary_large_image" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  image: `${SITE_URL}${product.image}`,
  brand: { "@type": "Brand", name: SITE_NAME },
  batchNumber: product.batchNumber,
  offers: product.variants.map((v) => ({
    "@type": "Offer",
    name: formatWeight(v.weightGrams),
    price: v.price,
    priceCurrency: "INR",
    availability: "https://schema.org/PreOrder",
    url: `${SITE_URL}/products`,
  })),
};

export default function Products() {
  return (
    <main id="main" className={s.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductView product={product} />
      <p className="sr-only">
        Sold in {product.variants.length} pack sizes, from{" "}
        {formatPrice(cheapest.price)}.
      </p>
    </main>
  );
}
