import React, { useState } from "react";
import {
  BookOpen,
  Package,
  Star,
  Lock,
  TrendingUp,
  Award,
  Gift,
  ShoppingCart,
  Filter,
  Search,
} from "lucide-react";
import card1 from "../../assets/CartaAmarilla.png";
import card2 from "../../assets/CartaAzul.png";
import card3 from "../../assets/CartaVerde.png";
import card4 from "../../assets/CartaRoja.png";

interface Card {
  id: string;
  number: number;
  name: string;
  category:
    | "player"
    | "legend"
    | "stadium"
    | "history"
    | "special";
  rarity: "common" | "rare" | "epic" | "legendary";
  owned: boolean;
  duplicates?: number;
}

export function CardAlbum() {
  
}