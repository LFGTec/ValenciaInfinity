import React, { useState } from "react";
import TipsSection from "@/components/features/Daily Rewards/TipsSection";
import HeaderSection from "@/components/features/Daily Rewards/HeaderSection";
import GridSection from "@/components/features/Daily Rewards/GridSection";
import { Toast } from "@/components/features/Daily Rewards/Toast";

export interface DayReward {
    day: number;
    reward: number;
    type: "points" | "card" | "bonus";
    claimed: boolean;
    available: boolean;
    description: string;
}



export function DailyRewards() {
    const [currentStreak, setCurrentStreak] = useState(7);
    const [longestStreak, setLongestStreak] = useState(23);
    const [totalDays, setTotalDays] = useState(45);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const [rewards, setRewards] = useState<DayReward[]>([
        {
            day: 1,
            reward: 50,
            type: "points",
            claimed: true,
            available: false,
            description: "50 Puntos Valencia",
        },
        {
            day: 2,
            reward: 75,
            type: "points",
            claimed: true,
            available: false,
            description: "75 Puntos Valencia",
        },
        {
            day: 3,
            reward: 100,
            type: "points",
            claimed: true,
            available: false,
            description: "100 Puntos Valencia",
        },
        {
            day: 4,
            reward: 150,
            type: "card",
            claimed: true,
            available: false,
            description: "Carta Aleatoria Rara",
        },
        {
            day: 5,
            reward: 200,
            type: "points",
            claimed: true,
            available: false,
            description: "200 Puntos Valencia",
        },
        {
            day: 6,
            reward: 250,
            type: "points",
            claimed: true,
            available: false,
            description: "250 Puntos Valencia",
        },
        {
            day: 7,
            reward: 500,
            type: "bonus",
            claimed: false,
            available: true,
            description: "BONO SEMANAL",
        },
        {
            day: 8,
            reward: 100,
            type: "points",
            claimed: false,
            available: false,
            description: "100 Puntos Valencia",
        },
        {
            day: 9,
            reward: 125,
            type: "points",
            claimed: false,
            available: false,
            description: "125 Puntos Valencia",
        },
        {
            day: 10,
            reward: 150,
            type: "points",
            claimed: false,
            available: false,
            description: "150 Puntos Valencia",
        },
        {
            day: 11,
            reward: 200,
            type: "card",
            claimed: false,
            available: false,
            description: "Carta Aleatoria Épica",
        },
        {
            day: 12,
            reward: 250,
            type: "points",
            claimed: false,
            available: false,
            description: "250 Puntos Valencia",
        },
        {
            day: 13,
            reward: 300,
            type: "points",
            claimed: false,
            available: false,
            description: "300 Puntos Valencia",
        },
        {
            day: 14,
            reward: 1000,
            type: "bonus",
            claimed: false,
            available: false,
            description: "MEGA BONO QUINCENAL",
        },
    ]);


    return (
        <div className="max-w-[1600px] mx-auto px-4 py-12 bg-content min-h-screen">

            <HeaderSection currentStreak={currentStreak} longestStreak={longestStreak} totalDays={totalDays} />

            <GridSection rewards={rewards} setToast={setToast} setRewards={setRewards} />

            <TipsSection />

            {/* Toast Notifications */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
