"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Question = {
  category: "basics" | "process";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const questionBank: Question[] = [
  {
    category: "basics",
    question: "Apa kepanjangan dari CCUS?",
    options: ["Carbon Capture, Utilization, and Storage", "Climate Change Utility System", "Carbon Control and Usage Standard", "Clean Coal Usage Strategy"],
    correctIndex: 0,
    explanation: "CCUS adalah Carbon Capture, Utilization, and Storage: penangkapan, pemanfaatan, dan penyimpanan karbon.",
  },
  {
    category: "basics",
    question: "Apa tujuan utama teknologi penangkapan karbon?",
    options: ["Meningkatkan jumlah karbon di atmosfer", "Menangkap emisi CO₂ sebelum dilepaskan ke atmosfer", "Mengubah semua bahan bakar menjadi listrik", "Menghilangkan kebutuhan akan energi"],
    correctIndex: 1,
    explanation: "Penangkapan karbon memisahkan CO₂ dari sumber emisi agar dapat dimanfaatkan atau disimpan.",
  },
  {
    category: "basics",
    question: "Apa perbedaan utama CCS dan CCUS?",
    options: ["CCS hanya menangkap karbon dari kendaraan", "CCUS mencakup pemanfaatan CO₂ selain penyimpanannya", "CCS menggunakan energi terbarukan, CCUS tidak", "Keduanya tidak memiliki perbedaan"],
    correctIndex: 1,
    explanation: "CCUS mencakup pemanfaatan CO₂ yang ditangkap, sedangkan CCS berfokus pada penangkapan dan penyimpanan.",
  },
  {
    category: "basics",
    question: "Dari mana CO₂ biasanya ditangkap dalam penerapan CCUS?",
    options: ["Hanya dari udara di dalam rumah", "Dari sumber emisi seperti fasilitas industri dan pembangkit", "Dari air minum", "Dari lapisan ozon"],
    correctIndex: 1,
    explanation: "CO₂ dapat ditangkap dari aliran emisi fasilitas industri dan pembangkit sebelum dilepas ke atmosfer.",
  },
  {
    category: "basics",
    question: "Apa contoh pemanfaatan CO₂ yang ditangkap?",
    options: ["Bahan baku untuk produk tertentu atau mineralisasi", "Mengubah CO₂ menjadi oksigen secara langsung", "Membuangnya ke sungai", "Menggunakannya sebagai pengganti air minum"],
    correctIndex: 0,
    explanation: "CO₂ dapat dimanfaatkan sebagai bahan baku produk, misalnya untuk bahan bangunan melalui proses mineralisasi.",
  },
  {
    category: "process",
    question: "Setelah ditangkap, bagaimana CO₂ umumnya dikirim ke lokasi pemanfaatan atau penyimpanan?",
    options: ["Melalui jaringan pipa atau kapal khusus", "Dilepaskan ke udara lalu dikumpulkan kembali", "Dikirim melalui jaringan air minum", "Diubah menjadi batu sebelum dikirim"],
    correctIndex: 0,
    explanation: "CO₂ yang telah dikondisikan dapat diangkut melalui pipa atau kapal menuju lokasi yang sesuai.",
  },
  {
    category: "process",
    question: "Di mana CO₂ dapat disimpan secara geologis?",
    options: ["Di formasi batuan bawah permukaan yang sesuai", "Di gua terbuka di permukaan", "Di sungai dan danau", "Di dalam lapisan tanah paling atas"],
    correctIndex: 0,
    explanation: "Penyimpanan geologis dilakukan pada formasi batuan bawah permukaan dengan karakteristik dan lapisan penutup yang sesuai.",
  },
  {
    category: "process",
    question: "Mengapa lokasi penyimpanan CO₂ perlu dipantau?",
    options: ["Untuk memastikan penyimpanan tetap aman dan sesuai rencana", "Agar CO₂ dapat kembali ke atmosfer lebih cepat", "Untuk mengubah lokasi menjadi tambang", "Agar tidak perlu mengukur emisi"],
    correctIndex: 0,
    explanation: "Pemantauan membantu memastikan CO₂ tetap tersimpan dan mendeteksi perubahan yang perlu ditindaklanjuti.",
  },
  {
    category: "process",
    question: "Apa yang perlu dilakukan sebelum menentukan lokasi penyimpanan geologis?",
    options: ["Menilai kondisi geologi dan kelayakan lokasi", "Memilih lokasi hanya berdasarkan jarak terdekat", "Mengabaikan kondisi batuan", "Membuka sumur tanpa pengukuran"],
    correctIndex: 0,
    explanation: "Karakteristik geologi, kapasitas, dan integritas lapisan penutup perlu dinilai untuk menentukan kelayakan lokasi.",
  },
  {
    category: "process",
    question: "Apa yang terjadi pada CO₂ dalam proses mineralisasi?",
    options: ["CO₂ bereaksi membentuk mineral karbonat yang stabil", "CO₂ berubah menjadi air tanpa reaksi", "CO₂ menghilang tanpa jejak", "CO₂ berubah menjadi nitrogen"],
    correctIndex: 0,
    explanation: "Dalam mineralisasi, CO₂ bereaksi dengan mineral tertentu dan dapat membentuk mineral karbonat yang stabil.",
  },
];

type QuizMode = "practice" | "evaluation";

export default function Quiz() {
  const [category, setCategory] = useState("all");
  const [count, setCount] = useState(5);
  const [mode, setMode] = useState<QuizMode>("practice");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const available = useMemo(
    () => questionBank.filter((question) => category === "all" || question.category === category),
    [category],
  );
  const correctCount = questions.reduce(
    (total, question, index) => total + Number(answers[index] === question.correctIndex),
    0,
  );
  const score = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;
  const selectedQuestion = questions[current];
  const selectedAnswer = answers[current];

  function startQuiz(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newQuestions = available.slice(0, count);
    setQuestions(newQuestions);
    setAnswers(Array(newQuestions.length).fill(null));
    setCurrent(0);
    setFinished(false);
    setShowReview(false);
  }

  function restartQuiz() {
    setCategory("all");
    setCount(5);
    setMode("practice");
    setFinished(false);
    setQuestions([]);
    setAnswers([]);
    setCurrent(0);
    setShowReview(false);
  }

  return (
    <main className="quiz-page" data-quiz-app>
      <div className="container quiz-shell">
        <header className="quiz-heading">
          <div className="quiz-heading-copy">
            <span className="quiz-kicker">BELAJAR SAMBIL BERMAIN</span>
            <h1>Uji Pemahaman</h1>
            <h2>Seberapa Paham Kamu tentang CCUS?</h2>
            <p>Kerjakan soal pilihan ganda dan lihat sejauh mana pemahamanmu.</p>
          </div>
          <Image className="quiz-mascot" src="/images/coco-studying.svg" alt="Maskot CCUS Edu sedang belajar" width={185} height={185} />
        </header>

        {questions.length === 0 && (
          <section className="quiz-panel quiz-setup-panel" data-quiz-setup>
            <form onSubmit={startQuiz}>
              <div className="quiz-settings">
                <div className="quiz-fields">
                  <label className="quiz-field">
                    <span>Pilih Kategori Materi</span>
                    <select value={category} onChange={(event) => {
                      setCategory(event.target.value);
                      if (event.target.value !== "all") setCount(5);
                    }}>
                      <option value="all">Semua Materi</option>
                      <option value="basics">Konsep Dasar CCUS</option>
                      <option value="process">Rantai Proses CCUS</option>
                    </select>
                  </label>
                  <label className="quiz-field">
                    <span>Jumlah Soal</span>
                    <select value={count} onChange={(event) => setCount(Number(event.target.value))}>
                      <option value={5}>5 Soal</option>
                      <option value={10} disabled={category !== "all"}>10 Soal</option>
                    </select>
                    {category !== "all" && <small>Kategori ini memiliki 5 soal.</small>}
                  </label>
                </div>
                <fieldset className="quiz-mode">
                  <legend>Mode</legend>
                  <label className="quiz-mode-option">
                    <input type="radio" name="quiz-mode" checked={mode === "practice"} onChange={() => setMode("practice")} />
                    <span className="quiz-radio" aria-hidden="true" />
                    <span><strong>Latihan</strong><small>Tidak dinilai</small></span>
                  </label>
                  <label className="quiz-mode-option">
                    <input type="radio" name="quiz-mode" checked={mode === "evaluation"} onChange={() => setMode("evaluation")} />
                    <span className="quiz-radio" aria-hidden="true" />
                    <span><strong>Evaluasi</strong><small>Dengan nilai</small></span>
                  </label>
                </fieldset>
              </div>
              <button className="quiz-button quiz-button-primary quiz-start-button" type="submit">
                Mulai Ujian <span aria-hidden="true">→</span>
              </button>
            </form>
          </section>
        )}

        {selectedQuestion && !finished && (
          <section className="quiz-panel quiz-question-panel" data-quiz-question>
            <div className="quiz-progress-heading">
              <span className="quiz-mode-label">{mode === "evaluation" ? "Mode evaluasi" : "Mode latihan"}</span>
              <span>Soal {current + 1} dari {questions.length}</span>
            </div>
            <div className="quiz-progress-track" role="progressbar" aria-label="Progress kuis" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(((current + 1) / questions.length) * 100)}>
              <span style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
            </div>
            <h2 className="quiz-question-title">{selectedQuestion.question}</h2>
            <div className="quiz-options" role="group" aria-label="Pilihan jawaban">
              {selectedQuestion.options.map((option, index) => (
                <label className="quiz-option" key={option}>
                  <input
                    type="radio"
                    name={`quiz-answer-${current}`}
                    value={index}
                    checked={selectedAnswer === index}
                    onChange={() => setAnswers((previous) => previous.map((answer, answerIndex) => answerIndex === current ? index : answer))}
                  />
                  <span className="quiz-option-content">
                    <span className="quiz-option-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                    <span>{option}</span>
                  </span>
                </label>
              ))}
            </div>
            {mode === "practice" && selectedAnswer !== null && selectedAnswer !== undefined && (
              <div className={`quiz-feedback${selectedAnswer === selectedQuestion.correctIndex ? " is-correct" : " is-wrong"}`} role="status" aria-live="polite">
                <strong>{selectedAnswer === selectedQuestion.correctIndex ? "Jawaban kamu benar!" : "Belum tepat."}</strong>
                <p>{selectedQuestion.explanation}</p>
              </div>
            )}
            <div className="quiz-question-actions">
              {current > 0 && (
                <button className="quiz-button quiz-button-secondary" type="button" onClick={() => setCurrent((index) => index - 1)}>← Sebelumnya</button>
              )}
              <button
                className="quiz-button quiz-button-primary"
                type="button"
                disabled={selectedAnswer === null || selectedAnswer === undefined}
                onClick={() => {
                  if (current === questions.length - 1) setFinished(true);
                  else setCurrent((index) => index + 1);
                }}
              >
                {current === questions.length - 1 ? "Lihat Hasil" : "Lanjut"} <span aria-hidden="true">→</span>
              </button>
            </div>
          </section>
        )}

        {finished && (
          <section className="quiz-panel quiz-results-panel" aria-labelledby="quiz-results-title" data-quiz-results>
            <div className="quiz-results-main">
              <div className="quiz-score-ring" role="img" aria-label={mode === "evaluation" ? `Skor kamu ${score}%` : `Latihan selesai, ${correctCount} jawaban benar`} style={{ "--score": `${mode === "evaluation" ? score : 100}%` } as React.CSSProperties}>
                <span>{mode === "evaluation" ? `${score}%` : `${correctCount}/${questions.length}`}</span>
                <small>{mode === "evaluation" ? `dari ${questions.length} soal` : "jawaban benar"}</small>
              </div>
              <div className="quiz-results-copy">
                <span className="quiz-mode-label">{mode === "evaluation" ? "Mode evaluasi" : "Mode latihan"}</span>
                <h2 id="quiz-results-title">{mode === "evaluation" && score < 80 ? "Terus Belajar!" : mode === "evaluation" ? "Bagus!" : "Latihan Selesai!"}</h2>
                <p>{mode === "evaluation"
                  ? score >= 80
                    ? "Kamu sudah memahami konsep dasar CCUS dengan baik. Terus pelajari materi lainnya untuk memperdalam pemahamanmu."
                    : "Tetap semangat! Pelajari kembali materi CCUS, lalu coba lagi untuk melihat perkembanganmu."
                  : "Kamu sudah menyelesaikan latihan. Pelajari pembahasan untuk memahami setiap jawaban."}</p>
                <div className="quiz-result-actions">
                  <button className="quiz-button quiz-button-primary" type="button" aria-expanded={showReview} aria-controls="quiz-review-list" onClick={() => setShowReview((visible) => !visible)}>
                    {showReview ? "Tutup Pembahasan" : "Lihat Pembahasan"}
                  </button>
                  <button className="quiz-button quiz-button-secondary" type="button" onClick={restartQuiz}><span aria-hidden="true">↻</span> Ulangi Ujian</button>
                </div>
              </div>
            </div>
            <div className="quiz-review-summary">
              <strong className="quiz-summary-heading"><span aria-hidden="true">▣</span> Ringkasan Jawaban</strong>
              <div className="quiz-summary-counts">
                <span className="quiz-summary-count is-correct"><span className="quiz-summary-icon" aria-hidden="true">✓</span><span><strong>{correctCount}</strong> Jawaban Benar</span></span>
                <span className="quiz-summary-count is-wrong"><span className="quiz-summary-icon" aria-hidden="true">×</span><span><strong>{questions.length - correctCount}</strong> Jawaban Salah</span></span>
              </div>
            </div>
            {showReview && (
              <div className="quiz-review-list" id="quiz-review-list">
                {questions.map((question, index) => {
                  const isCorrect = answers[index] === question.correctIndex;
                  return (
                    <article className={`quiz-review-item${isCorrect ? " is-correct" : " is-wrong"}`} key={question.question}>
                      <strong>{index + 1}. {question.question}</strong>
                      <p className="quiz-review-answer">
                        Jawaban kamu: {question.options[answers[index] ?? 0]}
                        {!isCorrect && <> · Jawaban benar: {question.options[question.correctIndex]}</>}
                      </p>
                      <p>{question.explanation}</p>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
