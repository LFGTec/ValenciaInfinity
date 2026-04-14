import { supabase } from "./supabaseClient";

export type News = {
  id?: string;
  titulo: string;
  contenido: string;
  autor?: string;
  vistas?: number;
  Imagen?: string | null;
  categoria?: string;
  published_at?: string | null;
  comentarios?: number;
  destacada?: boolean;
};

export const getNews = async (category: string = "TODAS"): Promise<News[]> => {
  let query = supabase
    .from("News")
    .select("*")
    .order("published_at", { ascending: false });

  if (category !== "TODAS") {
    query = query.eq("categoria", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error al obtener las noticias:", error);
    return [];
  }

  return data as News[];
};

export const addNews = async (news: News): Promise<News | null> => {
  const { data, error } = await supabase
    .from("News")
    .insert([
      {
        titulo: news.titulo,
        contenido: news.contenido,
        autor: news.autor ?? "Valencia Infinity",
        categoria: news.categoria ?? "CLUB",
        destacada: news.destacada ?? false,
        vistas: news.vistas ?? 0,
        Imagen: news.Imagen ?? null,
        published_at: news.published_at ?? null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error al agregar la noticia:", error);
    throw error;
  }

  return data as News;
};

export const uploadNewsImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const filePath = `news/${fileName}`;

  const { error } = await supabase.storage
    .from("news-images")
    .upload(filePath, file);

  if (error) {
    console.error("Error al subir imagen:", error);
    throw error;
  }

  const { data } = supabase.storage
    .from("news-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
};