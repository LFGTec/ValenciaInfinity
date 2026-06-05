import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useSetAtom } from "jotai";
import { pageAtom } from "../UI";
import { Book } from "../Book";
import { useAuth } from "../../hooks/useAuth";
import {
  getFullAlbumCardsByUser,
  getUserPacks,
  openPack,
  createUserPack,
  type Card,
  type UserPack,
} from "../../services/cardsService";
import { PackOpenAnimation } from "./PackOpenAnimation";
import { useVisitingAlbum } from "@/hooks/useVisitingAlbum";
import { Star, Trophy } from "lucide-react";
import { VisitorAlbumHeader } from "../album/visitorAlbum";

type Props = {
  userId?: string;
};

export function CardAlbum({ userId }: Props) {
  // Authentication and user context
  const { user } = useAuth();

  const setPage = useSetAtom(pageAtom);

  const targetUserId = userId ?? user?.id;

  const isVisiting = !!userId && userId !== user?.id;

  const {
    profile: friend,
    sendFriendRequest,
    loadingVisiting,
  } = useVisitingAlbum(targetUserId);

  // Album cards state
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filtering state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");

  // Pack opening state
  const [packs, setPacks] = useState<UserPack[]>([]);
  const [packsLoading, setPacksLoading] = useState(false);
  const [openingPackId, setOpeningPackId] = useState<string | null>(null);
  const [revealedCards, setRevealedCards] = useState<Card[]>([]);
  const [showPackAnimation, setShowPackAnimation] = useState(false);
  const [buyingPacks, setBuyingPacks] = useState(false);
  const [packError, setPackError] = useState<string | null>(null);

  // Reset page on component mount
  useEffect(() => {
    setPage(0);
  }, [setPage]);

  // Load album cards for the target user
  useEffect(() => {
    if (!targetUserId) {
      setCards([]);
      setLoading(false);
      return;
    }

    const loadAlbum = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getFullAlbumCardsByUser(targetUserId);
        setCards(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "No se pudo cargar el album";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadAlbum();
  }, [targetUserId]);

  // Load user's unopened packs
  useEffect(() => {
    if (!user?.id) {
      setPacks([]);
      return;
    }

    const loadPacks = async () => {
      setPacksLoading(true);
      try {
        const userPacks = await getUserPacks(user.id);
        setPacks(userPacks);
      } catch (err) {
        console.error("Error loading packs:", err);
        setPacks([]);
      } finally {
        setPacksLoading(false);
      }
    };

    loadPacks();
  }, [user?.id]);

  // Calculate album progress metrics
  const totalCards = cards.length;
  const obtainedCards = useMemo(
    () => cards.filter((card) => card.obtained).length,
    [cards],
  );
  const missingCards = Math.max(totalCards - obtainedCards, 0);

  const progress =
    totalCards > 0 ? Math.round((obtainedCards / totalCards) * 100) : 0;

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      
      const matchesCategory =
        selectedCategory === "todas" ||
        (selectedCategory === "jugadores" && card.type === "jugador") ||
        (selectedCategory === "leyendas" && card.rarity === "Legendario") ||
        (selectedCategory === "Epica" && card.rarity === "Epica") ||
        (selectedCategory === "Comun" && card.rarity === "Comun") ||
        (selectedCategory === "Raro" && card.rarity === "Raro");

      return  matchesCategory;
    });
  }, [cards, searchQuery, selectedCategory]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(0);
  };
  // Handle pack opening and card reveal
  const handleOpenPack = async (packId: string) => {
    setOpeningPackId(packId);
    setPackError(null);
    try {
      const revealedCards = await openPack(packId);
      if (revealedCards) {
        // Remove the opened pack from local state
        setPacks((prev) => prev.filter((p) => p.id !== packId));

        // Refresh cards to display newly obtained ones
        if (user?.id) {
          const updatedCards = await getFullAlbumCardsByUser(user.id);
          setCards(updatedCards);
        }

        // Display pack opening animation
        setRevealedCards(revealedCards);
        setShowPackAnimation(true);
      } else {
        setPackError(
          "No se pudo guardar el sobre abierto en la base de datos. Intenta de nuevo.",
        );
      }
    } catch (err) {
      console.error("Error opening pack:", err);
      const message =
        err instanceof Error ? err.message : "No se pudo abrir el sobre.";
      setPackError(message);
    } finally {
      setOpeningPackId(null);
    }
  };

  // Handle buying new packs
  const handleBuyPacks = async () => {
    if (!user?.id) {
      console.error("User not authenticated");
      return;
    }

    setBuyingPacks(true);
    try {
      const newPack = await createUserPack(user.id);

      if (newPack) {
        // Reload packs list
        const updatedPacks = await getUserPacks(user.id);
        setPacks(updatedPacks);
      }
    } catch (err) {
      console.error("Error buying pack:", err);
    } finally {
      setBuyingPacks(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="team-album-loading">Cargando album de cartas...</div>
    );
  }

  // Show error state
  if (error) {
    return <div className="team-album-loading">{error}</div>;
  }

  return (
    <section className="team-album-container-new" aria-label="Álbum de cartas">
      {/* Top UI Controls */}
      <div className="album-ui-container px-4 pt-2 md:px-8 md:pt-3">
        <div className="max-w-5xl mx-auto">
          {/* Header with title and action buttons */}
          <div className="mb-6">
            <div className="mb-4">
              <h1 className="text-3xl md:text-4xl font-black mb-1">
                ÁLBUM DE <span className="text-vcf-orange">CARTAS</span>
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                {obtainedCards} de {totalCards} cartas coleccionadas ({progress}
                %)
              </p>
            </div>

            {packError && (
              <p className="mt-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {packError}
              </p>
            )}
          </div>
          {isVisiting && friend && (
            <VisitorAlbumHeader
              friend={friend}
              onSendFriendRequest={sendFriendRequest}
            />
          )}

          {/* Album progress section */}
          <div className="mb-4 bg-white border-2 border-vcf-orange backdrop-blur-sm rounded-lg px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-lg text-black">Progreso del Álbum</p>
              <p className="text-2xl font-black text-vcf-orange">{progress}%</p>
            </div>
            <div className="w-full h-8 bg-gray-300 rounded-full overflow-hidden mb-4 shadow-md border border-gray-400">
              <div
                className="h-full rounded-full bg-vcf-orange shadow-inner transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
                <p className="text-2xl md:text-3xl font-black text-vcf-orange">
                  {obtainedCards}
                </p>
                <p className="text-xs text-gray-600 font-medium">Obtenidas</p>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
                <p className="text-2xl md:text-3xl font-black text-black">
                  {missingCards}
                </p>
                <p className="text-xs text-gray-600 font-medium">Faltantes</p>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
                <p className="text-2xl md:text-3xl font-black text-vcf-orange">
                  0
                </p>
                <p className="text-xs text-gray-600 font-medium">Duplicadas</p>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
                <p className="text-2xl md:text-3xl font-black text-black">0</p>
                <p className="text-xs text-gray-600 font-medium">Legendarias</p>
              </div>
            </div>
          </div>

          {/* Unopened packs section */}
          <div className="bg-white border-2 border-vcf-orange backdrop-blur-sm rounded-lg px-6 py-4 mb-12">
            <div className="mb-4">
              <p className="text-xl font-black text-black">
                SOBRES <span className="text-vcf-orange">SIN ABRIR</span>
              </p>
              <p className="text-sm text-gray-600">
                {packsLoading
                  ? "Cargando..."
                  : `Tienes ${packs.length} ${packs.length === 1 ? "sobre" : "sobres"} esperando ser ${packs.length === 1 ? "abierto" : "abiertos"}`}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 px-6 py-4">
              {packs.length > 0 &&
                packs.map((pack) => (
                  <div
                    key={pack.id}
                    onClick={() => handleOpenPack(pack.id)}
                    className="border-2 border-vcf-orange rounded-lg aspect-square bg-gray-50 hover:bg-vcf-orange/10 transition-colors cursor-pointer flex items-center justify-center"
                  >
                    {openingPackId === pack.id ? (
                      <div className="text-center">
                        <div className="animate-spin mb-2">📦</div>
                        <p className="text-xs font-bold text-vcf-orange">
                          Abriendo...
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-4xl">📦</p>
                        <p className="text-xs font-bold text-gray-600 mt-2">
                          Sobre
                        </p>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Search and filter section */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                {/* Search input */}
            

                {/* Category filter tabs */}
                <div className="flex overflow-x-auto gap-3 pb-2">
                  {[
                    { id: "todas", label: "TODAS", count: cards.length },
                    {
                      id: "jugadores",
                      label: "JUGADORES",
                      count: cards.filter((c) => c.type === "jugador").length,
                    },
                    {
                      id: "leyendas",
                      label: "LEYENDAS",
                      count: cards.filter((c) => c.rarity === "Legendario")
                        .length,
                    },
                    {
                      id: "Epica",
                      label: "ÉPICA",
                      count: cards.filter((c) => c.rarity === "Epica").length,
                    },
                    {
                      id: "Comun",
                      label: "COMUN",
                      count: cards.filter((c) => c.rarity === "Comun").length,
                    },
                    {
                      id: "Raro",
                      label: "RARO",
                      count: cards.filter((c) => c.rarity === "Raro").length,
                    },
                  ].map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`px-6 py-3 rounded-lg font-bold whitespace-nowrap transition-all ${
                        selectedCategory === category.id
                          ? "bg-vcf-orange text-white shadow-lg"
                          : "bg-white border-2 border-gray-200 text-black hover:border-vcf-orange"
                      }`}
                    >
                      {category.label} ({category.count})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Book canvas container */}
      <div id="album-book" className="album-canvas-wrapper">
        <Canvas
          camera={{ fov: 35, position: [1.7, 0.15, 3.4] }}
          dpr={[1, 1.8]}
          shadows
        >
          <color attach="background" args={["#ffffff"]} />
          <ambientLight intensity={0.8} />
          <directionalLight
            position={[2, 3, 2]}
            intensity={1.3}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          <group position={[-0.1, -0.05, 0]}>
            <Book cards={filteredCards} />
          </group>
        </Canvas>
      </div>

      {/* Pack opening animation modal */}
      <PackOpenAnimation
        isOpen={showPackAnimation}
        cards={revealedCards}
        onClose={() => setShowPackAnimation(false)}
      />
    </section>
  );
}
