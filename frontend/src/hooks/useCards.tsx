import { useEffect, useState } from "react";
import {
  getCards,
  addCard,
  deleteCard,
  getCategories,
  type Card,
  type Category,
  updateCard, 
} from "../services/cardsService";

export const useCards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [cardsData, categoriesData] = await Promise.all([
        getCards(),
        getCategories(),
      ]);

      setCards(cardsData);
      setCategories(categoriesData);
      setLoading(false);
    };

    fetchData();
  }, []);

 
  const createCard = async (
    name: string,
    type: string,
    season: number,
    category_id: string,
    file?: File
  ) => {
    const category = categories.find((c) => c.id === category_id);

    const rarity = category?.name ?? null;

    await addCard(
      name,
      type,
      season,
      category_id,
      rarity,
      file
    );

    const updatedCards = await getCards();
    setCards(updatedCards);
  };

  const editCard = async (
    id: string,
    name: string,
    type: string,
    season: number,
    category_id: string,
    existing_image_url: string | null,
    file?: File
  ) => {
    const category = categories.find((c) => c.id === category_id);

    const rarity = category?.name || null;

    await updateCard(
      id,
      name,
      type,
      season,
      category_id,
      rarity,
      existing_image_url,
      file
    );


    const updatedCards = await getCards();
    setCards(updatedCards);
  };

  const removeCard = async (id: string) => {
    await deleteCard(id);

    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  return {
    cards,
    categories,
    loading,
    createCard,
    removeCard,
    editCard,
  };
};