import { useEffect, useRef, useState } from "react";
import {
  Share2,
  MessageSquare,
  Check,
  X,
  Plus,
  Trash2,
  Search,
} from "lucide-react";
import { useTrades } from "../../hooks/useTrades";
import { useAuth } from "../../hooks/useAuth";
import { getAlbumCardsByUser, type Card } from "../../services/cardsService";
import { getFriendsByName, type FriendSuggestion } from "../../services/tradeService";

export function CardExchange() {
  const { user } = useAuth();
  const { trades, loading: tradesLoading, acceptTrade, rejectTrade, createTrade } = useTrades();
  const [activeTab, setActiveTab] = useState<
    "trades" | "propose"
  >("trades");
  const [tradeFilter, setTradeFilter] = useState<"all" | "pending" | "accepted">("all");

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

  // Load only current user cards when entering propose tab
  useEffect(() => {
    if (user?.id && activeTab === "propose") {
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

  const rarityColors = {
    common: "bg-muted",
    rare: "bg-vcf-orange",
    epic: "bg-black",
    legendary: "bg-vcf-orange",
  };

  const rarityLabels = {
    common: "Común",
    rare: "Rara",
    epic: "Épica",
    legendary: "Legendaria",
  };

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
          Intercambia cartas con otros fans
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            id: "pending",
            label: "Intercambios Activos",
            value: trades.filter((t) => t.status === "pending").length,
            icon: Share2,
            color: "bg-vcf-orange",
          },
          {
            id: "accepted",
            label: "Intercambios Aceptados",
            value: trades.filter((t) => t.status === "accepted").length,
            icon: Check,
            color: "bg-vcf-orange",
          },
          {
            id: "all",
            label: "Total de Intercambios",
            value: trades.length,
            icon: MessageSquare,
            color: "bg-black",
          },
        ].map((stat, i) => (
          <button
            key={i}
            onClick={() => setTradeFilter(stat.id as "all" | "pending" | "accepted")}
            className={`bg-card border-2 rounded-lg p-4 shadow-md transition-all text-left ${
              tradeFilter === stat.id
                ? "border-vcf-orange bg-vcf-orange/5"
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
      <div className="flex gap-2 mb-8 border-b-2 border-border">
        {[
          { id: "trades", label: "INTERCAMBIOS" },
          { id: "propose", label: "PROPONER INTERCAMBIO" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 font-bold transition-all ${
              activeTab === tab.id
                ? "border-b-4 border-vcf-orange text-vcf-orange"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
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
          ) : trades.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tienes solicitudes de intercambio
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
                const otherPartyName = otherPartyProfile?.full_name || otherPartyProfile?.email?.split("@")[0];
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
                            {otherPartyName || "Usuario"}
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
                              ? "bg-vcf-orange/20 text-vcf-orange"
                              : "bg-black/20 text-black"
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
                Selecciona un amigo para intercambiar
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
                <Share2 size={20} />
                {creatingTrade ? "Proponiendo..." : "PROPONER INTERCAMBIO"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
