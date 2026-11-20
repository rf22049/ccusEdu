import type { Metadata } from "next";
import Quiz from "@/components/quiz";

export const metadata: Metadata = {
  title: "Uji Pemahaman — CCUS Edu",
  description: "Kerjakan kuis interaktif untuk menguji pemahamanmu tentang CCUS.",
};

export default function QuizPage() {
  return <Quiz />;
}
