import { supabase } from "./supabaseClient";


export type AvatarPieza = {
  id: number;
  categoria: string;
  etiqueta_categoria: string | null;
  posicion_categoria: number | null;
  posicion_item: number | null;
  nombre: string;
  ruta_archivo: string;
  ruta_thumbnail: string | null;
  removible: boolean | null;
  activo: boolean | null;
};

export type AvatarPaletaColor = {
  id: number;
  categoria: string;
  nombre: string;
  colores: string[];
  activo: boolean;
};

export type AvatarAsset = {
  id: number;
  name: string;
  group: string;
  url: string;
  thumbnail: string | null;
  posicion_item: number;
  lockedGroups: string[];
};

export type AvatarCategory = {
  id: string;
  name: string;
  label: string;
  removable: boolean;
  posicion_categoria: number;
  assets: AvatarAsset[];
  expand: {
    colorPalette: {
      colors: string[];
    };
  };
};

function cleanStoragePath(path: string) {
  if (!path) return "";

  return path
    .replace(/^avatar-assets\//, "")
    .replace(/^\/+/, "");
}

function getAvatarPublicUrl(path: string) {
  const cleanPath = cleanStoragePath(path);

  const { data } = supabase.storage
    .from("avatar-assets")
    .getPublicUrl(cleanPath);

  console.log("Avatar URL:", cleanPath, data.publicUrl);

  return data.publicUrl;
}

export async function getAvatarCategories(): Promise<AvatarCategory[]> {
  const { data: piezas, error: piezasError } = await supabase
    .from("AvatarPiezas")
    .select("*")
    .eq("activo", true)
    .order("posicion_categoria", { ascending: true })
    .order("posicion_item", { ascending: true });

  if (piezasError) {
    console.error("Error cargando piezas de avatar:", piezasError);
    throw piezasError;
  }

  const { data: paletas, error: paletasError } = await supabase
    .from("AvatarPaletasColor")
    .select("*")
    .eq("activo", true);

  if (paletasError) {
    console.error("Error cargando paletas de avatar:", paletasError);
    throw paletasError;
  }

  const categoriesMap: Record<string, AvatarCategory> = {};

  (piezas as AvatarPieza[]).forEach((item) => {
    const categoria = item.categoria.trim().toLowerCase();

    const paleta = (paletas as AvatarPaletaColor[]).find(
      (p) => p.categoria.trim().toLowerCase() === categoria
    );

    if (!categoriesMap[categoria]) {
      categoriesMap[categoria] = {
        id: categoria,
        name: categoria,
        label: item.etiqueta_categoria ?? categoria,
        removable: item.removible ?? false,
        posicion_categoria: item.posicion_categoria ?? 999,
        assets: [],
        expand: {
          colorPalette: {
            colors: paleta?.colores ?? [],
          },
        },
      };
    }

    categoriesMap[categoria].assets.push({
      id: item.id,
      name: item.nombre,
      group: categoria,
      posicion_item: item.posicion_item ?? 999,
      url: getAvatarPublicUrl(item.ruta_archivo),
      thumbnail: item.ruta_thumbnail
        ? getAvatarPublicUrl(item.ruta_thumbnail)
        : null,
      lockedGroups: [],
    });
  });

  return Object.values(categoriesMap)
    .sort((a, b) => a.posicion_categoria - b.posicion_categoria)
    .map((category) => ({
      ...category,
      assets: category.assets.sort(
        (a, b) => a.posicion_item - b.posicion_item
      ),
    }));
}

export async function getUserAvatar(userId: string) {
  const { data, error } = await supabase
    .from("AvatarUsuario")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error cargando avatar del usuario:", error);
    throw error;
  }

  return data;
}

export async function saveUserAvatarSelection(params: {
  userId: string;
  categoria: string;
  piezaId?: number | null;
  color?: string | null;
}) {
  const { userId, categoria, piezaId, color } = params;

  const { data, error } = await supabase.from("AvatarUsuario").upsert(
    {
      user_id: userId,
      categoria,
      pieza_id: piezaId ?? null,
      color: color ?? null,
    },
    {
      onConflict: "user_id,categoria",
    }
  );

  if (error) {
    console.error("Error guardando selección de avatar:", error);
    throw error;
  }

  return data;
}