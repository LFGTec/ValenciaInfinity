import { supabase } from "./supabaseClient";

export interface StreakData {
  current_streak: number;
  longest_streak: number;
  total_days: number;
  last_login_date: string | null; // "YYYY-MM-DD"
}

function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const streakKey = (id: string) => `vcf_streak_${id}`;
const rewardKey = (id: string) => `vcf_reward_${id}_${todayISO()}`;

export function getLocalStreak(userId: string): StreakData {
  try {
    const raw = localStorage.getItem(streakKey(userId));
    if (raw) return JSON.parse(raw) as StreakData;
  } catch {
    
  }
  return { current_streak: 0, longest_streak: 0, total_days: 0, last_login_date: null };
}

function saveLocalStreak(userId: string, data: StreakData): void {
  localStorage.setItem(streakKey(userId), JSON.stringify(data));
}

function syncToSupabase(userId: string, data: StreakData): void {
  supabase
    .from("profiles")
    .update({
      current_streak: data.current_streak,
      longest_streak: data.longest_streak,
      total_days: data.total_days,
      last_login_date: data.last_login_date,
    })
    .eq("id", userId)
    .then(({ error }) => {
      if (error) console.warn("Streak sync pendiente (añade columnas a profiles en Supabase):", error.message);
    });
}

export function checkAndUpdateStreak(userId: string): StreakData {
  const today = todayISO();
  const local = getLocalStreak(userId);

  if (local.last_login_date === today) return local;

  let updated: StreakData;

  if (!local.last_login_date) {
    updated = { current_streak: 1, longest_streak: 1, total_days: 1, last_login_date: today };
  } else {
    const diffDays = Math.round(
      (new Date(today).getTime() - new Date(local.last_login_date).getTime()) / 86_400_000
    );
    const newCurrent = diffDays === 1 ? local.current_streak + 1 : 1;
    updated = {
      current_streak: newCurrent,
      longest_streak: Math.max(local.longest_streak, newCurrent),
      total_days: local.total_days + 1,
      last_login_date: today,
    };
  }

  saveLocalStreak(userId, updated);
  syncToSupabase(userId, updated);
  return updated;
}

export function hasClaimedRewardToday(userId: string): boolean {
  return localStorage.getItem(rewardKey(userId)) === "true";
}

export function markRewardClaimed(userId: string): void {
  localStorage.setItem(rewardKey(userId), "true");
}

/** Día 1-14 en el ciclo actual de 14 días */
export function getCycleDay(total_days: number): number {
  if (total_days === 0) return 1;
  return ((total_days - 1) % 14) + 1;
}
