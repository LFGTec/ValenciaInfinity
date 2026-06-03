import { supabase } from "./supabaseClient";

export interface Category {
  id: string;
  name: string;
  label: string;
  color: string;
  icon: string;
}

export interface Card {
  id: string;
  name: string;
  type: string | null;
  season: number | null;
  image_url: string | null;
  rarity: string | null;
  quantity?: number;
  obtained?: boolean;

  category_id: string;
  is_deleted: boolean;

  categories?: Category; 
}


export const getAlbumCardsByUser = async (userId: string): Promise<Card[]> => {
  const { data, error } = await supabase
    .from("user_cards")
    .select(`
      quantity,
      Cards (
        *,
        categories!fk_category (
          id,
          name,
          color,
        )
      )
    `)
    .eq("user_id", userId)
    .gt("quantity", 0);
    

  if (error) {
    console.error("Error al obtener cartas del usuario:", error);
    return [];
  }

  return (data ?? []).reduce<Card[]>((accumulator, row: any) => {
    const cardData = Array.isArray(row.Cards) ? row.Cards[0] : row.Cards;
    const card = cardData as Card | null | undefined;

    if (!card || card.is_deleted) {
      return accumulator;
    }

    accumulator.push({
      ...card,
      rarity: card.categories?.name || card.rarity || null,
      quantity: row.quantity ?? 0,
      obtained: true,
    });

    return accumulator;
  }, []).sort((left, right) => {
      const leftSeason = left.season ?? 0;
      const rightSeason = right.season ?? 0;
      return leftSeason - rightSeason;
    });
};

export const getFullAlbumCardsByUser = async (userId: string): Promise<Card[]> => {
  const [{ data: allCards, error: allCardsError }, { data: userCards, error: userCardsError }] = await Promise.all([
    supabase
      .from("Cards")
      .select(`
        *,
        categories!fk_category (
          id,
          name,
          color
        )
      `)
      .eq("is_deleted", false),
    supabase
      .from("user_cards")
      .select("card_id, quantity")
      .eq("user_id", userId)
      .gt("quantity", 0),
  ]);

  if (allCardsError) {
    throw new Error(allCardsError.message);
  }

  if (userCardsError) {
    throw new Error(userCardsError.message);
  }

  const ownedQuantities = new Map<string, number>(
    (userCards ?? []).map((row: any) => [row.card_id as string, Number(row.quantity ?? 0)])
  );

  return (allCards ?? [])
    .map((card: any) => {
      const quantity = ownedQuantities.get(card.id) ?? 0;

      return {
        ...card,
        rarity: card.categories?.name || card.rarity || null,
        quantity,
        obtained: quantity > 0,
      } as Card;
    })
    .sort((left, right) => {
      const leftSeason = left.season ?? 0;
      const rightSeason = right.season ?? 0;

      if (leftSeason !== rightSeason) {
        return leftSeason - rightSeason;
      }

      return left.name.localeCompare(right.name);
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
        color,
        icon,
      )
    `)
    .eq("is_deleted", false);

  if (error) {
    console.error("Error al obtener cartas:", error);
    return [];
  }

  return (data ?? []).map((card: any) => ({
    ...card,
    rarity: card.categories?.name || card.rarity || null,
  })) as Card[];
};

export const getAllCards = async (): Promise<Card[]> => {
  try {
    const { data, error } = await supabase
      .from("Cards")
      .select("*")
      .eq("is_deleted", false)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error al obtener todas las cartas:", error);
      return [];
    }

    console.log("Cartas obtenidas:", data);
    return (data || []) as Card[];
  } catch (err) {
    console.error("Excepción al obtener cartas:", err);
    return [];
  }
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

    // Persist every selected card before closing the pack.
    for (const card of selectedCards) {
      const { data: existingCard, error: fetchError } = await supabase
        .from("user_cards")
        .select("quantity")
        .eq("user_id", userId)
        .eq("card_id", card.id)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching existing card:", fetchError);
        throw new Error(`Error fetching existing card: ${fetchError.message || fetchError}`);
      }

      const newQuantity = (existingCard?.quantity || 0) + 1;

      if (existingCard) {
        const { error: updateError } = await supabase
          .from("user_cards")
          .update({ quantity: newQuantity })
          .eq("user_id", userId)
          .eq("card_id", card.id);

        if (updateError) {
          console.error("Error updating card quantity:", updateError);
          throw new Error(`Error updating card quantity: ${updateError.message || updateError}`);
        }
      } else {
        const { error: insertError } = await supabase
          .from("user_cards")
          .insert([
            {
              user_id: userId,
              card_id: card.id,
              quantity: 1,
            },
          ]);

        if (insertError) {
          console.error("Error inserting card:", insertError);
          throw new Error(`Error inserting card: ${insertError.message || insertError}`);
        }
      }
    }

    // Mark pack as opened
    const { error: updateError } = await supabase
      .from("user_packs")
      .update({ opened_at: new Date().toISOString() })
      .eq("id", packId)
      .eq("user_id", userId);

    if (updateError) {
      console.error("Error al marcar sobre como abierto:", updateError);
      throw new Error(`Error marking pack opened: ${updateError.message || updateError}`);
    }

    return selectedCards;
  } catch (error) {
    console.error("Error opening pack:", error);
    return null;
  }
}