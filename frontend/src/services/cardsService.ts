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

export interface UserPack {
  id: string;
  user_id: string;
  pack_type: string;
  created_at: string;
  opened_at: string | null;
}

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
}

export const getUserPacks = async (userId: string): Promise<UserPack[]> => {
  const { data, error } = await supabase
    .from("user_packs")
    .select("*")
    .eq("user_id", userId)
    .is("opened_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al obtener sobres del usuario:", error);
    return [];
  }

  return data as UserPack[];
};

export const createUserPack = async (
  userId: string,
  packType: string = "standard"
): Promise<UserPack | null> => {
  const { data, error } = await supabase
    .from("user_packs")
    .insert([
      {
        user_id: userId,
        pack_type: packType,
      },
    ])
    .select();

  if (error) {
    console.error("Error al crear sobre:", error);
    return null;
  }

  return (data?.[0] as UserPack) || null;
};

export const openPack = async (packId: string): Promise<Card[] | null> => {
  try {
    // Get all non-deleted cards for weighted selection
    const { data: allCards, error: cardsError } = await supabase
      .from("Cards")
      .select("*")
      .eq("is_deleted", false);

    if (cardsError) {
      console.error("Error al obtener cartas:", cardsError);
      return null;
    }

    if (!allCards || allCards.length === 0) {
      console.warn("No hay cartas disponibles");
      return null;
    }

    // Weighted card selection by rarity
    const rarityWeights: { [key: string]: number } = {
      comun: 50,
      rara: 30,
      epica: 15,
      legendaria: 5,
    };

    const cardsWithWeights = (allCards as Card[]).map((card) => ({
      ...card,
      weight: rarityWeights[card.rareza?.toLowerCase() || "comun"] || 1,
    }));

    // Select 5 random cards with weighted distribution
    const selectedCards: Card[] = [];
    for (let i = 0; i < 5 && cardsWithWeights.length > 0; i++) {
      const totalWeight = cardsWithWeights.reduce((sum, card) => sum + card.weight, 0);
      let random = Math.random() * totalWeight;

      for (const card of cardsWithWeights) {
        random -= card.weight;
        if (random <= 0) {
          selectedCards.push(card);
          // Remove selected card to avoid duplicates
          cardsWithWeights.splice(cardsWithWeights.indexOf(card), 1);
          break;
        }
      }
    }

    // Get current user from auth
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;

    if (!userId) {
      console.error("No user authenticated");
      return null;
    }

    // Upsert cards into user_cards table
    for (const card of selectedCards) {
      const { data: existingCard, error: fetchError } = await supabase
        .from("user_cards")
        .select("quantity")
        .eq("user_id", userId)
        .eq("card_id", card.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching existing card:", fetchError);
        continue;
      }

      const newQuantity = (existingCard?.quantity || 0) + 1;

      if (existingCard) {
        // Update existing record
        await supabase
          .from("user_cards")
          .update({ quantity: newQuantity })
          .eq("user_id", userId)
          .eq("card_id", card.id);
      } else {
        // Insert new record
        await supabase
          .from("user_cards")
          .insert([
            {
              user_id: userId,
              card_id: card.id,
              quantity: 1,
            },
          ]);
      }
    }

    // Mark pack as opened
    const { error: updateError } = await supabase
      .from("user_packs")
      .update({ opened_at: new Date().toISOString() })
      .eq("id", packId);

    if (updateError) {
      console.error("Error al marcar sobre como abierto:", updateError);
      return null;
    }

    return selectedCards;
  } catch (error) {
    console.error("Error opening pack:", error);
    return null;
  }
}