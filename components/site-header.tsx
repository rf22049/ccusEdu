"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function subscribeTheme(onChange: () => void) {
  window.addEventListener("ccus-theme-change", onChange);
  window.addEventListener("storage", onChange);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", onChange);
  return () => {
    window.removeEventListener("ccus-theme-change", onChange);
    window.removeEventListener("storage", onChange);
    window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", onChange);
  };
}

function getThemeSnapshot(): Theme {
  const savedTheme = window.localStorage.getItem("ccus-theme");
  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getServerThemeSnapshot(): Theme {
  return "light";
}

const links = [
  { href: "/#beranda", label: "Beranda", active: (path: string) => path === "/" },
  { href: "/belajar-ccus", label: "Belajar CCUS", active: (path: string) => path.startsWith("/belajar-ccus") },
  { href: "/materi-modul", label: "Materi & Modul", active: (path: string) => path.startsWith("/materi-modul") },
  { href: "/#artikel", label: "Artikel", active: () => false },
  { href: "/#game", label: "Game & Kuis", active: () => false },
  { href: "/uji-pemahaman", label: "Uji Pemahaman", active: (path: string) => path === "/uji-pemahaman" },
  { href: "/tentang-kami", label: "Tentang Kami", active: (path: string) => path === "/tentang-kami" },
];

const adminLinks = [
  { href: "/", label: "Situs Utama", active: () => false },
  { href: "/admin?view=ringkasan", label: "Ringkasan", active: (path: string, search: string) => path === "/admin" && (!search.includes("view") || search.includes("ringkasan")) },
  { href: "/admin?view=konten", label: "Kelola Konten", active: (path: string, search: string) => path === "/admin" && search.includes("konten") },
  { href: "/admin?view=soal", label: "Kelola Soal", active: (path: string, search: string) => path === "/admin" && search.includes("soal") },
  { href: "/admin?view=hasil", label: "Hasil Uji", active: (path: string, search: string) => path === "/admin" && search.includes("hasil") },
];

export default function SiteHeader() {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    window.localStorage.setItem("ccus-theme", nextTheme);
    window.dispatchEvent(new Event("ccus-theme-change"));
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", nextTheme === "dark" ? "#102b25" : "#f4fbf8");
    document.documentElement.dataset.theme = nextTheme;
  }

  return (
    <header className="site-header">
      <nav className="navbar container" aria-label="Navigasi utama">
        <Link className="brand" href="/#beranda" aria-label="CCUS Edu">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              <path d="M24 4C14 4 6 12 6 22c0 4 1 7 3 10 2-7 8-12 15-12 5 0 9 2 12 6 2-3 3-6 3-9C39 10 32 4 24 4Z" fill="#63B96D" />
              <path d="M8 33c4 7 11 11 19 11 7 0 13-3 17-9-2-7-8-12-15-12-8 0-15 4-21 10Z" fill="#176B50" />
              <path d="M22 19c-4-7-2-13 4-16 6 2 9 7 8 13-4 0-8 1-12 3Z" fill="#238D62" />
            </svg>
          </span>
          <span className="brand-copy">
            <strong>CCUS Edu</strong>
            <small>Explore · Learn · Discover</small>
          </span>
        </Link>

        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <Suspense fallback={<NavigationLinks pathname="" search="" menuOpen={menuOpen} onNavigate={() => setMenuOpen(false)} />}>
          <ActiveNavigationLinks menuOpen={menuOpen} onNavigate={() => setMenuOpen(false)} />
        </Suspense>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            type="button"
            aria-label={theme === "dark" ? "Ganti ke tema terang" : "Ganti ke tema gelap"}
            aria-pressed={theme === "dark"}
            onClick={toggleTheme}
          >
            <span className="theme-toggle-thumb" aria-hidden="true">
              <svg className="theme-icon theme-icon-sun" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="4" fill="currentColor" />
                <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <svg className="theme-icon theme-icon-moon" viewBox="0 0 24 24" fill="none">
                <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.7 8.7 0 1 0 20.2 15.1Z" fill="currentColor" />
              </svg>
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}

function ActiveNavigationLinks({
  menuOpen,
  onNavigate,
}: {
  menuOpen: boolean;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <NavigationLinks
      pathname={pathname}
      search={searchParams.toString()}
      menuOpen={menuOpen}
      onNavigate={onNavigate}
    />
  );
}

function NavigationLinks({
  pathname,
  search,
  menuOpen,
  onNavigate,
}: {
  pathname: string;
  search: string;
  menuOpen: boolean;
  onNavigate: () => void;
}) {
  const isAdmin = pathname.startsWith("/admin");
  const activeLinks = isAdmin ? adminLinks : links;
  return (
    <div className={`nav-links${menuOpen ? " is-open" : ""}`}>
      {activeLinks.map((link) => (
        <Link
          className={`nav-link${link.active(pathname, search) ? " active" : ""}`}
          href={link.href}
          key={link.label}
          onClick={onNavigate}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
