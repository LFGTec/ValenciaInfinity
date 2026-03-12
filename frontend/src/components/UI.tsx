import { atom, useAtom } from "jotai";
import { useEffect, useRef } from "react";
import type { Card } from "../services/cardsService";
import { CARDS_PER_FACE } from "../utils/createCardTexture";

export const pageAtom = atom(0);

export type AlbumPage = {
  front: string | Card[];
  back: string | Card[];
};

export function buildPages(cards: Card[]): AlbumPage[] {
  const chunks: Card[][] = [];
  for (let i = 0; i < cards.length; i += CARDS_PER_FACE) {
    chunks.push(cards.slice(i, i + CARDS_PER_FACE));
  }

  if (chunks.length === 0) return [{ front: "__cover__", back: "__back__" }];

  const pages: AlbumPage[] = [{ front: "__cover__", back: chunks[0] }];

  for (let i = 1; i < chunks.length - 1; i += 2) {
    pages.push({ front: chunks[i], back: chunks[i + 1] ?? chunks[i] });
  }

  if (chunks.length > 1) {
    pages.push({ front: chunks[chunks.length - 1], back: "__back__" });
  } else {
    // Only one chunk — cover already shows it; just add back cover
    pages.push({ front: "__back__", back: "__back__" });
  }

  return pages;
}

function pageLabel(pageData: AlbumPage, index: number): string {
  if (index === 0) return "Portada";
  if (Array.isArray(pageData.front) && pageData.front.length > 0) {
    const tipos = [...new Set((pageData.front as Card[]).map((c) => c.tipo))];
    return tipos.slice(0, 2).join(" / ");
  }
  return `Pág ${index}`;
}

interface AlbumUIProps {
  cards: Card[];
}

export const AlbumUI = ({ cards }: AlbumUIProps) => {
  const [page, setPage] = useAtom(pageAtom);
  const pages = buildPages(cards);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/audios/page-flip-01a.mp3");
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }, [page]);

  return (
    <div className="album-ui">
      <div className="album-marquee" aria-hidden="true">
        <div className="album-marquee-scroll">
          {"Valencia CF · Álbum de Jugadores · Valencia CF · Álbum de Jugadores · ".repeat(4)}
        </div>
      </div>
      <div className="album-nav">
        {pages.map((pageData, index) => (
          <button
            key={index}
            className={`album-nav-btn${index === page ? " active" : ""}`}
            onClick={() => setPage(index)}
          >
            {pageLabel(pageData, index)}
          </button>
        ))}
        <button
          className={`album-nav-btn${page === pages.length ? " active" : ""}`}
          onClick={() => setPage(pages.length)}
        >
          Contraportada
        </button>
      </div>
    </div>
  );
};
