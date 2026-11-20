import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Belajar CCUS — CCUS Edu",
  description: "Pelajari konsep, proses, teknologi, dan penerapan CCUS.",
};

export default function LearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
