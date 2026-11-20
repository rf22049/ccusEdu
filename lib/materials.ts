import materialData from "@/data/materials.json";

export type LessonSlide = {
  title: string;
  body: string;
  takeaway: string;
};

export type LearningMaterial = {
  slug: string;
  number: number;
  title: string;
  short_title: string;
  category: string;
  icon: string;
  description: string;
  duration: string;
  slides: LessonSlide[];
};

export const learningMaterials = materialData as LearningMaterial[];
