import { supabase } from "./supabaseClient";

export interface Card {
  uid?: string;
  nombre: string;
  rareza: string;
  tipo: string;
  temporada: number;
  numero: number;
  image_url?: string;
}

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


export async function addCard(
  nombre: string,
  rareza: string,
  tipo: string,
  temporada: number,
  numero: number,
  file?: File 
) {
  try {
    let image_url = null;

    if (file) {
      const fileName = `${Date.now()}-${file.name}`;

      const {  error } = await supabase.storage
        .from("imagenesCartas")
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("imagenesCartas")
        .getPublicUrl(fileName);

      image_url = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
      .from("Cards")
      .insert([
        {
          nombre,
          rareza,
          tipo,
          temporada,
          numero,
          image_url,
        },
      ])
      .select();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error al agregar carta:", error);
    throw error;
  }
}