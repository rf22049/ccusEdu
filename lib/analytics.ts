import { useMemo, useSyncExternalStore } from "react";

export type AnalyticsEvent =
  | {
      type: "page-view";
      at: number;
      sessionId: string;
      visitorId: string;
      path: string;
    }
  | {
      type: "page-duration";
      at: number;
      sessionId: string;
      visitorId: string;
      path: string;
      seconds: number;
    }
  | {
      type: "quiz-result";
      at: number;
      sessionId: string;
      visitorId: string;
      mode: "practice" | "evaluation";
      score: number;
      total: number;
      questions: { text: string; correct: boolean }[];
    }
  | {
      type: "resource-download";
      at: number;
      sessionId: string;
      visitorId: string;
      slug: string;
    };

const STORAGE_KEY = "ccus-analytics-v1";
const CHANGE_EVENT = "ccus-analytics-change";
const MAX_EVENTS = 5000;
const EMPTY_SNAPSHOT = "[]";

function createId() {
  return window.crypto.randomUUID?.()
    ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getIdentity() {
  let visitorId = window.localStorage.getItem("ccus-analytics-visitor");
  if (!visitorId) {
    visitorId = createId();
    window.localStorage.setItem("ccus-analytics-visitor", visitorId);
  }

  let sessionId = window.sessionStorage.getItem("ccus-analytics-session");
  if (!sessionId) {
    sessionId = createId();
    window.sessionStorage.setItem("ccus-analytics-session", sessionId);
  }

  return { visitorId, sessionId };
}

export function recordPageView(path: string) {
  const identity = getIdentity();
  recordEvent({ type: "page-view", ...identity, path, at: Date.now() });
}

export function recordPageDuration(path: string, seconds: number) {
  if (seconds < 1) return;
  const identity = getIdentity();
  recordEvent({
    type: "page-duration",
    ...identity,
    path,
    seconds: Math.round(seconds),
    at: Date.now(),
  });
}

export function recordQuizResult(result: {
  mode: "practice" | "evaluation";
  score: number;
  total: number;
  questions: { text: string; correct: boolean }[];
}) {
  const identity = getIdentity();
  recordEvent({ type: "quiz-result", ...identity, ...result, at: Date.now() });
}

export function recordResourceDownload(slug: string) {
  const identity = getIdentity();
  recordEvent({ type: "resource-download", ...identity, slug, at: Date.now() });
}

function recordEvent(event: AnalyticsEvent) {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const events: AnalyticsEvent[] = stored ? JSON.parse(stored) as AnalyticsEvent[] : [];
    if (!Array.isArray(events)) {
      throw new Error("Struktur data analitik tersimpan tidak valid.");
    }
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...events, event].slice(-MAX_EVENTS)),
    );
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch (error) {
    console.error("Data analitik tidak dapat disimpan.", error);
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) ?? EMPTY_SNAPSHOT;
}

function getServerSnapshot() {
  return EMPTY_SNAPSHOT;
}

function subscribeClock(onChange: () => void) {
  const timer = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(timer);
}

function getClockSnapshot() {
  return Math.floor(Date.now() / 60_000) * 60_000;
}

function getServerClockSnapshot() {
  return 0;
}

function parseSnapshot(snapshot: string): AnalyticsEvent[] {
  try {
    const events: unknown = JSON.parse(snapshot);
    if (!Array.isArray(events)) throw new Error("Format analitik tidak valid.");
    return events as AnalyticsEvent[];
  } catch (error) {
    console.error("Data analitik tersimpan tidak dapat dibaca.", error);
    return [];
  }
}

export function useAnalytics() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => parseSnapshot(snapshot), [snapshot]);
}

export function useAnalyticsClock() {
  return useSyncExternalStore(subscribeClock, getClockSnapshot, getServerClockSnapshot);
}
