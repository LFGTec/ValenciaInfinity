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
  name: string;
  type: string | null;
  season: number | null;
  image_url?: string;
  rarity: string | null;
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
    .eq("is_deleted", false)
    .order("season", { ascending: true });

  if (catalogError) {
    console.error("Error al obtener el catalogo de cartas:", catalogError);
    return [];
  }

  const { data: userCards, error: userCardsError } = await supabase
    .from("user_cards")
    .select("card_id, quantity")
    .eq("user_id", userId);

  if (userCardsError) {
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
  created_at: string;
  opened_at: string | null;
}

export async function addCard(
  name: string,
  type: string,
  season: number,
  category_id: string,
  rarity: string | null,
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
        name,
        type,
        season,
        category_id,
        rarity,
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

export const updateCard = async (
  id: string,
  name: string,
  type: string,
  season: number,
  category_id: string,
  rarity: string | null,
  existing_image_url: string | null,
  file?: File
) => {
  let image_url = existing_image_url;

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
    .update({
      name,
      type,
      season,
      category_id,
      rarity,
      image_url,
    })
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
}

export const getUserPacks = async (userId: string): Promise<UserPack[]> => {
  const { data, error } = await supabase
    .from("user_packs")
    .select("*")
    .eq("user_id", userId)
    .is("opened_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error obtaining user packs:", error);
    return [];
  }

  return data as UserPack[];
};

export const createUserPack = async (userId: string): Promise<UserPack | null> => {
  try {
    const { data, error } = await supabase
      .from("user_packs")
      .insert([
        {
          user_id: userId,
        },
      ])
      .select();

    if (error) {
      console.error("Error creating pack:", error);
      return null;
    }

    return (data?.[0] as UserPack) || null;
  } catch (err) {
    console.error("Exception creating pack:", err);
    return null;
  }
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
      weight: rarityWeights[card.rarity?.toLowerCase() || "comun"] || 1,
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