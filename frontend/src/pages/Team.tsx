import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { Experience } from "../components/Experience";
import { AlbumUI } from "../components/UI";
import { getCards } from "../services/cardsService";
import type { Card } from "../services/cardsService";

function Team() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCards().then((data) => {
      setCards(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="team-album-loading">
        <p>Cargando álbum...</p>
      </div>
    );
  }

  return (
    <div className="team-album-container">
      <AlbumUI cards={cards} />
      <Canvas
        shadows
        camera={{
          position: [-0.5, 1, window.innerWidth > 800 ? 4 : 9],
          fov: 45,
        }}
      >
        <Suspense fallback={null}>
          <Experience cards={cards} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Team;
