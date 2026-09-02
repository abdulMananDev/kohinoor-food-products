/* Business contact details.
 *
 * Orders are taken over WhatsApp, so this number is a live commercial
 * entry point, not decoration. It lives here rather than inline in a
 * component so changing it is one edit in one file — and it can be
 * overridden per-environment without a code change at all (a staging build
 * pointing at a test number, say).
 *
 * Format: country code first, digits only — no +, spaces or dashes. That
 * is what wa.me requires. */

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ?? "916005597358";

/** Human-readable, for anywhere the number itself should be shown. */
export const WHATSAPP_DISPLAY = "+91 60055 97358";

/** A direct chat link. Deliberately no prefilled text — the brief asks for
    a plain chat, and wa.me deep-links into the app on mobile natively. */
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
