"use client";

import { useId } from "react";
import Image from "next/image";
import { whatsappUrl } from "@/lib/site";
import s from "./product-ui.module.css";

/* The three pieces every product on this site needs: the pack shot, the
   quantity stepper and the WhatsApp handoff. Extracted from the New Fast Tea
   page when /our-teas needed the same behaviour and the same styling.
   Ordering is a WhatsApp draft, not a form submission — the message is
   composed by the caller because only it knows what to say. */

export function WhatsAppIcon({
  className = s.ctaIcon,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

/** The pack shot: sunk ground, hairline rule, rounded, image fills the width
    at its own aspect ratio. Same framing on every product. */
export function PackShot({
  src,
  alt,
  width = 1400,
  height = 784,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={s.media}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
      />
    </div>
  );
}

/** Minus / value / plus. Controlled, so the owner keeps the count it will
    put in the message. `max` is optional — /our-teas has no ceiling. */
export function QtyStepper({
  qty,
  setQty,
  max,
}: {
  qty: number;
  setQty: (n: number) => void;
  max?: number;
}) {
  const id = useId();
  const clamp = (n: number) => Math.max(1, max ? Math.min(max, n) : n);

  return (
    <div className={s.qtyRow}>
      <label className={s.label} htmlFor={id}>
        Quantity
      </label>
      <div className={s.qty}>
        <button
          type="button"
          onClick={() => setQty(clamp(qty - 1))}
          disabled={qty <= 1}
          aria-label="Decrease quantity"
        >
          &minus;
        </button>
        <input
          id={id}
          type="number"
          min={1}
          max={max}
          value={qty}
          onChange={(e) => {
            const n = Number(e.target.value);
            setQty(Number.isFinite(n) ? clamp(n) : 1);
          }}
          className="mono"
        />
        <button
          type="button"
          onClick={() => setQty(clamp(qty + 1))}
          disabled={max ? qty >= max : false}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  );
}

/** Opens WhatsApp with `message` prefilled in the composer — the customer
    still presses send, so nothing goes out on their behalf. */
export function BuyNowButton({
  message,
  label = "Buy Now",
  ariaLabel = "Order via WhatsApp",
}: {
  message: string;
  label?: string;
  ariaLabel?: string;
}) {
  return (
    <div className={s.actions}>
      <a
        href={whatsappUrl(message)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={`${s.cta} ${s.ctaPrimary}`}
      >
        <WhatsAppIcon />
        {label}
      </a>
    </div>
  );
}
