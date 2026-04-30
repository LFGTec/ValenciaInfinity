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

function normalize(value?: string) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

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

  return data.publicUrl;
}

export async function getAvatarPalettes() {
  const { data, error } = await supabase
    .from("AvatarPaletasColor")
    .select("*")
    .eq("activo", true);

  if (error) throw error;

  return data as AvatarPaletaColor[];
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
    const categoriaOriginal = item.categoria.trim();
    const categoriaId = normalize(item.categoria);

    const paleta = (paletas as AvatarPaletaColor[]).find(
      (p) => normalize(p.categoria) === categoriaId
    );

    if (!categoriesMap[categoriaId]) {
      categoriesMap[categoriaId] = {
        id: categoriaId,
        name: categoriaOriginal,
        label: item.etiqueta_categoria ?? categoriaOriginal,
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

    categoriesMap[categoriaId].assets.push({
      id: item.id,
      name: item.nombre,
      group: categoriaId,
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

export async function saveFullUserAvatar(params: {
  userId: string;
  selectedAssets: Record<string, AvatarAsset>;
  selectedColors: Record<string, string>;
}) {
  const { userId, selectedAssets, selectedColors } = params;

  const assetRows = Object.entries(selectedAssets).map(([categoria, asset]) => {
    const colorKey = Object.keys(selectedColors).find(
      (key) => normalize(key) === normalize(categoria)
    );

    return {
      user_id: userId,
      categoria,
      pieza_id: asset.id,
      color: colorKey ? selectedColors[colorKey] : null,
    };
  });

  const colorRows = Object.entries(selectedColors)
    .filter(([categoria]) => {
      return !Object.keys(selectedAssets).some(
        (assetCategoria) => normalize(assetCategoria) === normalize(categoria)
      );
    })
    .map(([categoria, color]) => ({
      user_id: userId,
      categoria,
      pieza_id: null,
      color,
    }));

  const rows = [...assetRows, ...colorRows];

  if (rows.length === 0) {
    return null;
  }

  const { data, error } = await supabase
    .from("AvatarUsuario")
    .upsert(rows, {
      onConflict: "user_id,categoria",
    })
    .select();

  if (error) {
    console.error("Error guardando avatar completo:", error);
    throw error;
  }

  return data;
}