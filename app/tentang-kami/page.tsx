import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Tentang Kami — CCUS Edu",
  description: "Mengenal visi, misi, dan tim pengembang CCUS Edu.",
};

const profiles = [
  {
    icon: "/images/ccus_edu_asset_library/coco_game_education/coco_game_education_07.png",
    title: "Visi",
    description: "Meningkatkan literasi tentang teknologi CCUS di Indonesia.",
  },
  {
    icon: "/images/ccus_edu_asset_library/ccus_process_nature/ccus_process_nature_10.png",
    title: "Misi",
    description: "Menyediakan media pembelajaran yang mudah, interaktif, dan terpercaya.",
  },
  {
    icon: "/images/ccus_edu_asset_library/coco_game_education/coco_game_education_01.png",
    title: "Tim Pengembang",
    description: "Mahasiswa Universitas Pertamina.",
  },
  {
    icon: "/images/ccus_edu_asset_library/industrial_nature_education/industrial_nature_education_08.png",
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
            <Image
              src="/images/ccus_edu_asset_library/industrial_nature_education/industrial_nature_education_01.png"
              alt="Ilustrasi pabrik CCUS yang ramah lingkungan"
              width={520}
              height={331}
            />
          </div>
        </div>
      </section>

      <section className="container about-values" aria-label="Profil CCUS Edu">
        {profiles.map((profile) => (
          <article className="about-card" key={profile.title}>
            <span className="about-card-icon" aria-hidden="true">
              <Image src={profile.icon} alt="" width={38} height={38} />
            </span>
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
