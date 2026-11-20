import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami — CCUS Edu",
  description: "Mengenal visi, misi, dan tim pengembang CCUS Edu.",
};

const profiles = [
  {
    icon: "♡",
    title: "Visi",
    description: "Meningkatkan literasi tentang teknologi CCUS di Indonesia.",
  },
  {
    icon: "▤",
    title: "Misi",
    description: "Menyediakan media pembelajaran yang mudah, interaktif, dan terpercaya.",
  },
  {
    icon: "♧",
    title: "Tim Pengembang",
    description: "Mahasiswa Universitas Pertamina.",
  },
  {
    icon: "✉",
    title: "Kontak",
    description: "ccusedu@universitaspertamina.ac.id",
  },
];

export default function AboutPage() {
  return (
    <main className="about-page" id="tentang-kami">
      <section className="about-hero">
        <div className="container about-hero-inner">
          <div className="about-copy">
            <span className="about-kicker">CCUS EDU</span>
            <h1>Tentang Kami</h1>
            <h2>Mengenal CCUS Edu</h2>
            <p>
              Platform edukasi yang hadir untuk mengenalkan teknologi Carbon
              Capture, Utilization, and Storage kepada masyarakat secara
              sederhana, interaktif, dan menyenangkan.
            </p>
          </div>
          <div className="about-art">
            <svg viewBox="0 0 560 310" role="img" aria-labelledby="about-art-title">
              <title id="about-art-title">Ilustrasi pabrik CCUS yang ramah lingkungan</title>
              <circle cx="429" cy="69" r="37" fill="#F6D66E" />
              <path d="M66 110c2-20 19-35 40-35 13 0 25 7 32 17 6-7 15-11 25-11 20 0 36 15 38 34H66Z" fill="#fff" opacity=".8" />
              <path d="M0 221c67-20 120-7 175-13 68-7 130-26 193-10 73 18 123-3 192 8v104H0V221Z" fill="#AEDB9B" />
              <path d="M0 254c56-18 113-10 168 1 61 12 116-5 172-10 70-6 145 14 220-2v67H0v-56Z" fill="#75B66B" />
              <path d="M151 135h241v101H151z" fill="#FFF9E8" stroke="#28694F" strokeWidth="6" strokeLinejoin="round" />
              <path d="m151 162 48-31 45 31 48-31 47 31 53-32v106H151v-74Z" fill="#D9EED5" stroke="#28694F" strokeWidth="6" strokeLinejoin="round" />
              <path d="M170 177h32v59h-32zm57 0h32v59h-32zm57 0h32v59h-32zm57 0h32v59h-32z" fill="#8CC6A1" stroke="#28694F" strokeWidth="5" />
              <path d="M174 141V83h30v58m139 0V60h34v81" fill="#FFF9E8" stroke="#28694F" strokeWidth="6" strokeLinejoin="round" />
              <path d="M174 101h30m-30 17h30m139-35h34m-34 20h34" stroke="#70B98A" strokeWidth="10" />
              <path d="M0 255h560" stroke="#4E9A52" strokeWidth="5" />
            </svg>
          </div>
        </div>
      </section>

      <section className="container about-values" aria-label="Profil CCUS Edu">
        {profiles.map((profile) => (
          <article className="about-card" key={profile.title}>
            <span className="about-card-icon" aria-hidden="true">{profile.icon}</span>
            <h3>{profile.title}</h3>
            <p>
              {profile.title === "Kontak" ? (
                <a href="mailto:ccusedu@universitaspertamina.ac.id">{profile.description}</a>
              ) : profile.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
