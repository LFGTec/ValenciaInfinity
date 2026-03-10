// src/services/cardsService.ts

import { supabase } from "./supabaseClient";

export type Card = {
  id: number;
  nombre: string;
  rareza: string;
  tipo: string;
  temporada: string;
  numero: number;
};

export const getCards = async (): Promise<Card[]> => {
  const { data, error } = await supabase
    .from("Cards")
    .select("*");

  if (error) {
    console.error("Error al obtener las cartas:", error);
    return [];
  }

  return data as Card[];
};