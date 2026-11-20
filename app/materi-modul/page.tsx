"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const categories = {
  modul: "Modul",
  infografik: "Infografik",
  video: "Video",
};

const formats = {
  pdf: "PDF",
  ppt: "PPT",
  mp4: "MP4",
};

type MaterialCategory = keyof typeof categories;
type MaterialFormat = keyof typeof formats;

const materials: {
  slug: string;
  title: string;
  description: string;
  category: MaterialCategory;
  format: MaterialFormat;
  topics: string;
  filename: string;
}[] = [
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
];

export default function MaterialsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [format, setFormat] = useState("all");
  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("id");
    return materials.filter((material) => (
      (category === "all" || material.category === category)
      && (format === "all" || material.format === format)
      && `${material.title} ${material.description} ${material.topics}`.toLocaleLowerCase("id").includes(term)
    ));
  }, [category, format, search]);

  return (
    <main className="materials-page" data-materials-page>
      <div className="container materials-shell">
        <header className="materials-heading">
          <div className="materials-heading-copy">
            <span className="materials-kicker">PUSAT UNDUHAN</span>
            <h1>Materi &amp; Modul</h1>
            <p>
              Akses berbagai bahan belajar CCUS dalam beragam format, siap
              diunduh dan dipelajari kapan saja.
            </p>
          </div>
          <div className="materials-heading-art" aria-hidden="true">
            <svg viewBox="0 0 230 150" fill="none">
              <path d="M18 127c2-29 17-44 42-45-1 26-15 41-42 45Zm193-2c-2-29-17-44-42-45 1 26 15 41 42 45Z" fill="#87C978" />
              <path d="M22 129c12-17 23-28 38-37m147 35c-12-17-23-28-38-37" stroke="#438F55" strokeWidth="4" strokeLinecap="round" />
              <path d="M64 35c0-7 6-13 13-13h66l20 20v84c0 7-6 13-13 13H77c-7 0-13-6-13-13V35Z" fill="#D9EFE1" stroke="#176B50" strokeWidth="4" />
              <path d="M104 39c0-6 5-11 11-11h57l20 20v69c0 6-5 11-11 11h-66c-6 0-11-5-11-11V39Z" fill="#FFFDF5" stroke="#257C59" strokeWidth="4" />
              <path d="M88 51c0-6 5-11 11-11h57l20 20v65c0 6-5 11-11 11H99c-6 0-11-5-11-11V51Z" fill="#F4C84F" stroke="#176B50" strokeWidth="4" />
              <path d="M130 67v29m-12-12 12 12 12-12" stroke="#176B50" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </header>

        <section className="materials-catalog" aria-label="Katalog materi CCUS">
          <div className="materials-toolbar">
            <label className="materials-search">
              <span className="sr-only">Cari materi</span>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="2" />
                <path d="m16 16 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                placeholder="Cari materi, modul, atau topik..."
                autoComplete="off"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <label className="materials-filter">
              <span className="sr-only">Filter kategori</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="all">Semua Kategori</option>
                {Object.entries(categories).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className="materials-filter">
              <span className="sr-only">Filter format</span>
              <select value={format} onChange={(event) => setFormat(event.target.value)}>
                <option value="all">Semua Format</option>
                {Object.entries(formats).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
          </div>
          <p className="materials-placeholder-notice" role="note">
            File unduhan saat ini adalah placeholder sementara. Format di kartu
            menunjukkan format materi final yang akan tersedia.
          </p>
          <p className="materials-result-count" aria-live="polite">
            Menampilkan {filtered.length} dari {materials.length} materi
          </p>
          <div className="materials-grid">
            {filtered.map((material) => (
              <article
                className="material-download-card"
                data-material-card
                data-category={material.category}
                data-format={material.format}
                key={material.slug}
              >
                <div className={`material-card-art material-card-art-${material.category}`}>
                  {material.category === "modul" ? (
                    <span className="material-file-symbol" aria-hidden="true">
                      <span>{material.format.toUpperCase()}</span>
                      <svg viewBox="0 0 48 48" fill="none">
                        <path d="M12 5h16l10 10v27H12V5Z" fill="#fff" stroke="#9D3A39" strokeWidth="3" strokeLinejoin="round" />
                        <path d="M28 5v11h10M17 25h15M17 31h15M17 37h10" stroke="#9D3A39" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  ) : material.category === "infografik" ? (
                    <span className="material-art-badge">Capture → Utilization → Storage</span>
                  ) : (
                    <Image src="/images/coco-studying.svg" alt="" width={100} height={100} />
                  )}
                  <span className="material-format-badge">{material.format.toUpperCase()}</span>
                </div>
                <div className="material-card-body">
                  <div className="material-card-meta">
                    <span className="material-category-badge">{categories[material.category]}</span>
                    <span className="material-placeholder-badge">Placeholder</span>
                  </div>
                  <h2>{material.title}</h2>
                  <p>{material.description}</p>
                  <div className="material-card-footer">
                    <span className="material-file-note">File sementara · TXT</span>
                    <a
                      className="material-download-button"
                      href={`/downloads/materials/${material.filename}`}
                      download
                      aria-label={`Unduh placeholder ${material.title}`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M12 3v12m0 0 5-5m-5 5-5-5M4 17v3h16v-3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="materials-empty-state">
              Tidak ada materi yang cocok. Coba ubah kata kunci atau filter.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
