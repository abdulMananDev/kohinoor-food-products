"use client";

import { useState } from "react";
import { type OtherTea } from "@/lib/products";
import { PackShot, QtyStepper, BuyNowButton } from "../components/product-ui";
import s from "./our-teas.module.css";

/* One card, one quantity. State lives here rather than on the page so the
   three cards cannot share a counter. */

export default function TeaCard({
  tea,
  priority,
}: {
  tea: OtherTea;
  priority?: boolean;
}) {
  const [qty, setQty] = useState(1);

  /* Exactly the wording the brief specifies. whatsappUrl() encodes it. */
  const message = `Hi, I would like to order ${qty} x ${tea.name} from Inaam Tea. Please share the price and availability.`;

  return (
    <article className={s.card}>
      <PackShot
        src={tea.image}
        alt={`${tea.name} tea pack by Inaam Tea`}
        sizes="(min-width: 960px) 33vw, (min-width: 640px) 50vw, 100vw"
        priority={priority}
      />
      <h2 className={s.name}>{tea.name}</h2>
      <p className={s.tagline}>{tea.tagline}</p>
      <p className={s.description}>{tea.description}</p>
      <p className={s.footer}>{tea.footer}</p>
      <QtyStepper qty={qty} setQty={setQty} />
      <BuyNowButton
        message={message}
        ariaLabel={`Order ${tea.name} via WhatsApp`}
      />
    </article>
  );
}
