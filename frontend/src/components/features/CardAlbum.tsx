import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useAtom, useSetAtom } from "jotai";
import { easing } from "maath";
import { pageAtom, buildPages } from "../UI";
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
import { VisitorAlbumHeader } from "../album/visitorAlbum";
import { AlbumProgressBar } from "../AlbumProgress";

// Smoothly re-centers the book depending on open/closed state.
// Closed (cover or back-cover): single page → shift left by half a page width.
// Open: both pages symmetric around x=0 → no offset.
function BookWrapper({ cards }: { cards: Card[] }) {
  const [page] = useAtom(pageAtom);
  const groupRef = useRef<import("three").Group>(null);
  const pagesCount = useMemo(() => buildPages(cards).length, [cards]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Front cover: page extends right → shift left to center it
    // Back cover:  page extends left  → shift right to center it
    // Open:        both pages symmetric around x=0 → no offset
    const targetX = page === 0 ? -0.64 : page === pagesCount ? 0.64 : 0;
    easing.damp(groupRef.current.position, "x", targetX, 0.25, delta);
  });

  return (
    // Start already at the closed position (page=0 on mount)
    <group ref={groupRef} position={[-0.64, -0.05, 0]}>
      <Book cards={cards} />
    </group>
  );
}

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
          err instanceof Error ? err.message : "No se pudo cargar el álbum";
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
  const duplicatedCards = useMemo(
    () => cards.reduce((acc, c) => acc + Math.max((c.quantity ?? 1) - 1, 0), 0),
    [cards],
  );

  const progress =
    totalCards > 0 ? Math.round((obtainedCards / totalCards) * 100) : 0;

  const filteredCards = useMemo(() => {
    const seen = new Set<string>();
    return cards.filter((card) => {
      if (seen.has(card.id)) return false;
      seen.add(card.id);

      const matchesCategory =
        selectedCategory === "todas" ||
        (selectedCategory === "jugadores" && card.type === "jugador") ||
        (selectedCategory === "leyendas" && card.rarity === "Legendario") ||
        (selectedCategory === "Epica" && card.rarity === "Epica") ||
        (selectedCategory === "Comun" && card.rarity === "Comun") ||
        (selectedCategory === "Raro" && card.rarity === "Raro");

      return matchesCategory;
    });
  }, [cards, searchQuery, selectedCategory]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
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
      <div className="team-album-loading">Cargando álbum de cartas...</div>
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
              <p className="text-sm md:text-base text-muted-foreground">
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

          {/* Progress card */}
          <AlbumProgressBar
            obtained={obtainedCards}
            total={totalCards}
            missing={missingCards}
            progress={progress}
            duplicated={duplicatedCards}
          />

          {/* Packs — only shown on own album */}
          {!isVisiting && (
            <div className="bg-card border-2 border-vcf-orange dark:border-border backdrop-blur-sm rounded-lg px-6 py-4 mb-6 transition-colors">
              <div className="mb-4">
                <p className="text-xl font-black text-foreground">
                  SOBRES <span className="text-vcf-orange">SIN ABRIR</span>
                </p>

                <p className="text-sm text-muted-foreground">
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
                      className="border-2 border-vcf-orange dark:border-border rounded-lg aspect-square bg-gray-50 dark:bg-muted hover:bg-vcf-orange/10 dark:hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-center"
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
                          <p className="text-xs font-bold text-muted-foreground mt-2">
                            Sobre
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Category filter tabs — always visible */}
          <div className="mb-12">
            <div className="flex overflow-x-auto gap-3 py-2">
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
                  count: cards.filter((c) => c.rarity === "Legendario").length,
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
                  className={`px-6 py-3 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer hover:-translate-y-1 ${
                    selectedCategory === category.id
                      ? "bg-vcf-orange text-white shadow-lg"
                      : "bg-white dark:bg-card border-2 border-gray-200 dark:border-border text-foreground hover:border-vcf-orange"
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3D Book canvas container */}
      <div id="album-book" className="album-canvas-wrapper">
        <Canvas
          camera={{ fov: 45, position: [0, 0.1, 4.0] }}
          dpr={[1, 1.8]}
          shadows
        >
          <color attach="background" args={["#ffffff"]} />
          <ambientLight intensity={0.8} />
          <directionalLight
            position={[0, 3, 2]}
            intensity={1.3}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          <BookWrapper cards={filteredCards} />
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
