import { supabase } from "./supabaseClient";

export interface StreakData {
  current_streak: number;
  longest_streak: number;
  total_days: number;
  last_login_date: string | null;
}

export function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Recibe los datos de racha que ya vienen del perfil (Supabase).
 * Si hoy no está registrado, calcula el nuevo estado y lo persiste en Supabase.
 */
export async function checkAndUpdateStreak(
  userId: string,
  current: StreakData
): Promise<StreakData> {
  const today = todayISO();

  if (current.last_login_date === today) return current;

  let updated: StreakData;

  if (!current.last_login_date) {
    updated = { current_streak: 1, longest_streak: 1, total_days: 1, last_login_date: today };
  } else {
    const diffDays = Math.round(
      (new Date(today).getTime() - new Date(current.last_login_date).getTime()) / 86_400_000
    );
    const newCurrent = diffDays === 1 ? current.current_streak + 1 : 1;
    updated = {
      current_streak: newCurrent,
      longest_streak: Math.max(current.longest_streak, newCurrent),
      total_days: current.total_days + 1,
      last_login_date: today,
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      current_streak: updated.current_streak,
      longest_streak: updated.longest_streak,
      total_days: updated.total_days,
      last_login_date: updated.last_login_date,
    })
    .eq("id", userId);

  if (error) console.error("❌ Streak update failed:", error.message);

  return updated;
}

/** Número de días del mes actual (28-31) — longitud del ciclo */
export function getDaysInCurrentMonth(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

/**
 * Día 1-N dentro del ciclo mensual basado en la racha actual.
 * Si el streak supera la longitud del ciclo, vuelve a empezar desde 1.
 */
export function getCycleDay(streak: number, daysInCycle: number): number {
  if (streak <= 0) return 1;
  return ((streak - 1) % daysInCycle) + 1;
}
