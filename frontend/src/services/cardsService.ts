import { supabase } from "./supabaseClient";

export interface Card {
  id?: string;
  nombre: string;
  rareza: string | null;
  tipo: string | null;
  temporada: number | null;
  numero: number | null;
  image_url?: string;
  obtained?: boolean;
  quantity?: number;
}



export const getAlbumCardsByUser = async (userId: string): Promise<Card[]> => {
  const { data: catalog, error: catalogError } = await supabase
    .from("Cards")
    .select("*")
    .order("temporada", { ascending: true })
    .order("numero", { ascending: true });

  if (catalogError) {
    console.error("Error al obtener el catalogo de cartas:", catalogError);
    return [];
  }

  const { data: userCards, error: userCardsError } = await supabase
    .from("user_cards")
    .select("card_id, quantity")
    .eq("user_id", userId);

  if (userCardsError) {
    // Si la tabla no existe aun, mantenemos comportamiento seguro para no romper UI.
    console.warn("No se pudo consultar user_cards:", userCardsError.message);
  }

  const quantityByCardId = new Map<string, number>();
  for (const row of userCards ?? []) {
    quantityByCardId.set(row.card_id, row.quantity ?? 0);
  }

  return (catalog as Card[]).map((card) => {
    const quantity = card.id ? quantityByCardId.get(card.id) ?? 0 : 0;
    return {
      ...card,
      quantity,
      obtained: quantity > 0,
    };
  });
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