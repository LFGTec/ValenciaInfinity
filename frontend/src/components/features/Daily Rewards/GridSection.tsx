import React, { useState } from "react";
import {
  CheckCircle,
  Lock,
  Gift,
  Star,
  Trophy,
  Crown,
  ChevronDown,
} from "lucide-react";
import type { DayReward } from "@/pages/DailyRewards";

type ToastState = { message: string; type: "success" | "error" } | null;
type GridSectionProps = {
  rewards: DayReward[];
  setToast: React.Dispatch<React.SetStateAction<ToastState>>;
  onClaim: (day: number) => void;
  cycleDay: number;
};

const REWARD_COLOR: Record<DayReward["type"], string> = {
  //tipo para colores de recompensas
  points: "bg-vcf-orange",
  card: "bg-purple-600",
  bonus: "bg-gradient-to-br from-vcf-orange to-yellow-400",
};

const REWARD_ICON: Record<DayReward["type"], typeof Star> = {
  points: Star,
  card: Trophy,
  bonus: Crown,
};

type DayState = "available" | "claimed" | "future" | "inactive";

function getDayState(reward: DayReward): DayState {
  if (reward.claimed) return "claimed";
  if (reward.available) return "available";
  if (!reward.active) return "inactive";
  return "future";
}

function GridSection({
  rewards,
  setToast,
  onClaim,
  cycleDay,
}: GridSectionProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const todayReward = rewards.find((r) => r.day === cycleDay);
  const upcoming = rewards
    .filter((r) => !r.claimed && !r.available && r.active)
    .slice(0, 4);
  const claimedCount = rewards.filter((r) => r.claimed).length;

  const handleClaim = () => {
    if (!todayReward?.available) {
      setToast({
        message: "Esta recompensa no está disponible todavía",
        type: "error",
      });
      return;
    }
    onClaim(cycleDay);
  };

  const TodayIcon = todayReward ? REWARD_ICON[todayReward.type] : Gift;
  const todayColor = todayReward ? REWARD_COLOR[todayReward.type] : "bg-muted";

  return (
    <div className="mb-8 space-y-10">
      {/* ── HÉROE: RECOMPENSA DE HOY ─────────────────────────────────── */}
      <section>
        <h2 className="text-3xl font-black mb-5 text-foreground">
          RECOMPENSAS <span className="text-vcf-orange">DIARIAS</span>
        </h2>

        <div
          className={`relative rounded-2xl p-8 border-2 transition-all ${
            todayReward?.claimed
              ? "bg-muted/40 border-green-500/40"
              : todayReward?.available
                ? "bg-card border-vcf-orange shadow-2xl shadow-vcf-orange/20"
                : "bg-card border-border"
          }`}
        >
          {/* Día badge */}
          <div className="absolute -top-4 left-8 bg-black text-white px-4 py-1.5 rounded-full text-sm font-black border-2 border-vcf-orange">
            DÍA {cycleDay} DE RACHA
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Icono */}
            <div
              className={`w-28 h-28 rounded-full flex items-center justify-center flex-shrink-0 ${
                todayReward ? todayColor : "bg-muted border-2 border-border"
              } ${todayReward?.available ? "animate-pulse" : ""}`}
            >
              <TodayIcon size={52} className="text-white" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              {todayReward ? (
                <>
                  <p className="text-5xl font-black text-foreground mb-2">
                    {todayReward.type === "card"
                      ? "CARTA"
                      : `+${todayReward.reward}`}
                    {todayReward.type !== "card" && (
                      <span className="text-2xl text-muted-foreground ml-3">
                        {todayReward.type === "points" ? "puntos" : "bono"}
                      </span>
                    )}
                  </p>
                  <p className="text-lg text-muted-foreground font-bold">
                    {todayReward.description}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-black text-muted-foreground mb-2">
                    Sin recompensa hoy
                  </p>
                  <p className="text-muted-foreground">
                    Este día no tiene recompensa configurada
                  </p>
                </>
              )}
            </div>

            {/* Botón */}
            <div className="flex-shrink-0">
              {todayReward?.claimed ? (
                <div className="flex items-center gap-3 px-8 py-4 bg-green-500/10 border-2 border-green-500/50 rounded-xl">
                  <CheckCircle size={26} className="text-green-500" />
                  <span className="font-black text-green-500 text-lg">
                    RECLAMADO
                  </span>
                </div>
                
              ) : todayReward?.available ? (
                <button
                  data-testid="claim-reward-button"
                  onClick={handleClaim}
                  className="flex items-center gap-3 px-8 py-4 bg-vcf-orange text-white rounded-xl font-black text-lg hover:bg-[#e05516] transition-all shadow-lg hover:shadow-vcf-orange/40 hover:scale-105"
                >
                  <Gift size={22} />
                  RECLAMAR
                </button>
              ) : (
                <div className="flex items-center gap-3 px-8 py-4 bg-muted border-2 border-border rounded-xl">
                  <Lock size={22} className="text-muted-foreground" />
                  <span className="font-black text-muted-foreground text-lg">
                    NO DISPONIBLE
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRÓXIMAS RECOMPENSAS ─────────────────────────────────────── */}
      {upcoming.length > 0 && (
        <section>
          <h2 className="text-3xl font-black mb-5 text-foreground">
            PRÓXIMAS <span className="text-vcf-orange">RECOMPENSAS</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {upcoming.map((reward) => {
              const UpIcon = REWARD_ICON[reward.type];
              return (
                <div
                  key={reward.day}
                  className="bg-card border-2 border-border rounded-xl p-5 text-center hover:border-vcf-orange/40 transition-all"
                >
                  <div className="text-xs font-black text-muted-foreground mb-3 tracking-widest">
                    DÍA {reward.day}
                  </div>
                  <div
                    className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center opacity-70 ${REWARD_COLOR[reward.type]}`}
                  >
                    <UpIcon size={22} className="text-white" />
                  </div>
                  <div className="text-xl font-black text-foreground">
                    {reward.type === "card" ? "CARTA" : `+${reward.reward}`}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 font-bold line-clamp-1">
                    {reward.description}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── CALENDARIO COLAPSABLE ───────────────────────────────────── */}
      <section>
        <button
          onClick={() => setCalendarOpen((o) => !o)}
          className="w-full flex items-center justify-between px-6 py-4 bg-card border-2 border-border rounded-2xl hover:border-vcf-orange/50 transition-all group"
        >
          <div className="flex items-center gap-4">
            <span className="text-xl font-black text-foreground group-hover:text-vcf-orange transition-colors">
              Ver todas las recompensas
            </span>
            <span className="text-sm font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {claimedCount} / {rewards.length} completadas
            </span>
          </div>
          <ChevronDown
            size={22}
            className={`text-muted-foreground transition-transform duration-300 ${calendarOpen ? "rotate-180" : ""}`}
          />
        </button>

        {calendarOpen && (
          <div className="mt-2 bg-card border-2 border-border rounded-2xl p-6">
            <div className="grid grid-cols-7 gap-2">
              {rewards.map((reward) => {
                const state = getDayState(reward);
                const CellIcon = REWARD_ICON[reward.type];

                return (
                  <div
                    key={reward.day}
                    title={reward.description || `Día ${reward.day}`}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                      state === "available"
                        ? "bg-vcf-orange/10 border-2 border-vcf-orange"
                        : state === "claimed"
                          ? "bg-green-500/10 border-2 border-green-500/40"
                          : state === "inactive"
                            ? "border border-dashed border-border opacity-25"
                            : "border border-border hover:border-vcf-orange/40"
                    }`}
                  >
                    <span
                      className={`text-[11px] font-black leading-none ${
                        state === "available"
                          ? "text-vcf-orange"
                          : state === "claimed"
                            ? "text-green-500"
                            : "text-muted-foreground"
                      }`}
                    >
                      {reward.day}
                    </span>

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        state === "available"
                          ? REWARD_COLOR[reward.type]
                          : state === "claimed"
                            ? "bg-green-500"
                            : "bg-muted"
                      }`}
                    >
                      {state === "claimed" ? (
                        <CheckCircle size={13} className="text-white" />
                      ) : state === "inactive" ? (
                        <Lock size={10} className="text-muted-foreground" />
                      ) : (
                        <CellIcon size={13} className="text-white" />
                      )}
                    </div>

                    {(state === "available" || state === "future") &&
                      reward.active && (
                        <span
                          className={`text-[9px] font-black leading-none ${
                            state === "available"
                              ? "text-vcf-orange"
                              : "text-muted-foreground"
                          }`}
                        >
                          {reward.type === "card"
                            ? "CARTA"
                            : `+${reward.reward}`}
                        </span>
                      )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default GridSection;
