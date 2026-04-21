import { supabase } from "./supabaseClient";

export type Ranking = {
  id: number;
  fan_nombre: string;
  puntos: number;
  nivel: string;
};
//Modelo de ranking, con id, nombre del fan, puntos y nivel

export const getRanking = async (): Promise<Ranking[]> => {
  const { data, error } = await supabase
    .from("ranking")
    //va a la tabla de ranking
    .select("*")
    //Trae todas las columnas
    .order("puntos", { ascending: false });
    //Ordena de mayor a menor

  if (error) {
    console.error("Error obteniendo ranking:", error);
    return [];
  }

  return data as Ranking[];
};

//Funcion que obtiene el ranking del Supabase y trae el ranking ordenado
