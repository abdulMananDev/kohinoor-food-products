"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { type Product, formatPrice, formatWeight } from "@/lib/products";
import s from "./product.module.css";
import c from "../components/product-ui.module.css";
import { PackShot, QtyStepper, BuyNowButton } from "../components/product-ui";

/* The only client component on this route. It owns one piece of state —
   which variant is selected — which both columns read: the price in the
   purchase card and the net weight in the pack details. That shared read is
   why the two columns live in one client component rather than the right
   column staying on the server. */

export default function ProductView({ product }: { product: Product }) {
  const [variantIndex, setVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);

  const variant = product.variants[variantIndex];

  /* The WhatsApp opener. Kept short and scannable — it is a draft the
     customer sees in their composer before sending, not a form submission. */
  const orderMessage = [
    `Hi! I would like to order ${product.name}.`,
    "",
    `Pack size: ${formatWeight(variant.weightGrams)} (${formatPrice(variant.price)} each)`,
    `Quantity: ${qty}`,
    "",
    `Batch ${product.batchNumber}`,
  ].join("\n");

  const sizeGroupId = useId();

  return (
    <div className={s.layout}>
      {/* ---- left: the purchase decision, nothing else ---- */}
      <div className={s.buy}>
        <PackShot
          src={product.image}
          alt={product.imageAlt}
          width={1400}
          height={784}
          sizes="(min-width: 900px) 45vw, 100vw"
          priority
        />

        <h1 className={s.name}>{product.name}</h1>

        <p className={s.price}>
          <span className={s.priceValue}>{formatPrice(variant.price)}</span>
          <span className={s.priceUnit}>
            for {formatWeight(variant.weightGrams)}
          </span>
        </p>

        <fieldset className={s.sizes}>
          <legend className={c.label} id={sizeGroupId}>
            Pack size
          </legend>
          <div
            className={s.sizeRow}
            role="radiogroup"
            aria-labelledby={sizeGroupId}
          >
            {product.variants.map((v, i) => (
              <label
                key={v.weightGrams}
                className={s.size}
                data-selected={i === variantIndex || undefined}
              >
                <input
                  type="radio"
                  name="pack-size"
                  value={v.weightGrams}
                  checked={i === variantIndex}
                  onChange={() => setVariantIndex(i)}
                  className={s.sizeInput}
                />
                <span className={s.sizeWeight}>
                  {formatWeight(v.weightGrams)}
                </span>
                <span className={s.sizePrice}>{formatPrice(v.price)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <QtyStepper qty={qty} setQty={setQty} max={99} />

        {/* Ordering happens over WhatsApp, so this is the whole purchase
            path — no basket to add to. The pack size and quantity chosen
            above travel with the link, so nobody has to retype a selection
            they already made.

            No order total: delivery and any taxes are not known here, and a
            figure in the message would read as the amount payable. The unit
            price is stated, the arithmetic is left to the person who knows
            the rest of it. */}
        <BuyNowButton message={orderMessage} />
      </div>

      {/* ---- right: everything that supports the decision ---- */}
      <div className={s.support}>
        <Link href="/transparency" className={s.trust}>
          <span className={s.trustBatch}>Batch {product.batchNumber}</span>
          <span className={s.trustClaim}>
            Tested clear for synthetic colours
          </span>
          <span className={s.trustBody}>
            NABL-accredited laboratory. See the signed report
            <span aria-hidden> &rarr;</span>
          </span>
        </Link>

        <section className={s.block}>
          <h2 className={s.blockTitle}>What it is</h2>
          <p className={s.prose}>
            An instant mix of Assam tea, packed in Thane. One measure gives you
            a full cup — tea, milk and sugar already in the right proportion, so
            there is nothing to judge by eye at six in the morning.
          </p>
          <p className={s.prose}>
            It is for households that drink tea every day and would rather not
            spend ten minutes on it, and for anyone who wants to know exactly
            what is in the packet before they buy it.
          </p>
        </section>

        <section className={s.block}>
          <h2 className={s.blockTitle}>How to make it</h2>
          <ol className={s.steps}>
            <li>
              Heat 150 ml of water or milk until it is just about to boil.
            </li>
            <li>
              Add one heaped teaspoon of the mix and stir for ten seconds.
            </li>
            <li>Let it stand for half a minute, then drink it hot.</li>
          </ol>
        </section>

        <section className={s.block}>
          <h2 className={s.blockTitle}>Pack details</h2>
          <dl className={s.details}>
            <div>
              <dt>Net weight</dt>
              {/* Reads the same state as the price. Tabular figures and a
                  fixed value column mean swapping 250 gm for 1 kg moves
                  nothing else on the page. */}
              <dd className="mono">{formatWeight(variant.weightGrams)}</dd>
            </div>
            <div>
              <dt>Best before</dt>
              <dd>{product.bestBeforeMonths} months from date of packing</dd>
            </div>
            <div>
              <dt>Batch number</dt>
              <dd className="mono">{product.batchNumber}</dd>
            </div>
            <div>
              <dt>FSSAI licence</dt>
              <dd className={product.fssaiLicenseNo ? "mono" : s.pending}>
                {product.fssaiLicenseNo ?? "Awaiting confirmation"}
              </dd>
            </div>
            <div>
              <dt>Packed by</dt>
              <dd>{product.packedBy}</dd>
            </div>
          </dl>
        </section>

        <section className={s.block}>
          <h2 className={s.blockTitle}>Ingredients</h2>
          {product.ingredients.length > 0 ? (
            <ul className={s.ingredients}>
              {product.ingredients.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          ) : (
            <p className={s.pending}>
              Not yet transcribed from the pack label. It will be published here
              word for word rather than paraphrased.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
