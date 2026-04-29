import { useState, useEffect } from "react";
import { getUserPacks, openPack, type UserPack, type Card } from "../services/cardsService";

export const usePacks = (userId?: string) => {
	const [packs, setPacks] = useState<UserPack[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [openingPackId, setOpeningPackId] = useState<string | null>(null);

	useEffect(() => {
		if (!userId) {
			setPacks([]);
			return;
		}

		const loadPacks = async () => {
			setLoading(true);
			setError(null);
			try {
				const userPacks = await getUserPacks(userId);
				setPacks(userPacks);
			} catch (err) {
				const message = err instanceof Error ? err.message : "Error loading packs";
				setError(message);
				setPacks([]);
			} finally {
				setLoading(false);
			}
		};

		loadPacks();
	}, [userId]);

	const handleOpenPack = async (packId: string): Promise<Card[] | null> => {
		setOpeningPackId(packId);
		setError(null);
		try {
			const revealedCards = await openPack(packId);
			if (revealedCards) {
				// Remove opened pack from state
				setPacks(prev => prev.filter(p => p.id !== packId));
				return revealedCards;
			}
			return null;
		} catch (err) {
			const message = err instanceof Error ? err.message : "Error opening pack";
			setError(message);
			return null;
		} finally {
			setOpeningPackId(null);
		}
	};

	return {
		packs,
		loading,
		error,
		openingPackId,
		openPack: handleOpenPack,
	};
};
