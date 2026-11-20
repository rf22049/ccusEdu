import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { learningMaterials } from "@/lib/materials";
import LessonPlayer from "@/components/lesson-player";

export function generateStaticParams() {
  return learningMaterials.map((material) => ({ slug: material.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const material = learningMaterials.find((item) => item.slug === slug);

  return {
    title: material ? `${material.title} — CCUS Edu` : "Materi Belajar CCUS — CCUS Edu",
    description: material?.description ?? "Pelajari materi CCUS secara interaktif.",
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const material = learningMaterials.find((item) => item.slug === slug);

  if (!material) {
    notFound();
  }

  return <LessonPlayer material={material} />;
}
