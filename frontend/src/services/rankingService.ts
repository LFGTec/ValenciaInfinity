// rankingService.ts

import { supabase } from "./supabaseClient";

export interface RankingUser {
  id: string;
  full_name: string;
  avatar_url?: string;
  puntos: number;
  level: number;
}

export const rankingService = {
  async getRanking(): Promise<RankingUser[]> {
    const { data, error } = await supabase.rpc(
      "get_ranking"
    );

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },
};