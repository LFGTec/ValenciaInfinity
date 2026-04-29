import { supabase } from "./supabaseClient";

export interface Category {
  id: string;
  name: string;
  label: string;
  color: string;
  border_color: string;
  text_color: string;
  icon: string;
}

export interface Card {
  id: string;
  nombre: string;
  tipo: string | null;
  temporada: number | null;
  numero: number | null;
  image_url?: string;
  rareza: string

  category_id: string;
  is_deleted: boolean;

  categories?: Category;
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
    .select(`
      *,
      categories!fk_category (
        id,
        name,
        label,
        color,
        border_color,
        text_color,
        icon
      )
    `)
    .eq("is_deleted", false);

  if (error) {
    console.error("Error al obtener cartas:", error);
    return [];
  }

  return data as Card[];
};

export async function addCard(
  nombre: string,
  tipo: string,
  temporada: number,
  numero: number,
  category_id: string,
  rareza: string | null, 
  file?: File
) {
  let image_url = null;

  if (file) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("imagenesCartas")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("imagenesCartas")
      .getPublicUrl(fileName);

    image_url = data.publicUrl;
  }

  const { data, error } = await supabase
    .from("Cards")
    .insert([
      {
        nombre,
        tipo,
        temporada,
        numero,
        category_id,
        rareza, 
        image_url,
      },
    ])
    .select();

  if (error) throw error;

  return data;
}

export const deleteCard = async (id: string) => {

  const { data, error } = await supabase
    .from("Cards")
    .update({ is_deleted: true })
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
};

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from("categories")
    .select("*");

  if (error) {
    console.error("Error al obtener categorías:", error);
    return [];
  }

  return data as Category[];
};

export async function updateCard(
  id: string,
  nombre: string,
  tipo: string,
  temporada: number,
  numero: number,
  category_id: string,
  rareza: string | null,
  existing_image_url: string | null, 
  file?: File
) {
  let image_url = existing_image_url; 

  
  if (file) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("imagenesCartas")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("imagenesCartas")
      .getPublicUrl(fileName);

    image_url = data.publicUrl; 
  }

  // 🧠 AQUÍ está tu lógica
  const { data, error } = await supabase
    .from("Cards")
    .update({
      nombre,
      tipo,
      temporada,
      numero,
      category_id,
      rareza,
      image_url, 
    })
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
}