import { supabase } from "./supabaseClient";

export type AvatarAsset = {
  id: number | string;
  name?: string;
  nombre?: string;
  group?: string;
  url?: string;
  model_url?: string;
  file_url?: string;
  asset_url?: string;
  thumbnail?: string;
  ruta_archivo?: string;
  ruta_thumbnail?: string;
  posicion_item?: number;
  position_item?: number;
  removable?: boolean;
  removible?: boolean;
  activo?: boolean;
};

export type AvatarCategory = {
  id: string;
  name?: string;
  label?: string;
  etiqueta_categoria?: string;
  removable?: boolean;
  removible?: boolean;
  posicion_categoria?: number;
  assets: AvatarAsset[];
};

function normalize(value?: string) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function getPublicUrl(path?: string | null) {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const cleanPath = path.replace(/^avatar-assets\//, "");

  const { data } = supabase.storage
    .from("avatar-assets")
    .getPublicUrl(cleanPath);

  return data.publicUrl;
}

function getColorKeyForSave(categoryId: string) {
  const category = normalize(categoryId);

  if (
    category === "cabello" ||
    category === "cejas" ||
    category === "barba" ||
    category === "hair" ||
    category === "eyebrow" ||
    category === "eyebrows" ||
    category === "facialhair"
  ) {
    return "Cabello";
  }

  if (category === "nariz" || category === "nose") {
    return "Cabeza";
  }

  if (category === "pantalon" || category === "bottom") {
    return "Pantalón";
  }

  if (category === "playera" || category === "top") {
    return "Playera";
  }

  if (category === "lentes" || category === "glasses") {
    return "Lentes";
  }

  if (category === "sombrero" || category === "hat") {
    return "Sombrero";
  }

  if (category === "zapatos" || category === "shoes") {
    return "Zapatos";
  }

  return categoryId;
}

function getColorForCategory(
  selectedColors: Record<string, string>,
  categoryId: string
) {
  const colorKey = getColorKeyForSave(categoryId);

  return (
    selectedColors[categoryId] ||
    selectedColors[colorKey] ||
    selectedColors[normalize(categoryId)] ||
    null
  );
}

export async function getAvatarPalettes() {
  const { data, error } = await supabase
    .from("AvatarPaletasColor")
    .select("*")
    .eq("activo", true)
    .order("id", { ascending: true });

  if (error) throw error;

  return data ?? [];
}

export async function getAvatarCategories(): Promise<AvatarCategory[]> {
  const { data, error } = await supabase
    .from("AvatarPiezas")
    .select("*")
    .eq("activo", true)
    .order("posicion_categoria", { ascending: true })
    .order("posicion_item", { ascending: true });

  if (error) throw error;

  const categoryMap = new Map<string, AvatarCategory>();

  (data ?? []).forEach((piece: any) => {
    const categoryId = piece.categoria;

    if (!categoryMap.has(categoryId)) {
      categoryMap.set(categoryId, {
        id: categoryId,
        name: categoryId,
        label: piece.etiqueta_categoria || categoryId,
        etiqueta_categoria: piece.etiqueta_categoria || categoryId,
        removable: piece.removible ?? false,
        removible: piece.removible ?? false,
        posicion_categoria: piece.posicion_categoria ?? 999,
        assets: [],
      });
    }

    const category = categoryMap.get(categoryId)!;

    category.assets.push({
      id: piece.id,
      name: piece.nombre,
      nombre: piece.nombre,
      group: categoryId,
      url: getPublicUrl(piece.ruta_archivo),
      model_url: getPublicUrl(piece.ruta_archivo),
      file_url: getPublicUrl(piece.ruta_archivo),
      asset_url: getPublicUrl(piece.ruta_archivo),
      thumbnail: getPublicUrl(piece.ruta_thumbnail),
      ruta_archivo: piece.ruta_archivo,
      ruta_thumbnail: piece.ruta_thumbnail,
      posicion_item: piece.posicion_item,
      position_item: piece.posicion_item,
      removable: piece.removible,
      removible: piece.removible,
      activo: piece.activo,
    });
  });

  return Array.from(categoryMap.values()).sort(
    (a, b) => (a.posicion_categoria ?? 999) - (b.posicion_categoria ?? 999)
  );
}

export async function saveFullUserAvatar(
  selectedAssets: Record<string, any>,
  selectedColors: Record<string, string>
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("No hay usuario autenticado");

  const { error: deleteError } = await supabase
    .from("AvatarUsuario")
    .delete()
    .eq("user_id", user.id);

  if (deleteError) throw deleteError;

  const rows = Object.entries(selectedAssets)
    .filter(([, asset]) => asset?.id)
    .map(([categoryId, asset]) => {
      return {
        user_id: user.id,
        categoria: categoryId,
        pieza_id: asset.id,
        color: getColorForCategory(selectedColors, categoryId),
      };
    });

  if (rows.length === 0) return;

  const { error: insertError } = await supabase
    .from("AvatarUsuario")
    .insert(rows);

  if (insertError) throw insertError;
}

export async function getUserAvatar() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return [];

  const { data, error } = await supabase
    .from("AvatarUsuario")
    .select(`
      id,
      user_id,
      categoria,
      pieza_id,
      color,
      AvatarPiezas (
        id,
        categoria,
        etiqueta_categoria,
        posicion_categoria,
        posicion_item,
        nombre,
        ruta_archivo,
        ruta_thumbnail,
        removible,
        activo
      )
    `)
    .eq("user_id", user.id);

  if (error) throw error;

  return data ?? [];
}

export async function getUserAvatarByUserId(userId: string) {
  const { data, error } = await supabase
    .from("AvatarUsuario")
    .select(`
      id,
      user_id,
      categoria,
      pieza_id,
      color,
      AvatarPiezas (
        id,
        categoria,
        etiqueta_categoria,
        posicion_categoria,
        posicion_item,
        nombre,
        ruta_archivo,
        ruta_thumbnail,
        removible,
        activo
      )
    `)
    .eq("user_id", userId);

  if (error) throw error;

  return data ?? [];
}

export function buildSavedAvatarState(savedAvatar: any[]) {
  const selectedAssets: Record<string, AvatarAsset> = {};
  const selectedColors: Record<string, string> = {};

  savedAvatar.forEach((row: any) => {
    const piece = Array.isArray(row.AvatarPiezas)
      ? row.AvatarPiezas[0]
      : row.AvatarPiezas;

    if (!piece) return;

    selectedAssets[row.categoria] = {
      id: piece.id,
      name: piece.nombre,
      nombre: piece.nombre,
      group: row.categoria,
      url: getPublicUrl(piece.ruta_archivo),
      model_url: getPublicUrl(piece.ruta_archivo),
      file_url: getPublicUrl(piece.ruta_archivo),
      asset_url: getPublicUrl(piece.ruta_archivo),
      thumbnail: getPublicUrl(piece.ruta_thumbnail),
      ruta_archivo: piece.ruta_archivo,
      ruta_thumbnail: piece.ruta_thumbnail,
      posicion_item: piece.posicion_item,
      position_item: piece.posicion_item,
      removable: piece.removible,
      removible: piece.removible,
      activo: piece.activo,
    };

    if (row.color) {
      const colorKey = getColorKeyForSave(row.categoria);
      selectedColors[row.categoria] = row.color;
      selectedColors[colorKey] = row.color;
    }
  });

  return {
    selectedAssets,
    selectedColors,
  };
}
