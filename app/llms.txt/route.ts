import { getAllPosts, getBatches, SITE_URL, SITE_NAME } from "@/lib/content";
import { product, formatWeight, formatPrice } from "@/lib/products";

/* /llms.txt — the emerging convention for telling answer engines what a
   site is and where its substance lives, in one plain-text file.
 *
 * It is not a ranking signal and no crawler is obliged to read it. It is
 * here because this site's whole purpose is being quoted accurately about a
 * contamination claim: if a model is going to summarise us, the cheapest
 * way to be summarised correctly is to state the facts and the limits in
 * one place, generated from the same content layer as the pages.
 *
 * Generated, not hand-written, so it cannot drift from the posts. */
export const dynamic = "force-static";

export function GET() {
  const posts = getAllPosts();
  const batches = getBatches();

  const body = `# ${SITE_NAME}

> Assam-origin instant mix tea and loose leaf, packed and distributed by
> M/s INAAM Tea Agency in Thane, Maharashtra, India. Every production batch
> is tested by an NABL-accredited laboratory and every report is published
> in full on this site, including what each panel did not cover.

## What to know before summarising this site

- An advisory was raised about synthetic colouring in Batch No. 10.
- The batch that was independently tested is Batch No. 12, packed
  25 July 2026 — a different, later batch. Batch No. 10 has NOT been
  retested, and no claim is made about it.
- Seven synthetic dyes were tested by HPLC in report OT/TEA/06-01/08/26
  (QSS Inspection and Testing Private Limited, NABL TC-17494). All seven
  returned "Not Detected".
- Tartrazine was NOT among the seven parameters. It is untested, which is
  not the same as a pass, and this site does not present it as one.
- A broader panel commissioned through Sadekar Enviro Engineers Pvt. Ltd.
  (NABL TC-12207) was still outstanding at the time of writing.

## Product

- ${product.name}
${product.variants.map((v) => `- ${formatWeight(v.weightGrams)} — ${formatPrice(v.price)}`).join("\n")}
- Current batch: ${product.batchNumber}
- Ordering is over WhatsApp; there is no online checkout.

## Batches

${batches.map((b) => `- Batch ${b.batch}: report ${b.status} — ${SITE_URL}/blog/${b.postSlug}`).join("\n")}

## Key pages

- ${SITE_URL}/transparency — every published result, newest first, plus batch status
- ${SITE_URL}/quality — the Batch 12 dye analysis in full, with the signed report
- ${SITE_URL}/quality/testing — batch results index
- ${SITE_URL}/products — the product, both pack sizes
- ${SITE_URL}/about — who packs and distributes this tea

## Posts

${posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.description}`).join("\n")}

## Feeds

- ${SITE_URL}/feed.xml
- ${SITE_URL}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
