"use client";

import { useState } from "react";
import Link from "next/link";
import {
  getDefaultSiteContent,
  resetSiteContent,
  saveSiteContent,
  useSiteContent,
  type QuizQuestion,
  type ResourceCategory,
  type ResourceFormat,
  type SiteContent,
} from "@/lib/site-content";

type EditorSection = "lessons" | "resources" | "questions";

export default function AdminPage() {
  const liveContent = useSiteContent();
  const [content, setContent] = useState<SiteContent>(() => structuredClone(liveContent));
  const [section, setSection] = useState<EditorSection>("lessons");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [status, setStatus] = useState("");

  function save() {
    try {
      saveSiteContent(content);
      setStatus("Perubahan berhasil disimpan.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Perubahan gagal disimpan.");
    }
  }

  function reset() {
    if (!window.confirm("Kembalikan semua konten ke pengaturan bawaan?")) return;
    resetSiteContent();
    setContent(getDefaultSiteContent());
    setStatus("Konten bawaan berhasil dipulihkan.");
  }

  const lessonItems = content.lessons;
  const resourceItems = content.resources;
  const questionItems = content.questions;
  const safeIndex = Math.min(selectedIndex, (
    section === "lessons" ? lessonItems.length : section === "resources" ? resourceItems.length : questionItems.length
  ) - 1);
  const activeIndex = Math.max(0, safeIndex);

  return (
    <main className="admin-page">
      <div className="container admin-shell">
        <header className="admin-heading">
          <div>
            <span className="admin-kicker">PENGELOLAAN KONTEN</span>
            <h1>Admin CCUS Edu</h1>
            <p>Edit materi, modul, dan soal yang tampil pada website.</p>
          </div>
          <Link className="admin-back" href="/">← Kembali ke Website</Link>
        </header>

        <nav className="admin-tabs" aria-label="Bagian konten">
          {([
            ["lessons", "Belajar CCUS"],
            ["resources", "Materi & Modul"],
            ["questions", "Uji Pemahaman"],
          ] as [EditorSection, string][]).map(([value, label]) => (
            <button
              type="button"
              className={section === value ? "active" : ""}
              onClick={() => { setSection(value); setSelectedIndex(0); }}
              key={value}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="admin-workspace">
          <aside className="admin-list">
            <strong>{section === "lessons" ? "Daftar Materi" : section === "resources" ? "Daftar Unduhan" : "Daftar Soal"}</strong>
            {(section === "lessons" ? lessonItems : section === "resources" ? resourceItems : questionItems).map((item, index) => (
              <button
                type="button"
                className={activeIndex === index ? "active" : ""}
                onClick={() => setSelectedIndex(index)}
                key={"slug" in item ? item.slug : `question-${index}`}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {"title" in item ? item.title : item.question}
              </button>
            ))}
          </aside>

          <section className="admin-editor">
            {section === "lessons" && lessonItems[activeIndex] && (
              <div className="admin-fields">
                <div className="admin-field-row">
                  <label><span>Judul</span><input value={lessonItems[activeIndex].title} onChange={(event) => setContent((current) => ({ ...current, lessons: current.lessons.map((item, index) => index === activeIndex ? { ...item, title: event.target.value } : item) }))} /></label>
                  <label><span>Judul Pendek</span><input value={lessonItems[activeIndex].short_title} onChange={(event) => setContent((current) => ({ ...current, lessons: current.lessons.map((item, index) => index === activeIndex ? { ...item, short_title: event.target.value } : item) }))} /></label>
                </div>
                <div className="admin-field-row">
                  <label><span>Kategori</span><input value={lessonItems[activeIndex].category} onChange={(event) => setContent((current) => ({ ...current, lessons: current.lessons.map((item, index) => index === activeIndex ? { ...item, category: event.target.value } : item) }))} /></label>
                  <label><span>Durasi</span><input value={lessonItems[activeIndex].duration} onChange={(event) => setContent((current) => ({ ...current, lessons: current.lessons.map((item, index) => index === activeIndex ? { ...item, duration: event.target.value } : item) }))} /></label>
                </div>
                <label><span>Deskripsi</span><textarea rows={3} value={lessonItems[activeIndex].description} onChange={(event) => setContent((current) => ({ ...current, lessons: current.lessons.map((item, index) => index === activeIndex ? { ...item, description: event.target.value } : item) }))} /></label>
                <div className="admin-slides">
                  <strong>Slide Materi</strong>
                  {lessonItems[activeIndex].slides.map((slide, slideIndex) => (
                    <fieldset key={`${lessonItems[activeIndex].slug}-${slideIndex}`}>
                      <legend>Slide {slideIndex + 1}</legend>
                      <label><span>Judul slide</span><input value={slide.title} onChange={(event) => setContent((current) => ({ ...current, lessons: current.lessons.map((item, itemIndex) => itemIndex === activeIndex ? { ...item, slides: item.slides.map((value, index) => index === slideIndex ? { ...value, title: event.target.value } : value) } : item) }))} /></label>
                      <label><span>Isi</span><textarea rows={4} value={slide.body} onChange={(event) => setContent((current) => ({ ...current, lessons: current.lessons.map((item, itemIndex) => itemIndex === activeIndex ? { ...item, slides: item.slides.map((value, index) => index === slideIndex ? { ...value, body: event.target.value } : value) } : item) }))} /></label>
                      <label><span>Tujuan pembelajaran</span><textarea rows={2} value={slide.takeaway} onChange={(event) => setContent((current) => ({ ...current, lessons: current.lessons.map((item, itemIndex) => itemIndex === activeIndex ? { ...item, slides: item.slides.map((value, index) => index === slideIndex ? { ...value, takeaway: event.target.value } : value) } : item) }))} /></label>
                    </fieldset>
                  ))}
                </div>
              </div>
            )}

            {section === "resources" && resourceItems[activeIndex] && (
              <div className="admin-fields">
                <div className="admin-field-row">
                  <label><span>Judul</span><input value={resourceItems[activeIndex].title} onChange={(event) => setContent((current) => ({ ...current, resources: current.resources.map((item, index) => index === activeIndex ? { ...item, title: event.target.value } : item) }))} /></label>
                  <label><span>Nama File</span><input value={resourceItems[activeIndex].filename} onChange={(event) => setContent((current) => ({ ...current, resources: current.resources.map((item, index) => index === activeIndex ? { ...item, filename: event.target.value } : item) }))} /></label>
                </div>
                <div className="admin-field-row">
                  <label><span>Kategori</span><select value={resourceItems[activeIndex].category} onChange={(event) => setContent((current) => ({ ...current, resources: current.resources.map((item, index) => index === activeIndex ? { ...item, category: event.target.value as ResourceCategory } : item) }))}><option value="modul">Modul</option><option value="infografik">Infografik</option><option value="video">Video</option></select></label>
                  <label><span>Format</span><select value={resourceItems[activeIndex].format} onChange={(event) => setContent((current) => ({ ...current, resources: current.resources.map((item, index) => index === activeIndex ? { ...item, format: event.target.value as ResourceFormat } : item) }))}><option value="pdf">PDF</option><option value="ppt">PPT</option><option value="mp4">MP4</option></select></label>
                </div>
                <label><span>Deskripsi</span><textarea rows={4} value={resourceItems[activeIndex].description} onChange={(event) => setContent((current) => ({ ...current, resources: current.resources.map((item, index) => index === activeIndex ? { ...item, description: event.target.value } : item) }))} /></label>
                <label><span>Kata Kunci Pencarian</span><input value={resourceItems[activeIndex].topics} onChange={(event) => setContent((current) => ({ ...current, resources: current.resources.map((item, index) => index === activeIndex ? { ...item, topics: event.target.value } : item) }))} /></label>
              </div>
            )}

            {section === "questions" && questionItems[activeIndex] && (
              <div className="admin-fields">
                <label><span>Pertanyaan</span><textarea rows={3} value={questionItems[activeIndex].question} onChange={(event) => setContent((current) => ({ ...current, questions: current.questions.map((item, index) => index === activeIndex ? { ...item, question: event.target.value } : item) }))} /></label>
                <label><span>Kategori</span><select value={questionItems[activeIndex].category} onChange={(event) => setContent((current) => ({ ...current, questions: current.questions.map((item, index) => index === activeIndex ? { ...item, category: event.target.value as QuizQuestion["category"] } : item) }))}><option value="basics">Konsep Dasar CCUS</option><option value="process">Rantai Proses CCUS</option></select></label>
                <div className="admin-options">
                  <strong>Pilihan Jawaban</strong>
                  {questionItems[activeIndex].options.map((option, optionIndex) => (
                    <label key={optionIndex}><span>{String.fromCharCode(65 + optionIndex)}{questionItems[activeIndex].correctIndex === optionIndex ? " · Jawaban benar" : ""}</span><input value={option} onChange={(event) => setContent((current) => ({ ...current, questions: current.questions.map((item, index) => index === activeIndex ? { ...item, options: item.options.map((value, index) => index === optionIndex ? event.target.value : value) } : item) }))} /></label>
                  ))}
                  <label><span>Jawaban Benar</span><select value={questionItems[activeIndex].correctIndex} onChange={(event) => setContent((current) => ({ ...current, questions: current.questions.map((item, index) => index === activeIndex ? { ...item, correctIndex: Number(event.target.value) } : item) }))}>{questionItems[activeIndex].options.map((_, index) => <option value={index} key={index}>Pilihan {String.fromCharCode(65 + index)}</option>)}</select></label>
                </div>
                <label><span>Pembahasan</span><textarea rows={4} value={questionItems[activeIndex].explanation} onChange={(event) => setContent((current) => ({ ...current, questions: current.questions.map((item, index) => index === activeIndex ? { ...item, explanation: event.target.value } : item) }))} /></label>
              </div>
            )}

            <div className="admin-actions">
              <button type="button" className="admin-save" onClick={save}>Simpan Perubahan</button>
              <button type="button" className="admin-reset" onClick={reset}>Pulihkan Konten Bawaan</button>
              {status && <span role="status">{status}</span>}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
