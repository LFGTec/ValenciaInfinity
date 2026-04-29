
import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useSetAtom } from "jotai";
import { useParams } from "react-router-dom";
import { AlbumUI, pageAtom } from "../UI";
import { Book } from "../Book";
import { useAuth } from "../../hooks/useAuth";
import { getAlbumCardsByUser, type Card } from "../../services/cardsService";

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

	const totalCards = cards.length;
	const obtainedCards = useMemo(
		() => cards.filter((card) => card.obtained).length,
		[cards]
	);
	const missingCards = Math.max(totalCards - obtainedCards, 0);
	const progress = totalCards > 0 ? Math.round((obtainedCards / totalCards) * 100) : 0;

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
		<section className="team-album-container" aria-label="Album de cartas">
			<Canvas
				camera={{ fov: 42, position: [1.7, 0.25, 3.4] }}
				dpr={[1, 1.8]}
				shadows
			>
				<color attach="background" args={["#1e1c1c"]} />
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

			<div className="absolute top-0 left-0 right-0 z-20 px-4 pt-4 md:px-8 md:pt-6 pointer-events-none">
				<div className="max-w-5xl mx-auto mb-3 bg-black/45 border border-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
					<div className="flex items-center justify-between mb-2">
						<p className="text-xs text-white/70 uppercase tracking-wide">Progreso del album</p>
						<p className="text-sm md:text-base font-black text-vcf-orange">{obtainedCards}/{totalCards} ({progress}%)</p>
					</div>
					<div className="w-full h-3 bg-white/15 rounded-full overflow-hidden border border-white/10">
						<div
							className="h-full rounded-full bg-gradient-to-r from-vcf-orange to-vcf-yellow transition-all duration-700 ease-out"
							style={{ width: `${progress}%` }}
						/>
					</div>
				</div>

				<div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
					<div className="bg-black/45 border border-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
						<p className="text-xs text-white/70 uppercase tracking-wide">Progreso</p>
						<p className="text-xl md:text-2xl font-black text-vcf-orange">{progress}%</p>
					</div>
					<div className="bg-black/45 border border-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
						<p className="text-xs text-white/70 uppercase tracking-wide">Obtenidas</p>
						<p className="text-xl md:text-2xl font-black text-white">{obtainedCards}</p>
					</div>
					<div className="bg-black/45 border border-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
						<p className="text-xs text-white/70 uppercase tracking-wide">Faltantes</p>
						<p className="text-xl md:text-2xl font-black text-white">{missingCards}</p>
					</div>
					<div className="bg-black/45 border border-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
						<p className="text-xs text-white/70 uppercase tracking-wide">Total catalogo</p>
						<p className="text-xl md:text-2xl font-black text-white">{totalCards}</p>
					</div>
				</div>
			</div>

			<AlbumUI cards={cards} />
		</section>
	);
}