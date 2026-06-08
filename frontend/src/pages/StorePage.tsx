import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../services/supabaseClient";
import {
  ShoppingBag,
  Package,
  Layers,
  CheckCircle,
  XCircle,
  Loader2,
  Lock,
  ChevronDown,
  Search,
  X
} from "lucide-react";
import valenciaPointsIcon from "../assets/ValenciaPoints.png";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import {
  getFullAlbumCardsByUser,
  buySpecificCard,
  type Card,
} from "../services/cardsService";

// ─── Productos ────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: "sobre",
    name: "Sobre de Cartas",
    description:
      "Contiene 5 cartas aleatorias del equipo. ¡Puede incluir cartas raras y legendarias!",
    price: 500,
    icon: Package,
    badge: "MÁS POPULAR",
    badgeColor: "bg-vcf-orange",
    gradient: "from-orange-500/10 to-yellow-500/5",
    border: "border-vcf-orange/40",
    glow: "shadow-orange-500/10",
  },
  {
    id: "carta",
    name: "Carta Individual",
    description:
      "Elige una carta específica del catálogo. Garantiza el jugador que quieres.",
    price: 200,
    icon: Layers,
    badge: "GARANTIZADO",
    badgeColor: "bg-blue-500",
    gradient: "from-blue-500/10 to-cyan-500/5",
    border: "border-blue-500/40",
    glow: "shadow-blue-500/10",
  },
];

// ─── Toast interno ─────────────────────────────────────────────────────────────
type ToastType = "success" | "error";
type Toast = { type: ToastType; message: string } | null;

// ─── Component ────────────────────────────────────────────────────────────────
export function StorePage() {
  const { user, isAuthenticated, updatePoints } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  const currentPoints = user?.puntos ?? 0;

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };
  const [showCardPicker, setShowCardPicker] = useState(false);
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [cardSearch, setCardSearch] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("todas");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [buyingCard, setBuyingCard] = useState(false);

  useEffect(() => {
    if (!showCardPicker || !user?.id) return;
    const load = async () => {
      setCardsLoading(true);
      try {
        const data = await getFullAlbumCardsByUser(user.id);
        setAllCards(data);
      } finally {
        setCardsLoading(false);
      }
    };
    load();
  }, [showCardPicker, user?.id]);

  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      if (card.rarity === "Legendario") return false;
      const matchesSearch =
        cardSearch.trim() === "" ||
        card.name.toLowerCase().includes(cardSearch.toLowerCase());
      const matchesRarity =
        selectedRarity === "todas" || card.rarity === selectedRarity;
      return matchesSearch && matchesRarity;
    });
  }, [allCards, cardSearch, selectedRarity]);

  const rarities = useMemo(() => {
    const set = new Set(
      allCards
        .map((c) => c.rarity)
        .filter((r): r is string => Boolean(r) && r !== "Legendario")
    );
    return ["todas", ...Array.from(set)] as string[];
  }, [allCards]);

  const handleBuyCard = async () => {
    if (!user?.id || !selectedCard) return;
    setBuyingCard(true);
    try {
      updatePoints(-PRODUCTS[1].price);
      await buySpecificCard(user.id, selectedCard.id);
      showToast("success", `¡${selectedCard.name} añadida a tu álbum!`);
      setShowCardPicker(false);
      setSelectedCard(null);
      setCardSearch("");
      setSelectedRarity("todas");
    } catch {
      showToast("error", "Error al comprar la carta. Inténtalo de nuevo.");
    } finally {
      setBuyingCard(false);
    }
  };

  const handleBuy = async (product: (typeof PRODUCTS)[0]) => {
    if (!isAuthenticated || !user) {
      showToast("error", "Debes iniciar sesión para comprar.");
      return;
    }
    if (currentPoints < product.price) {
      showToast("error", "No tienes suficientes puntos.");
      return;
    }

    setLoading(product.id);

    try {
      // 1. Descontar puntos (actualiza atom + Supabase, refleja en navbar)
      updatePoints(-product.price);

      // 2. Si es un sobre → insertar fila en user_packs (opened_at null = pendiente de abrir)
      if (product.id === "sobre") {
        const { error } = await supabase
          .from("user_packs")
          .insert({ user_id: user.id });

        if (error) throw error;
      }

      showToast("success", `¡${product.name} comprado con éxito!`);
    } catch {
      showToast("error", "Error al procesar la compra. Inténtalo de nuevo.");
    }

    setLoading(null);
  };

  return (
    <div className="min-h-screen bg-content">
      {/* ── Hero ── */}
      <section className="relative bg-card border-b border-border overflow-hidden py-16 px-4">
        {/* fondo decorativo — sutil para respetar ambos modos */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-vcf-orange rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-yellow-500 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-vcf-orange/10 border border-vcf-orange/30 rounded-full px-4 py-1.5 mb-4">
            <ShoppingBag size={14} className="text-vcf-orange" />
            <span className="text-vcf-orange text-xs font-bold uppercase tracking-widest">
              Tienda Oficial
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-3 text-foreground">
            Canjea tus <span className="text-vcf-orange">Puntos</span>
          </h1>
          <p className="text-sm max-w-md mx-auto text-muted-foreground">
            Usa los puntos que ganas con tu actividad en la plataforma para
            conseguir sobres y cartas exclusivas.
          </p>

          {/* Saldo actual */}
          {isAuthenticated && (
            <div className="mt-6 inline-flex items-center gap-2 bg-vcf-orange/10 border border-vcf-orange/30 rounded-xl px-5 py-3">
              <img src={valenciaPointsIcon} alt="" className="w-5 h-5" />
              <span className="text-vcf-orange font-black text-xl tabular-nums">
                {currentPoints.toLocaleString("es-ES")}
              </span>
              <span className="text-muted-foreground text-sm font-bold uppercase">
                pts disponibles
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ── Productos ── */}
      <section className="max-w-4xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRODUCTS.map((product) => {
            const Icon = product.icon;
            const canAfford = isAuthenticated && currentPoints >= product.price;
            const isBuying = loading === product.id;

            return (
              <div
                key={product.id}
                className={`
                  relative rounded-2xl border bg-card bg-gradient-to-br ${product.gradient} ${product.border}
                  p-6 flex flex-col gap-4 shadow-xl ${product.glow}
                  transition-transform duration-200 hover:-translate-y-1
                `}
              >
                {/* Badge */}
                <span
                  className={`absolute top-4 right-4 ${product.badgeColor} text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full`}
                >
                  {product.badge}
                </span>

                {/* Icono */}
                <div className="w-14 h-14 rounded-xl bg-background border border-border flex items-center justify-center">
                  <Icon size={28} className="text-foreground" />
                </div>

                {/* Info */}
                <div>
                  <h2 className="text-xl font-black uppercase text-foreground">
                    {product.name}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Precio */}
                <div className="flex items-center gap-2 mt-auto">
                  <img src={valenciaPointsIcon} alt="" className="w-5 h-5" />
                  <span className="text-foreground font-black text-2xl tabular-nums">
                    {product.price.toLocaleString("es-ES")}
                  </span>
                  <span className="text-muted-foreground text-sm font-bold uppercase">
                    pts
                  </span>
                </div>

                {/* Botón */}
                {!isAuthenticated ? (
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-background border border-border text-muted-foreground font-bold text-sm cursor-not-allowed"
                  >
                    <Lock size={14} /> Inicia sesión para comprar
                  </button>
                ) : (
                  <button
                    onClick={() => product.id === "carta" ? setShowCardPicker(true) : handleBuy(product)}

                    disabled={isBuying || !canAfford}
                    className={`
                      w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm uppercase tracking-wide transition-all
                      ${
                        canAfford
                          ? "bg-vcf-orange hover:bg-orange-400 text-white shadow-lg shadow-vcf-orange/30 active:scale-95"
                          : "bg-background border border-border text-muted-foreground cursor-not-allowed"
                      }
                    `}
                  >
                    {isBuying ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />{" "}
                        Comprando...
                      </>
                    ) : canAfford ? (
                      <>
                        <ShoppingBag size={16} /> Comprar ahora
                      </>
                    ) : (
                      <>
                        <Lock size={14} /> Puntos insuficientes
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <Link
          to="/album"
          className="
    mt-10 block rounded-xl border
    bg-muted/50 p-4
    transition-colors hover:bg-muted
  "
        >
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />

            <div>
              <p className="font-medium">
                Tus cartas ya fueron agregadas al álbum
              </p>

              <p className="text-sm text-muted-foreground">
                Los sobres permanecen cerrados. Haz clic aquí para abrirlos y
                ver tus nuevas cartas.
              </p>
            </div>
          </div>
        </Link>
      </section>

      {/* ── Toast ── */}
      {showCardPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="text-lg font-black uppercase text-foreground">
                  Elegir <span className="text-vcf-orange">Carta</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Selecciona la carta que quieres añadir a tu álbum
                </p>
              </div>
              <button
                onClick={() => { setShowCardPicker(false); setSelectedCard(null); }}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>

            {/* Filters */}
            <div className="px-6 py-3 border-b border-border flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar jugador..."
                  value={cardSearch}
                  onChange={(e) => setCardSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-vcf-orange"
                />
              </div>
              <div className="relative">
                <select
                  value={selectedRarity}
                  onChange={(e) => setSelectedRarity(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-sm bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:border-vcf-orange"
                >
                  {rarities.map((r) => (
                    <option key={r} value={r}>
                      {r === "todas" ? "Todas las rarezas" : r}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Card Grid */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cardsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 size={28} className="animate-spin text-vcf-orange" />
                </div>
              ) : filteredCards.length === 0 ? (
                <p className="text-center text-muted-foreground py-16 text-sm">
                  No se encontraron cartas
                </p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {filteredCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => setSelectedCard(card.id === selectedCard?.id ? null : card)}
                      className={`relative rounded-xl border-2 overflow-hidden transition-all aspect-[3/4] flex flex-col ${
                        selectedCard?.id === card.id
                          ? "border-vcf-orange shadow-lg shadow-vcf-orange/30 scale-105"
                          : "border-border hover:border-vcf-orange/50"
                      }`}
                    >
                      {card.image_url ? (
                        <img
                          src={card.image_url}
                          alt={card.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Layers size={24} className="text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-2">
                        <p className="text-white text-[10px] font-bold leading-tight line-clamp-2">
                          {card.name}
                        </p>
                        {card.rarity && (
                          <p className="text-vcf-orange text-[9px] font-bold uppercase mt-0.5">
                            {card.rarity}
                          </p>
                        )}
                      </div>
                      {card.obtained && (
                        <div className="absolute top-1.5 right-1.5 bg-green-500 rounded-full p-0.5">
                          <CheckCircle size={10} className="text-white" />
                        </div>
                      )}
                      {selectedCard?.id === card.id && (
                        <div className="absolute inset-0 bg-vcf-orange/20 flex items-center justify-center">
                          <CheckCircle size={28} className="text-vcf-orange drop-shadow" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                {selectedCard ? (
                  <span className="text-foreground font-bold">{selectedCard.name}</span>
                ) : (
                  "Ninguna carta seleccionada"
                )}
              </div>
              <button
                onClick={handleBuyCard}
                disabled={!selectedCard || buyingCard || currentPoints < PRODUCTS[1].price}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm uppercase transition-all ${
                  selectedCard && currentPoints >= PRODUCTS[1].price
                    ? "bg-vcf-orange hover:bg-orange-400 text-white shadow-lg shadow-vcf-orange/30 active:scale-95"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {buyingCard ? (
                  <><Loader2 size={15} className="animate-spin" /> Comprando...</>
                ) : (
                  <><ShoppingBag size={15} /> Comprar ({PRODUCTS[1].price.toLocaleString("es-ES")} pts)</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div
          className={`
            fixed bottom-6 left-1/2 -translate-x-1/2 z-50
            flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border
            text-sm font-bold transition-all
            ${
              toast.type === "success"
                ? "bg-green-900/90 border-green-500/40 text-green-300"
                : "bg-red-900/90 border-red-500/40 text-red-300"
            }
          `}
        >
          {toast.type === "success" ? (
            <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
          ) : (
            <XCircle size={18} className="text-red-400 flex-shrink-0" />
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}
