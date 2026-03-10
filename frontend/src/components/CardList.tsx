import { useEffect, useState } from "react";
import { getCards } from "../services/cardsService";
import type { Card } from "../services/cardsService";
import "./CardList.css";

export default function CardsList() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      const data = await getCards();
      setCards(data);
      setLoading(false);
    };

    fetchCards();
  }, []);

  if (loading) return <p>Cargando cartas...</p>;

  return (
    <div className="cards-container">
      {cards.map((card) => (
        <div key={card.id} className="card">
          <h2>{card.nombre}</h2>
          <p>Rareza: {card.rareza}</p>
          <p>Tipo: {card.tipo}</p>
          <p>Temporada: {card.temporada}</p>
          <p>Número: {card.numero}</p>
        </div>
      ))}
    </div>
  );
}
