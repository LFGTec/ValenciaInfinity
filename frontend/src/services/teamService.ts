import { supabase } from "./supabaseClient";

export type PositionGroup =
  | "Portero"
  | "Defensa"
  | "Centrocampista"
  | "Delantero";

export interface Player {
  id: number;
  name: string;
  position: string;
  image_url: string;
  nationality: string;
  age: number;
  matches: number;
  goals: number;
  assists: number;
  description: string;
  squad_number: number;
  position_group?: PositionGroup;
}

/**
 * Convierte image_url (path) a URL pública del bucket
 */
const getImageUrl = (path: string) => {
  const { data } = supabase.storage
    .from("player")
    .getPublicUrl(path);

  return data.publicUrl;
};

export const playersService = {
  /**
   * Traer todos los jugadores
   */
  async getAll(): Promise<Player[]> {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .order("squad_number", { ascending: true });

    if (error) throw error;

    return (
      data?.map((player) => ({
        ...player,
        image_url: getImageUrl(player.image_url),
      })) || []
    );
  },

  /**
   * Filtrar por posición
   */
  async getByPosition(position: PositionGroup): Promise<Player[]> {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("position", position)
      .order("squad_number", { ascending: true });

    if (error) throw error;

    return (
      data?.map((player) => ({
        ...player,
        image_url: getImageUrl(player.image_url),
      })) || []
    );
  },

  /**
   * Obtener jugador por ID
   */
  async getById(id: number): Promise<Player | null> {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) return null;

    return {
      ...data,
      image_url: getImageUrl(data.image_url),
    };
  },
};