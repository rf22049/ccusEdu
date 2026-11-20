import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Materi & Modul — CCUS Edu",
  description: "Unduh materi dan modul pembelajaran CCUS.",
};

export default function MaterialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
