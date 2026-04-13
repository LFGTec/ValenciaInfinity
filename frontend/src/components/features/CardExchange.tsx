import React, { useState } from "react";
import {
  Share2,
  ShoppingCart,
  DollarSign,
  Filter,
  Search,
  TrendingUp,
  Users,
  Package,
  MessageSquare,
  Check,
  X,
  Plus,
  Eye,
} from "lucide-react";
import card1 from "../../assets/CartaAmarilla.png";
import card2 from "../../assets/CartaAzul.png";
import card3 from "../../assets/CartaRoja.png";
import card4 from "../../assets/CartaVerde.png";

interface Card {
  id: string;
  number: number;
  name: string;
  category: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  price?: number;
  seller?: string;
  quantity?: number;
  image?: string;
}

interface Listing {
  id: string;
  card: Card;
  price: number;
  type: "sale" | "trade";
  seller: string;
  posted: string;
}

interface TradeRequest {
  id: string;
  from: string;
  offeredCards: Card[];
  requestedCards: Card[];
  status: "pending" | "accepted" | "rejected";
  date: string;
}

export function CardExchange() {
  const [activeTab, setActiveTab] = useState<
    "marketplace" | "my-listings" | "trades" | "sell"
  >("marketplace");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCard, setSelectedCard] =
    useState<Listing | null>(null);
  const [priceFilter, setPriceFilter] = useState<
    "all" | "low" | "medium" | "high"
  >("all");

  // Helper function to get card image
  const getCardImage = (index: number) => {
    const images = [card1, card2, card3, card4];
    return images[index % images.length]; // Rotar cíclicamente las 4 imágenes
  };

  const marketplaceListings: Listing[] = Array.from(
    { length: 24 },
    (_, i) => ({
      id: `listing-${i + 1}`,
      card: {
        id: `card-${i + 1}`,
        number: i + 1,
        name: `Jugador ${i + 1}`,
        category: ["Jugador", "Leyenda", "Estadio"][
          Math.floor(Math.random() * 3)
        ],
        rarity: ["common", "rare", "epic", "legendary"][
          Math.floor(Math.random() * 4)
        ] as any,
        image: getCardImage(i),
      },
      price: Math.floor(Math.random() * 200) + 50,
      type: Math.random() > 0.3 ? "sale" : "trade",
      seller: `Usuario${Math.floor(Math.random() * 100)}`,
      posted: `Hace ${Math.floor(Math.random() * 24)} horas`,
    }),
  );

  const myListings: Listing[] = [
    {
      id: "my-1",
      card: {
        id: "c1",
        number: 15,
        name: "David Silva",
        category: "Leyenda",
        rarity: "legendary",
        image: card1,
      },
      price: 250,
      type: "sale",
      seller: "Tú",
      posted: "Hace 2 días",
    },
    {
      id: "my-2",
      card: {
        id: "c2",
        number: 42,
        name: "Hugo Guillamón",
        category: "Jugador",
        rarity: "rare",
        image: card2,
      },
      price: 75,
      type: "sale",
      seller: "Tú",
      posted: "Hace 5 días",
    },
  ];

  const tradeRequests: TradeRequest[] = [
    {
      id: "trade-1",
      from: "Usuario23",
      offeredCards: [
        {
          id: "c1",
          number: 10,
          name: "Carlos Soler",
          category: "Jugador",
          rarity: "epic",
          image: card3,
        },
        {
          id: "c2",
          number: 25,
          name: "José Gayà",
          category: "Jugador",
          rarity: "rare",
          image: card4,
        },
      ],
      requestedCards: [
        {
          id: "c3",
          number: 15,
          name: "David Silva",
          category: "Leyenda",
          rarity: "legendary",
          image: card1,
        },
      ],
      status: "pending",
      date: "Hace 1 hora",
    },
    {
      id: "trade-2",
      from: "Usuario45",
      offeredCards: [
        {
          id: "c4",
          number: 33,
          name: "Javi Guerra",
          category: "Jugador",
          rarity: "rare",
          image: card2,
        },
      ],
      requestedCards: [
        {
          id: "c5",
          number: 42,
          name: "Hugo Guillamón",
          category: "Jugador",
          rarity: "rare",
          image: card3,
        },
      ],
      status: "pending",
      date: "Hace 3 horas",
    },
  ];

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

  const handleBuy = (listing: Listing) => {
    alert(
      `Comprando ${listing.card.name} por $${listing.price}`,
    );
  };

  const handleRemoveListing = (listingId: string) => {
    alert("Publicación eliminada");
  };

  const handleAcceptTrade = (tradeId: string) => {
    alert("Intercambio aceptado");
  };

  const handleRejectTrade = (tradeId: string) => {
    alert("Intercambio rechazado");
  };

  if (selectedCard) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-card border-2 border-vcf-orange rounded-xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b-2 border-border flex items-center justify-between bg-vcf-orange/10">
            <h3 className="text-2xl font-black text-foreground">
              DETALLES DE LA{" "}
              <span className="text-vcf-orange">CARTA</span>
            </h3>
            <button
              onClick={() => setSelectedCard(null)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X size={24} className="text-foreground" />
            </button>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card Preview */}
              <div>
                <div className="aspect-[2/3] bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg mb-4 shadow-lg relative flex items-center justify-center p-4">
                  <div
                    className={`absolute top-0 left-0 right-0 h-2 ${rarityColors[selectedCard.card.rarity]}`}
                  ></div>
                  {selectedCard.card.image && (
                    <img
                      src={selectedCard.card.image}
                      alt={selectedCard.card.name}
                      className="w-full h-full object-contain drop-shadow-2xl"
                    />
                  )}
                </div>
                <div className="text-center">
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-white text-sm font-bold ${rarityColors[selectedCard.card.rarity]} shadow-md`}
                  >
                    {rarityLabels[selectedCard.card.rarity]}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div>
                <div className="mb-6">
                  <div className="text-sm text-muted-foreground mb-1">
                    #{selectedCard.card.number}
                  </div>
                  <h4 className="text-3xl font-black mb-2 text-foreground">
                    {selectedCard.card.name}
                  </h4>
                  <span className="inline-block bg-black/10 text-black px-3 py-1 rounded text-sm font-bold">
                    {selectedCard.card.category}
                  </span>
                </div>

                <div className="bg-muted rounded-lg p-6 mb-6 shadow-md">
                  <div className="text-sm text-muted-foreground mb-2 font-bold">
                    Precio
                  </div>
                  <div className="text-4xl font-black mb-4 text-vcf-orange">
                    ${selectedCard.price}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Vendedor:
                      </span>
                      <span className="font-bold text-foreground">
                        {selectedCard.seller}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Publicado:
                      </span>
                      <span className="font-bold text-foreground">
                        {selectedCard.posted}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Tipo:
                      </span>
                      <span className="font-bold text-foreground">
                        {selectedCard.type === "sale"
                          ? "Venta"
                          : "Intercambio"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleBuy(selectedCard)}
                    className="w-full py-4 bg-vcf-orange text-white rounded-lg font-bold hover:bg-[#a86d12] transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    <ShoppingCart size={20} />
                    COMPRAR AHORA
                  </button>
                  <button className="w-full py-4 bg-card border-2 border-vcf-orange text-vcf-orange rounded-lg font-bold hover:bg-vcf-orange hover:text-white transition-colors flex items-center justify-center gap-2 shadow-md">
                    <MessageSquare size={20} />
                    HACER OFERTA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Cartas en Venta",
            value: marketplaceListings.length,
            icon: ShoppingCart,
            color: "bg-vcf-orange",
          },
          {
            label: "Tus Publicaciones",
            value: myListings.length,
            icon: Package,
            color: "bg-black",
          },
          {
            label: "Intercambios Activos",
            value: tradeRequests.length,
            icon: Share2,
            color: "bg-vcf-orange",
          },
          {
            label: "Ventas Totales",
            value: "12",
            icon: TrendingUp,
            color: "bg-black",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-card border-2 border-border rounded-lg p-4 shadow-md hover:border-vcf-orange transition-all"
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
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b-2 border-border">
        {[
          { id: "marketplace", label: "MERCADO" },
          { id: "my-listings", label: "MIS PUBLICACIONES" },
          { id: "trades", label: "INTERCAMBIOS" },
          { id: "sell", label: "VENDER CARTA" },
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

      {/* Marketplace */}
      {activeTab === "marketplace" && (
        <div>
          {/* Filters */}
          <div className="bg-card border-2 border-border rounded-lg p-4 mb-6 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder="Buscar carta..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none"
                />
              </div>

              <select
                value={priceFilter}
                onChange={(e) =>
                  setPriceFilter(e.target.value as any)
                }
                className="px-4 py-2 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none"
              >
                <option value="all">Todos los precios</option>
                <option value="low">$0 - $100</option>
                <option value="medium">$100 - $200</option>
                <option value="high">$200+</option>
              </select>

              <select className="px-4 py-2 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none">
                <option>Todas las raridades</option>
                <option>Común</option>
                <option>Rara</option>
                <option>Épica</option>
                <option>Legendaria</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {marketplaceListings.map((listing) => (
              <div
                key={listing.id}
                onClick={() => setSelectedCard(listing)}
                className="bg-card border-2 border-border rounded-lg overflow-hidden hover:border-vcf-orange transition-all cursor-pointer group shadow-md hover:shadow-lg"
              >
                <div className="aspect-[2/3] bg-gradient-to-br from-orange-50 to-yellow-50 relative flex items-center justify-center p-2">
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 ${rarityColors[listing.card.rarity]}`}
                  ></div>
                  {listing.card.image ? (
                    <img
                      src={listing.card.image}
                      alt={listing.card.name}
                      className="w-full h-full object-contain drop-shadow-xl"
                    />
                  ) : null}
                  {listing.type === "trade" && (
                    <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded text-xs font-bold shadow-md z-10">
                      INTERCAMBIO
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="text-xs text-muted-foreground mb-1">
                    #{listing.card.number}
                  </div>
                  <div className="font-bold text-sm mb-2 text-foreground">
                    {listing.card.name}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-lg font-black text-vcf-orange">
                      ${listing.price}
                    </div>
                    <Eye
                      size={14}
                      className="text-vcf-orange opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {listing.seller}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Listings */}
      {activeTab === "my-listings" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-foreground">
              TUS PUBLICACIONES{" "}
              <span className="text-vcf-orange">ACTIVAS</span>
            </h2>
            <button
              onClick={() => setActiveTab("sell")}
              className="px-6 py-3 bg-vcf-orange text-white rounded-lg font-bold hover:bg-[#a86d12] transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
            >
              <Plus size={20} />
              NUEVA PUBLICACIÓN
            </button>
          </div>

          <div className="space-y-4">
            {myListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-card border-2 border-border rounded-lg p-6 flex items-center justify-between shadow-md hover:border-vcf-orange transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="w-24 h-32 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg shadow-lg relative flex items-center justify-center p-2">
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 ${rarityColors[listing.card.rarity]}`}
                    ></div>
                    {listing.card.image && (
                      <img
                        src={listing.card.image}
                        alt={listing.card.name}
                        className="w-full h-full object-contain drop-shadow-xl"
                      />
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      #{listing.card.number}
                    </div>
                    <h3 className="text-2xl font-black mb-2 text-foreground">
                      {listing.card.name}
                    </h3>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="bg-black/10 text-black px-3 py-1 rounded text-sm font-bold">
                        {listing.card.category}
                      </span>
                      <span
                        className={`${rarityColors[listing.card.rarity]} text-white px-3 py-1 rounded text-sm font-bold shadow-md`}
                      >
                        {rarityLabels[listing.card.rarity]}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Publicado {listing.posted}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black mb-3 text-vcf-orange">
                    ${listing.price}
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-card text-foreground rounded-lg font-bold hover:bg-muted transition-all shadow-lg hover:shadow-xl hover:scale-105">
                      EDITAR
                    </button>

                    <button
                      onClick={() =>
                        handleRemoveListing(listing.id)
                      }
                      className="px-4 py-2 bg-black text-white rounded-lg font-bold hover:bg-black/80 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      ELIMINAR
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trade Requests */}
      {activeTab === "trades" && (
        <div>
          <h2 className="text-2xl font-black mb-6 text-foreground">
            SOLICITUDES DE{" "}
            <span className="text-vcf-orange">INTERCAMBIO</span>
          </h2>

          <div className="space-y-6">
            {tradeRequests.map((trade) => (
              <div
                key={trade.id}
                className="bg-card border-2 border-border rounded-lg p-6 shadow-md hover:border-vcf-orange transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-black mb-1 text-foreground">
                      Intercambio con{" "}
                      <span className="text-vcf-orange">
                        {trade.from}
                      </span>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {trade.date}
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
                      TE OFRECE:
                    </h4>
                    <div className="space-y-2">
                      {trade.offeredCards.map((card, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 bg-muted rounded-lg shadow-sm"
                        >
                          <div className="w-12 h-16 bg-gradient-to-br from-orange-50 to-yellow-50 rounded flex-shrink-0 shadow-md relative flex items-center justify-center p-1">
                            {card.image && (
                              <img
                                src={card.image}
                                alt={card.name}
                                className="w-full h-full object-contain"
                              />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-foreground">
                              {card.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              #{card.number}
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
                      SOLICITA:
                    </h4>
                    <div className="space-y-2">
                      {trade.requestedCards.map((card, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 bg-black/10 rounded-lg shadow-sm"
                        >
                          <div className="w-12 h-16 bg-gradient-to-br from-orange-50 to-yellow-50 rounded flex-shrink-0 shadow-md relative flex items-center justify-center p-1">
                            {card.image && (
                              <img
                                src={card.image}
                                alt={card.name}
                                className="w-full h-full object-contain"
                              />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-foreground">
                              {card.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              #{card.number}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {trade.status === "pending" && (
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
            ))}
          </div>
        </div>
      )}

      {/* Sell Card */}
      {activeTab === "sell" && (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black mb-6 text-foreground">
            PUBLICAR CARTA PARA{" "}
            <span className="text-vcf-orange">
              VENTA O INTERCAMBIO
            </span>
          </h2>

          <div className="bg-card border-2 border-vcf-orange rounded-lg p-8 shadow-lg">
            <div className="space-y-6">
              <div>
                <label className="block font-bold mb-2 text-foreground">
                  Selecciona la carta
                </label>
                <select className="w-full px-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none">
                  <option>
                    Selecciona una carta de tu colección...
                  </option>
                  <option>
                    #15 - David Silva (Legendaria)
                  </option>
                  <option>#42 - Hugo Guillamón (Rara)</option>
                  <option>#8 - Fran Pérez (Común)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-2 text-foreground">
                  Tipo de publicación
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 bg-vcf-orange text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105">
                    VENTA
                  </button>

                  <button className="p-4 bg-card text-foreground rounded-lg font-bold hover:bg-vcf-orange hover:text-white transition-all shadow-lg hover:shadow-xl hover:scale-105">
                    INTERCAMBIO
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-2 text-foreground">
                  Precio (solo para venta)
                </label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    size={20}
                  />
                  <input
                    type="number"
                    placeholder="150"
                    className="w-full pl-10 pr-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-2 text-foreground">
                  Descripción (opcional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Agrega detalles sobre la carta..."
                  className="w-full px-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none"
                ></textarea>
              </div>

              <button className="w-full py-4 bg-vcf-orange text-white rounded-lg font-bold hover:bg-[#a86d12] transition-all shadow-lg hover:shadow-xl hover:scale-105">
                PUBLICAR CARTA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}