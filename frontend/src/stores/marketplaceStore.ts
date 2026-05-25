import { atom } from "jotai";
import type { MarketListing, MarketTransaction } from "../services/marketplaceService";

export interface MarketplaceState {
  listings: MarketListing[];
  userOffers: MarketListing[];
  transactionHistory: MarketTransaction[];
  loading: boolean;
  error: string | null;
  fetched: boolean;
}

const initialState: MarketplaceState = {
  listings: [],
  userOffers: [],
  transactionHistory: [],
  loading: false,
  error: null,
  fetched: false,
};

export const marketplaceAtom = atom<MarketplaceState>(initialState);

// Derived read atoms
export const listingsAtom = atom((get) => get(marketplaceAtom).listings);
export const userOffersAtom = atom((get) => get(marketplaceAtom).userOffers);
export const transactionHistoryAtom = atom((get) => get(marketplaceAtom).transactionHistory);
export const marketplaceLoadingAtom = atom((get) => get(marketplaceAtom).loading);
export const marketplaceErrorAtom = atom((get) => get(marketplaceAtom).error);
export const marketplaceFetchedAtom = atom((get) => get(marketplaceAtom).fetched);

// Setter atoms
export const setMarketplaceAtom = atom(
  null,
  (_get, set, newState: MarketplaceState) => {
    set(marketplaceAtom, newState);
  }
);

export const setListingsAtom = atom(
  null,
  (get, set, listings: MarketListing[]) => {
    const currentState = get(marketplaceAtom);
    set(marketplaceAtom, { ...currentState, listings });
  }
);

export const setUserOffersAtom = atom(
  null,
  (get, set, userOffers: MarketListing[]) => {
    const currentState = get(marketplaceAtom);
    set(marketplaceAtom, { ...currentState, userOffers });
  }
);

export const setTransactionHistoryAtom = atom(
  null,
  (get, set, transactionHistory: MarketTransaction[]) => {
    const currentState = get(marketplaceAtom);
    set(marketplaceAtom, { ...currentState, transactionHistory });
  }
);

export const setMarketplaceLoadingAtom = atom(
  null,
  (get, set, loading: boolean) => {
    const currentState = get(marketplaceAtom);
    set(marketplaceAtom, { ...currentState, loading });
  }
);

export const setMarketplaceErrorAtom = atom(
  null,
  (get, set, error: string | null) => {
    const currentState = get(marketplaceAtom);
    set(marketplaceAtom, { ...currentState, error });
  }
);

export const finishMarketplaceLoadingAtom = atom(
  null,
  (get, set) => {
    const currentState = get(marketplaceAtom);
    set(marketplaceAtom, {
      ...currentState,
      loading: false,
      fetched: true,
    });
  }
);

export const resetMarketplaceAtom = atom(
  null,
  (_get, set) => {
    set(marketplaceAtom, initialState);
  }
);
