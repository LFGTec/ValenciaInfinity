import { useEffect } from "react";
import { useAtom } from "jotai";
import {
  marketplaceAtom,
  setMarketplaceLoadingAtom,
  setMarketplaceErrorAtom,
  finishMarketplaceLoadingAtom,
  setListingsAtom,
  setUserOffersAtom,
  setTransactionHistoryAtom,
} from "../stores/marketplaceStore";
import * as marketplaceService from "../services/marketplaceService";
import type {
  MarketListing,
  MarketTransaction,
  OfferItemInput,
} from "../services/marketplaceService";
import { useAuth } from "./useAuth";

export function useMarketplace() {
  const { user } = useAuth();
  const [marketplace] = useAtom(marketplaceAtom);
  const [, setLoading] = useAtom(setMarketplaceLoadingAtom);
  const [, setError] = useAtom(setMarketplaceErrorAtom);
  const [, finishLoading] = useAtom(finishMarketplaceLoadingAtom);
  const [, setListings] = useAtom(setListingsAtom);
  const [, setUserOffers] = useAtom(setUserOffersAtom);
  const [, setTransactionHistory] = useAtom(setTransactionHistoryAtom);

  // Fetch active marketplace listings on mount
  useEffect(() => {
    if (!marketplace.fetched && !marketplace.loading) {
      fetchListings();
    }
  }, [marketplace.fetched, marketplace.loading]);

  // Fetch user's offers when user changes
  useEffect(() => {
    if (user?.id) {
      fetchUserOffers(user.id);
      fetchTransactionHistory(user.id);
    }
  }, [user?.id]);

  const fetchListings = async (limit: number = 20, offset: number = 0) => {
    setLoading(true);
    setError(null);
    try {
      const listings = await marketplaceService.getActiveMarketOffers(
        limit,
        offset
      );
      setListings(listings);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error loading listings";
      setError(errorMsg);
      console.error("Error fetching listings:", err);
    } finally {
      finishLoading();
    }
  };

  const fetchUserOffers = async (userId: string) => {
    try {
      console.log("[useMarketplace] fetchUserOffers: fetching for userId=", userId);
      const offers = await marketplaceService.getUserMarketOffers(userId);
      console.log("[useMarketplace] fetchUserOffers: received offers count=", offers?.length);
      setUserOffers(offers);
    } catch (err) {
      console.error("Error fetching user offers:", err);
    }
  };

  const fetchTransactionHistory = async (userId: string) => {
    try {
      const transactions =
        await marketplaceService.getMarketTransactionHistory(userId);
      setTransactionHistory(transactions);
    } catch (err) {
      console.error("Error fetching transaction history:", err);
    }
  };

  const postOffer = async (
    title: string,
    type: "card_for_card" | "card_for_points" | "points_for_card",
    offeringItems: OfferItemInput[],
    wantedItems: OfferItemInput[],
    expiresAt?: string
  ): Promise<boolean> => {
    if (!user?.id) {
      setError("You must be logged in to post an offer");
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const offerId = await marketplaceService.createMarketOffer(
        user.id,
        title,
        type,
        offeringItems,
        wantedItems,
        expiresAt
      );

      if (!offerId) {
        setError("Failed to create offer");
        return false;
      }

      // Refresh user offers
      await fetchUserOffers(user.id);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error creating offer";
      setError(errorMsg);
      console.error("Error posting offer:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const acceptOffer = async (offerId: string): Promise<boolean> => {
    if (!user?.id) {
      setError("You must be logged in to accept an offer");
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await marketplaceService.acceptMarketOffer(offerId, user.id);

      if (!result.success) {
        setError(result.error || "Failed to accept offer");
        return false;
      }

      // Refresh listings and user offers
      await Promise.all([
        fetchListings(),
        fetchUserOffers(user.id),
        fetchTransactionHistory(user.id),
      ]);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error accepting offer";
      setError(errorMsg);
      console.error("Error accepting offer:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelOffer = async (offerId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const success = await marketplaceService.cancelMarketOffer(offerId);

      if (!success) {
        setError("Failed to cancel offer");
        return false;
      }

      // Refresh user offers
      if (user?.id) {
        await fetchUserOffers(user.id);
      }
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error cancelling offer";
      setError(errorMsg);
      console.error("Error cancelling offer:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    listings: marketplace.listings,
    userOffers: marketplace.userOffers,
    transactionHistory: marketplace.transactionHistory,
    loading: marketplace.loading,
    error: marketplace.error,
    fetched: marketplace.fetched,
    postOffer,
    acceptOffer,
    cancelOffer,
    fetchListings,
    fetchUserOffers,
    fetchTransactionHistory,
  };
}
