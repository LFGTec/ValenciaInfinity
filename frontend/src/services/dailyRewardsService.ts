import { supabase } from "./supabaseClient";

export interface DailyRewardDef {
  day: number;
  reward: number;
  type: "points" | "card" | "bonus";
  description: string;
  active: boolean;
}

export async function getDailyRewards(): Promise<DailyRewardDef[]> {
  const { data, error } = await supabase
    .from("daily_rewards")
    .select("*")
    .order("day");
  if (error) throw error;
  return (data ?? []) as DailyRewardDef[];
}

export async function upsertDailyReward(reward: DailyRewardDef): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("daily_rewards")
    .upsert(reward, { onConflict: "day" });
  return { error: error?.message ?? null };
}
