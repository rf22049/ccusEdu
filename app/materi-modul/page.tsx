"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  useSiteContent,
  type ResourceCategory,
  type ResourceFormat,
} from "@/lib/site-content";

const categories: Record<ResourceCategory, string> = {
  modul: "Modul",
  infografik: "Infografik",
  video: "Video",
};

const formats: Record<ResourceFormat, string> = {
  pdf: "PDF",
  ppt: "PPT",
  mp4: "MP4",
};

export default function MaterialsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [format, setFormat] = useState("all");
  const { resources } = useSiteContent();
  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("id");
    return resources.filter((material) => (
      (category === "all" || material.category === category)
      && (format === "all" || material.format === format)
      && `${material.title} ${material.description} ${material.topics}`.toLocaleLowerCase("id").includes(term)
    ));
  }, [category, format, resources, search]);

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
            <Image
              src="/images/ccus_edu_asset_library/coco_game_education/coco_game_education_04.png"
              alt=""
              width={210}
              height={136}
            />
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
            Menampilkan {filtered.length} dari {resources.length} materi
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
                    <Image
                      className="material-card-image"
                      src="/images/ccus_edu_asset_library/ccus_process_nature/ccus_process_nature_04.png"
                      alt=""
                      width={220}
                      height={126}
                    />
                  ) : material.category === "infografik" ? (
                    <Image
                      className="material-card-image"
                      src="/images/ccus_edu_asset_library/ccus_process_nature/ccus_process_nature_06.png"
                      alt=""
                      width={220}
                      height={126}
                    />
                  ) : (
                    <Image
                      className="material-card-image"
                      src="/images/ccus_edu_asset_library/coco_game_education/coco_game_education_03.png"
                      alt=""
                      width={220}
                      height={126}
                    />
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
