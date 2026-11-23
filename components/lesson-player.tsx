"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { LearningMaterial } from "@/lib/materials";
import { useSiteContent } from "@/lib/site-content";
import {
  getProgressSnapshot,
  getServerProgressSnapshot,
  saveProgress,
  subscribeProgress,
} from "@/lib/progress";

export default function LessonPlayer({ material }: { material: LearningMaterial }) {
  const router = useRouter();
  const { lessons } = useSiteContent();
  const currentMaterial = lessons.find((item) => item.slug === material.slug) ?? material;
  const progressSnapshot = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getServerProgressSnapshot,
  );
  const progressValues = progressSnapshot.split(",").map((value) => Number(value));
  const materialIndex = lessons.findIndex((item) => item.slug === currentMaterial.slug);
  const nextMaterial = lessons[materialIndex + 1];
  const storedProgress = progressValues[materialIndex] ?? 0;
  const completedSlides = Number.isInteger(storedProgress) && storedProgress >= 0
    ? Math.min(storedProgress, currentMaterial.slides.length)
    : 0;
  const previousMaterial = lessons[materialIndex - 1];
  const previousProgress = progressValues[materialIndex - 1] ?? 0;
  const isLocked = materialIndex > 0
    && (!previousMaterial || previousProgress < previousMaterial.slides.length);
  const [selectedSlide, setSelectedSlide] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState("Progress tersimpan otomatis");
  const totalSlides = currentMaterial.slides.length;
  const percentage = totalSlides ? Math.round((completedSlides / totalSlides) * 100) : 0;
  const isCompleted = completedSlides >= totalSlides;
  const currentSlide = selectedSlide
    ?? (isCompleted ? totalSlides - 1 : completedSlides);

  useEffect(() => {
    if (isLocked) router.replace("/belajar-ccus?locked=1");
  }, [isLocked, router]);

  function showSlide(index: number) {
    if (index < 0 || index >= totalSlides || index > completedSlides) return;
    setSelectedSlide(index);
  }

  function completeCurrentSlide() {
    setSaveStatus("Menyimpan progress...");
    try {
      const nextCompleted = Math.min(
        totalSlides,
        Math.max(completedSlides, currentSlide + 1),
      );
      saveProgress(currentMaterial.slug, nextCompleted);
      if (nextCompleted >= totalSlides) {
        setSaveStatus("🎉 Materi berhasil diselesaikan!");
      } else {
        setSelectedSlide(Math.min(currentSlide + 1, nextCompleted));
        setSaveStatus("✓ Progress tersimpan");
      }
    } catch (error) {
      setSaveStatus("Gagal menyimpan progress");
      window.alert(
        error instanceof Error
          ? `Progress tidak dapat disimpan: ${error.message}`
          : "Progress tidak dapat disimpan.",
      );
    }
  }

  function restartLesson() {
    setSaveStatus("Mengatur ulang progress...");
    try {
      saveProgress(currentMaterial.slug, 0);
      setSelectedSlide(0);
      setSaveStatus("Materi siap dimulai kembali");
    } catch (error) {
      setSaveStatus("Gagal mengatur ulang progress");
      window.alert(
        error instanceof Error
          ? `Progress tidak dapat diatur ulang: ${error.message}`
          : "Progress tidak dapat diatur ulang.",
      );
    }
  }

  if (isLocked) {
    return <main className="lesson-page"><div className="container lesson-breadcrumb">Memuat materi...</div></main>;
  }

  return (
    <main className="lesson-page" data-learn-player>
      <div className="container lesson-breadcrumb">
        <Link href="/belajar-ccus">Belajar CCUS</Link>
        <span>›</span>
        <span>{currentMaterial.title}</span>
      </div>

      <section className="container lesson-hero">
        <div className="lesson-hero-copy">
          <span className="section-kicker green-kicker">
            MATERI {String(currentMaterial.number).padStart(2, "0")} / {currentMaterial.category}
          </span>
          <h1>{currentMaterial.title}</h1>
          <p>{currentMaterial.description}</p>
          <div className="lesson-meta">
            <span>📖 {totalSlides} Slide</span>
            <span>⏱️ {currentMaterial.duration}</span>
          </div>
        </div>
        <div className="lesson-hero-art">
          <Image
            className="lesson-hero-image"
            src="/images/ccus_edu_asset_library/ccus_process_nature/ccus_process_nature_01.png"
            alt="Ilustrasi fasilitas CCUS di lingkungan hijau"
            width={438}
            height={261}
            loading="eager"
          />
        </div>
      </section>

      <section className="container lesson-workspace">
        <aside className="lesson-sidebar">
          <div className="lesson-sidebar-heading"><span>📚</span><h2>Daftar Isi</h2></div>
          <div className="lesson-toc">
            {currentMaterial.slides.map((slide, index) => (
              <button
                type="button"
                className={`toc-item${index === currentSlide && !isCompleted ? " active" : ""}${index < completedSlides ? " completed" : ""}`}
                data-toc-index={index}
                disabled={index > completedSlides || isCompleted}
                key={slide.title}
                onClick={() => showSlide(index)}
              >
                <span className="toc-icon">{index < completedSlides ? "✓" : "◈"}</span>
                <span className="toc-title">{slide.title}</span>
                {index === currentSlide && !isCompleted && <span className="toc-current-dot" />}
              </button>
            ))}
          </div>
          <div className="lesson-sidebar-footer">
            <span>YOUR PROGRESS</span>
            <strong data-progress-label>{percentage}%</strong>
            <div className="lesson-progress-track">
              <div className="lesson-progress-fill" data-progress-fill style={{ width: `${percentage}%` }} />
            </div>
            <small data-slide-count>{completedSlides} dari {totalSlides} slide selesai</small>
          </div>
        </aside>

        <div className="lesson-content-card">
          {!isCompleted ? (
            <>
              <div className="lesson-content-top">
                <div className="lesson-slide-indicator"><span data-current-number>{currentSlide + 1}</span> / {totalSlides}</div>
                <div className="lesson-navigation">
                  <button
                    type="button"
                    className="lesson-nav-button"
                    data-prev-slide
                    disabled={currentSlide === 0}
                    onClick={() => showSlide(currentSlide - 1)}
                  >
                    ← Sebelumnya
                  </button>
                  <button
                    type="button"
                    className="lesson-nav-button next"
                    data-next-slide
                    onClick={completeCurrentSlide}
                  >
                    {currentSlide === totalSlides - 1 ? "Selesaikan Materi" : "Selanjutnya →"}
                  </button>
                </div>
              </div>
              <div className="lesson-slides">
                {currentMaterial.slides.map((slide, index) => (
                  <article
                    className={`lesson-slide${index === currentSlide ? " active" : ""}`}
                    data-slide={index}
                    hidden={index !== currentSlide}
                    key={slide.title}
                  >
                    <span className="slide-kicker">BAGIAN {String(index + 1).padStart(2, "0")}</span>
                    <h2>{slide.title}</h2>
                    <p className="slide-body">{slide.body}</p>
                    <div className="slide-takeaway">
                      <div className="takeaway-icon">✦</div>
                      <div><strong>Tujuan Pembelajaran</strong><p>{slide.takeaway}</p></div>
                    </div>
                    <div className="slide-mascot">
                      <Image
                        src="/images/ccus_edu_asset_library/coco_game_education/coco_game_education_01.png"
                        alt="Coco sedang membaca"
                        width={90}
                        height={90}
                      />
                      <span>{index === totalSlides - 1 ? "Hebat! Kamu hampir selesai!" : "Yuk, lanjut belajar!"}</span>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="lesson-completion" data-completion>
              <div className="completion-icon">🎉</div>
              <h2>Materi Berhasil Diselesaikan!</h2>
              <p>Hebat! Kamu sudah menyelesaikan seluruh slide {currentMaterial.title}.</p>
              <div className="completion-actions">
                <button type="button" className="completion-button secondary" onClick={restartLesson}>
                  ↻ Mulai Ulang Materi
                </button>
                <Link href="/belajar-ccus" className="completion-button">
                  Kembali ke Daftar Materi
                </Link>
                {nextMaterial && (
                  <Link href={`/belajar-ccus/${nextMaterial.slug}`} className="completion-button">
                    Materi Berikutnya →
                  </Link>
                )}
              </div>
            </div>
          )}
          <div className="lesson-content-footer">
            <span>🌱 Pelajari setiap bagian untuk menyelesaikan materi.</span>
            <span data-save-status>{saveStatus}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
