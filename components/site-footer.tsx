import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer" id="tentang">
      <div className="footer-hills" aria-hidden="true" />
      <div className="container footer-content">
        <div className="footer-brand">
          <Link className="brand brand-light" href="/#beranda">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none">
                <path d="M24 4C14 4 6 12 6 22c0 4 1 7 3 10 2-7 8-12 15-12 5 0 9 2 12 6 2-3 3-6 3-9C39 10 32 4 24 4Z" fill="#A9D875" />
                <path d="M8 33c4 7 11 11 19 11 7 0 13-3 17-9-2-7-8-12-15-12-8 0-15 4-21 10Z" fill="#F1F8E8" />
              </svg>
            </span>
            <span className="brand-copy">
              <strong>CCUS Edu</strong>
              <small>Explore · Learn · Discover</small>
            </span>
          </Link>
          <p>
            Platform edukasi untuk mengenal teknologi Carbon Capture,
            Utilization, and Storage (CCUS) secara mudah, interaktif, dan
            menyenangkan.
          </p>
        </div>
        <div className="footer-column">
          <strong>Jelajahi</strong>
          <Link href="/belajar-ccus">Belajar CCUS</Link>
          <Link href="/materi-modul">Materi &amp; Modul</Link>
          <Link href="/#game">Game &amp; Kuis</Link>
        </div>
        <div className="footer-column">
          <strong>Lainnya</strong>
          <Link href="/uji-pemahaman">Uji Pemahaman</Link>
          <Link href="/tentang-kami">Tentang Kami</Link>
          <a href="mailto:ccusedu@universitaspertamina.ac.id">Kontak &amp; Aspirasi</a>
        </div>
        <div className="footer-column social-column">
          <strong>Ikuti Kami</strong>
          <div className="social-links" role="note">
            <span className="social-coming-soon">Akun media sosial segera hadir.</span>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 CCUS Edu. All rights reserved.</span>
        <span>Made for curious minds 🌱</span>
      </div>
    </footer>
  );
}
