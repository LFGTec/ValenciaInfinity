import React, { useState } from "react";
import {
  BookOpen,
  Package,
  Star,
  Lock,
  TrendingUp,
  Award,
  Gift,
  ShoppingCart,
  Filter,
  Search,
} from "lucide-react";
import card1 from "../../assets/CartaAmarilla.png";
import card2 from "../../assets/CartaAzul.png";
import card3 from "../../assets/CartaVerde.png";
import card4 from "../../assets/CartaRoja.png";

interface Card {
  id: string;
  number: number;
  name: string;
  category:
    | "player"
    | "legend"
    | "stadium"
    | "history"
    | "special";
  rarity: "common" | "rare" | "epic" | "legendary";
  owned: boolean;
  duplicates?: number;
}

export function CardAlbum() {
  const [activeCategory, setActiveCategory] =
    useState<string>("all");
  const [showPackOpening, setShowPackOpening] = useState(false);
  const [openedCards, setOpenedCards] = useState<Card[]>([]);
  const [unopenedPacks, setUnopenedPacks] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");

  // Simulación de cartas
  const allCards: Card[] = Array.from(
    { length: 200 },
    (_, i) => ({
      id: `card-${i + 1}`,
      number: i + 1,
      name: `Jugador ${i + 1}`,
      category: [
        "player",
        "legend",
        "stadium",
        "history",
        "special",
      ][Math.floor(Math.random() * 5)] as any,
      rarity: ["common", "rare", "epic", "legendary"][
        Math.floor(Math.random() * 4)
      ] as any,
      owned: Math.random() > 0.3,
      duplicates:
        Math.random() > 0.7
          ? Math.floor(Math.random() * 3) + 1
          : 0,
    }),
  );

  const ownedCount = allCards.filter((c) => c.owned).length;
  const completionPercentage = Math.round(
    (ownedCount / allCards.length) * 100,
  );

  const categories = [
    { id: "all", label: "TODAS", count: allCards.length },
    {
      id: "player",
      label: "JUGADORES",
      count: allCards.filter((c) => c.category === "player")
        .length,
    },
    {
      id: "legend",
      label: "LEYENDAS",
      count: allCards.filter((c) => c.category === "legend")
        .length,
    },
    {
      id: "stadium",
      label: "ESTADIO",
      count: allCards.filter((c) => c.category === "stadium")
        .length,
    },
    {
      id: "history",
      label: "HISTORIA",
      count: allCards.filter((c) => c.category === "history")
        .length,
    },
    {
      id: "special",
      label: "ESPECIALES",
      count: allCards.filter((c) => c.category === "special")
        .length,
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

  const filteredCards = allCards
    .filter(
      (card) =>
        activeCategory === "all" ||
        card.category === activeCategory,
    )
    .filter((card) =>
      card.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );

  const handleOpenPack = () => {
    if (unopenedPacks > 0) {
      // Simular apertura de sobre con 5 cartas aleatorias
      const newCards = Array.from({ length: 5 }, () => {
        const randomIndex = Math.floor(
          Math.random() * allCards.length,
        );
        return allCards[randomIndex];
      });
      setOpenedCards(newCards);
      setShowPackOpening(true);
      setUnopenedPacks(unopenedPacks - 1);
    }
  };

  const handleBuyPack = () => {
    alert("Función de compra - Integrar con sistema de pagos");
    setUnopenedPacks(unopenedPacks + 1);
  };

  if (showPackOpening) {
    return (
      <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black text-white mb-4">
              ¡ABRIENDO{" "}
              <span className="text-vcf-orange">SOBRE</span>!
            </h2>
            <p className="text-xl text-vcf-yellow">
              Has conseguido 5 nuevas cartas
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {openedCards.map((card, i) => (
              <div
                key={i}
                className="transform hover:scale-110 transition-transform cursor-pointer"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className={`aspect-[2/3] rounded-lg border-4 ${card.owned ? "border-vcf-yellow" : "border-white"} bg-gradient-to-br from-vcf-orange to-black p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl`}
                >
                  {/* Rarity indicator */}
                  <div
                    className={`absolute top-2 right-2 w-3 h-3 rounded-full ${rarityColors[card.rarity]} shadow-lg`}
                  ></div>

                  <div className="text-center text-white">
                    <div className="text-xs mb-2 opacity-75">
                      #{card.number}
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-vcf-orange to-vcf-yellow rounded-full mx-auto mb-3"></div>
                    <div className="font-bold text-sm mb-1">
                      {card.name}
                    </div>
                    <div className="text-xs opacity-75">
                      {rarityLabels[card.rarity]}
                    </div>
                    {!card.owned && (
                      <div className="mt-2 bg-vcf-yellow text-black px-2 py-1 rounded text-xs font-bold shadow-md">
                        ¡NUEVA!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowPackOpening(false)}
              className="px-8 py-4 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-bold text-lg hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              CONTINUAR
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 bg-content">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-5xl font-black mb-2 text-foreground">
              ÁLBUM DE{" "}
              <span className="text-vcf-orange">CARTAS</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              {ownedCount} de {allCards.length} cartas
              coleccionadas ({completionPercentage}%)
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleOpenPack}
              disabled={unopenedPacks === 0}
              className="px-6 py-3 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-bold hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Package size={20} />
              ABRIR SOBRE ({unopenedPacks})
            </button>
            <button
              onClick={handleBuyPack}
              className="px-6 py-3 bg-white border-2 border-white text-vcf-orange rounded-lg font-bold hover:bg-gray-100 hover:border-gray-100 transition-all shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"
            >
              <ShoppingCart size={20} />
              COMPRAR SOBRES
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-card border-2 border-vcf-orange rounded-lg p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-foreground">
              Progreso del Álbum
            </span>
            <span className="font-bold text-xl text-vcf-orange">
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full h-6 bg-muted rounded-full overflow-hidden border-2 border-border">
            <div
              className="h-full bg-gradient-to-r from-vcf-orange to-vcf-yellow transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {[
              {
                label: "Total",
                value: ownedCount,
                color: "text-vcf-orange",
              },
              {
                label: "Faltantes",
                value: allCards.length - ownedCount,
                color: "text-black",
              },
              {
                label: "Duplicadas",
                value: allCards.filter(
                  (c) => c.duplicates && c.duplicates > 0,
                ).length,
                color: "text-vcf-orange",
              },
              {
                label: "Legendarias",
                value: allCards.filter(
                  (c) => c.owned && c.rarity === "legendary",
                ).length,
                color: "text-black",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center p-3 bg-muted rounded shadow-md"
              >
                <div
                  className={`text-2xl font-black mb-1 ${stat.color}`}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground font-bold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unopened Packs */}
      {unopenedPacks > 0 && (
        <div className="bg-gradient-to-r from-vcf-orange via-white to-vcf-orange text-black rounded-xl p-8 mb-8 shadow-2xl border-2 border-vcf-orange">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black mb-2">
                SOBRES{" "}
                <span className="text-vcf-orange">
                  SIN ABRIR
                </span>
              </h3>
              <p className="text-muted-foreground font-bold">
                Tienes {unopenedPacks} sobre
                {unopenedPacks !== 1 ? "s" : ""} esperando ser
                abierto{unopenedPacks !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex gap-4">
              {Array.from({
                length: Math.min(unopenedPacks, 3),
              }).map((_, i) => (
                <div
                  key={i}
                  className="w-24 h-32 bg-gradient-to-br from-vcf-orange to-white rounded-lg border-4 border-vcf-orange shadow-xl cursor-pointer transform hover:scale-110 transition-transform flex items-center justify-center"
                  onClick={handleOpenPack}
                >
                  <Package size={32} className="text-white" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar carta por nombre o número..."
            className="w-full pl-12 pr-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none"
          />
        </div>
        <button className="px-6 py-3 bg-card border-2 border-border rounded-lg hover:border-vcf-orange transition-colors flex items-center gap-2 text-foreground shadow-md">
          <Filter size={20} />
          <span className="font-bold">FILTROS</span>
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-6 py-3 rounded-lg font-bold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? "bg-vcf-orange text-white shadow-lg"
                : "bg-card border-2 border-border hover:border-vcf-orange text-foreground shadow-md"
            }`}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredCards.map((card, index) => {
          // Array de imágenes de cartas reales (para las primeras 4 cartas del grid)
          const cardImages = [card1, card2, card3, card4];
          // Mostrar imagen real en las primeras 4 cartas del grid
          const cardImage =
            index < 4 ? cardImages[index] : null;

          return (
            <div
              key={card.id}
              className="aspect-[2/3] rounded-lg border-2 transition-all cursor-pointer group shadow-md hover:shadow-xl border-gray-300 hover:border-vcf-orange bg-white"
            >
              <div className="relative h-full bg-white rounded-lg overflow-hidden">
                {/* Rarity border */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 z-10 ${card.owned ? rarityColors[card.rarity] : "bg-gray-300"}`}
                ></div>

                {/* Card content */}
                {cardImage ? (
                  // Mostrar imagen real de la carta
                  <div className="relative h-full bg-gradient-to-br from-orange-50 to-yellow-50 p-3 flex items-center justify-center">
                    <img
                      src={cardImage}
                      alt={card.name}
                      className="w-full h-full object-contain drop-shadow-xl"
                    />
                    {/* Overlay con información en hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center rounded-lg">
                      <div className="opacity-0 group-hover:opacity-100 transition-all text-center">
                        <div className="text-white font-bold mb-2">
                          #{card.number}
                        </div>
                        <div className="text-white text-xs mb-2">
                          {card.name}
                        </div>
                        <button className="px-4 py-2 bg-vcf-orange text-white rounded-lg font-bold text-xs shadow-lg">
                          VER DETALLES
                        </button>
                      </div>
                    </div>
                  </div>
                ) : card.owned ? (
                  // Mostrar carta generada con gradiente (cartas poseídas sin imagen)
                  <div className="p-3 h-full flex flex-col bg-white">
                    <div className="text-xs text-gray-500 mb-2">
                      #{card.number}
                    </div>
                    <div className="flex-1 bg-gradient-to-br from-vcf-orange to-vcf-yellow rounded mb-2"></div>
                    <div className="text-center">
                      <div className="font-bold text-sm mb-1 text-gray-900">
                        {card.name}
                      </div>
                      <div
                        className={`inline-block px-2 py-1 rounded text-xs font-bold text-white ${rarityColors[card.rarity]} shadow-md`}
                      >
                        {rarityLabels[card.rarity]}
                      </div>
                      {card.duplicates &&
                        card.duplicates > 0 && (
                          <div className="mt-2 text-xs font-bold text-vcf-orange">
                            x{card.duplicates + 1}
                          </div>
                        )}
                    </div>
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center rounded-lg">
                      <div className="opacity-0 group-hover:opacity-100 transition-all">
                        <button className="px-4 py-2 bg-vcf-orange text-white rounded-lg font-bold text-xs shadow-lg">
                          VER DETALLES
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Cartas bloqueadas
                  <div className="h-full flex flex-col items-center justify-center p-4 text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
                    <Lock
                      size={32}
                      className="mb-3 opacity-50 text-gray-400"
                    />
                    <div className="text-xs text-center">
                      <div className="font-bold mb-1 text-gray-600">
                        #{card.number}
                      </div>
                      <div className="text-gray-500">
                        Bloqueada
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Summary */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border-2 border-vcf-orange rounded-lg p-6 shadow-lg hover:border-vcf-orange transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-vcf-orange rounded-lg flex items-center justify-center shadow-md">
              <Star size={24} className="text-white" />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">
                {
                  allCards.filter(
                    (c) => c.owned && c.rarity === "legendary",
                  ).length
                }
              </div>
              <div className="text-sm text-muted-foreground font-bold">
                Cartas Legendarias
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Las cartas más raras y valiosas de la colección
          </p>
        </div>

        <div className="bg-card border-2 border-black rounded-lg p-6 shadow-lg hover:border-vcf-orange transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center shadow-md">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">
                {Math.max(0, allCards.length - ownedCount)}
              </div>
              <div className="text-sm text-muted-foreground font-bold">
                Cartas Faltantes
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Te quedan estas cartas para completar el álbum
          </p>
        </div>

        <div className="bg-card border-2 border-vcf-orange rounded-lg p-6 shadow-lg hover:border-vcf-orange transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-vcf-orange rounded-lg flex items-center justify-center shadow-md">
              <Award size={24} className="text-white" />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">
                {
                  allCards.filter(
                    (c) => c.duplicates && c.duplicates > 0,
                  ).length
                }
              </div>
              <div className="text-sm text-muted-foreground font-bold">
                Cartas Repetidas
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Disponibles para intercambio con otros fans
          </p>
        </div>
      </div>

      {/* Featured Cards */}
      <div className="mt-12">
        <h3 className="text-2xl font-black mb-6 text-foreground">
          CARTAS{" "}
          <span className="text-vcf-orange">DESTACADAS</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[card1, card2, card3, card4].map((cardImg, i) => (
            <div
              key={i}
              className="aspect-[2/3] rounded-lg shadow-lg transform hover:scale-105 transition-transform cursor-pointer overflow-hidden border-2 border-vcf-orange"
            >
              <img
                src={cardImg}
                alt={`Carta ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 bg-gradient-to-br from-vcf-orange via-white to-vcf-orange text-black rounded-xl p-8 text-center shadow-2xl border-2 border-vcf-orange">
        <h3 className="text-3xl font-black mb-4">
          ¿QUIERES MÁS{" "}
          <span className="text-vcf-orange">CARTAS</span>?
        </h3>
        <p className="text-lg mb-6 font-bold text-muted-foreground">
          Completa trivias, asiste a partidos y participa en
          eventos para ganar sobres gratis
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={handleBuyPack}
            className="px-8 py-4 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-bold hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            COMPRAR SOBRES
          </button>
          <button className="px-8 py-4 bg-white border-2 border-white text-vcf-orange rounded-lg font-bold hover:bg-gray-100 hover:border-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105">
            IR A INTERCAMBIO
          </button>
        </div>
      </div>
    </div>
  );
}