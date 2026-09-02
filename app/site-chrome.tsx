"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import s from "./site-chrome.module.css";

/* Shared chrome.
 *
 * Client only so the nav can mark where you are — ui-ux-pro-max lists
 * nav-state-active as HIGH priority, and a server component has no way to
 * express it. Nothing else here hydrates: four short links fit on one line
 * down to 360px, so there is still no menu to open. */

const nav = [
  { href: "/products", label: "Products" },
  // "Results" not "Test results": the longer label overflows the bar at
  // 375px, and the surrounding context already makes it unambiguous.
  { href: "/quality", label: "Results" },
  { href: "/about", label: "About" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className={s.bar}>
      <nav className={s.barInner} aria-label="Main">
        <Link href="/" className={`${s.wordmark} wordmark`}>
          New Fast Tea
        </Link>

        <ul className={s.links}>
          {nav.map((n) => {
            // /quality/testing should still light up "Test results".
            const active =
              pathname === n.href || pathname.startsWith(`${n.href}/`);
            return (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className={s.link}
                  data-active={active || undefined}
                  aria-current={active ? "page" : undefined}
                >
                  {n.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className={s.footer} data-ground="deep">
      <div className={s.footerInner}>
        <div className={s.footerBrand}>
          <Link href="/" className={`${s.footerMark} wordmark`}>
            New Fast Tea
          </Link>
          <p className={s.footerLine}>
            Assam tea, blended and packed in Thane, Maharashtra. Every batch is
            tested before it is sold, and every report is published here —
            whatever it says.
          </p>
        </div>

        <nav className={s.footerNav} aria-label="Footer">
          {/* One SKU, so one link. "Instant mix" and "Loose leaf" were
              three separate entries pointing at the same page. */}
          <div className={s.footerCol}>
            <h2 className={s.footerHead}>Shop</h2>
            <Link href="/products" className={s.footerLink}>
              New Fast Tea
            </Link>
          </div>

          <div className={s.footerCol}>
            <h2 className={s.footerHead}>Evidence</h2>
            <Link href="/transparency" className={s.footerLink}>
              Every test
            </Link>
            <Link href="/quality" className={s.footerLink}>
              Latest report
            </Link>
            <Link href="/quality/testing" className={s.footerLink}>
              All batch results
            </Link>
          </div>

          <div className={s.footerCol}>
            <h2 className={s.footerHead}>Company</h2>
            <Link href="/about" className={s.footerLink}>
              About us
            </Link>
            <Link href="/blog" className={s.footerLink}>
              Blog
            </Link>
            <Link href="/about#contact" className={s.footerLink}>
              Contact
            </Link>
          </div>
        </nav>
      </div>

      <div className={s.footerBase}>
        <p className={s.footerFine}>
          &copy; {new Date().getFullYear()} New Fast Tea. Packed and distributed
          by M/s INAAM Tea Agency, Thane, Maharashtra.
        </p>
        <p className={`${s.footerFine} mono`}>NABL-tested · ISO/IEC 17025:2017</p>
      </div>
    </footer>
  );
}
