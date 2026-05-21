import { useEffect, useState } from "react";
import {
  getAvatarCategories,
  getAvatarPalettes,
  getUserAvatar,
  saveFullUserAvatar,
  buildSavedAvatarState,
  type AvatarCategory,
  type AvatarAsset,
} from "../../../services/avatarService";

import { AvatarCanvas } from "./AvatarCanvas";
import { AvatarControls } from "./AvatarControls";

type ToastType = {
  type: "success" | "error";
  title: string;
  message: string;
};

function normalize(value?: string) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

function getPaletteColors(colors: any): string[] {
  if (Array.isArray(colors)) return colors;

  if (typeof colors === "string") {
    try {
      const parsed = JSON.parse(colors);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
}

function sameCategory(a?: string, b?: string) {
  const x = normalize(a);
  const y = normalize(b);

  if (x === y) return true;

  const aliases: Record<string, string[]> = {
    cabeza: ["cabeza", "head", "cara", "face"],
    cabello: ["cabello", "hair", "pelo", "cejas", "barba"],
    pantalon: ["pantalon", "bottom"],
    playera: ["playera", "top"],
    lentes: ["lentes", "glasses"],
    sombrero: ["sombrero", "hat"],
    zapatos: ["zapatos", "shoes"],
  };

  return Object.values(aliases).some(
    (group) => group.includes(x) && group.includes(y)
  );
}

function getColorCategory(categoryId: string) {
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

function buildInitialAssets(categories: AvatarCategory[]) {
  const initialAssets: Record<string, AvatarAsset> = {};

  categories.forEach((cat) => {
    if (cat.assets.length > 0 && !cat.removable && !cat.removible) {
      initialAssets[cat.id] = cat.assets[0];
    }
  });

  return initialAssets;
}

function buildInitialColors(palettes: any[]) {
  const initialColors: Record<string, string> = {};

  palettes.forEach((palette: any) => {
    const colors = getPaletteColors(palette?.colores);

    if (palette?.categoria && colors.length > 0) {
      initialColors[palette.categoria] = colors[0];
    }
  });

  return initialColors;
}

function getRandomColorForCategory(categoryId: string, palettes: any[]) {
  const colorCategory = getColorCategory(categoryId);

  const palette = palettes.find((p) => {
    return (
      sameCategory(p?.categoria, colorCategory) ||
      sameCategory(p?.nombre, colorCategory)
    );
  });

  const colors = getPaletteColors(palette?.colores);

  if (colors.length === 0) return null;

  const randomColorIndex = Math.floor(Math.random() * colors.length);

  return {
    key: palette?.categoria || colorCategory,
    color: colors[randomColorIndex],
  };
}

export function AvatarSection() {
  const [categories, setCategories] = useState<AvatarCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<Record<string, AvatarAsset>>({});
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const [palettes, setPalettes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState<ToastType | null>(null);

  const showToast = (newToast: ToastType) => {
    setToast(newToast);

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  useEffect(() => {
    async function loadAvatar() {
      try {
        const data = await getAvatarCategories();
        const paletteData = await getAvatarPalettes();
        const savedAvatar = await getUserAvatar();

        setCategories(data);
        setPalettes(paletteData);

        if (data.length > 0) {
          setSelectedCategory(data[0].id);
        }

        const defaultAssets = buildInitialAssets(data);
        const defaultColors = buildInitialColors(paletteData);
        const savedState = buildSavedAvatarState(savedAvatar);

        setSelectedAssets({
          ...defaultAssets,
          ...savedState.selectedAssets,
        });

        setSelectedColors({
          ...defaultColors,
          ...savedState.selectedColors,
        });
      } catch (error) {
        console.error("Error cargando avatar:", error);

        showToast({
          type: "error",
          title: "ERROR",
          message: "No se pudo cargar el avatar",
        });
      } finally {
        setLoading(false);
      }
    }

    loadAvatar();
  }, []);

  const handleSelectAsset = (categoryId: string, asset: AvatarAsset) => {
    setSelectedAssets((prev) => ({
      ...prev,
      [categoryId]: asset,
    }));
  };

  const handleRemoveAsset = (categoryId: string) => {
    setSelectedAssets((prev) => {
      const copy = { ...prev };
      delete copy[categoryId];
      return copy;
    });
  };

  const handleSelectColor = (categoryId: string, color: string) => {
    setSelectedColors((prev) => ({
      ...prev,
      [categoryId]: color,
    }));
  };

  const handleRandomize = () => {
    const randomAssets: Record<string, AvatarAsset> = {};
    const randomColors: Record<string, string> = {};

    categories.forEach((cat) => {
      if (cat.assets.length > 0) {
        const shouldRemove = (cat.removable || cat.removible) && Math.random() < 0.35;

        if (!shouldRemove) {
          const randomIndex = Math.floor(Math.random() * cat.assets.length);
          randomAssets[cat.id] = cat.assets[randomIndex];
        }
      }

      const randomColor = getRandomColorForCategory(cat.id, palettes);

      if (randomColor) {
        randomColors[randomColor.key] = randomColor.color;
      }
    });

    setSelectedAssets(randomAssets);
    setSelectedColors(randomColors);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await saveFullUserAvatar(selectedAssets, selectedColors);

      showToast({
        type: "success",
        title: "¡ÉXITO!",
        message: "Avatar guardado correctamente",
      });
    } catch (error) {
      console.error("Error guardando avatar:", error);

      showToast({
        type: "error",
        title: "ERROR",
        message: "No se pudo guardar el avatar",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="relative mt-12 mb-12 h-[760px] overflow-hidden rounded-2xl bg-[#120f2b] shadow-2xl border-4 border-black">
      {toast && (
        <div className="absolute right-10 top-8 z-[999] flex w-[470px] items-center gap-5 rounded-xl border-2 border-vcf-orange bg-white px-6 py-5 shadow-2xl">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-vcf-orange text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-2xl font-black">
              {toast.type === "success" ? "✓" : "!"}
            </span>
          </div>

          <div className="flex-1">
            <p className="text-2xl font-black text-vcf-orange leading-none">
              {toast.title}
            </p>
            <p className="mt-2 text-base font-black text-black">
              {toast.message}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-4xl font-light leading-none text-gray-500 hover:text-black"
          >
            ×
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex h-full items-center justify-center text-white font-black">
          Cargando avatar...
        </div>
      ) : (
        <>
          <AvatarCanvas
            selectedAssets={selectedAssets}
            selectedColors={selectedColors}
          />

          <div className="absolute right-10 top-10 z-30 flex gap-3">
            <button
              type="button"
              onClick={handleRandomize}
              disabled={saving}
              className="rounded-xl bg-white px-5 py-4 font-black text-vcf-orange shadow-lg disabled:opacity-60"
            >
              ↻
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-vcf-orange px-7 py-4 font-black text-white shadow-lg disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>

          <AvatarControls
            categories={categories}
            selectedCategory={selectedCategory}
            selectedAssets={selectedAssets}
            selectedColors={selectedColors}
            palettes={palettes}
            onSelectCategory={setSelectedCategory}
            onSelectAsset={handleSelectAsset}
            onRemoveAsset={handleRemoveAsset}
            onSelectColor={handleSelectColor}
          />
        </>
      )}
    </section>
  );
}
