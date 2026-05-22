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
      trade_items(
        *,
        card:card_id(id, name, type, season, rarity, image_url)
      )
    `)
    .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`);

  if (error) {
    console.error("Error fetching trade requests:", error);
    return [];
  }

  const trades = (data || []) as TradeRequest[];
  const profileIds = [...new Set(trades.flatMap((trade) => [trade.requester_id, trade.receiver_id]))];
  const profiles = await getProfilesByIds(profileIds);

  return trades.map((trade) => ({
    ...trade,
    requester_profile: profiles.get(trade.requester_id) || null,
    receiver_profile: profiles.get(trade.receiver_id) || null,
  }));
};

export const getTradeRequestById = async (
  tradeId: string
): Promise<TradeRequest | null> => {
  const { data, error } = await supabase
    .from("trade_requests")
    .select(
      `
      *,
      trade_items(
        *,
        card:card_id(id, name, type, season, rarity, image_url)
      )
    `
    )
    .eq("id", tradeId)
    .single();

  if (error) {
    console.error("Error fetching trade request:", error);
    return null;
  }

  const trade = data as TradeRequest;
  const profiles = await getProfilesByIds([trade.requester_id, trade.receiver_id]);

  return {
    ...trade,
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
