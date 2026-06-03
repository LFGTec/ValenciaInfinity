import { useEffect, useRef, useState } from "react";
import {
  UsersRound,
  MessageSquare,
  Check,
  X,
  Plus,
  Trash2,
  Search,
  ShoppingCart,
  Gift,
  TrendingUp,
} from "lucide-react";
import { useTrades } from "../../hooks/useTrades";
import { useAuth } from "../../hooks/useAuth";
import { useMarketplace } from "../../hooks/useMarketplace";
import { getAlbumCardsByUser, getCards, type Card } from "../../services/cardsService";
import { getFriendsByName, type FriendSuggestion } from "../../services/tradeService";

type MarketplaceSelectionItem = {
  card_id: string;
  quantity: number;
  points_amount?: number;
};

type PendingCancelOffer = {
  id: string;
  title: string;
};

export function CardExchange() {
  const { user } = useAuth();
  const { trades, loading: tradesLoading, acceptTrade, rejectTrade, createTrade } = useTrades();
  const { listings, userOffers, loading: marketplaceLoading, postOffer, acceptOffer, cancelOffer } = useMarketplace();
  const [activeTab, setActiveTab] = useState<
    "trades" | "propose" | "marketplace" | "my_offers"
  >("trades");
  const [tradeFilter, setTradeFilter] = useState<"all" | "pending" | "accepted">("all");

  // Marketplace form state
  const [marketplaceOfferType, setMarketplaceOfferType] = useState<"card_for_card" | "card_for_points" | "points_for_card">("card_for_card");
  const [offerTitle, setOfferTitle] = useState("");
  const [offerExpiresAt, setOfferExpiresAt] = useState("");
  const [creatingMarketplaceOffer, setCreatingMarketplaceOffer] = useState(false);
  const [acceptingOffer, setAcceptingOffer] = useState<string | null>(null);
  const [loadingMarketplaceCards, setLoadingMarketplaceCards] = useState(false);
  const [marketplaceCards, setMarketplaceCards] = useState<Card[]>([]);
  const [marketplaceOfferingPoints, setMarketplaceOfferingPoints] = useState<number | null>(null);
  const [marketplaceWantedPoints, setMarketplaceWantedPoints] = useState<number | null>(null);

  // Marketplace cards selection
  const [marketplaceOfferingCards, setMarketplaceOfferingCards] = useState<MarketplaceSelectionItem[]>([]);
  const [marketplaceWantedCards, setMarketplaceWantedCards] = useState<MarketplaceSelectionItem[]>([]);
  const [marketplaceSelectedTab, setMarketplaceSelectedTab] = useState<"offering" | "wanted">("offering");

  // Propose form state
  const [userCards, setUserCards] = useState<Card[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [loadingReceiverCards, setLoadingReceiverCards] = useState(false);
  const [receiverCards, setReceiverCards] = useState<Card[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [friendSuggestions, setFriendSuggestions] = useState<FriendSuggestion[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<FriendSuggestion | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [offeredCards, setOfferedCards] = useState<Array<{ card_id: string; quantity: number }>>([]);
  const [wantedCards, setWantedCards] = useState<Array<{ card_id: string; quantity: number }>>([]);
  const [selectedCardTab, setSelectedCardTab] = useState<"offered" | "wanted">("offered");
  const [creatingTrade, setCreatingTrade] = useState(false);
  const [offerToCancel, setOfferToCancel] = useState<PendingCancelOffer | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const showFeedback = (
    message: string,
    type: "success" | "error" | "warning" = "success"
  ) => {
    setFeedback({ type, message });
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    feedbackTimeoutRef.current = window.setTimeout(() => {
      setFeedback(null);
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (feedback) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [feedback]);

  // Load only current user cards when entering propose tab
  useEffect(() => {
    if (user?.id && (activeTab === "propose" || activeTab === "my_offers")) {
      const loadCards = async () => {
        setLoadingCards(true);
        try {
          const userCardsData = await getAlbumCardsByUser(user.id);
          console.log("User cards:", userCardsData);
          setUserCards(userCardsData);
        } catch (err) {
          console.error("Error loading cards:", err);
        } finally {
          setLoadingCards(false);
        }
      };
      loadCards();
    }
  }, [user?.id, activeTab]);

  useEffect(() => {
    if (!user?.id || activeTab !== "my_offers") {
      return;
    }

    let isCancelled = false;

    const loadMarketplaceCards = async () => {
      setLoadingMarketplaceCards(true);
      try {
        const cardsData = await getCards();
        if (!isCancelled) {
          setMarketplaceCards(cardsData);
        }
      } catch (err) {
        console.error("Error loading marketplace cards:", err);
        if (!isCancelled) {
          setMarketplaceCards([]);
        }
      } finally {
        if (!isCancelled) {
          setLoadingMarketplaceCards(false);
        }
      }
    };

    loadMarketplaceCards();

    return () => {
      isCancelled = true;
    };
  }, [user?.id, activeTab]);

  useEffect(() => {
    if (activeTab !== "propose") {
      return;
    }

    if (!searchTerm.trim()) {
      setFriendSuggestions([]);
      setShowSuggestions(false);
      setReceiverCards([]);
      setWantedCards([]);
      return;
    }

    let isCancelled = false;
    const timeoutId = window.setTimeout(async () => {
      setLoadingReceiverCards(true);
      try {
        const suggestions = await getFriendsByName(searchTerm);
        if (!isCancelled) {
          setFriendSuggestions(suggestions);
          setShowSuggestions(suggestions.length > 0);
        }
      } catch (err) {
        console.error("Error loading friend suggestions:", err);
        if (!isCancelled) {
          setFriendSuggestions([]);
        }
      } finally {
        if (!isCancelled) {
          setLoadingReceiverCards(false);
        }
      }
    }, 300);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [searchTerm, activeTab]);

  // Load receiver cards when friend is selected
  useEffect(() => {
    if (activeTab !== "propose" || !selectedFriend?.id) {
      return;
    }

    let isCancelled = false;
    const loadCards = async () => {
      setLoadingReceiverCards(true);
      try {
        const receiverCardsData = await getAlbumCardsByUser(selectedFriend.id);
        if (isCancelled) {
          return;
        }

        const availableReceiverCards = receiverCardsData.filter((card) => (card.quantity ?? 0) > 0);
        setReceiverCards(availableReceiverCards);
        setWantedCards((prev) =>
          prev.filter((item) =>
            availableReceiverCards.some((card) => card.id === item.card_id)
          )
        );
      } catch (err) {
        console.error("Error loading receiver cards:", err);
        if (!isCancelled) {
          setReceiverCards([]);
        }
      } finally {
        if (!isCancelled) {
          setLoadingReceiverCards(false);
        }
      }
    };

    loadCards();

    return () => {
      isCancelled = true;
    };
  }, [selectedFriend?.id, activeTab]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showSuggestions]);

  const handleAcceptTrade = async (tradeId: string) => {
    const success = await acceptTrade(tradeId);
    if (success) {
      showFeedback(
        "Felicidades. Las cartas intercambiadas se anadiran a tu album.",
        "success"
      );
    } else {
      showFeedback("No se pudo aceptar el intercambio.", "error");
    }
  };

  const handleRejectTrade = async (tradeId: string) => {
    const success = await rejectTrade(tradeId);
    if (success) {
      showFeedback("Intercambio rechazado.", "warning");
    } else {
      showFeedback("No se pudo rechazar el intercambio.", "error");
    }
  };

  const marketplaceOfferingUsesPoints = marketplaceOfferType === "points_for_card";
  const marketplaceWantedUsesPoints = marketplaceOfferType === "card_for_points";

  const getMarketplaceCardById = (cardId: string) =>
    marketplaceCards.find((card) => card.id === cardId) ||
    userCards.find((card) => card.id === cardId) ||
    null;

  const updateMarketplaceSelection = (
    side: "offering" | "wanted",
    cardId: string,
    quantity: number,
    pointsAmount?: number
  ) => {
    const safeQuantity = Math.max(1, Number.isFinite(quantity) ? quantity : 1);
    const safePointsAmount =
      pointsAmount === undefined ? undefined : Math.max(1, Number.isFinite(pointsAmount) ? pointsAmount : 1);

    const updateItems = (items: MarketplaceSelectionItem[]) => {
      const existing = items.find((item) => item.card_id === cardId);

      if (existing) {
        return items.map((item) =>
          item.card_id === cardId
            ? {
                ...item,
                quantity: safeQuantity,
                ...(safePointsAmount !== undefined ? { points_amount: safePointsAmount } : {}),
              }
            : item
        );
      }

      return [
        ...items,
        {
          card_id: cardId,
          quantity: safeQuantity,
          ...(safePointsAmount !== undefined ? { points_amount: safePointsAmount } : {}),
        },
      ];
    };

    if (side === "offering") {
      setMarketplaceOfferingCards((prev) => updateItems(prev));
    } else {
      setMarketplaceWantedCards((prev) => updateItems(prev));
    }
  };

  const removeMarketplaceSelection = (side: "offering" | "wanted", cardId: string) => {
    if (side === "offering") {
      setMarketplaceOfferingCards((prev) => prev.filter((item) => item.card_id !== cardId));
    } else {
      setMarketplaceWantedCards((prev) => prev.filter((item) => item.card_id !== cardId));
    }
  };

  const addCardToTrade = (cardId: string, quantity: number) => {
    const safeQuantity = Math.max(1, Number.isFinite(quantity) ? quantity : 1);

    if (selectedCardTab === "offered") {
      const ownedCard = userCards.find((c) => c.id === cardId);
      const maxQuantity = Math.max(1, ownedCard?.quantity ?? 1);
      const normalizedQuantity = Math.min(safeQuantity, maxQuantity);
      const existing = offeredCards.find((c) => c.card_id === cardId);
      if (existing) {
        setOfferedCards(
          offeredCards.map((c) =>
            c.card_id === cardId ? { ...c, quantity: normalizedQuantity } : c
          )
        );
      } else {
        setOfferedCards([...offeredCards, { card_id: cardId, quantity: normalizedQuantity }]);
      }
    } else {
      const receiverCard = receiverCards.find((c) => c.id === cardId);
      const maxQuantity = Math.max(1, receiverCard?.quantity ?? 1);
      const normalizedQuantity = Math.min(safeQuantity, maxQuantity);
      const existing = wantedCards.find((c) => c.card_id === cardId);
      if (existing) {
        setWantedCards(
          wantedCards.map((c) =>
            c.card_id === cardId ? { ...c, quantity: normalizedQuantity } : c
          )
        );
      } else {
        setWantedCards([...wantedCards, { card_id: cardId, quantity: normalizedQuantity }]);
      }
    }
  };

  const removeCardFromTrade = (cardId: string) => {
    if (selectedCardTab === "offered") {
      setOfferedCards(offeredCards.filter((c) => c.card_id !== cardId));
    } else {
      setWantedCards(wantedCards.filter((c) => c.card_id !== cardId));
    }
  };

  const handleProposeTrade = async () => {
    if (!selectedFriend?.id) {
      showFeedback("Selecciona un amigo para intercambiar.", "warning");
      return;
    }
    if (loadingReceiverCards) {
      showFeedback("Espera a que se carguen las cartas del usuario.", "warning");
      return;
    }
    if (receiverCards.length === 0) {
      showFeedback("El usuario no tiene cartas disponibles para solicitar.", "warning");
      return;
    }
    if (offeredCards.length === 0) {
      showFeedback("Debes ofrecer al menos una carta.", "warning");
      return;
    }
    if (wantedCards.length === 0) {
      showFeedback("Debes solicitar al menos una carta.", "warning");
      return;
    }

    const ownCardsById = new Map(userCards.map((card) => [card.id, card.quantity ?? 0]));
    const receiverCardsById = new Map(receiverCards.map((card) => [card.id, card.quantity ?? 0]));

    const invalidOfferedCard = offeredCards.find((item) => {
      const available = ownCardsById.get(item.card_id) ?? 0;
      return item.quantity < 1 || item.quantity > available;
    });
    if (invalidOfferedCard) {
      showFeedback("La cantidad ofrecida supera tus cartas disponibles.", "error");
      return;
    }

    const invalidWantedCard = wantedCards.find((item) => {
      const available = receiverCardsById.get(item.card_id) ?? 0;
      return item.quantity < 1 || item.quantity > available;
    });
    if (invalidWantedCard) {
      showFeedback("Solo puedes solicitar cartas que el usuario tenga disponibles.", "error");
      return;
    }

    setCreatingTrade(true);
    const tradeId = await createTrade(
      selectedFriend.email,
      offeredCards,
      wantedCards
    );
    setCreatingTrade(false);

    if (tradeId) {
      showFeedback("Intercambio propuesto correctamente.", "success");
      setSearchTerm("");
      setSelectedFriend(null);
      setReceiverCards([]);
      setOfferedCards([]);
      setWantedCards([]);
      setSelectedCardTab("offered");
    } else {
      showFeedback("Error al proponer el intercambio.", "error");
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 bg-content">
      <div className="mb-6">
        <h1 className="text-5xl font-black mb-4 text-foreground">
          INTERCAMBIO DE{" "}
          <span className="text-vcf-orange">CARTAS</span>
        </h1>
        <p className="text-xl text-muted-foreground">
Compra, vende e intercambia cartas con otros fans
        </p>
      </div>

      {feedback && (
        <div
          role="status"
          className={`mb-6 flex items-start justify-between gap-3 rounded-lg border-2 p-4 shadow-md ${
            feedback.type === "success"
              ? "border-green-600 bg-green-500/10 text-green-800"
              : feedback.type === "warning"
                ? "border-vcf-orange bg-vcf-orange/10 text-[#6e4a00]"
                : "border-red-600 bg-red-500/10 text-red-800"
          }`}
        >
          <p className="font-bold">{feedback.message}</p>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="rounded p-1 hover:bg-black/10"
            aria-label="Cerrar mensaje"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            id: "pending",
            label: "Intercambios Activos",
            value: trades.filter((t) => t.status === "pending").length,
            icon: UsersRound,
            color: "bg-vcf-orange",
            borderColor: "border-vcf-orange",
          },
          {
            id: "accepted",
            label: "Intercambios Aceptados",
            value: trades.filter((t) => t.status === "accepted").length,
            icon: Check,
            color: "bg-green-600",
            borderColor: "border-green-600",
          },
          {
            id: "all",
            label: "Total de Intercambios",
            value: trades.length,
            icon: MessageSquare,
            color: "bg-black",
            borderColor: "border-black",
          },
          {
            id: "offers",
            label: "Ofertas Publicadas",
            value: userOffers.filter((offer) => offer.status === "active").length,
            icon: TrendingUp,
            color: "bg-vcf-orange",
            borderColor: "border-vcf-orange",
          },
        ].map((stat, i) => (
          <button
            key={i}
            onClick={() =>
              stat.id === "offers"
                ? setActiveTab("my_offers")
                : setTradeFilter(stat.id as "all" | "pending" | "accepted")
            }
            className={`bg-card border-2 rounded-lg p-4 shadow-md transition-all text-left ${
              stat.id === "offers"
                ? activeTab === "my_offers"
                  ? `${stat.borderColor} bg-opacity-10`
                  : "border-border hover:border-vcf-orange"
                : tradeFilter === stat.id
                ? `${stat.borderColor} bg-opacity-10`
                : "border-border hover:border-vcf-orange"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center shadow-md`}
              >
                <stat.icon size={20} className="text-white" />
              </div>
              <div className="text-3xl font-black text-foreground">
                {stat.value}
              </div>
            </div>
            <div className="text-sm text-muted-foreground font-bold">
              {stat.label}
            </div>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b-2 border-border overflow-x-auto">
        {[
          { id: "trades", label: "INTERCAMBIOS", icon: UsersRound },
          { id: "propose", label: "CREAR INTERCAMBIO", icon: Gift },
          { id: "marketplace", label: "MARKETPLACE", icon: ShoppingCart },
          { id: "my_offers", label: "MIS OFERTAS", icon: TrendingUp },
        ].map((tab) => (
          <button
            key={tab.id}
                  onClick={() => setActiveTab(tab.id as "trades" | "propose" | "marketplace" | "my_offers")}
            className={`px-6 py-3 font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "border-b-4 border-vcf-orange text-vcf-orange"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Intercambios */}
      {activeTab === "trades" && (
        <div>
          <h2 className="text-2xl font-black mb-6 text-foreground">
            MIS SOLICITUDES DE{" "}
            <span className="text-vcf-orange">INTERCAMBIO</span>
          </h2>

          {tradesLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Cargando intercambios...
            </div>
          ) : trades.length === 0 || trades.filter((t) => {
            if (tradeFilter === "all") return true;
            return t.status === tradeFilter;
          }).length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-2xl font-bold mb-2 text-foreground">
                No hay intercambios
              </h3>
              <p className="text-muted-foreground mb-6">
                ¡Crea uno ahora y comienza a intercambiar cartas con otros fans!
              </p>
              <button
                onClick={() => setActiveTab("propose")}
                className="px-6 py-3 bg-vcf-orange text-white rounded-lg font-bold hover:bg-[#a86d12] transition-all shadow-lg hover:shadow-xl"
              >
                Proponer Intercambio
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {trades
                .filter((trade) => {
                  if (tradeFilter === "all") return true;
                  return trade.status === tradeFilter;
                })
                .map((trade) => {
                const isRequester = trade.requester_id === user?.id;
                const otherPartyProfile = isRequester
                  ? trade.receiver_profile
                  : trade.requester_profile;
                const offeredCards = trade.trade_items?.filter(
                  (item) => item.side === "offered"
                ) || [];
                const wantedCards = trade.trade_items?.filter(
                  (item) => item.side === "wanted"
                ) || [];

                return (
                  <div
                    key={trade.id}
                    className="bg-card border-2 border-border rounded-lg p-6 shadow-md hover:border-vcf-orange transition-all"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-black mb-1 text-foreground">
                          Intercambio con{" "}
                          <span className="text-vcf-orange">
                            {otherPartyProfile?.full_name || otherPartyProfile?.email || "Usuario"}
                          </span>
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(trade.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold ${
                          trade.status === "pending"
                            ? "bg-vcf-orange/20 text-vcf-orange"
                            : trade.status === "accepted"
                              ? "bg-green-500/20 text-green-600"
                              : "bg-red-500/20 text-red-600"
                        }`}
                      >
                        {trade.status === "pending"
                          ? "PENDIENTE"
                          : trade.status === "accepted"
                            ? "ACEPTADO"
                            : "RECHAZADO"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {/* Offered Cards */}
                      <div>
                        <h4 className="font-bold mb-3 text-sm text-muted-foreground">
                          {isRequester ? "OFRECES:" : "TE OFRECE:"}
                        </h4>
                        <div className="space-y-2">
                          {offeredCards.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 p-3 bg-muted rounded-lg shadow-sm"
                            >
                              <div className="w-12 h-16 bg-gradient-to-br from-orange-50 to-yellow-50 rounded flex-shrink-0 shadow-md relative flex items-center justify-center p-1">
                                {item.card?.image_url && (
                                  <img
                                    src={item.card.image_url}
                                    alt={item.card.name}
                                    className="w-full h-full object-contain"
                                  />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-sm text-foreground mb-1">
                                  {item.card?.name || "Carta"}
                                </div>
                                <div className="text-xs text-muted-foreground space-y-0.5">
                                  {item.card?.type && (
                                    <div>Tipo: {item.card.type}</div>
                                  )}
                                  {item.card?.season && (
                                    <div>Temporada: {item.card.season}</div>
                                  )}
                                  {item.card?.rarity && (
                                    <div>Categoría: {item.card.rarity}</div>
                                  )}
                                  {item.quantity > 1 && (
                                    <div className="font-bold text-vcf-orange">x{item.quantity}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex items-center justify-center">
                        <div className="text-4xl font-black text-vcf-orange">
                          ⇄
                        </div>
                      </div>

                      {/* Requested Cards */}
                      <div>
                        <h4 className="font-bold mb-3 text-sm text-muted-foreground">
                          {isRequester ? "SOLICITAS:" : "SOLICITA:"}
                        </h4>
                        <div className="space-y-2">
                          {wantedCards.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 p-3 bg-black/10 rounded-lg shadow-sm"
                            >
                              <div className="w-12 h-16 bg-gradient-to-br from-orange-50 to-yellow-50 rounded flex-shrink-0 shadow-md relative flex items-center justify-center p-1">
                                {item.card?.image_url && (
                                  <img
                                    src={item.card.image_url}
                                    alt={item.card.name}
                                    className="w-full h-full object-contain"
                                  />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-sm text-foreground mb-1">
                                  {item.card?.name || "Carta"}
                                </div>
                                <div className="text-xs text-muted-foreground space-y-0.5">
                                  {item.card?.type && (
                                    <div>Tipo: {item.card.type}</div>
                                  )}
                                  {item.card?.season && (
                                    <div>Temporada: {item.card.season}</div>
                                  )}
                                  {item.card?.rarity && (
                                    <div>Rareza: {item.card.rarity}</div>
                                  )}
                                  {item.quantity > 1 && (
                                    <div className="font-bold text-vcf-orange">x{item.quantity}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {trade.status === "pending" && !isRequester && (
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            handleAcceptTrade(trade.id)
                          }
                          className="flex-1 py-3 bg-vcf-orange text-white rounded-lg font-bold hover:bg-[#a86d12] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          <Check size={20} />
                          ACEPTAR INTERCAMBIO
                        </button>

                        <button
                          onClick={() =>
                            handleRejectTrade(trade.id)
                          }
                          className="flex-1 py-3 bg-black text-white rounded-lg font-bold hover:bg-black/80 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          <X size={20} />
                          RECHAZAR
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Proponer Intercambio */}
      {activeTab === "propose" && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black mb-6 text-foreground">
            PROPONER UN NUEVO{" "}
            <span className="text-vcf-orange">INTERCAMBIO</span>
          </h2>

          <div className="bg-card border-2 border-vcf-orange rounded-lg p-8 shadow-lg">
            <div className="space-y-6">
              {/* Friend Search */}
              <div>
                <label className="block font-bold mb-2 text-foreground">
                Selecciona un amigo para intercambiar <span className="text-red-500">*</span>
              </label>
              <div className="relative" ref={suggestionsRef}>
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 text-muted-foreground" size={20} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(searchTerm.trim().length > 0)}
                    placeholder="Busca por nombre..."
                    className="w-full pl-10 pr-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none"
                  />
                </div>

                {selectedFriend && !showSuggestions && (
                  <div className="mt-3 p-3 bg-vcf-orange/10 border-2 border-vcf-orange rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {selectedFriend.avatar_url && (
                        <img
                          src={selectedFriend.avatar_url}
                          alt={selectedFriend.full_name}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div>
                        <div className="font-bold text-foreground">
                          {selectedFriend.full_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {selectedFriend.email}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFriend(null);
                        setSearchTerm("");
                        setReceiverCards([]);
                      }}
                      className="p-1 hover:bg-red-500/20 rounded transition-colors"
                    >
                      <X size={20} className="text-red-500" />
                    </button>
                  </div>
                )}

                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-vcf-orange rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                    {loadingReceiverCards ? (
                      <div className="p-4 text-center text-muted-foreground">
                        Buscando amigos...
                      </div>
                    ) : friendSuggestions.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        {searchTerm.trim()
                          ? "No encontramos amigos con ese nombre"
                          : "Escribe un nombre para buscar"}
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {friendSuggestions.map((friend) => (
                          <button
                            key={friend.id}
                            onClick={() => {
                              setSelectedFriend(friend);
                              setSearchTerm("");
                              setShowSuggestions(false);
                            }}
                            className="w-full p-3 flex items-center gap-3 hover:bg-muted transition-colors text-left"
                          >
                            {friend.avatar_url && (
                              <img
                                src={friend.avatar_url}
                                alt={friend.full_name}
                                className="w-10 h-10 rounded-full"
                              />
                            )}
                            <div className="min-w-0">
                              <div className="font-bold text-foreground truncate">
                                {friend.full_name}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {friend.email}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

              {/* Cards Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Offered Cards */}
                <div>
                  <h3 className="font-bold mb-4 text-foreground text-lg">
                    CARTAS QUE{" "}
                    <span className="text-vcf-orange">OFRECES</span>
                    <span className="text-red-500 ml-2">*</span>
                  </h3>

                  {/* Selected Offered Cards */}
                  <div className="mb-4 space-y-2">
                    {offeredCards.length === 0 ? (
                      <div className="text-sm text-muted-foreground italic p-3 bg-muted rounded">
                        Selecciona cartas que ofreces
                      </div>
                    ) : (
                      offeredCards.map((item) => {
                        const card = userCards.find((c) => c.id === item.card_id);
                        return (
                          <div
                            key={item.card_id}
                            className="flex items-center gap-3 p-3 bg-muted rounded-lg border-l-4 border-vcf-orange"
                          >
                            <div className="w-14 h-20 rounded bg-white/80 border border-border overflow-hidden flex-shrink-0 shadow-sm">
                              {card?.image_url ? (
                                <img
                                  src={card.image_url}
                                  alt={card.name}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground px-1 text-center">
                                  Sin imagen
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-foreground truncate">
                                {card?.name || "Carta"}
                              </div>
                              <div className="text-xs text-muted-foreground space-y-0.5">
                                <div>
                                  Categoría: {card?.categories?.name || "Sin categoría"}
                                </div>
                                <div>
                                  Tipo: {card?.type || "N/A"} · Temporada: {card?.season ?? "N/A"}
                                </div>
                                <div>Cantidad: {item.quantity}</div>
                              </div>
                            </div>
                            <button
                              onClick={() => removeCardFromTrade(item.card_id)}
                              className="p-2 hover:bg-red-500/20 rounded transition-colors self-start"
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Available Cards to Add */}
                  <button
                    onClick={() => setSelectedCardTab("offered")}
                    className={`w-full mb-2 py-2 rounded-lg font-bold transition-colors ${
                      selectedCardTab === "offered"
                        ? "bg-vcf-orange text-white"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    + Agregar carta
                  </button>

                  {selectedCardTab === "offered" && (
                    <div className="border-2 border-vcf-orange/30 rounded-lg p-4 max-h-72 overflow-y-auto">
                      {loadingCards ? (
                        <div className="text-center text-muted-foreground">
                          Cargando cartas...
                        </div>
                      ) : userCards.filter((c) => (c.quantity ?? 0) > 0).length === 0 ? (
                        <div className="text-center text-muted-foreground">
                          No tienes cartas disponibles
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {userCards
                            .filter((c) => (c.quantity ?? 0) > 0)
                            .map((card) => (
                              <div
                                key={card.id}
                                className="flex items-center justify-between p-2 bg-card rounded border border-border hover:border-vcf-orange transition-colors"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="w-12 h-16 rounded bg-white/80 border border-border overflow-hidden flex-shrink-0 shadow-sm">
                                    {card.image_url ? (
                                      <img
                                        src={card.image_url}
                                        alt={card.name}
                                        className="w-full h-full object-contain"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground px-1 text-center">
                                        Sin imagen
                                      </div>
                                    )}
                                  </div>

                                  <div className="min-w-0">
                                    <div className="font-bold text-sm text-foreground truncate">
                                      {card.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground space-y-0.5">
                                      <div>
                                        Categoría: {card.categories?.name || "Sin categoría"}
                                      </div>
                                      <div>
                                        Tipo: {card.type || "N/A"} · Temporada: {card.season ?? "N/A"}
                                      </div>
                                      <div>Tienes: {card.quantity}</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    min="1"
                                    max={card.quantity ?? 1}
                                    defaultValue="1"
                                    id={`qty-offered-${card.id}`}
                                    className="w-12 px-2 py-1 border border-border rounded text-center bg-muted text-foreground"
                                  />
                                  <button
                                    onClick={() => {
                                      const qty = parseInt(
                                        (document.getElementById(`qty-offered-${card.id}`) as HTMLInputElement)
                                          ?.value || "1"
                                      );
                                      addCardToTrade(card.id, qty);
                                    }}
                                    className="p-1 bg-vcf-orange text-white rounded hover:bg-[#a86d12] transition-colors"
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Wanted Cards */}
                <div>
                  <h3 className="font-bold mb-4 text-foreground text-lg">
                    CARTAS QUE{" "}
                    <span className="text-vcf-orange">SOLICITAS</span>
                    <span className="text-red-500 ml-2">*</span>
                  </h3>

                  {/* Selected Wanted Cards */}
                  <div className="mb-4 space-y-2">
                    {wantedCards.length === 0 ? (
                      <div className="text-sm text-muted-foreground italic p-3 bg-muted rounded">
                        Selecciona cartas que solicitas
                      </div>
                    ) : (
                      wantedCards.map((item) => {
                        const card = receiverCards.find((c) => c.id === item.card_id);
                        return (
                          <div
                            key={item.card_id}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg border-l-4 border-vcf-orange"
                          >
                            <div>
                              <div className="font-bold text-foreground">
                                {card?.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Cantidad: {item.quantity}
                              </div>
                            </div>
                            <button
                              onClick={() => removeCardFromTrade(item.card_id)}
                              className="p-2 hover:bg-red-500/20 rounded transition-colors"
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Available Cards to Add */}
                  <button
                    onClick={() => setSelectedCardTab("wanted")}
                    className={`w-full mb-2 py-2 rounded-lg font-bold transition-colors ${
                      selectedCardTab === "wanted"
                        ? "bg-vcf-orange text-white"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    + Agregar carta
                  </button>

                  {selectedCardTab === "wanted" && (
                    <div className="border-2 border-vcf-orange/30 rounded-lg p-4 max-h-72 overflow-y-auto">
                      {loadingReceiverCards ? (
                        <div className="text-center text-muted-foreground">
                          Cargando cartas del usuario...
                        </div>
                      ) : !selectedFriend ? (
                        <div className="text-center text-muted-foreground">
                          Selecciona un amigo para ver sus cartas
                        </div>
                      ) : receiverCards.length === 0 ? (
                        <div className="text-center text-muted-foreground">
                          Este usuario no tiene cartas disponibles
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {receiverCards.map((card) => (
                            <div
                              key={card.id}
                              className="flex items-center justify-between p-2 bg-card rounded border border-border hover:border-vcf-orange transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-12 h-16 rounded bg-white/80 border border-border overflow-hidden flex-shrink-0 shadow-sm">
                                  {card.image_url ? (
                                    <img
                                      src={card.image_url}
                                      alt={card.name}
                                      className="w-full h-full object-contain"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground px-1 text-center">
                                      Sin imagen
                                    </div>
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <div className="font-bold text-sm text-foreground truncate">
                                    {card.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground space-y-0.5">
                                    <div>
                                      Categoría: {card.categories?.name || "Sin categoría"}
                                    </div>
                                    <div>
                                      Tipo: {card.type || "N/A"} · Temporada: {card.season ?? "N/A"}
                                    </div>
                                    <div>Cantidad disponible: {card.quantity}</div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="1"
                                  max={card.quantity ?? 1}
                                  defaultValue="1"
                                  id={`qty-wanted-${card.id}`}
                                  className="w-12 px-2 py-1 border border-border rounded text-center bg-muted text-foreground"
                                />
                                <button
                                  onClick={() => {
                                    const qty = parseInt(
                                      (document.getElementById(`qty-wanted-${card.id}`) as HTMLInputElement)
                                        ?.value || "1"
                                    );
                                    addCardToTrade(card.id, qty);
                                  }}
                                  className="p-1 bg-vcf-orange text-white rounded hover:bg-[#a86d12] transition-colors"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleProposeTrade}
                disabled={creatingTrade}
                className="w-full py-4 bg-vcf-orange text-white rounded-lg font-bold hover:bg-[#a86d12] transition-all disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
              >
                  <UsersRound size={20} />
                {creatingTrade ? "Proponiendo..." : "PROPONER INTERCAMBIO"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Marketplace */}
      {activeTab === "marketplace" && (
        <div>
          <h2 className="text-2xl font-black mb-6 text-foreground">
            MARKETPLACE DE <span className="text-vcf-orange">CARTAS</span>
          </h2>

          {marketplaceLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Cargando ofertas del marketplace...
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
              <p>No hay ofertas activas en el marketplace</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {listings.map((listing) => {
                const offeringItems = listing.trade_items?.filter((i) => i.side === "offering") || [];
                const wantedItems = listing.trade_items?.filter((i) => i.side === "wanted") || [];

                return (
                  <div
                    key={listing.id}
                    className="bg-card border-2 border-border rounded-lg p-6 shadow-md hover:border-vcf-orange transition-all"
                  >
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-black text-foreground">{listing.title}</h3>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-vcf-orange/20 text-vcf-orange">
                          {listing.type === "card_for_card"
                            ? "CARTAS POR CARTAS"
                            : listing.type === "card_for_points"
                            ? "CARTAS POR PUNTOS"
                            : "PUNTOS POR CARTAS"}
                        </span>
                      </div>
                      {/* description removed */}
                    </div>

                    {listing.creator_profile && (
                      <div className="mb-4 p-3 bg-muted rounded-lg flex items-center gap-3">
                        {listing.creator_profile.avatar_url && (
                          <img
                            src={listing.creator_profile.avatar_url}
                            alt={listing.creator_profile.full_name || "Usuario"}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <div className="text-sm">
                          <div className="font-bold text-foreground">
                            {listing.creator_profile.full_name || listing.creator_profile.email?.split("@")[0]}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Publicado: {new Date(listing.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {/* Offering */}
                      <div>
                        <h4 className="font-bold mb-2 text-sm text-muted-foreground">OFRECE:</h4>
                        <div className="space-y-2">
                          {offeringItems.map((item) => (
                            <div
                              key={item.id}
                              className="p-2 bg-muted rounded border border-border text-sm"
                            >
                              {item.card ? (
                                <div className="flex items-center gap-2">
                                  {item.card.image_url && (
                                    <img
                                      src={item.card.image_url}
                                      alt={item.card.name}
                                      className="w-6 h-8 object-contain"
                                    />
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <div className="font-bold text-foreground truncate text-xs">
                                      {item.card.name}
                                    </div>
                                    {item.quantity && item.quantity > 1 && (
                                      <div className="text-xs text-vcf-orange">x{item.quantity}</div>
                                    )}
                                  </div>
                                </div>
                              ) : item.points_amount ? (
                                <div className="font-bold text-vcf-orange">💰 {item.points_amount} puntos</div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Wanted */}
                      <div>
                        <h4 className="font-bold mb-2 text-sm text-muted-foreground">QUIERE:</h4>
                        <div className="space-y-2">
                          {wantedItems.map((item) => (
                            <div
                              key={item.id}
                              className="p-2 bg-black/10 rounded border border-border text-sm"
                            >
                              {item.card ? (
                                <div className="flex items-center gap-2">
                                  {item.card.image_url && (
                                    <img
                                      src={item.card.image_url}
                                      alt={item.card.name}
                                      className="w-6 h-8 object-contain"
                                    />
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <div className="font-bold text-foreground truncate text-xs">
                                      {item.card.name}
                                    </div>
                                    {item.quantity && item.quantity > 1 && (
                                      <div className="text-xs text-vcf-orange">x{item.quantity}</div>
                                    )}
                                  </div>
                                </div>
                              ) : item.points_amount ? (
                                <div className="font-bold text-vcf-orange">💰 {item.points_amount} puntos</div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {user?.id !== listing.creator_id && (
                      <button
                        onClick={async () => {
                          setAcceptingOffer(listing.id);
                          const success = await acceptOffer(listing.id);
                          setAcceptingOffer(null);
                          if (success) {
                            showFeedback(
                              "Oferta aceptada correctamente. Los items se añadirán a tu inventario.",
                              "success"
                            );
                          } else {
                            showFeedback(
                              "No se pudo aceptar la oferta. Verifica que tengas los items requeridos.",
                              "error"
                            );
                          }
                        }}
                        disabled={acceptingOffer === listing.id}
                        className="w-full py-2 bg-vcf-orange text-white rounded-lg font-bold hover:bg-[#a86d12] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Check size={16} />
                        {acceptingOffer === listing.id ? "Aceptando..." : "ACEPTAR OFERTA"}
                      </button>
                    )}
                    {user?.id === listing.creator_id && (
                      <div className="text-center py-2 text-sm text-muted-foreground italic">
                        Tu oferta
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* My Offers */}
      {activeTab === "my_offers" && (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-foreground">
              MIS <span className="text-vcf-orange">OFERTAS</span>
            </h2>
            <button
              onClick={() => {
                setActiveTab("my_offers");
                document.querySelector('[data-section="create-offer"]')?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="px-4 py-2 bg-vcf-orange text-white rounded-lg font-bold hover:bg-[#a86d12] transition-all flex items-center gap-2"
            >
              <Plus size={18} />
              CREAR OFERTA
            </button>
          </div>

          {/* Create Offer Form */}
          <div data-section="create-offer" className="bg-card border-2 border-vcf-orange rounded-lg p-8 shadow-lg mb-8">
            <h3 className="text-lg font-black mb-6 text-foreground">
              PUBLICAR NUEVA <span className="text-vcf-orange">OFERTA</span>
            </h3>

            <div className="space-y-6">
              {/* Offer Type */}
              <div>
                <label className="block font-bold mb-2 text-foreground">Tipo de Oferta</label>
                <select
                  value={marketplaceOfferType}
                  onChange={(e) =>
                    setMarketplaceOfferType(
                      e.target.value as "card_for_card" | "card_for_points" | "points_for_card"
                    )
                  }
                  className="w-full px-4 py-2 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none"
                >
                  <option value="card_for_card">Cartas por Cartas</option>
                  <option value="card_for_points">Cartas por Puntos</option>
                  <option value="points_for_card">Puntos por Cartas</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold mb-2 text-foreground">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  placeholder="Ej: Vendo Messi por 100 puntos"
                  className="w-full px-4 py-2 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none"
                />
              </div>

              {/* Description removed per request */}

              {/* Expiration */}
              <div>
                <label className="block font-bold mb-2 text-foreground">Expira en (opcional)</label>
                <input
                  type="datetime-local"
                  value={offerExpiresAt}
                  onChange={(e) => setOfferExpiresAt(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h4 className="font-black text-foreground text-lg">
                      {marketplaceOfferingUsesPoints ? (
                          <>
                            PUNTOS QUE <span className="text-vcf-orange">OFRECES</span>
                          </>
                        ) : (
                          <>
                            CARTAS QUE <span className="text-vcf-orange">OFRECES</span>
                          </>
                        )}
                      <span className="text-red-500 ml-2">*</span>
                    </h4>
                    {!marketplaceOfferingUsesPoints && (
                      <button
                        type="button"
                        onClick={() => setMarketplaceSelectedTab("offering")}
                        className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                          marketplaceSelectedTab === "offering"
                            ? "bg-vcf-orange text-white"
                            : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                      >
                        + Agregar carta
                      </button>
                    )}
                  </div>

                  {marketplaceOfferingUsesPoints ? (
                    <div className="bg-muted rounded-lg border border-border p-4 space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Este tipo de oferta se paga con puntos, así que aquí solo indicas el monto total.
                      </p>
                      <label className="block font-bold text-foreground">Puntos que ofreces <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        min="1"
                        value={marketplaceOfferingPoints ?? ""}
                        onChange={(e) =>
                          setMarketplaceOfferingPoints(
                            e.target.value ? Math.max(1, Number(e.target.value)) : null
                          )
                        }
                        placeholder="Ej: 100"
                        className="w-full px-4 py-2 border-2 border-border bg-card text-foreground rounded-lg focus:border-vcf-orange outline-none"
                      />
                    </div>
                  ) : (
                    <div className="mb-4 space-y-2">
                      {marketplaceOfferingCards.length === 0 ? (
                        <div className="text-sm text-muted-foreground italic p-3 bg-muted rounded-lg">
                          Selecciona las cartas que vas a ofrecer
                        </div>
                      ) : (
                        marketplaceOfferingCards.map((item) => {
                          const card = getMarketplaceCardById(item.card_id);
                          return (
                            <div
                              key={item.card_id}
                              className="flex items-center gap-3 p-3 bg-muted rounded-lg border-l-4 border-vcf-orange"
                            >
                              <div className="w-14 h-20 rounded bg-white/80 border border-border overflow-hidden flex-shrink-0 shadow-sm">
                                {card?.image_url ? (
                                  <img
                                    src={card.image_url}
                                    alt={card.name}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground px-1 text-center">
                                    Sin imagen
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-foreground truncate">{card?.name || "Carta"}</div>
                                <div className="text-xs text-muted-foreground space-y-0.5">
                                  <div>Tipo: {card?.type || "N/A"} · Temporada: {card?.season ?? "N/A"}</div>
                                  <div>Categoría: {card?.categories?.name || card?.rarity || "Sin categoría"}</div>
                                  <div>Cantidad: {item.quantity}</div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeMarketplaceSelection("offering", item.card_id)}
                                className="p-2 hover:bg-red-500/20 rounded transition-colors self-start"
                              >
                                <Trash2 size={16} className="text-red-500" />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {!marketplaceOfferingUsesPoints && marketplaceSelectedTab === "offering" && (
                    <div className="border-2 border-vcf-orange/30 rounded-lg p-4 max-h-80 overflow-y-auto">
                      {loadingCards || loadingMarketplaceCards ? (
                        <div className="text-center text-muted-foreground">Cargando cartas...</div>
                      ) : userCards.filter((card) => (card.quantity ?? 0) > 0).length === 0 ? (
                        <div className="text-center text-muted-foreground">No tienes cartas disponibles</div>
                      ) : (
                        <div className="space-y-2">
                          {userCards
                            .filter((card) => (card.quantity ?? 0) > 0)
                            .map((card) => (
                              <div
                                key={card.id}
                                className="flex items-center justify-between p-2 bg-card rounded border border-border hover:border-vcf-orange transition-colors"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="w-12 h-16 rounded bg-white/80 border border-border overflow-hidden flex-shrink-0 shadow-sm">
                                    {card.image_url ? (
                                      <img
                                        src={card.image_url}
                                        alt={card.name}
                                        className="w-full h-full object-contain"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground px-1 text-center">
                                        Sin imagen
                                      </div>
                                    )}
                                  </div>

                                  <div className="min-w-0">
                                    <div className="font-bold text-sm text-foreground truncate">{card.name}</div>
                                    <div className="text-xs text-muted-foreground space-y-0.5">
                                      <div>Tipo: {card.type || "N/A"} · Temporada: {card.season ?? "N/A"}</div>
                                      <div>Categoría: {card.categories?.name || card.rarity || "Sin categoría"}</div>
                                      <div>Tienes: {card.quantity}</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    min="1"
                                    max={card.quantity ?? 1}
                                    defaultValue="1"
                                    id={`marketplace-qty-offered-${card.id}`}
                                    className="w-12 px-2 py-1 border border-border rounded text-center bg-muted text-foreground"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const qty = parseInt(
                                        (document.getElementById(`marketplace-qty-offered-${card.id}`) as HTMLInputElement)
                                          ?.value || "1"
                                      );
                                      updateMarketplaceSelection("offering", card.id, qty);
                                    }}
                                    className="p-1 bg-vcf-orange text-white rounded hover:bg-[#a86d12] transition-colors"
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h4 className="font-black text-foreground text-lg">
                      {marketplaceWantedUsesPoints ? (
                          <>
                            PUNTOS QUE <span className="text-vcf-orange">BUSCAS</span>
                          </>
                        ) : (
                          <>
                            CARTAS QUE <span className="text-vcf-orange">BUSCAS</span>
                          </>
                        )}
                      <span className="text-red-500 ml-2">*</span>
                    </h4>
                    {!marketplaceWantedUsesPoints && (
                      <button
                        type="button"
                        onClick={() => setMarketplaceSelectedTab("wanted")}
                        className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                          marketplaceSelectedTab === "wanted"
                            ? "bg-vcf-orange text-white"
                            : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                      >
                        + Buscar carta
                      </button>
                    )}
                  </div>

                  {marketplaceWantedUsesPoints ? (
                    <div className="bg-muted rounded-lg border border-border p-4 space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Aquí solo indicas cuántos puntos quieres recibir.
                      </p>
                      <label className="block font-bold text-foreground">Puntos que buscas <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        min="1"
                        value={marketplaceWantedPoints ?? ""}
                        onChange={(e) =>
                          setMarketplaceWantedPoints(
                            e.target.value ? Math.max(1, Number(e.target.value)) : null
                          )
                        }
                        placeholder="Ej: 100"
                        className="w-full px-4 py-2 border-2 border-border bg-card text-foreground rounded-lg focus:border-vcf-orange outline-none"
                      />
                    </div>
                  ) : (
                    <div className="mb-4 space-y-2">
                      {marketplaceWantedCards.length === 0 ? (
                        <div className="text-sm text-muted-foreground italic p-3 bg-muted rounded-lg">
                          Selecciona las cartas que quieres recibir
                        </div>
                      ) : (
                        marketplaceWantedCards.map((item) => {
                          const card = getMarketplaceCardById(item.card_id);
                          return (
                            <div
                              key={item.card_id}
                              className="flex items-center gap-3 p-3 bg-muted rounded-lg border-l-4 border-vcf-orange"
                            >
                              <div className="w-14 h-20 rounded bg-white/80 border border-border overflow-hidden flex-shrink-0 shadow-sm">
                                {card?.image_url ? (
                                  <img
                                    src={card.image_url}
                                    alt={card.name}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground px-1 text-center">
                                    Sin imagen
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-foreground truncate">{card?.name || "Carta"}</div>
                                <div className="text-xs text-muted-foreground space-y-0.5">
                                  <div>Tipo: {card?.type || "N/A"} · Temporada: {card?.season ?? "N/A"}</div>
                                  <div>Categoría: {card?.categories?.name || card?.rarity || "Sin categoría"}</div>
                                  <div>Cantidad: {item.quantity}</div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeMarketplaceSelection("wanted", item.card_id)}
                                className="p-2 hover:bg-red-500/20 rounded transition-colors self-start"
                              >
                                <Trash2 size={16} className="text-red-500" />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {!marketplaceWantedUsesPoints && marketplaceSelectedTab === "wanted" && (
                    <div className="border-2 border-vcf-orange/30 rounded-lg p-4 max-h-80 overflow-y-auto">
                      {loadingMarketplaceCards ? (
                        <div className="text-center text-muted-foreground">Cargando catálogo de cartas...</div>
                      ) : marketplaceCards.length === 0 ? (
                        <div className="text-center text-muted-foreground">No hay cartas cargadas</div>
                      ) : (
                        <div className="space-y-2">
                          {marketplaceCards.map((card) => (
                            <div
                              key={card.id}
                              className="flex items-center justify-between p-2 bg-card rounded border border-border hover:border-vcf-orange transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-12 h-16 rounded bg-white/80 border border-border overflow-hidden flex-shrink-0 shadow-sm">
                                  {card.image_url ? (
                                    <img
                                      src={card.image_url}
                                      alt={card.name}
                                      className="w-full h-full object-contain"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground px-1 text-center">
                                      Sin imagen
                                    </div>
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <div className="font-bold text-sm text-foreground truncate">{card.name}</div>
                                  <div className="text-xs text-muted-foreground space-y-0.5">
                                    <div>Tipo: {card.type || "N/A"} · Temporada: {card.season ?? "N/A"}</div>
                                    <div>Categoría: {card.categories?.name || card.rarity || "Sin categoría"}</div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="1"
                                  defaultValue="1"
                                  id={`marketplace-qty-wanted-${card.id}`}
                                  className="w-12 px-2 py-1 border border-border rounded text-center bg-muted text-foreground"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const qty = parseInt(
                                      (document.getElementById(`marketplace-qty-wanted-${card.id}`) as HTMLInputElement)
                                        ?.value || "1"
                                    );
                                    updateMarketplaceSelection("wanted", card.id, qty);
                                  }}
                                  className="p-1 bg-vcf-orange text-white rounded hover:bg-[#a86d12] transition-colors"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={async () => {
                  if (!offerTitle.trim()) {
                    showFeedback("El título es obligatorio", "warning");
                    return;
                  }

                  if (!marketplaceOfferingUsesPoints && !marketplaceOfferingCards.length) {
                    showFeedback("Debes ofrecer al menos una carta", "warning");
                    return;
                  }

                  if (!marketplaceWantedUsesPoints && !marketplaceWantedCards.length) {
                    showFeedback("Debes solicitar al menos una carta", "warning");
                    return;
                  }

                  if (marketplaceOfferingUsesPoints && !marketplaceOfferingPoints) {
                    showFeedback("Debes indicar los puntos que ofreces", "warning");
                    return;
                  }

                  if (marketplaceWantedUsesPoints && !marketplaceWantedPoints) {
                    showFeedback("Debes indicar los puntos que buscas", "warning");
                    return;
                  }

                  const offeringItems = marketplaceOfferingUsesPoints
                    ? [{ points_amount: marketplaceOfferingPoints ?? undefined }]
                    : marketplaceOfferingCards;

                  const wantedItems = marketplaceWantedUsesPoints
                    ? [{ points_amount: marketplaceWantedPoints ?? undefined }]
                    : marketplaceWantedCards;

                  const pointsSide = marketplaceOfferType === "card_for_points"
                    ? wantedItems
                    : marketplaceOfferType === "points_for_card"
                      ? offeringItems
                      : [];

                  if (pointsSide.some((item) => !item.points_amount || item.points_amount < 1)) {
                    showFeedback("Indica el monto de puntos en la parte que se paga con puntos.", "warning");
                    return;
                  }

                  setCreatingMarketplaceOffer(true);
                  const success = await postOffer(
                    offerTitle,
                    marketplaceOfferType,
                    offeringItems,
                    wantedItems,
                    offerExpiresAt || undefined
                  );

                  if (success) {
                    showFeedback("Oferta publicada correctamente", "success");
                    setOfferTitle("");
                    setOfferExpiresAt("");
                    setMarketplaceOfferingCards([]);
                    setMarketplaceWantedCards([]);
                    setMarketplaceOfferingPoints(null);
                    setMarketplaceWantedPoints(null);
                    setMarketplaceSelectedTab("offering");
                  } else {
                    showFeedback("Error al publicar la oferta", "error");
                  }
                }}
                disabled={creatingMarketplaceOffer}
                className="w-full py-4 bg-vcf-orange text-white rounded-lg font-bold hover:bg-[#a86d12] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                {creatingMarketplaceOffer ? "Publicando..." : "PUBLICAR OFERTA"}
              </button>
            </div>
          </div>

          {/* User's Offers List */}
          <div>
            <h3 className="text-lg font-black mb-4 text-foreground">
              TUS OFERTAS <span className="text-vcf-orange">ACTIVAS</span>
            </h3>

            {marketplaceLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Cargando tus ofertas...
              </div>
            ) : userOffers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground bg-card border-2 border-border rounded-lg">
                No tienes ofertas activas
              </div>
            ) : (
              <div className="space-y-4">
                {userOffers
                  .filter((o) => o.status === "active")
                  .map((offer) => {
                    const offeringItems = offer.trade_items?.filter((i) => i.side === "offering") || [];
                    const wantedItems = offer.trade_items?.filter((i) => i.side === "wanted") || [];

                    return (
                      <div
                        key={offer.id}
                        className="bg-card border-2 border-border rounded-lg p-4 shadow-md"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-foreground">{offer.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {new Date(offer.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={async () => {
                              setOfferToCancel({ id: offer.id, title: offer.title });
                            }}
                            className="p-2 hover:bg-red-500/20 rounded transition-colors"
                          >
                            <Trash2 size={18} className="text-red-500" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <div className="font-bold mb-1 text-muted-foreground">OFRECES:</div>
                            {offeringItems.map((item) => (
                              <div key={item.id} className="text-foreground">
                                {item.card ? `${item.card.name}${item.quantity ? ` x${item.quantity}` : ""}` : `💰 ${item.points_amount} puntos`}
                              </div>
                            ))}
                          </div>
                          <div>
                            <div className="font-bold mb-1 text-muted-foreground">QUIERES:</div>
                            {wantedItems.map((item) => (
                              <div key={item.id} className="text-foreground">
                                {item.card ? `${item.card.name}${item.quantity ? ` x${item.quantity}` : ""}` : `💰 ${item.points_amount} puntos`}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {offerToCancel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-offer-title"
          aria-describedby="cancel-offer-description"
          onClick={() => setOfferToCancel(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border-2 border-vcf-orange bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 id="cancel-offer-title" className="text-2xl font-black text-foreground">
                  ¿Estás seguro?
                </h3>
                <p id="cancel-offer-description" className="mt-2 text-sm text-muted-foreground">
                  Vas a cancelar la oferta <span className="font-bold text-foreground">{offerToCancel.title}</span>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOfferToCancel(null)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={async () => {
                  const currentOffer = offerToCancel;
                  if (!currentOffer) return;

                  setOfferToCancel(null);
                  if (await cancelOffer(currentOffer.id)) {
                    showFeedback("Oferta cancelada", "warning");
                  } else {
                    showFeedback("Error al cancelar la oferta", "error");
                  }
                }}
                className="flex-1 rounded-lg bg-vcf-orange px-4 py-3 font-bold text-white transition-colors hover:bg-[#a86d12]"
              >
                CONTINUAR
              </button>
              <button
                type="button"
                onClick={() => setOfferToCancel(null)}
                className="flex-1 rounded-lg border-2 border-border bg-muted px-4 py-3 font-bold text-foreground transition-colors hover:bg-muted/70"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
