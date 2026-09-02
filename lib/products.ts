/* The product.
 *
 * New Fast Tea is a single SKU sold in two pack sizes. It is modelled as one
 * product with a variants array rather than as two products, because the
 * batch, the label, the ingredients and the licence are all shared — only
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
  /** Null until the licence number is confirmed — see the note below. */
  fssaiLicenseNo: string | null;
  bestBeforeMonths: number;
  packedBy: string;
  /** Empty until transcribed from the pack — see the note below. */
  ingredients: string[];
  image: string;
  imageAlt: string;
};

/* Two values are deliberately blank rather than filled in.
 *
 * fssaiLicenseNo: an FSSAI licence number is a regulatory identifier. A
 * plausible-looking wrong one printed under "Pack details" is a false
 * statement about compliance, on the one site whose entire argument is that
 * its claims can be checked. It renders as "awaiting confirmation" until
 * someone supplies the real number.
 *
 * ingredients: the brief says "matching the pack label exactly", and the
 * pack label was not supplied. Guessing at the composition of a food
 * product is the same category of mistake. The block renders a note instead
 * of a list until the real text is transcribed.
 *
 * TODO: fill both from the physical pack, then delete this comment. */
export const product: Product = {
  name: "New Fast Tea — Premium Instant Mix Tea",
  variants: [
    { weightGrams: 250, price: 120 },
    { weightGrams: 1000, price: 480 },
  ],
  batchNumber: "No. 12",
  fssaiLicenseNo: null,
  bestBeforeMonths: 9,
  packedBy: "INAAM TEA, Thane",
  ingredients: [],
  // TODO: real pack photography. This is loose leaf and whole spices, not a
  // shot of the packet the customer receives.
  image: "/new-fast-tea-leaves.png",
  imageAlt:
    "Assam tea leaves with cardamom, star anise and cinnamon on a white ground",
};

/** "250 gm" / "1 kg" — derived, so a new variant needs no new label. */
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
