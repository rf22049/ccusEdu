"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useSiteContent } from "@/lib/site-content";
import {
  getProgressSnapshot,
  getServerProgressSnapshot,
  subscribeProgress,
} from "@/lib/progress";

const materialIllustrations: Record<string, string> = {
  "pengantar-ccus": "/images/ccus_edu_asset_library/ccus_process_nature/ccus_process_nature_01.png",
  "carbon-capture": "/images/ccus_edu_asset_library/ccus_process_nature/ccus_process_nature_02.png",
  "carbon-utilization": "/images/ccus_edu_asset_library/ccus_process_nature/ccus_process_nature_03.png",
  "carbon-storage": "/images/ccus_edu_asset_library/industrial_nature_education/industrial_nature_education_03.png",
  "integrasi-ccus": "/images/ccus_edu_asset_library/industrial_nature_education/industrial_nature_education_01.png",
  "ccus-indonesia": "/images/ccus_edu_asset_library/ccus_process_nature/ccus_process_nature_05.png",
};

function subscribeLocation(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

function getLocationSnapshot() {
  return window.location.search;
}

export default function LearningIndexPage() {
  const { lessons } = useSiteContent();
  const progressSnapshot = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getServerProgressSnapshot,
  );
  const locationSearch = useSyncExternalStore(subscribeLocation, getLocationSnapshot, () => "");
  const storedProgress = progressSnapshot.split(",").map((value) => Number(value));
  const progress = Object.fromEntries(
    lessons.map((material, index) => [
      material.slug,
      Number.isInteger(storedProgress[index]) && storedProgress[index] >= 0
        ? storedProgress[index]
        : 0,
    ]),
  );
  const lockedMessage = new URLSearchParams(locationSearch).has("locked")
    ? "Selesaikan materi sebelumnya untuk membuka materi ini."
    : "";

  return (
    <main className="learn-page">
      <section className="learn-hero">
        <div className="container learn-hero-inner">
          <div className="learn-hero-copy">
            <span className="section-kicker green-kicker">BELAJAR CCUS</span>
            <h1>Pahami CCUS<br />Langkah demi Langkah</h1>
            <p>
              Pelajari konsep, proses, teknologi, dan penerapan CCUS melalui
              materi yang tersusun sistematis dan interaktif.
            </p>
            <div className="learn-hero-meta">
              <span>📚 {lessons.length} Materi</span>
              <span>⏱️ Belajar sesuai ritmemu</span>
            </div>
          </div>
          <div className="learn-hero-mascot">
            <div className="learn-decoration decoration-one">✦</div>
            <div className="learn-decoration decoration-two">✦</div>
            <Image
              src="/images/ccus_edu_asset_library/coco_game_education/coco_game_education_01.png"
              alt="Coco sedang belajar CCUS"
              width={210}
              height={210}
              loading="eager"
            />
            <div className="mascot-caption"><span>👋</span> Yuk, belajar bersama Coco!</div>
          </div>
        </div>
      </section>

      <section className="container learn-content">
        {lockedMessage && (
          <div className="learn-notice" role="status"><span>🔒</span>{lockedMessage}</div>
        )}
        <div className="learn-layout">
          <aside className="learn-sidebar">
            <h3>Daftar Materi</h3>
            <a href="#semua-materi" className="sidebar-link active"><span>⌂</span>Semua Materi</a>
            {lessons.map((material, index) => {
              const isCompleted = (progress[material.slug] ?? 0) >= material.slides.length;
              const isUnlocked = index === 0
                || (progress[lessons[index - 1].slug] ?? 0) >= lessons[index - 1].slides.length;
              return (
                <a className="sidebar-link" href={`#material-${material.number}`} key={material.slug}>
                  <span>{isCompleted ? "✓" : isUnlocked ? "◉" : "🔒"}</span>
                  {material.short_title}
                </a>
              );
            })}
          </aside>

          <div className="learn-main" id="semua-materi">
            <div className="material-heading">
              <div>
                <span className="section-kicker green-kicker">DAFTAR MATERI</span>
                <h2>Materi Belajar CCUS</h2>
                <p>Selesaikan materi secara berurutan untuk membuka pembelajaran berikutnya.</p>
              </div>
              <span className="material-count">{String(lessons.length).padStart(2, "0")} MATERI</span>
            </div>
            <div className="material-grid">
              {lessons.map((material, index) => {
                const completed = Math.min(progress[material.slug] ?? 0, material.slides.length);
                const percentage = material.slides.length > 0
                  ? Math.round((completed / material.slides.length) * 100)
                  : 0;
                const isUnlocked = index === 0
                  || (progress[lessons[index - 1].slug] ?? 0) >= lessons[index - 1].slides.length;
                const isCompleted = completed >= material.slides.length;
                return (
                  <article
                    className={`material-card${!isUnlocked ? " is-locked" : ""}${isCompleted ? " is-completed" : ""}`}
                    id={`material-${material.number}`}
                    key={material.slug}
                  >
                    <div className="material-card-top">
                      <div className="material-icon">
                        <Image
                          src={materialIllustrations[material.slug]}
                          alt=""
                          width={46}
                          height={46}
                        />
                      </div>
                      {isCompleted ? (
                        <span className="material-status status-complete">✓ Selesai</span>
                      ) : !isUnlocked ? (
                        <span className="material-status status-locked">🔒 Terkunci</span>
                      ) : (
                        <span className="material-status status-open">● Tersedia</span>
                      )}
                    </div>
                    <span className="material-category">{material.category}</span>
                    <h3>{material.number}. {material.title}</h3>
                    <p className="material-description">{material.description}</p>
                    <div className="material-progress-area">
                      <div className="material-progress-info">
                        <span>{completed}/{material.slides.length} Slide</span>
                        <strong>{percentage}%</strong>
                      </div>
                      <div className="material-progress-track">
                        <div className="material-progress-fill" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                    {isUnlocked ? (
                      <Link href={`/belajar-ccus/${material.slug}`} className="material-button">
                        {isCompleted ? "Pelajari Kembali" : percentage > 0 ? "Lanjutkan Belajar" : "Mulai Belajar"}
                        <span>→</span>
                      </Link>
                    ) : (
                      <div className="material-button disabled">Selesaikan materi sebelumnya <span>🔒</span></div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
