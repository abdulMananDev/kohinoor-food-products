import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/* The share card every link to this site gets — WhatsApp is the actual order
   channel, so this is the first thing most people see of the brand.
   Deliberately typographic rather than a photo:
   - It is self-identifying. A product photo with no wordmark tells a person
     forwarded the link nothing about who sent it.
   - It renders to a ~40KB flat-colour PNG. WhatsApp silently drops previews
     for images it considers too heavy, which the 1.5MB leaf photo risked.
   - --deep ground, not --paper: a dark card separates from the chat bubble
     instead of dissolving into it.
   Inherited by every nested route, so one file covers the whole site. */

export const alt = "New Fast Tea | Matka chai ka maza ab ghar par";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Satori only knows the faces you hand it, and it fails quietly in both
   directions. With no `fonts` array, @vercel/og supplies Geist-Regular alone,
   so `fontWeight: 700` renders byte-for-byte identically to 400. Pass a
   `fonts` array and the bundled default drops out entirely — every unmatched
   family, generic names included, collapses onto whatever you did supply.
   So both faces the site actually uses are named and loaded here: no generic
   family names anywhere below, because there is nothing sane to fall back to.
   Bricolage at 96pt is the optical size the live site lands on at this scale —
   it is variable on `opsz` and browsers apply `font-optical-sizing: auto`.
   Read at module scope, which is safe because this route prerenders at build
   time; the files are never touched while serving a request. */
const [bricolageBold, plexRegular] = await Promise.all([
  readFile(join(process.cwd(), "assets/BricolageGrotesque96pt-Bold.ttf")),
  readFile(join(process.cwd(), "assets/IBMPlexSans-Regular.ttf")),
]);

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#1c1a17",
        color: "#f3f1ec",
        padding: "72px 80px",
        fontFamily: "IBM Plex Sans",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 56,
            height: 6,
            background: "#e9a41b",
            borderRadius: 3,
          }}
        />
        <div
          style={{
            fontSize: 24,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#e9a41b",
          }}
        >
          Thane, Maharashtra
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontFamily: "Bricolage Grotesque",
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: -2,
          }}
        >
          New Fast Tea
        </div>
        <div style={{ fontSize: 38, lineHeight: 1.35, color: "#c8c3b8" }}>
          Matka chai ka maza ab ghar par. NABL-accredited laboratory tested.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 26,
          color: "#8e887d",
          borderTop: "2px solid #34302a",
          paddingTop: 28,
        }}
      >
        <div>newfasttea.com</div>
        <div>Instant mix</div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "IBM Plex Sans",
          data: plexRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Bricolage Grotesque",
          data: bricolageBold,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );
}
