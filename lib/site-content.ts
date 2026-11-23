import { useMemo, useSyncExternalStore } from "react";
import { learningMaterials, type LearningMaterial } from "@/lib/materials";

export type ResourceCategory = "modul" | "infografik" | "video";
export type ResourceFormat = "pdf" | "ppt" | "mp4";
export type QuizCategory = "basics" | "process";

export type DownloadableMaterial = {
  slug: string;
  title: string;
  description: string;
  category: ResourceCategory;
  format: ResourceFormat;
  topics: string;
  filename: string;
};

export type QuizQuestion = {
  category: QuizCategory;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type SiteContent = {
  lessons: LearningMaterial[];
  resources: DownloadableMaterial[];
  questions: QuizQuestion[];
};

const CONTENT_STORAGE_KEY = "ccus-site-content-v1";
const CONTENT_CHANGE_EVENT = "ccus-site-content-change";

const defaultSiteContent: SiteContent = {
  lessons: learningMaterials,
  resources: [
    {
      slug: "modul-dasar-ccus",
      title: "Modul Dasar CCUS",
      description: "Pengenalan tentang konsep, proses, dan manfaat CCUS.",
      category: "modul",
      format: "pdf",
      topics: "carbon capture utilization storage konsep dasar emisi karbon",
      filename: "modul-dasar-ccus-placeholder.txt",
    },
    {
      slug: "infografik-proses-ccus",
      title: "Infografik Proses CCUS",
      description: "Visualisasi ringkas tahapan Capture–Utilization–Storage.",
      category: "infografik",
      format: "ppt",
      topics: "capture utilization storage penangkapan pemanfaatan penyimpanan",
      filename: "infografik-proses-ccus-placeholder.txt",
    },
    {
      slug: "video-ccus-kehidupan-nyata",
      title: "Video: CCUS dalam Kehidupan Nyata",
      description: "Penjelasan penerapan CCUS di industri secara sederhana.",
      category: "video",
      format: "mp4",
      topics: "industri penerapan studi kasus teknologi",
      filename: "video-ccus-kehidupan-nyata-placeholder.txt",
    },
  ],
  questions: [
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
  ],
};

const defaultContentSnapshot = JSON.stringify(defaultSiteContent);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isLesson(value: unknown): value is LearningMaterial {
  if (!isRecord(value) || !Array.isArray(value.slides)) return false;
  return typeof value.slug === "string"
    && typeof value.number === "number"
    && typeof value.title === "string"
    && typeof value.short_title === "string"
    && typeof value.category === "string"
    && typeof value.icon === "string"
    && typeof value.description === "string"
    && typeof value.duration === "string"
    && value.slides.every((slide) => (
      isRecord(slide)
      && typeof slide.title === "string"
      && typeof slide.body === "string"
      && typeof slide.takeaway === "string"
    ));
}

function isResource(value: unknown): value is DownloadableMaterial {
  return isRecord(value)
    && typeof value.slug === "string"
    && typeof value.title === "string"
    && typeof value.description === "string"
    && ["modul", "infografik", "video"].includes(String(value.category))
    && ["pdf", "ppt", "mp4"].includes(String(value.format))
    && typeof value.topics === "string"
    && typeof value.filename === "string";
}

function isQuestion(value: unknown): value is QuizQuestion {
  return isRecord(value)
    && ["basics", "process"].includes(String(value.category))
    && typeof value.question === "string"
    && Array.isArray(value.options)
    && value.options.length > 1
    && value.options.every((option) => typeof option === "string")
    && typeof value.correctIndex === "number"
    && Number.isInteger(value.correctIndex)
    && value.correctIndex >= 0
    && value.correctIndex < value.options.length
    && typeof value.explanation === "string";
}

function isSiteContent(value: unknown): value is SiteContent {
  return isRecord(value)
    && Array.isArray(value.lessons)
    && value.lessons.every(isLesson)
    && Array.isArray(value.resources)
    && value.resources.every(isResource)
    && Array.isArray(value.questions)
    && value.questions.every(isQuestion);
}

function subscribeToContent(onChange: () => void) {
  window.addEventListener(CONTENT_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONTENT_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getContentSnapshot() {
  return window.localStorage.getItem(CONTENT_STORAGE_KEY) ?? defaultContentSnapshot;
}

function getServerContentSnapshot() {
  return defaultContentSnapshot;
}

function parseContentSnapshot(snapshot: string): SiteContent {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (!isSiteContent(parsed)) {
      throw new Error("Struktur konten tersimpan tidak valid.");
    }
    return parsed;
  } catch (error) {
    console.error("Konten tersimpan tidak dapat dibaca; konten bawaan digunakan.", error);
    return structuredClone(defaultSiteContent);
  }
}

function notifyContentChanged() {
  window.dispatchEvent(new Event(CONTENT_CHANGE_EVENT));
}

export function useSiteContent() {
  const snapshot = useSyncExternalStore(
    subscribeToContent,
    getContentSnapshot,
    getServerContentSnapshot,
  );
  return useMemo(() => parseContentSnapshot(snapshot), [snapshot]);
}

export function getDefaultSiteContent() {
  return structuredClone(defaultSiteContent);
}

export function saveSiteContent(content: SiteContent) {
  if (!isSiteContent(content)) {
    throw new Error("Periksa kembali konten sebelum menyimpan.");
  }
  window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
  notifyContentChanged();
}

export function resetSiteContent() {
  window.localStorage.removeItem(CONTENT_STORAGE_KEY);
  notifyContentChanged();
}
