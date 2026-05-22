import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import {
  getMyTradeRequests,
  updateTradeStatus,
  createTradeRequest,
  getUserIdByEmail,
  type TradeRequest,
} from "../services/tradeService";

export const useTrades = () => {
  const { user } = useAuth();
  const [trades, setTrades] = useState<TradeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrades = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const data = await getMyTradeRequests(user.id);
      setTrades(data);
      setLoading(false);
    };

    fetchTrades();
  }, [user?.id]);

  const acceptTrade = async (tradeId: string) => {
    const success = await updateTradeStatus(tradeId, "accepted");
    if (success) {
      setTrades((prev) =>
        prev.map((t) =>
          t.id === tradeId ? { ...t, status: "accepted" } : t
        )
      );
    } else {
      setError("Error aceptando el intercambio");
    }
    return success;
  };

  const rejectTrade = async (tradeId: string) => {
    const success = await updateTradeStatus(tradeId, "rejected");
    if (success) {
      setTrades((prev) =>
        prev.map((t) =>
          t.id === tradeId ? { ...t, status: "rejected" } : t
        )
      );
    } else {
      setError("Error rechazando el intercambio");
    }
    return success;
  };

  const createTrade = async (
    receiverEmail: string,
    offeredCards: Array<{ card_id: string; quantity: number }>,
    wantedCards: Array<{ card_id: string; quantity: number }>,
    expiresAt?: string
  ) => {
    if (!user?.id) {
      setError("Usuario no autenticado");
      return null;
    }

    // Get receiver ID from email
    const receiverId = await getUserIdByEmail(receiverEmail);
    if (!receiverId) {
      setError("Usuario no encontrado");
      return null;
    }

    const tradeId = await createTradeRequest(
      user.id,
      receiverId,
      offeredCards,
      wantedCards,
      expiresAt
    );

    if (tradeId) {
      const newTrade = await getMyTradeRequests(user.id);
      setTrades(newTrade);
    } else {
      setError("Error creando el intercambio");
    }

    return tradeId;
  };

  return {
    trades,
    loading,
    error,
    acceptTrade,
    rejectTrade,
    createTrade,
  };
};
