import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/site-footer";

const learningCards = [
  {
    icon: "▤",
    number: "01 / DASAR",
    title: "Mengenal CCS & CCUS",
    description:
      "Mulai dari pengertian, perbedaan, dan alasan teknologi ini dikembangkan.",
    href: "/belajar-ccus",
    link: "Mulai belajar →",
  },
  {
    icon: "♧",
    number: "02 / PROSES",
    title: "Bagaimana CCUS Bekerja?",
    description:
      "Ikuti perjalanan CO₂ dari proses penangkapan hingga penyimpanan.",
    href: "/belajar-ccus",
    link: "Pelajari proses →",
  },
  {
    icon: "✓",
    number: "03 / LATIHAN",
    title: "Uji Pemahamanmu",
    description:
      "Periksa pemahamanmu melalui pertanyaan singkat seputar CCUS.",
    href: "/uji-pemahaman",
    link: "Coba kuis →",
  },
];

const articles = [
  {
    category: "CCUS BASICS",
    art: "🌍",
    style: "article-image-earth",
    label: "Dasar CCUS",
    time: "5 menit membaca",
    title: "Mengenal CCUS: Teknologi untuk Masa Depan yang Lebih Bersih",
    description:
      "Memahami bagaimana teknologi penangkapan, pemanfaatan, dan penyimpanan karbon bekerja dalam upaya mengurangi emisi.",
    href: "/belajar-ccus",
  },
  {
    category: "TECHNOLOGY",
    art: "🏭",
    style: "article-image-industry",
    label: "Teknologi",
    time: "4 menit membaca",
    title: "Bagaimana Karbon Ditangkap dari Aktivitas Industri?",
    description:
      "Mengenal proses capture dan bagaimana CO₂ dipisahkan dari gas buang industri.",
    href: "/belajar-ccus/carbon-capture",
  },
  {
    category: "ENVIRONMENT",
    art: "🌱",
    style: "article-image-storage",
    label: "Lingkungan",
    time: "6 menit membaca",
    title: "Ke Mana CO₂ Pergi Setelah Berhasil Ditangkap?",
    description:
      "Mengenal perjalanan karbon setelah ditangkap, mulai dari pemanfaatan hingga penyimpanan.",
    href: "/belajar-ccus",
  },
];

export default function Home() {
  return (
    <>
      <main id="beranda">
        <section className="hero-section">
          <div className="hero-decoration leaf leaf-left" />
          <div className="hero-decoration leaf leaf-right" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">
                <span className="eyebrow-leaf">❧</span>
                Platform Edukasi CCUS
              </span>
              <h1>
                What if carbon
                <br />
                could have a
                <br />
                <em>second chance?</em>
              </h1>
              <p>
                Temukan bagaimana teknologi Carbon Capture, Utilization, and
                Storage (CCUS) menangkap, memanfaatkan, dan menyimpan karbon
                untuk masa depan yang lebih bersih.
              </p>
              <div className="hero-actions">
                <Link className="button button-primary" href="/belajar-ccus">
                  <span className="button-play">▶</span>
                  Mulai Belajar <span>→</span>
                </Link>
                <a className="button button-outline" href="#cara-kerja">
                  <span className="button-icon">▤</span>
                  Lihat Cara Kerja
                </a>
              </div>
              <div className="hero-note">
                <span className="note-dot" />
                Belajar teknologi masa depan dengan cara yang menyenangkan.
              </div>
            </div>

            <div className="hero-art" aria-label="Ilustrasi teknologi CCUS">
              <div className="hero-sky-cloud cloud-one" />
              <div className="hero-sky-cloud cloud-two" />
              <div className="sun-orb" />
              <div className="hero-mascot">
                <Image
                  src="/images/coco-studying.svg"
                  alt="Coco, maskot CO2 CCUS Edu"
                  width={180}
                  height={180}
                  priority
                />
              </div>
              <div className="factory-scene">
                <svg viewBox="0 0 620 390" role="img" aria-label="Pabrik CCUS dan penyimpanan karbon bawah tanah">
                  <path d="M0 188Q80 174 145 188T300 185T470 188T620 181V390H0Z" fill="#C8E8C5" />
                  <path d="M0 214H620V390H0Z" fill="#D99D62" />
                  <path d="M0 270Q120 245 235 274T470 266T620 275V390H0Z" fill="#B77A4B" opacity=".55" />
                  <path d="M0 188Q100 177 190 188T380 188T620 184V220H0Z" fill="#8CCB68" />
                  <rect x="112" y="102" width="208" height="86" rx="8" fill="#F4F0D9" stroke="#245B4A" strokeWidth="5" />
                  <path d="m112 137 42-29 36 29 35-29 42 29 53-33v84H112Z" fill="#DDE9D0" stroke="#245B4A" strokeWidth="5" />
                  <rect x="132" y="49" width="36" height="92" rx="6" fill="#F3F0D8" stroke="#245B4A" strokeWidth="5" />
                  <rect x="280" y="26" width="42" height="119" rx="6" fill="#F5F1D9" stroke="#245B4A" strokeWidth="5" />
                  <path d="M132 78h36m-36 17h36m112-38h42m-42 19h42" stroke="#64A77A" strokeWidth="11" />
                  <rect x="370" y="100" width="112" height="88" rx="22" fill="#F7F2D9" stroke="#245B4A" strokeWidth="5" />
                  <text x="426" y="153" textAnchor="middle" fontSize="26" fontWeight="800" fill="#174E3E">CO₂</text>
                  <path d="M482 146h48v142" fill="none" stroke="#278F7A" strokeWidth="7" strokeLinecap="round" />
                  <ellipse cx="530" cy="306" rx="76" ry="17" fill="#63C9D0" />
                  <path d="M72 188v-55m483 55v-58" stroke="#28634B" strokeWidth="5" />
                  <circle cx="72" cy="120" r="25" fill="#82C86A" />
                  <circle cx="555" cy="115" r="28" fill="#7EC66C" />
                </svg>
              </div>
              <div className="process-float capture-float">
                <span className="process-icon">◎</span>
                <span><strong>Capture</strong><small>Menangkap CO₂ dari sumber emisi</small></span>
              </div>
              <div className="process-float storage-float">
                <span className="process-icon">▤</span>
                <span><strong>Storage</strong><small>Menyimpan CO₂ secara aman</small></span>
              </div>
              <div className="process-float utilization-float">
                <span className="process-icon">♧</span>
                <span><strong>Utilization</strong><small>Mengolah CO₂ menjadi produk bernilai</small></span>
              </div>
            </div>
          </div>
        </section>

        <section className="container stats-strip" aria-label="Ringkasan platform">
          <div className="stat-item"><span className="stat-icon">♧</span><span><strong>3</strong><small>Tahapan Utama<br />(Capture · Utilization · Storage)</small></span></div>
          <div className="stat-item"><span className="stat-icon">▤</span><span><strong>10+</strong><small>Materi Edukasi<br />Interaktif</small></span></div>
          <div className="stat-item"><span className="stat-icon">♧</span><span><strong>Game &amp; Kuis</strong><small>Belajar sambil<br />bermain</small></span></div>
          <div className="stat-item"><span className="stat-icon">♙</span><span><strong>Untuk Semua</strong><small>Pelajar, mahasiswa,<br />dan masyarakat umum</small></span></div>
        </section>

        <section className="container impact-banner" id="belajar">
          <div className="earth-art" aria-hidden="true">
            <svg viewBox="0 0 300 220">
              <circle cx="145" cy="116" r="96" fill="#55B8C2" />
              <path d="M67 58Q90 25 126 38l20 22-20 18-26-5-8 23-26-5-13-16Zm90-24q47-8 68 28l-17 25-28-4-11 22-26-15-10-30Z" fill="#8ACB70" />
              <path d="m102 133 28-14 25 18-8 32-24 21-25-21Zm88-1 32-13 15 26-24 32-27-12Z" fill="#8ACB70" />
            </svg>
          </div>
          <div className="impact-copy">
            <span className="section-kicker">MENGAPA CCUS PENTING?</span>
            <h2>Mengurangi Emisi,<br />Menjaga Bumi Tetap Bernapas.</h2>
            <p>CCUS membantu menekan emisi karbon dioksida (CO₂) dari aktivitas industri, memanfaatkannya kembali, dan menyimpannya dengan aman di dalam bumi.</p>
          </div>
          <a className="button button-light" href="#cara-kerja">Pelajari Selengkapnya <span>→</span></a>
        </section>

        <section className="container feature-grid" id="cara-kerja">
          <article className="interactive-card" id="game">
            <div className="interactive-copy">
              <h2>Uji Pemahaman Seputar CCUS!</h2>
              <p>Coba kuis interaktif untuk melihat sejauh mana pemahamanmu tentang teknologi CCUS.</p>
              <Link className="button button-primary button-small" href="/uji-pemahaman">Mulai Kuis <span>→</span></Link>
            </div>
            <Link className="game-preview" href="/uji-pemahaman" aria-label="Mulai kuis CCUS">
              <div className="game-preview-title">Uji Pemahaman:<br />Kuis Interaktif</div>
              <div className="game-sky" />
              <Image className="game-coco" src="/images/coco-studying.svg" alt="" width={135} height={135} />
              <div className="game-ground" />
              <span className="play-button">▶</span>
            </Link>
          </article>
          <article className="steps-card">
            <div className="steps-heading">
              <div className="steps-heading-icon">🌿</div>
              <div><span className="steps-subtitle">THE CCUS PROCESS</span><h2>Tiga Langkah Menuju Udara Lebih Bersih</h2><p>Kenali perjalanan CO₂ melalui teknologi CCUS.</p></div>
            </div>
            <div className="steps-flow">
              <div className="step"><div className="step-visual capture-visual">🏭</div><div className="step-label"><span className="step-number">01</span><strong>Capture</strong></div><p>Menangkap dan memisahkan CO₂ dari sumber emisi industri.</p></div>
              <div className="step-connector"><span>→</span></div>
              <div className="step"><div className="step-visual utilization-visual">🧪</div><div className="step-label"><span className="step-number">02</span><strong>Utilization</strong></div><p>Memanfaatkan CO₂ sebagai bahan untuk menghasilkan produk bernilai.</p></div>
              <div className="step-connector"><span>→</span></div>
              <div className="step"><div className="step-visual storage-visual">🪨</div><div className="step-label"><span className="step-number">03</span><strong>Storage</strong></div><p>Menyimpan CO₂ di formasi geologi bawah tanah yang sesuai.</p></div>
            </div>
          </article>
        </section>

        <section className="container learning-teaser" id="materi">
          <div className="section-heading">
            <div><span className="section-kicker green-kicker">MULAI DARI SINI</span><h2>Jelajahi dunia CCUS</h2><p>Kenali konsepnya, pahami prosesnya, lalu uji pengetahuanmu.</p></div>
            <Link href="/materi-modul" className="section-action section-action-secondary"><span>Lihat semua materi</span><span className="action-icon">→</span></Link>
          </div>
          <div className="learning-cards">
            {learningCards.map((card) => (
              <Link className="learning-card" href={card.href} key={card.number}>
                <span className={`learning-card-icon ${card.number.includes("DASAR") ? "icon-book" : card.number.includes("PROSES") ? "icon-leaf" : "icon-quiz"}`}>{card.icon}</span>
                <span className="card-number">{card.number}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <span className="card-link">{card.link}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="container articles-section" id="artikel">
          <div className="section-heading">
            <div><span className="section-kicker green-kicker">EXPLORE &amp; DISCOVER</span><h2>Artikel &amp; Insight</h2><p>Temukan informasi, wawasan, dan perkembangan teknologi CCUS dari berbagai sudut pandang.</p></div>
            <a href="#artikel" className="section-action section-action-primary"><span>Jelajahi artikel</span><span className="action-icon">→</span></a>
          </div>
          <div className="articles-grid">
            {articles.map((article, index) => (
              <article className={`article-card${index === 0 ? " article-featured" : ""}`} key={article.title}>
                <div className={`article-image ${article.style}`}>
                  <span className="article-category">{article.category}</span>
                  <div className={index === 0 ? "article-earth" : "article-visual-icon"}>{article.art}</div>
                  {index === 0 && <span className="article-decoration">✦</span>}
                </div>
                <div className="article-content">
                  <div className="article-meta"><span>{article.label}</span><span>•</span><span>{article.time}</span></div>
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <Link href={article.href} className="article-link">Baca selengkapnya →</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
