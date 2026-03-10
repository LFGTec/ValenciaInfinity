import { supabase } from "./supabaseClient";

export type Ranking = {
  id: number;
  fan_nombre: string;
  puntos: number;
  nivel: string;
};

export const getRanking = async (): Promise<Ranking[]> => {
  const { data, error } = await supabase
    .from("ranking")
    .select("*")
    .order("puntos", { ascending: false });

  if (error) {
    console.error("Error obteniendo ranking:", error);
    return [];
  }

  return data as Ranking[];
};