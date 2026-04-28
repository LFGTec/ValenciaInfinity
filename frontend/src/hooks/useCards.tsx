import { useEffect, useState } from "react";
import {
  getCards,
  addCard,
  deleteCard,
  type Card,
} from "@/services/cardsService";

export const useCards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCards = async () => {
    setLoading(true);
    const data = await getCards();
    setCards(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const createCard = async (
    nombre: string,
    rareza: string,
    tipo: string,
    temporada: number,
    numero: number,
    file?: File
  ) => {
    const result = await addCard(
      nombre,
      rareza,
      tipo,
      temporada,
      numero,
      file
    );

    // refresco simple (puedes optimizar luego)
    await fetchCards();

    return result;
  };

  
  const deleteCards = async (id: string) => {
    await deleteCard(id);

    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  return {
    cards,
    loading,
    fetchCards,
    createCard,
    deleteCards,
  };
};