import { supabase } from "./supabaseClient";

export interface FriendSuggestion {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
}

export interface TradeItem {
  id: string;
  trade_request_id: string;
  card_id: string;
  quantity: number;
  side: "offered" | "wanted";
  card?: {
    id: string;
    name: string;
    type: string | null;
    season: number | null;
    rarity: "common" | "rare" | "epic" | "legendary";
    image_url?: string | null;
  };
}

export interface TradeRequest {
  id: string;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  requester_id: string;
  receiver_id: string;
  status: "pending" | "accepted" | "rejected" | "cancelled" | "expired";
  trade_items?: TradeItem[];
  requester_profile?: {
    id: string;
    full_name: string | null;
    email: string | null;
  } | null;
  receiver_profile?: {
    id: string;
    full_name: string | null;
    email: string | null;
  } | null;
}

const getProfilesByIds = async (userIds: string[]) => {
  if (userIds.length === 0) {
    return new Map<string, { id: string; full_name: string | null; email: string | null }>();
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", userIds);

  if (error) {
    console.error("Error fetching trade profiles:", error);
    return new Map<string, { id: string; full_name: string | null; email: string | null }>();
  }

  return new Map((data || []).map((profile) => [profile.id, profile]));
};

export const getFriendsByName = async (
  searchTerm: string
): Promise<FriendSuggestion[]> => {
  if (!searchTerm.trim()) return [];

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) return [];

    const search = `%${searchTerm.trim()}%`;

    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, email, avatar_url")
      .ilike("full_name", search)
      .limit(10);

    if (!data) return [];

    const friendsList: FriendSuggestion[] = [];

    for (const profile of data) {
      const { data: friendship } = await supabase
        .from("friend_requests")
        .select("id")
        .eq("status", "ACCEPTED")
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${profile.id}),and(receiver_id.eq.${user.id},sender_id.eq.${profile.id})`
        )
        .maybeSingle();

      if (friendship) {
        friendsList.push({
          id: profile.id,
          full_name: profile.full_name || profile.email,
          email: profile.email,
          avatar_url: profile.avatar_url,
        });
      }
    }

    return friendsList;
  } catch (err) {
    console.error("Error searching friends by name:", err);
    return [];
  }
};

export const getUserIdByEmail = async (
  email: string
): Promise<string | null> => {
  const normalizedEmail = email.trim().toLowerCase();

  console.log(`Searching for friend with email: "${email}"`);

  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      console.log("❌ No authenticated user");
      return null;
    }

    // Search for friend by email among accepted friendships
    const { data: friends, error } = await supabase
      .from("profiles")
      .select("id, email")
      .or(
        `email.ilike.${normalizedEmail},email.eq.${normalizedEmail}`
      )
      .limit(1);

    if (error || !friends || friends.length === 0) {
      console.log(`❌ Friend not found with email "${email}"`);
      return null;
    }

    const friend = friends[0];

    // Verify friendship exists
    const { data: friendshipCheck } = await supabase
      .from("friend_requests")
      .select("id")
      .eq("status", "ACCEPTED")
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${friend.id}),and(receiver_id.eq.${user.id},sender_id.eq.${friend.id})`
      )
      .maybeSingle();

    if (!friendshipCheck) {
      console.log(`❌ ${friend.email} is not your friend`);
      return null;
    }

    console.log(`✅ Found friend:`, friend.id, "email:", friend.email);
    return friend.id;
  } catch (err) {
    console.error("Error searching for friend:", err);
    return null;
  }
};

export const getMyTradeRequests = async (
  userId: string
): Promise<TradeRequest[]> => {
  const { data, error } = await supabase
    .from("trade_requests")
    .select(`
      *,
      trade_items(*)
    `)
    .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`);

  if (error) {
    console.error("Error fetching trade requests:", error);
    return [];
  }

  const trades = (data || []) as TradeRequest[];
  const profileIds = [...new Set(trades.flatMap((trade) => [trade.requester_id, trade.receiver_id]))];
  const profiles = await getProfilesByIds(profileIds);

  // Fetch card data separately
  const allCardIds = new Set<string>();
  trades.forEach((trade) => {
    trade.trade_items?.forEach((item) => {
      if (item.card_id) allCardIds.add(item.card_id);
    });
  });

  let cardsMap = new Map<string, any>();
  if (allCardIds.size > 0) {
    const { data: cardsData, error: cardsError } = await supabase
      .from("Cards")
      .select(`
        id,
        name,
        type,
        season,
        image_url,
        categories(id, name, color)
      `)
      .in("id", Array.from(allCardIds));

    if (!cardsError && cardsData) {
      cardsMap = new Map(cardsData.map((card: any) => [card.id, card]));
      console.log("✅ Fetched cards:", cardsMap.size);
    } else {
      console.error("❌ Error fetching cards:", cardsError);
    }
  }

  console.log("Cards map size:", cardsMap.size, "All card IDs:", allCardIds.size);

  return trades.map((trade) => ({
    ...trade,
    trade_items: trade.trade_items?.map((item) => ({
      ...item,
      card: cardsMap.get(item.card_id) || { id: item.card_id, name: "Carta" },
    })),
    requester_profile: profiles.get(trade.requester_id) || null,
    receiver_profile: profiles.get(trade.receiver_id) || null,
  }));
};

export const getTradeRequestById = async (
  tradeId: string
): Promise<TradeRequest | null> => {
  const { data, error } = await supabase
    .from("trade_requests")
    .select(`
      *,
      trade_items(*)
    `)
    .eq("id", tradeId)
    .single();

  if (error) {
    console.error("Error fetching trade request:", error);
    return null;
  }

  const trade = data as TradeRequest;
  const profiles = await getProfilesByIds([trade.requester_id, trade.receiver_id]);

  // Fetch card data separately
  const allCardIds = new Set<string>();
  trade.trade_items?.forEach((item) => {
    if (item.card_id) allCardIds.add(item.card_id);
  });

  let cardsMap = new Map<string, any>();
  if (allCardIds.size > 0) {
    const { data: cardsData, error: cardsError } = await supabase
      .from("Cards")
      .select(`
        id,
        name,
        type,
        season,
        image_url,
        categories(id, name, color)
      `)
      .in("id", Array.from(allCardIds));

    if (!cardsError && cardsData) {
      cardsMap = new Map(cardsData.map((card: any) => [card.id, card]));
      console.log("✅ Fetched cards:", cardsMap.size);
    } else {
      console.error("❌ Error fetching cards:", cardsError);
    }
  }

  return {
    ...trade,
    trade_items: trade.trade_items?.map((item) => ({
      ...item,
      card: cardsMap.get(item.card_id) || { id: item.card_id, name: "Carta" },
    })),
    requester_profile: profiles.get(trade.requester_id) || null,
    receiver_profile: profiles.get(trade.receiver_id) || null,
  };
};

export const createTradeRequest = async (
  requesterId: string,
  receiverId: string,
  offeredCards: Array<{ card_id: string; quantity: number }>,
  wantedCards: Array<{ card_id: string; quantity: number }>,
  expiresAt?: string
): Promise<string | null> => {
  const { data, error } = await supabase
    .from("trade_requests")
    .insert({
      requester_id: requesterId,
      receiver_id: receiverId,
      expires_at: expiresAt || null,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating trade request:", error);
    return null;
  }

  const tradeId = data.id;

  const itemsToInsert = [
    ...offeredCards.map((card) => ({
      trade_request_id: tradeId,
      card_id: card.card_id,
      quantity: card.quantity,
      side: "offered" as const,
    })),
    ...wantedCards.map((card) => ({
      trade_request_id: tradeId,
      card_id: card.card_id,
      quantity: card.quantity,
      side: "wanted" as const,
    })),
  ];

  const { error: itemsError } = await supabase
    .from("trade_items")
    .insert(itemsToInsert);

  if (itemsError) {
    console.error("Error creating trade items:", itemsError);
    return null;
  }

  return tradeId;
};

export const updateTradeStatus = async (
  tradeId: string,
  status: "accepted" | "rejected" | "cancelled" | "expired"
): Promise<boolean> => {
  const { error } = await supabase
    .from("trade_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", tradeId);

  if (error) {
    console.error("Error updating trade status:", error);
    return false;
  }

  return true;
};

export const acceptTradeWithInventoryUpdate = async (
  tradeId: string
): Promise<boolean> => {
  try {
    // Fetch trade details first to validate
    const trade = await getTradeRequestById(tradeId);
    if (!trade) {
      console.error("Trade not found");
      return false;
    }

    // Validate that both sides have items
    const offeredItems = trade.trade_items?.filter(i => i.side === "offered") || [];
    const wantedItems = trade.trade_items?.filter(i => i.side === "wanted") || [];

    if (offeredItems.length === 0 || wantedItems.length === 0) {
      console.error("Trade has no offered or wanted items");
      return false;
    }

    // Validate quantities
    for (const item of [...offeredItems, ...wantedItems]) {
      if (!item.card_id || item.quantity < 1) {
        console.error("Invalid trade item:", item);
        return false;
      }
    }

    const { data, error } = await supabase.rpc("accept_trade", {
      trade_id: tradeId,
    });

    if (error) {
      console.error("Error accepting trade:", error);
      return false;
    }

    if (data && !data.success) {
      console.error("Trade acceptance failed:", data.error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error in acceptTradeWithInventoryUpdate:", err);
    return false;
  }
};

export const addTradeItem = async (
  tradeId: string,
  cardId: string,
  quantity: number,
  side: "offered" | "wanted"
): Promise<boolean> => {
  const { error } = await supabase.from("trade_items").insert({
    trade_request_id: tradeId,
    card_id: cardId,
    quantity,
    side,
  });

  if (error) {
    console.error("Error adding trade item:", error);
    return false;
  }

  return true;
};

export const removeTradeItem = async (itemId: string): Promise<boolean> => {
  const { error } = await supabase
    .from("trade_items")
    .delete()
    .eq("id", itemId);

  if (error) {
    console.error("Error removing trade item:", error);
    return false;
  }

  return true;
};
