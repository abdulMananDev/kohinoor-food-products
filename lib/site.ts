/* Business contact details.
 *
 * Orders are taken over WhatsApp, so this number is a live commercial
 * entry point, not decoration. It lives here rather than inline in a
 * component so changing it is one edit in one file - and it can be
 * overridden per-environment without a code change at all (a staging build
 * pointing at a test number, say).
 *
 * Format: country code first, digits only - no +, spaces or dashes. That
 * is what wa.me requires. */

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ?? "916005597358";

/** Human-readable, for anywhere the number itself should be shown. */
export const WHATSAPP_DISPLAY = "+91 60055 97358";

/** A plain chat link, no prefilled text. Used where there is no order
    context to carry - the hero, for instance, where nothing has been
    selected yet. wa.me deep-links into the app on mobile natively. */
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

/** The same link with a prefilled opening message. WhatsApp shows the text
    in the composer for the sender to edit or send, so it is a draft rather
    than something sent on their behalf. Newlines survive as %0A. */
export function whatsappUrl(message?: string): string {
  return message
    ? `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`
    : WHATSAPP_URL;
}
