import React, { useState, useEffect } from "react";
import TipsSection from "@/components/features/Daily Rewards/TipsSection";
import HeaderSection from "@/components/features/Daily Rewards/HeaderSection";
import GridSection from "@/components/features/Daily Rewards/GridSection";
import { Toast } from "@/components/features/Daily Rewards/Toast";
import { useAuth } from "@/hooks/useAuth";
import { getCycleDay, getDaysInCurrentMonth, todayISO } from "@/services/streakService";
import { getDailyRewards, type DailyRewardDef } from "@/services/dailyRewardsService";

export interface DayReward {
  day: number;
  reward: number;
  type: "points" | "card" | "bonus";
  claimed: boolean;
  available: boolean;
  description: string;
  active: boolean;
}

const emptyRow = (day: number): DailyRewardDef => ({
  day,
  type: "points",
  reward: 0,
  description: "",
  active: false,
});

export function DailyRewards() {
  const { user, claimReward } = useAuth();

  const currentStreak = user?.current_streak ?? 0;
  const longestStreak = user?.longest_streak ?? 0;
  const totalDays     = user?.total_days ?? 0;
  const lastLoginDate = user?.last_login_date ?? null;

  const daysInCycle  = getDaysInCurrentMonth();          // 30 o 31 según el mes
  const cycleDay     = getCycleDay(currentStreak, daysInCycle); // posición en el ciclo
  const claimedToday = user?.last_reward_date === todayISO();

  const [catalog, setCatalog] = useState<DailyRewardDef[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    getDailyRewards()
      .then((data) => {
        // Genera los 31 slots; usa datos de BD donde existan, vacíos donde no
        const byDay = Object.fromEntries(data.map((r) => [r.day, r]));
        const full = Array.from({ length: 31 }, (_, i) => {
          const day = i + 1;
          return byDay[day] ?? emptyRow(day);
        });
        setCatalog(full);
      })
      .catch(() => setToast({ message: "Error cargando recompensas", type: "error" }));
  }, []);

  const rewards: DayReward[] = catalog
    .filter((def) => def.day <= daysInCycle)
    .map((def) => ({
      ...def,
      // Días anteriores al ciclo actual = ya reclamados esta racha
      claimed:   def.day < cycleDay || (def.day === cycleDay && claimedToday),
      available: def.day === cycleDay && !claimedToday && def.active,
    }));

  const handleClaim = (day: number) => {
    if (!user) return;
    const reward = catalog.find((r) => r.day === day);
    if (!reward) return;

    claimReward(reward.type !== "card" ? reward.reward : 0);

    setToast({
      message: `¡Recompensa reclamada! +${reward.reward} ${
        reward.type === "points" ? "puntos" : reward.type === "bonus" ? "bono" : "carta"
      }`,
      type: "success",
    });
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-12 bg-content min-h-screen">
      <HeaderSection
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        totalDays={totalDays}
        puntos={user?.puntos ?? 0}
        lastLoginDate={lastLoginDate}
      />

      <GridSection rewards={rewards} setToast={setToast} onClaim={handleClaim} />

      <TipsSection />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
