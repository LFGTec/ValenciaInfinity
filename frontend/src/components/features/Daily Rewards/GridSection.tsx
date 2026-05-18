import React from 'react'
import { CheckCircle, Lock, Gift, Star, Trophy, Crown } from 'lucide-react';
import type { DayReward } from '@/pages/DailyRewards';

type ToastState = { message: string; type: "success" | "error" } | null;

type GridSectionProps = {
    rewards: DayReward[];
    setToast: React.Dispatch<React.SetStateAction<ToastState>>;
    setRewards: React.Dispatch<React.SetStateAction<DayReward[]>>;
}

const getRewardColor = (type: DayReward["type"]) => {
    switch (type) {
        case "points":
            return "bg-vcf-orange";
        case "card":
            return "bg-purple-600";
        case "bonus":
            return "bg-gradient-to-r from-vcf-orange to-vcf-yellow";
    }
};

const getRewardIcon = (type: DayReward["type"]) => {
    switch (type) {
        case "points":
            return Star;
        case "card":
            return Trophy;
        case "bonus":
            return Crown;
    }
};



function GridSection({ rewards, setToast, setRewards }: GridSectionProps) {
    const handleClaimReward = (day: number) => {
        const reward = rewards.find((r) => r.day === day);
        if (!reward?.available) {
            setToast({
                message: "Esta recompensa no está disponible todavía",
                type: "error",
            });
            return;
        }

        setRewards(
            rewards.map((r) => (r.day === day ? { ...r, claimed: true, available: false } : r))
        );

        setToast({
            message: `¡Recompensa reclamada! +${reward.reward} ${reward.type === "points" ? "puntos" : "carta"}`,
            type: "success",
        });
    };
    return (
        <>
            {/* Daily Rewards Grid */}
            <div className="mb-8">
                <h2 className="text-3xl font-black mb-6 text-foreground">
                    RECOMPENSAS <span className="text-vcf-orange">DIARIAS</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {rewards.map((reward) => {
                        const Icon = getRewardIcon(reward.type);
                        const colorClass = getRewardColor(reward.type);

                        return (
                            <div
                                key={reward.day}
                                className={`relative rounded-xl p-6 transition-all ${reward.claimed
                                    ? "bg-muted border-2 border-border opacity-60"
                                    : reward.available
                                        ? "bg-card border-4 border-vcf-orange shadow-2xl shadow-vcf-orange/20 animate-pulse"
                                        : "bg-card border-2 border-border hover:border-vcf-orange/50"
                                    }`}
                            >
                                {/* Day Badge */}
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-1 rounded-full text-xs font-black border-2 border-vcf-orange">
                                    DÍA {reward.day}
                                </div>

                                {/* Claimed Badge */}
                                {reward.claimed && (
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-card">
                                        <CheckCircle size={20} className="text-white" />
                                    </div>
                                )}

                                {/* Locked Badge */}
                                {!reward.claimed && !reward.available && (
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center border-2 border-card">
                                        <Lock size={16} className="text-white" />
                                    </div>
                                )}

                                {/* Icon */}
                                <div
                                    className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${colorClass}`}
                                >
                                    <Icon size={32} className="text-white" />
                                </div>

                                {/* Reward Amount */}
                                <div className="text-center mb-2">
                                    <div className="text-2xl font-black text-foreground mb-1">
                                        {reward.type === "points" ? `+${reward.reward}` : "CARTA"}
                                    </div>
                                    <div className="text-xs text-muted-foreground font-bold">
                                        {reward.description}
                                    </div>
                                </div>

                                {/* Claim Button */}
                                {reward.available && !reward.claimed && (
                                    <button
                                        onClick={() => handleClaimReward(reward.day)}
                                        className="w-full mt-3 px-4 py-2 bg-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] transition-all shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <Gift size={16} />
                                        RECLAMAR
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    )
}

export default GridSection