// src/services/newsService.ts

import { supabase } from "./supabaseClient";

export type News = {
  id: number;
  titulo: string;
  contenido: string;
  autor: string;
  vistas: number;
};

export const getNews = async (): Promise<News[]> => {
  const { data, error } = await supabase
    .from("News")
    .select("*");

  if (error) {
    console.error("Error al obtener las noticias:", error);
    return [];
  }

  return data as News[];
};