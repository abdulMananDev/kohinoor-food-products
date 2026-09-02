"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Product, formatPrice, formatWeight } from "@/lib/products";
import s from "./product.module.css";
import { WHATSAPP_URL } from "@/lib/site";
function WhatsAppIcon() {
  return (
    <svg
      className={s.ctaIcon}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

/* The only client component on this route. It owns one piece of state —
   which variant is selected — which both columns read: the price in the
   purchase card and the net weight in the pack details. That shared read is
   why the two columns live in one client component rather than the right
   column staying on the server. */

export default function ProductView({ product }: { product: Product }) {
  const [variantIndex, setVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);

  const variant = product.variants[variantIndex];
  const sizeGroupId = useId();
  const qtyId = useId();

  return (
    <div className={s.layout}>
      {/* ---- left: the purchase decision, nothing else ---- */}
      <div className={s.buy}>
        <div className={s.media}>
          <Image
            src={product.image}
            alt={product.imageAlt}
            width={1400}
            height={784}
            sizes="(min-width: 900px) 45vw, 100vw"
            priority
          />
        </div>

        <h1 className={s.name}>{product.name}</h1>

        <p className={s.price}>
          <span className={s.priceValue}>{formatPrice(variant.price)}</span>
          <span className={s.priceUnit}>
            for {formatWeight(variant.weightGrams)}
          </span>
        </p>

        <fieldset className={s.sizes}>
          <legend className={s.label} id={sizeGroupId}>
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

        <div className={s.qtyRow}>
          <label className={s.label} htmlFor={qtyId}>
            Quantity
          </label>
          <div className={s.qty}>
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              aria-label="Decrease quantity"
            >
              &minus;
            </button>
            <input
              id={qtyId}
              type="number"
              min={1}
              max={99}
              value={qty}
              onChange={(e) => {
                const n = Number(e.target.value);
                setQty(Number.isFinite(n) ? Math.min(99, Math.max(1, n)) : 1);
              }}
              className="mono"
            />
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              disabled={qty >= 99}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Ordering happens over WhatsApp, so this is the whole purchase
            path — no basket to add to. */}
        <div className={s.actions}>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Order via WhatsApp"
            className={`${s.cta} ${s.ctaPrimary}`}
          >
            <WhatsAppIcon />
            Buy Now
          </a>
        </div>
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
