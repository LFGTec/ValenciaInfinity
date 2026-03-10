import { supabase } from "./supabaseClient";


export type Match = {
  id: number;
  equipo_local: string;
  equipo_visitante: string;
  estadio: string;
  fecha: string;
  liga: string;
};

export const getMatches = async (): Promise<Match[]> => {
  const { data, error } = await supabase
    .from("Matches")
    .select("*")
    .order("fecha", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data as Match[];
};