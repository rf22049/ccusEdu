"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useSyncExternalStore } from "react";
import { useAnalytics, useAnalyticsClock } from "@/lib/analytics";
import {
  getProgressSnapshot,
  getServerProgressSnapshot,
  subscribeProgress,
} from "@/lib/progress";
import { deleteResourceFile, getResourceFile, saveResourceFile } from "@/lib/resource-files";
import {
  resetSiteContent,
  saveSiteContent,
  useSiteContent,
  type QuizQuestion,
  type ResourceCategory,
  type ResourceFormat,
  type SiteContent,
} from "@/lib/site-content";

type AdminView = "ringkasan" | "konten" | "soal" | "hasil";

function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v15h4.5A2.5 2.5 0 0 1 20 20.5z" /></>,
    quiz: <><circle cx="12" cy="12" r="9" /><path d="M9.7 9a2.4 2.4 0 1 1 3.8 2c-1.1.7-1.5 1.2-1.5 2.3" /><circle cx="12" cy="16.5" r=".7" fill="currentColor" /></>,
    chart: <><path d="M5 20V10m7 10V4m7 16v-7" /><path d="M3 20h18" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3.5 19c.5-3.5 2.3-5.3 5.5-5.3s5 1.8 5.5 5.3" /><circle cx="17" cy="9" r="2" /><path d="M15.5 14c3 0 4.7 1.7 5 4.7" /></>,
    download: <><path d="M12 3v12m0 0 5-5m-5 5-5-5" /><path d="M5 21h14" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  };
  return <svg className="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function AdminPage() {
  return (
    <Suspense fallback={<main className="admin-page"><div className="container admin-shell" /></main>}>
      <AdminDashboard />
    </Suspense>
  );
}

function AdminDashboard() {
  const liveContent = useSiteContent();
  const analytics = useAnalytics();
  const analyticsClock = useAnalyticsClock();
  const progressSnapshot = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getServerProgressSnapshot,
  );
  const [draftContent, setDraftContent] = useState<SiteContent | null>(null);
  const content = draftContent ?? liveContent;
  function setContent(update: React.SetStateAction<SiteContent>) {
    setDraftContent((current) => (
      typeof update === "function" ? update(current ?? liveContent) : update
    ));
  }
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view");
  const view: AdminView = viewParam === "konten" || viewParam === "soal" || viewParam === "hasil" || viewParam === "ringkasan"
    ? viewParam
    : "ringkasan";
  const setView = (nextView: AdminView) => router.push(`/admin?view=${nextView}`);
  const editorSection: "lessons" | "resources" = searchParams.get("section") === "resources" ? "resources" : "lessons";
  const setEditorSection = (section: "lessons" | "resources", slug?: string) => {
    const items = section === "resources" ? content.resources : content.lessons;
    const params = new URLSearchParams({ view: "konten", section });
    const targetSlug = slug ?? items[0]?.slug;
    if (targetSlug) params.set("item", targetSlug);
    router.push(`/admin?${params.toString()}`);
  };
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [questionCategory, setQuestionCategory] = useState("all");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [resultsCategory, setResultsCategory] = useState("all");
  const [status, setStatus] = useState("");
  const [storedFileNames, setStoredFileNames] = useState<Record<string, string>>({});

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
    setDraftContent(null);
    setStatus("Konten bawaan berhasil dipulihkan.");
  }

  const lessons = content.lessons;
  const resources = content.resources;
  const questions = content.questions;
  const sectionItems = editorSection === "resources" ? resources : lessons;
  const selectedSlug = searchParams.get("item");
  const selectedItemIndex = sectionItems.findIndex((item) => item.slug === selectedSlug);
  const selectedIndex = selectedItemIndex >= 0 ? selectedItemIndex : 0;
  const questionCategories = content.questionCategories;
  const categoryLabels = new Map(questionCategories.map((category) => [category.id, category.name]));
  const lessonIndex = Math.min(selectedIndex, lessons.length - 1);
  const activeLesson = lessons[Math.max(0, lessonIndex)];
  const activeSlideIndex = activeLesson?.slides.length
    ? Math.min(selectedSlide, activeLesson.slides.length - 1)
    : 0;
  const resourceIndex = Math.min(selectedIndex, resources.length - 1);
  const activeResource = resources[Math.max(0, resourceIndex)];
  const activeResourceSlug = activeResource?.slug;
  const storedFileName = editorSection === "resources" && activeResourceSlug
    ? storedFileNames[activeResourceSlug] ?? ""
    : "";
  const filteredQuestions = questionCategory === "all"
    ? questions
    : questions.filter((question) => question.category === questionCategory);
  const preferredQuestion = questions[selectedQuestion];
  const preferredQuestionIndex = preferredQuestion ? filteredQuestions.indexOf(preferredQuestion) : -1;
  const questionIndex = preferredQuestionIndex >= 0
    ? questions.indexOf(preferredQuestion)
    : filteredQuestions.length
      ? questions.indexOf(filteredQuestions[0])
      : -1;
  const activeQuestion = questions[questionIndex];
  const progressValues = progressSnapshot.split(",").map((value) => Number(value));
  const recentEvents = analytics.filter((event) => event.at >= analyticsClock - 30 * 24 * 60 * 60 * 1000);
  const pageViews = recentEvents.filter((event) => event.type === "page-view");
  const activeSessions = new Set(
    pageViews
      .filter((event) => event.at >= analyticsClock - 30 * 60 * 1000)
      .map((event) => event.sessionId),
  );
  const activeVisitors = new Set(
    pageViews
      .filter((event) => event.at >= analyticsClock - 30 * 60 * 1000)
      .map((event) => event.visitorId),
  );
  const visitDaysByVisitor = new Map<string, Set<string>>();
  pageViews.forEach((event) => {
    const visitDays = visitDaysByVisitor.get(event.visitorId) ?? new Set<string>();
    visitDays.add(new Date(event.at).toLocaleDateString("en-CA"));
    visitDaysByVisitor.set(event.visitorId, visitDays);
  });
  const retainedVisitors = [...visitDaysByVisitor.values()].filter((days) => days.size > 1).length;
  const retentionRate = visitDaysByVisitor.size
    ? Math.round((retainedVisitors / visitDaysByVisitor.size) * 100)
    : 0;
  const durations = recentEvents.filter((event) => event.type === "page-duration");
  const averageDuration = durations.length
    ? Math.round(durations.reduce((total, event) => total + event.seconds, 0) / durations.length)
    : 0;
  const quizResults = recentEvents.filter((event) => event.type === "quiz-result");
  const averageScore = quizResults.length
    ? Math.round(quizResults.reduce((total, event) => total + event.score, 0) / quizResults.length)
    : 0;
  const downloadEvents = recentEvents.filter((event) => event.type === "resource-download");
  const pageCounts = new Map<string, number>();
  pageViews.forEach((event) => pageCounts.set(event.path, (pageCounts.get(event.path) ?? 0) + 1));
  const topPages = [...pageCounts.entries()].sort((first, second) => second[1] - first[1]).slice(0, 4);
  const questionResults = new Map<string, { correct: number; total: number }>();
  quizResults.forEach((event) => {
    event.questions.forEach((result) => {
      const current = questionResults.get(result.text) ?? { correct: 0, total: 0 };
      current.total += 1;
      current.correct += Number(result.correct);
      questionResults.set(result.text, current);
    });
  });
  const questionPerformance = questions
    .map((question, index) => {
      const result = questionResults.get(question.question) ?? { correct: 0, total: 0 };
      return {
        question,
        index,
        correctRate: result.total ? Math.round((result.correct / result.total) * 100) : null,
        attempts: result.total,
      };
    })
    .sort((first, second) => (first.correctRate ?? 101) - (second.correctRate ?? 101));
  const visibleQuestionPerformance = resultsCategory === "all"
    ? questionPerformance
    : questionPerformance.filter(({ question }) => question.category === resultsCategory);
  const completedLessons = lessons.filter((lesson, index) => {
    const stored = progressValues[index];
    return Number.isInteger(stored) && stored >= lesson.slides.length;
  }).length;
  const averageProgress = lessons.length
    ? Math.round(lessons.reduce((total, lesson, index) => {
      const stored = progressValues[index];
      return total + (lesson.slides.length
        ? Math.min(Number.isInteger(stored) && stored > 0 ? stored : 0, lesson.slides.length) / lesson.slides.length
        : 0);
    }, 0) / lessons.length * 100)
    : 0;

  function showNextFilteredQuestion() {
    if (!activeQuestion || filteredQuestions.length === 0) return;
    const activeFilteredIndex = filteredQuestions.indexOf(activeQuestion);
    const nextQuestion = filteredQuestions[(activeFilteredIndex + 1) % filteredQuestions.length];
    setSelectedQuestion(questions.indexOf(nextQuestion));
  }

  function addQuestion() {
    const question: QuizQuestion = {
      category: questionCategory === "all"
        ? questionCategories[0]?.id ?? "basics"
        : questionCategory,
      question: "Pertanyaan baru",
      options: ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
      correctIndex: 0,
      explanation: "Tambahkan pembahasan untuk pertanyaan ini.",
    };
    setContent((current) => ({ ...current, questions: [...current.questions, question] }));
    setSelectedQuestion(questions.length);
    setStatus("Soal baru ditambahkan. Lengkapi lalu simpan perubahan.");
  }

  function addQuestionCategory() {
    const name = newCategoryName.trim();
    if (!name) {
      setStatus("Isi nama kategori terlebih dahulu.");
      return;
    }
    const existing = questionCategories.find((category) => category.name.toLocaleLowerCase("id") === name.toLocaleLowerCase("id"));
    if (existing) {
      setQuestionCategory(existing.id);
      setStatus("Kategori dengan nama tersebut sudah ada.");
      return;
    }
    const id = `custom-${window.crypto.randomUUID()}`;
    setContent((current) => ({
      ...current,
      questionCategories: [...current.questionCategories, { id, name }],
    }));
    setQuestionCategory(id);
    setNewCategoryName("");
    setStatus(`Kategori "${name}" berhasil dibuat. Tambahkan soal ke kategori ini.`);
  }

  function deleteQuestion() {
    if (questions.length <= 1) {
      setStatus("Bank soal harus memiliki setidaknya satu soal.");
      return;
    }
    if (!window.confirm("Hapus soal ini dari bank soal?")) return;
    const nextQuestions = questions.filter((_, index) => index !== questionIndex);
    setContent((current) => ({ ...current, questions: nextQuestions }));
    setSelectedQuestion(Math.min(questionIndex, nextQuestions.length - 1));
    setStatus("Soal dihapus dari draf. Simpan perubahan untuk menerapkannya.");
  }

  async function uploadResource(file: File) {
    if (!activeResource) return;
    const expectedExtensions = activeResource.format === "ppt" ? [".ppt", ".pptx"] : [`.${activeResource.format}`];
    if (!expectedExtensions.some((extension) => file.name.toLowerCase().endsWith(extension))) {
      setStatus(`Format berkas harus ${activeResource.format.toUpperCase()}.`);
      return;
    }
    try {
      await saveResourceFile(activeResource.slug, file);
      setStoredFileNames((current) => ({ ...current, [activeResource.slug]: file.name }));
      setContent((current) => ({
        ...current,
        resources: current.resources.map((resource, index) => (
          index === resourceIndex ? { ...resource, filename: file.name } : resource
        )),
      }));
      setStatus(`Berkas ${file.name} tersimpan di browser ini. Simpan metadata untuk menerbitkannya.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Berkas tidak dapat disimpan.");
    }
  }

  function addResource() {
    const slug = `resource-${window.crypto.randomUUID()}`;
    const resource = {
      slug,
      title: "Materi Baru",
      description: "",
      category: "modul" as ResourceCategory,
      format: "pdf" as ResourceFormat,
      topics: "",
      filename: "",
    };
    setContent((current) => ({ ...current, resources: [...current.resources, resource] }));
    setEditorSection("resources", slug);
    setStatus("Materi baru ditambahkan. Lengkapi detail dan unggah file.");
  }

  async function deleteResource() {
    if (!activeResource || !window.confirm(`Hapus "${activeResource.title}"?`)) return;
    const nextResources = resources.filter((_, index) => index !== resourceIndex);
    const nextContent = { ...content, resources: nextResources };
    try {
      saveSiteContent(nextContent);
      setContent(nextContent);
      setEditorSection("resources", nextResources[Math.max(0, resourceIndex - 1)]?.slug);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Materi tidak dapat dihapus.");
      return;
    }
    try {
      await deleteResourceFile(activeResource.slug);
      setStatus("Materi dan file berhasil dihapus.");
    } catch (error) {
      setStatus(`Materi dihapus, tetapi file lokal gagal dihapus: ${error instanceof Error ? error.message : "kesalahan tidak diketahui."}`);
    }
  }

  const downloadsBySlug = new Map<string, number>();
  downloadEvents.forEach((event) => {
    downloadsBySlug.set(event.slug, (downloadsBySlug.get(event.slug) ?? 0) + 1);
  });
  useEffect(() => {
    let cancelled = false;
    if (editorSection !== "resources" || !activeResourceSlug) return;
    getResourceFile(activeResourceSlug)
      .then((file) => {
        if (!cancelled) {
          setStoredFileNames((current) => ({ ...current, [activeResourceSlug]: file?.name ?? "" }));
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setStatus(error instanceof Error ? error.message : "Berkas tidak dapat dibaca.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [activeResourceSlug, editorSection]);

  return (
    <main className="admin-page">
      <div className="container admin-shell">
        <section className="admin-hero">
          <span className="admin-kicker">{view === "ringkasan" ? "PANEL ADMINISTRATOR" : view === "konten" ? "EDITOR KONTEN" : view === "soal" ? "BANK SOAL" : "HASIL PEMAHAMAN"}</span>
          <div className="admin-hero-row">
            <div>
              <h1>{view === "ringkasan" ? "Aktivitas Belajar & Retensi Pelajar" : view === "konten" ? "Kelola Konten & Pantau Belajar CCUS Edu" : view === "soal" ? "Kelola Soal Pilihan Ganda CCUS" : "Analitik Uji Pemahaman & Bank Soal"}</h1>
              <p>{view === "ringkasan" ? "Pantau perkembangan konten, tingkat penyelesaian, dan unduhan materi." : view === "konten" ? "Edit semua materi pembelajaran, pantau isi modul, serta ganti file unduhan." : view === "soal" ? "Tambah, edit, dan periksa soal pilihan ganda serta pembahasan." : "Ringkasan hasil pengerjaan, tingkat kemahiran, dan soal dengan skor terendah."}</p>
            </div>
            {(view === "konten" || view === "soal") && (
              <div className="admin-hero-actions">
                {view === "soal" && <button type="button" className="admin-button primary" onClick={addQuestion}>Tambah Soal Baru</button>}
                {view === "konten" && <button type="button" className="admin-button secondary" onClick={reset}>Reset Konten</button>}
                {view === "konten" && editorSection === "resources" && <button type="button" className="admin-button secondary" onClick={addResource}>Tambah Materi</button>}
              </div>
            )}
          </div>
          {view === "ringkasan" && (
            <div className="admin-metrics">
              <div className="admin-metric"><span><Icon name="users" /> Pengunjung Aktif · perangkat ini</span><strong>{activeVisitors.size}</strong><small>{activeSessions.size} sesi · 30 menit</small></div>
              <div className="admin-metric"><span><Icon name="clock" /> Rata-rata Durasi</span><strong>{Math.floor(averageDuration / 60)}m {averageDuration % 60}d</strong><small>{durations.length} kunjungan tercatat</small></div>
              <div className="admin-metric"><span><Icon name="chart" /> Retensi Perangkat</span><strong>{retentionRate}%</strong><small>{visitDaysByVisitor.size} perangkat tercatat</small></div>
              <div className="admin-metric"><span><Icon name="quiz" /> Percobaan Kuis</span><strong>{quizResults.length}</strong><small>30 hari terakhir</small></div>
              <p className="admin-data-scope">Data lokal browser ini · diperbarui saat aktivitas terjadi</p>
            </div>
          )}
          {view === "konten" && (
            <div className="admin-mini-metrics">
              <span><Icon name="book" /> {lessons.length} Materi Aktif</span>
              <span><Icon name="download" /> {resources.length} Modul/Tautan</span>
              <span><Icon name="quiz" /> {questions.length} Soal Uji</span>
            </div>
          )}
          {view === "soal" && (
            <div className="admin-mini-metrics">
              <span><Icon name="quiz" /> {questions.length} Total Soal</span>
              <span><Icon name="users" /> {quizResults.length} Percobaan Tercatat</span>
              <span><Icon name="chart" /> Rata-rata {averageScore}%</span>
            </div>
          )}
          {view === "hasil" && (
            <div className="admin-mini-metrics">
              <span><Icon name="quiz" /> {quizResults.length} Total Percobaan</span>
              <span><Icon name="users" /> {quizResults.filter((event) => event.mode === "evaluation").length} Mode Evaluasi</span>
              <span><Icon name="chart" /> {averageScore}% Rata-rata</span>
            </div>
          )}
        </section>

        {view === "ringkasan" && (
          <section className="admin-dashboard-grid">
            <aside className="admin-status-card">
              <h2>Ringkasan Materi</h2>
              {lessons.map((lesson, index) => {
                const stored = progressValues[index];
                const completed = Number.isInteger(stored) && stored > 0
                  ? Math.min(stored, lesson.slides.length)
                  : 0;
                const percentage = lesson.slides.length ? Math.round((completed / lesson.slides.length) * 100) : 0;
                return (
                  <button type="button" className={index === selectedIndex ? "active" : ""} key={lesson.slug} onClick={() => { setSelectedSlide(0); setEditorSection("lessons", lesson.slug); }}>
                    <span>{lesson.short_title}</span><strong>{percentage}%</strong>
                  </button>
                );
              })}
            </aside>
            <div className="admin-progress-card">
              <div className="admin-card-heading"><div><h2>Progress Belajar CCUS</h2><p>Progress perangkat ini berdasarkan slide yang diselesaikan.</p></div><span>Perangkat ini</span></div>
              {lessons.map((lesson, index) => {
                const stored = progressValues[index];
                const complete = Number.isInteger(stored) && stored > 0 ? Math.min(stored, lesson.slides.length) : 0;
                const percent = lesson.slides.length ? Math.round((complete / lesson.slides.length) * 100) : 0;
                return (
                  <div className="admin-progress-row" key={lesson.slug}>
                    <span>{index + 1}. {lesson.short_title}</span><strong>{percent}%</strong>
                    <div><span style={{ width: `${percent}%` }} /></div>
                  </div>
                );
              })}
            </div>
            <div className="admin-table-card">
              <h2>Halaman Paling Sering Dikunjungi</h2>
              <p>Page view browser ini selama 30 hari terakhir.</p>
              <div className="admin-table">
                {topPages.map(([path, count]) => (
                  <div key={path}><span>{path}</span><strong>{count}</strong><small>kunjungan</small></div>
                ))}
                {topPages.length === 0 && <p className="admin-empty">Belum ada kunjungan tercatat.</p>}
              </div>
            </div>
            <aside className="admin-download-card">
              <h2>Unduhan Materi & Modul</h2><p>Unduhan melalui katalog pada browser ini.</p>
              {resources.map((resource) => (
                <div key={resource.slug}><span><strong>{resource.title}</strong><small>{resource.format.toUpperCase()}</small></span><b>{downloadsBySlug.get(resource.slug) ?? 0}</b></div>
              ))}
              <Link className="admin-card-button" href="/admin?view=konten&section=resources">Kelola File Unduhan <span>→</span></Link>
            </aside>
          </section>
        )}

        {view === "konten" && (
          <section className="admin-content-layout">
            <aside className="admin-sidebar">
              <h2>Menu Admin</h2>
              <button type="button" className={editorSection === "lessons" ? "active" : ""} onClick={() => { setEditorSection("lessons"); setSelectedSlide(0); }}><Icon name="book" /> Pengaturan Materi</button>
              <button type="button" onClick={() => setView("ringkasan")}><Icon name="chart" /> Ringkasan Belajar</button>
              <button type="button" className={editorSection === "resources" ? "active" : ""} onClick={() => setEditorSection("resources")}><Icon name="download" /> Materi & Modul</button>
              <button type="button" onClick={() => setView("hasil")}><Icon name="quiz" /> Analitik Uji Pemahaman</button>
              <button type="button" onClick={() => setView("soal")}><Icon name="book" /> Bank Soal</button>
              <div className="admin-completion"><strong>Progress Perangkat Ini</strong><b>{averageProgress}%</b><div><span style={{ width: `${averageProgress}%` }} /></div><small>{completedLessons} dari {lessons.length} materi selesai</small></div>
            </aside>

            {editorSection === "lessons" && activeLesson ? (
              <div className="admin-content-main">
                <div className="admin-card-heading admin-content-heading">
                  <div><span>{activeLesson.category}</span><h2>{activeLesson.number}. {activeLesson.title}</h2></div>
                </div>
                <div className="admin-editor-card">
                  <div className="admin-editor-topline"><strong>MATERI {String(activeLesson.number).padStart(2, "0")} / {activeLesson.category}</strong></div>
                  <div className="admin-form-grid">
                    <label><span>Label/Kategori</span><select value={activeLesson.category} onChange={(event) => setContent((current) => ({ ...current, lessons: current.lessons.map((item, index) => index === lessonIndex ? { ...item, category: event.target.value } : item) }))}><option>{activeLesson.category}</option><option>Pengenalan</option><option>Penangkapan</option><option>Pemanfaatan</option><option>Penyimpanan</option></select></label>
                    <label><span>Jabatan/Kode</span><input value={activeLesson.slug} readOnly /></label>
                    <label><span>Judul Materi</span><input value={activeLesson.title} onChange={(event) => setContent((current) => ({ ...current, lessons: current.lessons.map((item, index) => index === lessonIndex ? { ...item, title: event.target.value } : item) }))} /></label>
                    <label><span>Durasi</span><input value={activeLesson.duration} onChange={(event) => setContent((current) => ({ ...current, lessons: current.lessons.map((item, index) => index === lessonIndex ? { ...item, duration: event.target.value } : item) }))} /></label>
                    <label className="full"><span>Deskripsi Singkat</span><textarea rows={2} value={activeLesson.description} onChange={(event) => setContent((current) => ({ ...current, lessons: current.lessons.map((item, index) => index === lessonIndex ? { ...item, description: event.target.value } : item) }))} /></label>
                  </div>

                  <div className="admin-slide-tabs">
                    {activeLesson.slides.map((slide, index) => (
                      <button type="button" className={activeSlideIndex === index ? "active" : ""} onClick={() => setSelectedSlide(index)} key={slide.title}>Slide {index + 1}</button>
                    ))}
                    <button type="button" onClick={() => setStatus("Penambahan slide baru menyusul.")}>+ Tambah Slide</button>
                  </div>
                  {activeLesson.slides[activeSlideIndex] && (
                    <div className="admin-slide-fields">
                      <label><span>Judul Bagian Slide</span><input value={activeLesson.slides[activeSlideIndex].title} onChange={(event) => setContent((current) => ({ ...current, lessons: current.lessons.map((item, index) => index === lessonIndex ? { ...item, slides: item.slides.map((slide, slideIndex) => slideIndex === activeSlideIndex ? { ...slide, title: event.target.value } : slide) } : item) }))} /></label>
                      <label><span>Teks Penjelasan Utama</span><textarea rows={4} value={activeLesson.slides[activeSlideIndex].body} onChange={(event) => setContent((current) => ({ ...current, lessons: current.lessons.map((item, index) => index === lessonIndex ? { ...item, slides: item.slides.map((slide, slideIndex) => slideIndex === activeSlideIndex ? { ...slide, body: event.target.value } : slide) } : item) }))} /></label>
                      <div className="admin-takeaway"><span>Poin/Panduan Pembelajaran</span><input value={activeLesson.slides[activeSlideIndex].takeaway} onChange={(event) => setContent((current) => ({ ...current, lessons: current.lessons.map((item, index) => index === lessonIndex ? { ...item, slides: item.slides.map((slide, slideIndex) => slideIndex === activeSlideIndex ? { ...slide, takeaway: event.target.value } : slide) } : item) }))} /></div>
                    </div>
                  )}
                  <div className="admin-editor-footer"><small>Slide {activeSlideIndex + 1} dari {activeLesson.slides.length}</small><button type="button" className="admin-button primary" onClick={save}>Simpan Perubahan</button></div>
                </div>

                <div className="admin-resource-strip">
                  <div><strong>Kelola File Materi & Modul</strong><p>Cetak atau unduh file sesuai kategori.</p></div>
                  <div className="admin-resource-cards">
                    {resources.map((resource) => (
                      <button type="button" key={resource.slug} onClick={() => setEditorSection("resources", resource.slug)}><b>{resource.format.toUpperCase()}</b><strong>{resource.title}</strong><span>Lihat & Edit</span></button>
                    ))}
                  </div>
                </div>
              </div>
            ) : activeResource ? (
              <div className="admin-content-main">
                <div className="admin-card-heading"><div><span>BERKAS UNDUHAN</span><h2>{activeResource.title}</h2></div><button type="button" className="admin-button secondary" onClick={deleteResource}>Hapus Materi</button></div>
                <div className="admin-editor-card">
                  <div className="admin-form-grid">
                    <label><span>Judul File</span><input value={activeResource.title} onChange={(event) => setContent((current) => ({ ...current, resources: current.resources.map((item, index) => index === resourceIndex ? { ...item, title: event.target.value } : item) }))} /></label>
                    <label><span>Nama Berkas</span><input value={activeResource.filename} onChange={(event) => setContent((current) => ({ ...current, resources: current.resources.map((item, index) => index === resourceIndex ? { ...item, filename: event.target.value } : item) }))} /></label>
                    <label><span>Kategori</span><select value={activeResource.category} onChange={(event) => setContent((current) => ({ ...current, resources: current.resources.map((item, index) => index === resourceIndex ? { ...item, category: event.target.value as ResourceCategory } : item) }))}><option value="modul">Modul</option><option value="infografik">Infografik</option><option value="video">Video</option></select></label>
                    <label><span>Format</span><select value={activeResource.format} onChange={(event) => setContent((current) => ({ ...current, resources: current.resources.map((item, index) => index === resourceIndex ? { ...item, format: event.target.value as ResourceFormat } : item) }))}><option value="pdf">PDF</option><option value="ppt">PPT</option><option value="mp4">MP4</option></select></label>
                    <label className="full"><span>Deskripsi</span><textarea rows={4} value={activeResource.description} onChange={(event) => setContent((current) => ({ ...current, resources: current.resources.map((item, index) => index === resourceIndex ? { ...item, description: event.target.value } : item) }))} /></label>
                    <label className="full"><span>Kata kunci/topik pencarian</span><input value={activeResource.topics} onChange={(event) => setContent((current) => ({ ...current, resources: current.resources.map((item, index) => index === resourceIndex ? { ...item, topics: event.target.value } : item) }))} /></label>
                  </div>
                  <div className="admin-upload-row">
                    <label><span>Unggah file {activeResource.format === "ppt" ? ".ppt atau .pptx" : `.${activeResource.format}`}</span><input type="file" accept={activeResource.format === "ppt" ? ".ppt,.pptx" : `.${activeResource.format}`} onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void uploadResource(file);
                      event.currentTarget.value = "";
                    }} /></label>
                    <p>{storedFileName ? `Tersimpan di browser ini: ${storedFileName}` : "Belum ada file yang diunggah."} Metadata dan file hanya tersedia di browser ini.</p>
                  </div>
                  <div className="admin-editor-footer">
                    <small>Perubahan metadata belum disimpan.</small>
                    <button type="button" className="admin-button primary" onClick={save}>Simpan Materi</button>
                  </div>
                  <div className="admin-resource-cards large">
                    {resources.map((resource, index) => <button type="button" className={resourceIndex === index ? "active" : ""} onClick={() => setEditorSection("resources", resource.slug)} key={resource.slug}><b>{resource.format.toUpperCase()}</b><strong>{resource.title}</strong><span>{resource.filename || "Belum ada file"}</span></button>)}
                  </div>
                </div>
              </div>
            ) : <div className="admin-content-main"><div className="admin-editor-card"><p>Belum ada materi. Gunakan “Tambah Materi” untuk membuat item baru.</p></div></div>}
          </section>
        )}

        {view === "soal" && (
          <section className="admin-bank-layout">
            <aside className="admin-category-card">
              <h2>Kategori Soal</h2>
              <button type="button" className={questionCategory === "all" ? "active" : ""} onClick={() => setQuestionCategory("all")}><span>Semua Kategori</span><b>{questions.length}</b></button>
              {questionCategories.map((category) => (
                <button type="button" className={questionCategory === category.id ? "active" : ""} onClick={() => {
                  setQuestionCategory(category.id);
                  const firstQuestionIndex = questions.findIndex((question) => question.category === category.id);
                  if (firstQuestionIndex >= 0) setSelectedQuestion(firstQuestionIndex);
                }} key={category.id}><span>{category.name}</span><b>{questions.filter((question) => question.category === category.id).length}</b></button>
              ))}
              <form className="admin-new-category" onSubmit={(event) => { event.preventDefault(); addQuestionCategory(); }}>
                <label htmlFor="admin-new-category-name">Buat kategori baru</label>
                <input id="admin-new-category-name" value={newCategoryName} onChange={(event) => setNewCategoryName(event.target.value)} placeholder="Contoh: Transportasi CO₂" />
                <button type="submit" className="admin-button secondary">+ Tambah Kategori</button>
              </form>
            </aside>
            <div className="admin-question-editor">
              {activeQuestion && (
                <>
                  <div className="admin-card-heading"><div><span>{categoryLabels.get(activeQuestion.category) ?? "Tanpa kategori"}</span><h2>Edit Soal</h2></div><b className="admin-live-badge">Draf aktif</b></div>
                  <div className="admin-editor-card">
                    <div className="admin-form-grid">
                      <label><span>Kategori Materi</span><select value={activeQuestion.category} onChange={(event) => {
                        const nextCategory = event.target.value;
                        setQuestionCategory(nextCategory);
                        setContent((current) => ({ ...current, questions: current.questions.map((item, index) => index === questionIndex ? { ...item, category: nextCategory } : item) }));
                      }}>{questionCategories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label>
                      <label className="full"><span>Pertanyaan</span><textarea rows={3} value={activeQuestion.question} onChange={(event) => setContent((current) => ({ ...current, questions: current.questions.map((item, index) => index === questionIndex ? { ...item, question: event.target.value } : item) }))} /></label>
                    </div>
                    <div className="admin-options-editor">
                      {activeQuestion.options.map((option, index) => (
                        <label className={activeQuestion.correctIndex === index ? "correct" : ""} key={index}>
                          <input type="radio" checked={activeQuestion.correctIndex === index} onChange={() => setContent((current) => ({ ...current, questions: current.questions.map((item, itemIndex) => itemIndex === questionIndex ? { ...item, correctIndex: index } : item) }))} />
                          <b>{String.fromCharCode(65 + index)}</b>
                          <input value={option} onChange={(event) => setContent((current) => ({ ...current, questions: current.questions.map((item, itemIndex) => itemIndex === questionIndex ? { ...item, options: item.options.map((value, optionIndex) => optionIndex === index ? event.target.value : value) } : item) }))} />
                          {activeQuestion.correctIndex === index && <small>Benar</small>}
                        </label>
                      ))}
                    </div>
                    <label className="admin-explanation"><span>Pembahasan/Butir Latihan</span><textarea rows={3} value={activeQuestion.explanation} onChange={(event) => setContent((current) => ({ ...current, questions: current.questions.map((item, index) => index === questionIndex ? { ...item, explanation: event.target.value } : item) }))} /></label>
                    <div className="admin-editor-footer"><small>{filteredQuestions.length} soal pada kategori ini</small><button type="button" className="admin-button danger" onClick={deleteQuestion}>Hapus Soal</button><button type="button" className="admin-button secondary" onClick={showNextFilteredQuestion}>Soal Berikutnya</button><button type="button" className="admin-button primary" onClick={save}>Simpan Soal</button></div>
                  </div>
                  <div className="admin-question-table">
                    <div className="admin-card-heading"><div><h2>Soal · {questionCategory === "all" ? "Semua Kategori" : categoryLabels.get(questionCategory) ?? "Kategori"}</h2></div></div>
                    {filteredQuestions.map((question, index) => {
                      const globalIndex = questions.indexOf(question);
                      const result = questionResults.get(question.question);
                      const correctRate = result?.total ? Math.round((result.correct / result.total) * 100) : null;
                      return (
                        <button type="button" className={selectedQuestion === globalIndex ? "active" : ""} key={`${globalIndex}-${question.question}`} onClick={() => setSelectedQuestion(globalIndex)}>
                          <span>{String(index + 1).padStart(2, "0")}</span><strong>{question.question}</strong><b>{correctRate === null ? "—" : `${correctRate}% Benar`}</b><small>{result?.total ? `${result.total}x` : "Belum ada data"}</small>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
              {!activeQuestion && (
                <div className="admin-editor-card admin-empty-editor">
                  <p>Kategori ini belum memiliki soal.</p>
                  <button type="button" className="admin-button primary" onClick={addQuestion}>Tambah soal ke kategori ini</button>
                </div>
              )}
            </div>
          </section>
        )}

        {view === "hasil" && (
          <section className="admin-results-layout">
            <aside className="admin-category-card">
              <h2>Filter Kategori</h2>
              {[
                ["all", "Semua Materi", questions.length],
                ...questionCategories.map((category) => [
                  category.id,
                  category.name,
                  questions.filter((question) => question.category === category.id).length,
                ]),
              ].map(([value, label, count]) => (
                <button type="button" className={resultsCategory === value ? "active" : ""} key={String(value)} onClick={() => setResultsCategory(String(value))}><span>{label}</span><b>{count}</b></button>
              ))}
              <div className="admin-difficulty"><strong>Rata-rata Nilai</strong><b>{averageScore}%</b><div><span style={{ width: `${averageScore}%` }} /></div><small>{quizResults.length} percobaan tercatat</small></div>
            </aside>
            <div className="admin-results-main">
              <div className="admin-result-metrics">
                <div><span>Total Percobaan</span><strong>{quizResults.length}</strong><small>30 hari terakhir</small></div>
                <div><span>Percobaan Evaluasi</span><strong>{quizResults.filter((event) => event.mode === "evaluation").length}</strong><small>Mode bernilai</small></div>
                <div><span>Rata-rata Nilai</span><strong>{averageScore}%</strong><small>{quizResults.length ? "Semua mode" : "Belum ada data"}</small></div>
              </div>
              <div className="admin-top-answers">
                <div className="admin-card-heading"><div><h2>Analitik Butir Soal</h2><p>Jawaban benar berdasarkan percobaan kuis di browser ini.</p></div></div>
                {visibleQuestionPerformance.map(({ question, index, correctRate, attempts }) => (
                  <div className="admin-answer-row" key={`${index}-${question.question}`}><b>{String(index + 1).padStart(2, "0")}</b><div><strong>{question.question}</strong><div><span style={{ width: `${correctRate ?? 0}%` }} /></div></div><small>{correctRate === null ? "Belum ada data" : `${correctRate}% Benar · ${attempts}x`}</small><button type="button" onClick={() => { setSelectedQuestion(index); setView("soal"); }}>Edit Soal</button></div>
                ))}
                {visibleQuestionPerformance.length === 0 && <p className="admin-empty">Belum ada soal dalam kategori ini.</p>}
              </div>
              <div className="admin-history-card">
                <h2>Riwayat Percobaan</h2>
                {quizResults.slice().reverse().slice(0, 10).map((result, index) => (
                  <div key={`${result.at}-${index}`}><strong>Pengunjung anonim</strong><span>{result.total} soal</span><span>{result.mode === "evaluation" ? "Evaluasi" : "Latihan"}</span><small>{new Date(result.at).toLocaleString("id-ID")}</small><b>{result.score}%</b></div>
                ))}
                {quizResults.length === 0 && <p className="admin-empty">Belum ada percobaan kuis yang tercatat.</p>}
              </div>
            </div>
          </section>
        )}
        {status && <div className="admin-toast" role="status">{status}</div>}
      </div>
    </main>
  );
}
