// hooks/useAlbumProgress.ts
import { useEffect, useMemo, useState } from "react";
import { getFullAlbumCardsByUser, type Card } from "@/services/cardsService";

interface AlbumProgress {
  obtained: number;
  total: number;
  missing: number;
  progress: number;
  loading: boolean;
  error: string | null;
}

export function useAlbumProgress(userId?: string): AlbumProgress {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setCards([]);
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getFullAlbumCardsByUser(userId);
        setCards(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error cargando álbum");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  const obtained = useMemo(() => cards.filter((c) => c.obtained).length, [cards]);
  const total = cards.length;
  const missing = Math.max(total - obtained, 0);
  const progress = total > 0 ? Math.round((obtained / total) * 100) : 0;

  return { obtained, total, missing, progress, loading, error };
}