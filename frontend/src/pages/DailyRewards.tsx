import React, { useState } from "react";
import TipsSection from "@/components/features/Daily Rewards/TipsSection";
import HeaderSection from "@/components/features/Daily Rewards/HeaderSection";
import GridSection from "@/components/features/Daily Rewards/GridSection";
import { Toast } from "@/components/features/Daily Rewards/Toast";
import { useAuth } from "@/hooks/useAuth";
import { getCycleDay, hasClaimedRewardToday, markRewardClaimed } from "@/services/streakService";
import { addUserPoints } from "@/services/authService";

export interface DayReward {
  day: number;
  reward: number;
  type: "points" | "card" | "bonus";
  claimed: boolean;
  available: boolean;
  description: string;
}

const REWARD_CATALOG: Omit<DayReward, "claimed" | "available">[] = [
  { day: 1,  reward: 50,   type: "points", description: "50 Puntos Valencia"     },
  { day: 2,  reward: 75,   type: "points", description: "75 Puntos Valencia"     },
  { day: 3,  reward: 100,  type: "points", description: "100 Puntos Valencia"    },
  { day: 4,  reward: 150,  type: "card",   description: "Carta Aleatoria Rara"   },
  { day: 5,  reward: 200,  type: "points", description: "200 Puntos Valencia"    },
  { day: 6,  reward: 250,  type: "points", description: "250 Puntos Valencia"    },
  { day: 7,  reward: 500,  type: "bonus",  description: "BONO SEMANAL"           },
  { day: 8,  reward: 100,  type: "points", description: "100 Puntos Valencia"    },
  { day: 9,  reward: 125,  type: "points", description: "125 Puntos Valencia"    },
  { day: 10, reward: 150,  type: "points", description: "150 Puntos Valencia"    },
  { day: 11, reward: 200,  type: "card",   description: "Carta Aleatoria Épica"  },
  { day: 12, reward: 250,  type: "points", description: "250 Puntos Valencia"    },
  { day: 13, reward: 300,  type: "points", description: "300 Puntos Valencia"    },
  { day: 14, reward: 1000, type: "bonus",  description: "MEGA BONO QUINCENAL"    },
];

export function DailyRewards() {
  const { user, updatePoints } = useAuth();

  const currentStreak = user?.current_streak ?? 0;
  const longestStreak = user?.longest_streak ?? 0;
  const totalDays     = user?.total_days ?? 0;

  const cycleDay = getCycleDay(totalDays);
  const [claimedToday, setClaimedToday] = useState(
    () => (user ? hasClaimedRewardToday(user.id) : false)
  );

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const rewards: DayReward[] = REWARD_CATALOG.map((def) => ({
    ...def,
    claimed:   def.day < cycleDay || (def.day === cycleDay && claimedToday),
    available: def.day === cycleDay && !claimedToday,
  }));

  const handleClaim = (day: number) => {
    if (!user) return;
    const reward = REWARD_CATALOG.find((r) => r.day === day);
    if (!reward) return;

    markRewardClaimed(user.id);
    setClaimedToday(true);

    if (reward.type !== "card") {
      updatePoints(reward.reward);
      addUserPoints(user.id, reward.reward).catch(console.error);
    }

    setToast({
      message: `¡Recompensa reclamada! +${reward.reward} ${reward.type === "points" ? "puntos" : reward.type === "bonus" ? "bono" : "carta"}`,
      type: "success",
    });
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-12 bg-content min-h-screen">
      <HeaderSection
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        totalDays={totalDays}
      />

      <GridSection rewards={rewards} setToast={setToast} onClaim={handleClaim} />

      <TipsSection />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
