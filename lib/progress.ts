import { learningMaterials } from "@/lib/materials";

export function progressKey(slug: string) {
  return `ccus-progress-${slug}`;
}

export function subscribeProgress(onChange: () => void) {
  window.addEventListener("ccus-progress-change", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("ccus-progress-change", onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function getProgressSnapshot() {
  return learningMaterials
    .map((material) => window.localStorage.getItem(progressKey(material.slug)) ?? "0")
    .join(",");
}

export function getServerProgressSnapshot() {
  return learningMaterials.map(() => "0").join(",");
}

export function saveProgress(slug: string, completed: number) {
  window.localStorage.setItem(progressKey(slug), String(completed));
  window.dispatchEvent(new Event("ccus-progress-change"));
}
