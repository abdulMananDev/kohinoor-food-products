import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL, SITE_NAME, OG_IMAGE } from "@/lib/content";
import { SiteNav, SiteFooter } from "./site-chrome";

// Display. Variable (opsz, wdth, wght), so no weight array — an industrial
// grotesque that reads as packaging rather than as a magazine.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display-family",
  display: "swap",
});

// Body and UI. Plex Sans and Plex Mono are one designer's documentation
// family, so a batch ID and the sentence around it share a voice.
const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans-family",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-family",
  display: "swap",
});

export const metadata: Metadata = {
  /* Makes every relative URL in metadata resolve against the real origin —
     without it Next warns and OG images resolve against localhost. */
  metadataBase: new URL(SITE_URL),
  title: {
    default: "New Fast Tea",
    template: "%s — New Fast Tea",
  },
  description:
    "Assam tea, blended and packed in Thane. Every batch is tested by an NABL-accredited laboratory, and every report is published here in full.",
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Food & Drink",
  formatDetection: { telephone: false },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: `${SITE_NAME} — all posts` }],
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    url: "/",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

/* Sitewide entity data. Answer engines resolve "who is New Fast Tea" from
   this rather than inferring it from page copy, and the sameAs/knowsAbout
   fields are what let a citation be attributed correctly. */
const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}${OG_IMAGE.url}`,
      description:
        "Assam-origin instant mix tea and loose leaf, packed and distributed by M/s INAAM Tea Agency in Thane, Maharashtra. Every batch is tested by an NABL-accredited laboratory and every report is published.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Thane",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
      knowsAbout: [
        "Assam tea",
        "instant tea premix",
        "NABL accredited laboratory testing",
        "synthetic food colours",
        "FSSAI food safety standards",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-IN",
    },
  ],
};

/* Colours the browser chrome on mobile. Matches --paper so the address bar
   continues the page rather than sitting on a white edge against it.
   Lives in `viewport`, not `metadata` — it moved there in Next 14. */
export const viewport: Viewport = {
  themeColor: "#faf8f3",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        {/* Rendered rather than declared in `metadata.alternates`: every
            page sets its own `alternates` for its canonical, and that
            replaces the parent's object wholesale — so the feed link
            declared in the root layout never reached any page. React
            hoists this into <head>. */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${SITE_NAME} — all posts`}
          href="/feed.xml"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <a href="#main" className="sr-only">
          Skip to content
        </a>
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
