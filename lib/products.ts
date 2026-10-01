import type { StaticImageData } from "next/image";
import libertyTea from "@/public/our-teas/liberty-tea.png";
import saafNoonChai from "@/public/our-teas/saaf-noon-chai.png";
import lamsaTea from "@/public/our-teas/lamsa-tea.png";

/* The product.
 *
 * New Fast Tea is a single SKU sold in two pack sizes. It is modelled as one
 * product with a variants array rather than as two products, because the
 * batch, the label, the ingredients and the licence are all shared - only
 * weight and price differ. A price change or a new batch is a data edit
 * here, not a copy edit in JSX.
 *
 * Replaces the earlier three-product placeholder list and its /products/[slug]
 * detail route; there is no catalogue to browse. */

export type ProductVariant = {
  weightGrams: number;
  /** Rupees, whole units. No paise on this SKU. */
  price: number;
};

export type Product = {
  name: string;
  variants: ProductVariant[];
  batchNumber: string;
  /** Null until the licence number is confirmed - see the note below. */
  fssaiLicenseNo: string | null;
  bestBeforeMonths: number;
  packedBy: string;
  /** Empty until transcribed from the pack - see the note below. */
  ingredients: string[];
  image: string;
  imageAlt: string;
};

/* ingredients is deliberately still blank rather than filled in. The brief
 * says "matching the pack label exactly", and the pack label has not been
 * supplied - guessing at the composition of a food product is not a gap
 * worth papering over on a site whose argument is that its claims can be
 * checked. The block renders a note instead of a list until the real text
 * is transcribed.
 *
 * TODO: transcribe the ingredients from the physical pack. */
export const product: Product = {
  name: "New Fast Tea | Premium Instant Mix Tea",
  variants: [
    { weightGrams: 250, price: 130 },
    { weightGrams: 1000, price: 500 },
  ],
  batchNumber: "No. 12",
  // 14-digit FSSAI licence, as printed on the pack.
  fssaiLicenseNo: "21521068000013",
  bestBeforeMonths: 9,
  packedBy: "INAAM TEA, Thane",
  ingredients: [],
  // TODO: real pack photography. This is loose leaf and whole spices, not a
  // shot of the packet the customer receives.
  image: "/new-fast-tea-leaves.png",
  imageAlt:
    "Assam tea leaves with cardamom, star anise and cinnamon on a white ground",
};

/** "250 gm" / "1 kg" - derived, so a new variant needs no new label. */
export function formatWeight(grams: number): string {
  return grams >= 1000
    ? `${grams / 1000} kg`.replace(".0 ", " ")
    : `${grams} gm`;
}

export function formatPrice(rupees: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

/* The rest of the Inaam Tea range.
 *
 * Deliberately a different shape from `product` above: these are listed, not
 * specified. No price, no batch, no licence — nothing is claimed here that
 * has not been supplied, and /our-teas asks the customer to enquire on
 * WhatsApp rather than quoting a figure. */
export type OtherTea = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /** The line under the description on the card. */
  footer: string;
  /* Imported rather than referenced by path, so the intrinsic width and
     height come from the file itself. The three pack shots are 720x855,
     399x501 and 1500x1500 — hand-copied numbers that different would drift
     the first time one is re-exported. */
  image: StaticImageData;
};

export const otherTeas: OtherTea[] = [
  {
    slug: "liberty-strong-tea",
    name: "Liberty Strong Tea",
    tagline: "The Aroma of Cardamom, The Comfort of Home.",
    description:
      "Liberty Tea is our best-selling and most trusted blend, known for its bold strength, rich colour, and exceptional taste. Crafted from premium tea leaves, every cup delivers a strong, refreshing brew with consistent quality.",
    footer: "The Perfect Blend of Rich Taste & Refreshing Aroma.",
    image: libertyTea,
  },
  {
    slug: "saaf-noon-chai",
    name: "Saaf Noon Chai",
    tagline: "Ab Sehat Aur Zaiqa, Ek Saath.",
    description:
      "Experience the authentic taste of traditional Kashmiri Pink Tea with our premium Butter Grade Saaf Noon Chai. Made from carefully selected green tea leaves, it offers a smooth, creamy texture and a rich, satisfying flavour in every cup.",
    footer: "Handpicked Leaves for the Ultimate Butter-Grade Brew.",
    image: saafNoonChai,
  },
  {
    slug: "lamsa-tea",
    name: "Lamsa Tea",
    tagline: "Brewed to Warm Your Soul.",
    description:
      "Lamsa Special Tea is an exclusive blend, available only at Inaam Tea. Known for its signature chocolate-like aroma and rich flavour, it transforms every cup into a delightful tea experience with an unforgettable taste and refreshing fragrance.",
    footer: "Tradition in Every Pour.",
    image: lamsaTea,
  },
];
