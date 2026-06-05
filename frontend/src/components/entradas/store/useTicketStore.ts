import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { generateSeats } from '../data/seat';
import type { Seat, Zone } from '../data/seat';

interface BuyerInfo {
  name: string;
  email: string;
}

interface Purchase {
  buyer: BuyerInfo;
  tickets: Seat[];
  date: string;
}

interface TicketStore {
  screen: 'home' | 'tickets' | 'success';
  seats: Seat[];
  selectedSeats: Seat[];
  activeZone: Zone | 'all';
  currentView: '2d' | '3d';
  lastPurchase: Purchase | null;
  selectedZone: Zone | null;

  goToTickets: () => void;
  goHome: () => void;
  setSelectedZone: (zone: Zone | null) => void;
  goSuccess: (purchase: Purchase) => void;
  toggleSeat: (seatId: string) => boolean | undefined;
  removeSeat: (seatId: string) => void;
  setActiveZone: (zone: Zone | 'all') => void;
  setCurrentView: (view: '2d' | '3d') => void;
  confirmPurchase: (buyerInfo: BuyerInfo) => void;
}

export const useTicketStore = create<TicketStore>()(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────
      screen: 'home',
      seats: [],
      selectedSeats: [],
      activeZone: 'all',
      currentView: '2d',
      lastPurchase: null,
      selectedZone: null,

      // ── Navigation ─────────────────────────────────────────
      goToTickets: () => {
        const { seats } = get();
        set({
          screen: 'tickets',
          seats: seats.length ? seats : generateSeats(),
        });
      },

      goHome: () => set((state) => ({
        screen: 'home',
        selectedSeats: [],
        selectedZone: null,
        // Limpia también el estado visual de cada asiento
        seats: state.seats.map((s) => ({ ...s, selected: false })),
      })),

      setSelectedZone: (zone) => {
        const { seats } = get();
        const currentSeats = seats.length ? seats : generateSeats();
        set({
          selectedZone: zone,
          activeZone: zone ?? 'all',
          seats: currentSeats,
          // Sincroniza la lista con los asientos que ya están marcados
          selectedSeats: currentSeats.filter((s) => s.selected),
        });
      },

      goSuccess: (purchase) => set({ screen: 'success', lastPurchase: purchase }),

      // ── Seat selection ──────────────────────────────────────
      toggleSeat: (seatId) => {
        const { seats, selectedSeats, activeZone } = get();
        const seat = seats.find((s) => s.id === seatId);
        if (!seat || seat.occupied) return;
        if (activeZone !== 'all' && seat.zone !== activeZone) return;

        if (seat.selected) {
          set({
            seats: seats.map((s) => s.id === seatId ? { ...s, selected: false } : s),
            selectedSeats: selectedSeats.filter((s) => s.id !== seatId),
          });
        } else {
          if (selectedSeats.length >= 8) return false;
          const updated = seats.map((s) => s.id === seatId ? { ...s, selected: true } : s);
          set({ seats: updated, selectedSeats: [...selectedSeats, { ...seat, selected: true }] });
        }
        return true;
      },

      removeSeat: (seatId) => {
        const { seats, selectedSeats } = get();
        set({
          seats: seats.map((s) => s.id === seatId ? { ...s, selected: false } : s),
          selectedSeats: selectedSeats.filter((s) => s.id !== seatId),
        });
      },

      // ── Filters / view ──────────────────────────────────────
      setActiveZone: (zone) => set({ activeZone: zone }),
      setCurrentView: (view) => set({ currentView: view }),

      // ── Purchase ────────────────────────────────────────────
      confirmPurchase: (buyerInfo) => {
        const { seats, selectedSeats } = get();
        const purchase: Purchase = {
          buyer: buyerInfo,
          tickets: [...selectedSeats],
          date: new Date().toLocaleString('es-ES'),
        };
        set({
          seats: seats.map((s) =>
            selectedSeats.find((sel) => sel.id === s.id)
              ? { ...s, selected: false, occupied: true }
              : s
          ),
          selectedSeats: [],
          screen: 'success',
          lastPurchase: purchase,
        });
      },
    }),
    {
      name: 'vcf-ticket-store',
      storage: createJSONStorage(() => sessionStorage),
      // Solo persiste el estado de asientos, no el screen
      partialize: (state) => ({
        seats: state.seats,
        selectedSeats: state.selectedSeats,
        selectedZone: state.selectedZone,
        activeZone: state.activeZone,
      }),
    }
  )
);
