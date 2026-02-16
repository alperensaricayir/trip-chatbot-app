const HIGH_SCORE_KEY = "tps_high_score";

export function loadHighScore(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(HIGH_SCORE_KEY);
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

export function saveHighScore(score: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HIGH_SCORE_KEY, String(Math.max(0, score)));
  } catch {
    return;
  }
}

export function clearHighScore(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(HIGH_SCORE_KEY);
  } catch {
    return;
  }
}

