import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
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
  title: {
    default: "New Fast Tea",
    template: "%s — New Fast Tea",
  },
  description:
    "Assam tea, blended and packed in Thane. Every batch is tested by an NABL-accredited laboratory, and every report is published here in full.",
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
