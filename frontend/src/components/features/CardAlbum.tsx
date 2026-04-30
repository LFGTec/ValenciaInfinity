
import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useSetAtom } from "jotai";
import { pageAtom } from "../UI";
import { Book } from "../Book";
import { useAuth } from "../../hooks/useAuth";
import { getAlbumCardsByUser, getUserPacks, openPack, type Card, type UserPack } from "../../services/cardsService";
import { PackOpenAnimation } from "./PackOpenAnimation";

type Props = {
  userId?: string;
};

export function CardAlbum({ userId }: Props) {
	const { user } = useAuth();
	const targetUserId = userId ?? user?.id;
	const setPage = useSetAtom(pageAtom);
	const [cards, setCards] = useState<Card[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("todas");
	const [packs, setPacks] = useState<UserPack[]>([]);
	const [packsLoading, setPacksLoading] = useState(false);
	const [openingPackId, setOpeningPackId] = useState<string | null>(null);
	const [revealedCards, setRevealedCards] = useState<Card[]>([]);
	const [showPackAnimation, setShowPackAnimation] = useState(false);



	

	useEffect(() => {
		setPage(0);
	}, [setPage]);

	

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
				if (!targetUserId) {
				setCards([]);
				setLoading(false);
				return;
				}

				const data = await getAlbumCardsByUser(targetUserId);
				setCards(data);
			} catch (err) {
				const message = err instanceof Error ? err.message : "No se pudo cargar el album";
				setError(message);
			} finally {
				setLoading(false);
			}
		};

		loadAlbum();
	}, [targetUserId]);

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

	const totalCards = cards.length;
	const obtainedCards = useMemo(
		() => cards.filter((card) => card.obtained).length,
		[cards]
	);
	const missingCards = Math.max(totalCards - obtainedCards, 0);
	const progress = totalCards > 0 ? Math.round((obtainedCards / totalCards) * 100) : 0;

	const handleOpenPack = async (packId: string) => {
		setOpeningPackId(packId);
		try {
			const revealedCards = await openPack(packId);
			if (revealedCards) {
				// Update local packs state to remove opened pack
				setPacks(prev => prev.filter(p => p.id !== packId));
				// Refresh cards to show new ones
				if (user?.id) {
					const updatedCards = await getAlbumCardsByUser(user.id);
					setCards(updatedCards);
				}
				// Show animation with revealed cards
				setRevealedCards(revealedCards);
				setShowPackAnimation(true);
				console.log("Pack opened with cards:", revealedCards);
			}
		} catch (err) {
			console.error("Error opening pack:", err);
		} finally {
			setOpeningPackId(null);
		}
	};

	if (loading) {
		return (
			<div className="team-album-loading">
				Cargando album de cartas...
			</div>
		);
	}

	if (error) {
		return (
			<div className="team-album-loading">
				{error}
			</div>
		);
	}

	return (
		<section className="team-album-container-new" aria-label="Album de cartas">

			{/* UI Controls at Top */}
			<div className="album-ui-container px-4 pt-2 md:px-8 md:pt-3">
				<div className="max-w-5xl mx-auto">
					{/* Header con título y botones */}
					<div className="mb-6">
						<div className="mb-4">
							<h1 className="text-3xl md:text-4xl font-black mb-1">
								ÁLBUM DE <span className="text-vcf-orange">CARTAS</span>
							</h1>
							<p className="text-sm md:text-base text-gray-600">
								{obtainedCards} de {totalCards} cartas coleccionadas ({progress}%)
							</p>
						</div>

						<div className="flex gap-3">
							<button
								onClick={() => packs.length > 0 && handleOpenPack(packs[0].id)}
								disabled={packs.length === 0 || openingPackId !== null}
								className="flex items-center justify-center gap-2 bg-vcf-orange hover:bg-vcf-orange/90 disabled:bg-gray-400 text-white font-bold px-6 py-3 rounded-lg transition-all disabled:cursor-not-allowed"
							>
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"/>
								</svg>
								{openingPackId ? "Abriendo..." : `ABRIR SOBRE (${packs.length})`}
							</button>
							<button className="flex items-center justify-center gap-2 border-2 border-vcf-orange text-vcf-orange hover:bg-vcf-orange/5 font-bold px-6 py-3 rounded-lg transition-all">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M9 2l-1.41 1.41L9.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-5.17l1.58-1.59L15 2H9zm0 2h6v3H9V4zm7 12H8v-2h8v2z"/>
								</svg>
								COMPRAR SOBRES
							</button>
						</div>
					</div>

					{/* Progreso del álbum */}
					<div className="mb-4 bg-white border-2 border-vcf-orange backdrop-blur-sm rounded-lg px-6 py-4">
						<div className="flex items-center justify-between mb-4">
							<p className="font-bold text-lg text-black">Progreso del Álbum</p>
							<p className="text-2xl font-black text-vcf-orange">{progress}%</p>
						</div>
						<div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
							<div
								className="h-full rounded-full bg-gradient-to-r from-vcf-orange to-vcf-yellow transition-all duration-700 ease-out"
								style={{ width: `${progress}%` }}
							/>
						</div>
						<div className="grid grid-cols-4 gap-3">
							<div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
								<p className="text-2xl md:text-3xl font-black text-vcf-orange">{obtainedCards}</p>
								<p className="text-xs text-gray-600 font-medium">Total</p>
							</div>
							<div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
								<p className="text-2xl md:text-3xl font-black text-black">{missingCards}</p>
								<p className="text-xs text-gray-600 font-medium">Faltantes</p>
							</div>
							<div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
								<p className="text-2xl md:text-3xl font-black text-vcf-orange">0</p>
								<p className="text-xs text-gray-600 font-medium">Duplicadas</p>
							</div>
							<div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
								<p className="text-2xl md:text-3xl font-black text-black">0</p>
								<p className="text-xs text-gray-600 font-medium">Legendarias</p>
							</div>
						</div>
					</div>

					{/* Sobres sin abrir */}
					<div className="bg-white border-2 border-vcf-orange backdrop-blur-sm rounded-lg px-6 py-4 mb-6">
						<div className="mb-4">
							<p className="text-xl font-black text-black">
								SOBRES <span className="text-vcf-orange">SIN ABRIR</span>
							</p>
							<p className="text-sm text-gray-600">
								{packsLoading ? "Cargando..." : `Tienes ${packs.length} ${packs.length === 1 ? "sobre" : "sobres"} esperando ser ${packs.length === 1 ? "abierto" : "abiertos"}`}
							</p>
						</div>
						<div className="grid grid-cols-3 gap-4">
							{packs.length > 0 ? (
								packs.map((pack) => (
									<div
										key={pack.id}
										onClick={() => handleOpenPack(pack.id)}
										className="border-2 border-vcf-orange rounded-lg aspect-square bg-gray-50 hover:bg-vcf-orange/10 transition-colors cursor-pointer flex items-center justify-center"
									>
										{openingPackId === pack.id ? (
											<div className="text-center">
												<div className="animate-spin mb-2">📦</div>
												<p className="text-xs font-bold text-vcf-orange">Abriendo...</p>
											</div>
										) : (
											<div className="text-center">
												<p className="text-4xl">📦</p>
												<p className="text-xs font-bold text-gray-600 mt-2">{pack.pack_type}</p>
											</div>
										)}
									</div>
								))
							) : (
								<div className="col-span-3 text-center py-8">
									<p className="text-gray-500">No tienes sobres sin abrir</p>
								</div>
							)}
						</div>
					</div>

					{/* Browser / Search Section */}
					<div className="mb-6">
						<div className="flex flex-col md:flex-row gap-4 mb-4">
							{/* Search Bar */}
							<div className="flex-1 relative">
								<input
									type="text"
									placeholder="Buscar carta por nombre o número..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full px-6 py-3 pl-12 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-vcf-orange transition-colors"
								/>
								<svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
								</svg>
							</div>

							{/* Filters Button */}
							<button className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-vcf-orange text-black hover:text-vcf-orange font-bold px-6 py-3 rounded-lg transition-all whitespace-nowrap">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M3 6a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v5.172a1 1 0 01-1.447.894l-2-1A1 1 0 018 17.118v-4.414a1 1 0 00-.293-.707L1.293 8.707A1 1 0 011 8V6z" />
								</svg>
								FILTROS
							</button>
						</div>

						{/* Category Tabs */}
						<div className="flex overflow-x-auto gap-3 pb-2">
							{[
								{ id: "todas", label: "TODAS", count: cards.length },
								{ id: "jugadores", label: "JUGADORES", count: cards.filter(c => c.tipo === "player").length },
								{ id: "leyendas", label: "LEYENDAS", count: cards.filter(c => c.rareza === "legendary").length },
								{ id: "estadio", label: "ESTADIO", count: cards.filter(c => c.tipo === "stadium").length },
								{ id: "histor", label: "HISTOR", count: cards.filter(c => c.tipo === "historic").length }
							].map((category) => (
								<button
									key={category.id}
									onClick={() => setSelectedCategory(category.id)}
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

			{/* Canvas Container at Bottom */}
			<div className="album-canvas-wrapper">
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
						<Book cards={cards} />
					</group>
				</Canvas>
			</div>

			{/* Pack Open Animation Modal */}
			<PackOpenAnimation
				isOpen={showPackAnimation}
				cards={revealedCards}
				onClose={() => setShowPackAnimation(false)}
			/>
		</section>
	);
}
