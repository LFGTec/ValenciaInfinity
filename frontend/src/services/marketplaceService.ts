import { supabase } from "./supabaseClient";

export interface MarketOfferItem {
  id: string;
  market_offer_id: string;
  card_id: string | null;
  quantity: number | null;
  points_amount: number | null;
  side: "offering" | "wanted";
  card?: {
    id: string;
    name: string;
    type: string | null;
    season: number | null;
    image_url: string | null;
    category_id: string | null;
  };
}

export interface CreatorProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
}

export interface MarketOffer {
  id: string;
  creator_id: string;
  title: string;
  type: "card_for_card" | "card_for_points" | "points_for_card";
  status: "active" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
  expires_at: string | null;
}

export interface MarketListing extends MarketOffer {
  creator_profile?: CreatorProfile;
  trade_items?: MarketOfferItem[];
}

export interface MarketTransaction {
  id: string;
  market_offer_id: string;
  buyer_id: string;
  completed_at: string;
  transaction_type: "card_for_card" | "card_for_points" | "points_for_card";
  market_offer?: {
    id: string;
    creator_id: string;
    title: string;
  };
}

export interface OfferItemInput {
  card_id?: string;
  quantity?: number;
  points_amount?: number;
}

export const getActiveMarketOffers = async (
  limit: number = 20,
  offset: number = 0
): Promise<MarketListing[]> => {
  try {
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from("market_offers")
      .select(
        `
        *,
        market_offer_items (
          *,
          card:card_id (
            id,
            name,
            type,
            season,
            image_url,
            category_id
          )
        )
      `
      )
      .eq("status", "active")
      .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching active market offers:", error);
      return [];
    }

    const listings = (data as MarketListing[]) || [];

    // Fetch creator profiles separately (avoid relying on PostgREST relationships)
    const creatorIds = Array.from(new Set(listings.map((l) => l.creator_id).filter(Boolean)));
    if (creatorIds.length > 0) {
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id,full_name,email,avatar_url")
        .in("id", creatorIds as string[]);

      const profilesMap: Record<string, any> = {};
      (profilesData || []).forEach((p: any) => (profilesMap[p.id] = p));

      return listings.map((l) => ({
        ...l,
        creator_profile: profilesMap[l.creator_id] || undefined,
        trade_items: (l as any).market_offer_items || (l as any).trade_items || [],
      }));
    }

    return listings;
  } catch (err) {
    console.error("Error fetching active market offers:", err);
    return [];
  }
};

export const getMarketOfferById = async (
  offerId: string
): Promise<MarketListing | null> => {
  try {
    const { data, error } = await supabase
      .from("market_offers")
      .select(
        `
        *,
        market_offer_items (
          *,
          card:card_id (
            id,
            name,
            type,
            season,
            image_url,
            category_id
          )
        )
      `
      )
      .eq("id", offerId)
      .single();

    if (error) {
      console.error("Error fetching market offer:", error);
      return null;
    }

    const listing = data as MarketListing | null;
    if (!listing) return null;

    if (listing.creator_id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id,full_name,email,avatar_url")
        .eq("id", listing.creator_id)
        .maybeSingle();

      return {
        ...listing,
        creator_profile: profile || undefined,
        trade_items: (listing as any).market_offer_items || (listing as any).trade_items || [],
      };
    }

    return {
      ...listing,
      trade_items: (listing as any).market_offer_items || (listing as any).trade_items || [],
    };
  } catch (err) {
    console.error("Error fetching market offer:", err);
    return null;
  }
};

export const getUserMarketOffers = async (
  userId: string
): Promise<MarketListing[]> => {
  try {
    const { data, error } = await supabase
      .from("market_offers")
      .select(
        `
        *,
        market_offer_items (
          *,
          card:card_id (
            id,
            name,
            type,
            season,
            image_url,
            category_id
          )
        )
      `
      )
      .eq("creator_id", userId)
      .in("status", ["active", "completed"])
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user market offers:", error);
      return [];
    }

    const listings = (data as MarketListing[]) || [];
    // For user-specific offers the creator is the user; try to fetch profile once
    if (listings.length > 0) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id,full_name,email,avatar_url")
        .eq("id", userId)
        .maybeSingle();

      return listings.map((l) => ({
        ...l,
        creator_profile: profile || undefined,
        trade_items: (l as any).market_offer_items || (l as any).trade_items || [],
      }));
    }

    return listings;
  } catch (err) {
    console.error("Error fetching user market offers:", err);
    return [];
  }
};

export const createMarketOffer = async (
  creatorId: string,
  title: string,
  type: "card_for_card" | "card_for_points" | "points_for_card",
  offeringItems: OfferItemInput[],
  wantedItems: OfferItemInput[],
  expiresAt?: string
): Promise<string | null> => {
  try {
    // Create market offer
    const { data: offerData, error: offerError } = await supabase
      .from("market_offers")
      .insert({
        creator_id: creatorId,
        title,
        type,
        status: "active",
        expires_at: expiresAt || null,
      })
      .select("id")
      .single();

    if (offerError || !offerData) {
      console.error("Error creating market offer:", offerError);
      return null;
    }

    const offerId = offerData.id;

    // Create offering items
    const offeringItemsToInsert = offeringItems.map((item) => ({
      market_offer_id: offerId,
      card_id: item.card_id || null,
      quantity: item.quantity || null,
      points_amount: item.points_amount || null,
      side: "offering" as const,
    }));

    // Create wanted items
    const wantedItemsToInsert = wantedItems.map((item) => ({
      market_offer_id: offerId,
      card_id: item.card_id || null,
      quantity: item.quantity || null,
      points_amount: item.points_amount || null,
      side: "wanted" as const,
    }));

    const allItems = [...offeringItemsToInsert, ...wantedItemsToInsert];

    const { error: itemsError } = await supabase
      .from("market_offer_items")
      .insert(allItems);

    if (itemsError) {
      console.error("Error creating market offer items:", itemsError);
      // Rollback: delete the offer
      await supabase.from("market_offers").delete().eq("id", offerId);
      return null;
    }

    return offerId;
  } catch (err) {
    console.error("Error creating market offer:", err);
    return null;
  }
};

export const cancelMarketOffer = async (offerId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("market_offers")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", offerId);

    if (error) {
      console.error("Error cancelling market offer:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error cancelling market offer:", err);
    return false;
  }
};

export const acceptMarketOffer = async (
  offerId: string,
  buyerId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.rpc("accept_market_offer", {
      p_offer_id: offerId,
      p_buyer_id: buyerId,
    });

    if (error) {
      console.error("Error accepting market offer:", error);
      return { success: false, error: error.message };
    }

    return data || { success: false, error: "Unknown error" };
  } catch (err) {
    console.error("Error accepting market offer:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
};

export const getMarketTransactionHistory = async (
  userId: string
): Promise<MarketTransaction[]> => {
  try {
    // First fetch transactions where user is buyer
    const { data: buyerTx, error: buyerError } = await supabase
      .from("market_transactions")
      .select("*")
      .eq("buyer_id", userId)
      .order("completed_at", { ascending: false });

    if (buyerError) {
      console.error("Error fetching buyer transactions:", buyerError);
      return [];
    }

    let transactions: MarketTransaction[] = (buyerTx as MarketTransaction[]) || [];

    // Fetch offers created by user and then transactions for those offers
    const { data: offersByUser } = await supabase
      .from("market_offers")
      .select("id,creator_id,title")
      .eq("creator_id", userId);

    const offerIds = (offersByUser || []).map((o: any) => o.id);
    if (offerIds.length > 0) {
      const { data: txByOffers, error: txError } = await supabase
        .from("market_transactions")
        .select("*")
        .in("market_offer_id", offerIds)
        .order("completed_at", { ascending: false });

      if (txError) {
        console.error("Error fetching transactions for user's offers:", txError);
      } else {
        transactions = transactions.concat((txByOffers as MarketTransaction[]) || []);
      }
    }

    // Attach market_offer info where possible
    const offerMap: Record<string, any> = {};
    if (offerIds.length > 0) {
      (offersByUser || []).forEach((o: any) => (offerMap[o.id] = o));
    }

    const result = transactions.map((t) => ({
      ...t,
      market_offer: offerMap[t.market_offer_id] || undefined,
    }));

    // Deduplicate by id
    const deduped: Record<string, MarketTransaction> = {};
    result.forEach((r) => (deduped[r.id] = r));

    return Object.values(deduped).sort((a, b) => (a.completed_at < b.completed_at ? 1 : -1));
  } catch (err) {
    console.error("Error fetching transaction history:", err);
    return [];
  }
};
