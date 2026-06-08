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
  const c = normalize(categoryId);
  if (["cabello","cejas","barba","hair","eyebrow","eyebrows","facialhair"].includes(c)) return "Cabello";
  if (["nariz","nose"].includes(c)) return "Cabeza";
  if (["pantalon","bottom"].includes(c)) return "Pantalón";
  if (["playera","top"].includes(c)) return "Playera";
  if (["lentes","glasses"].includes(c)) return "Lentes";
  if (["sombrero","hat"].includes(c)) return "Sombrero";
  if (["zapatos","shoes"].includes(c)) return "Zapatos";
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
  const palette = palettes.find((p) =>
    sameCategory(p?.categoria, colorCategory) || sameCategory(p?.nombre, colorCategory)
  );
  const colors = getPaletteColors(palette?.colores);
  if (colors.length === 0) return null;
  return {
    key: palette?.categoria || colorCategory,
    color: colors[Math.floor(Math.random() * colors.length)],
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

  const showToast = (t: ToastType) => {
    setToast(t);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    async function load() {
      try {
        const data = await getAvatarCategories();
        const paletteData = await getAvatarPalettes();
        const savedAvatar = await getUserAvatar();
        setCategories(data);
        setPalettes(paletteData);
        if (data.length > 0) setSelectedCategory(data[0].id);
        const savedState = buildSavedAvatarState(savedAvatar);
        setSelectedAssets({ ...buildInitialAssets(data), ...savedState.selectedAssets });
        setSelectedColors({ ...buildInitialColors(paletteData), ...savedState.selectedColors });
      } catch {
        showToast({ type: "error", title: "ERROR", message: "No se pudo cargar el avatar" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSelectAsset = (categoryId: string, asset: AvatarAsset) =>
    setSelectedAssets((prev) => ({ ...prev, [categoryId]: asset }));

  const handleRemoveAsset = (categoryId: string) =>
    setSelectedAssets((prev) => {
      const copy = { ...prev };
      delete copy[categoryId];
      return copy;
    });

  const handleSelectColor = (categoryId: string, color: string) =>
    setSelectedColors((prev) => ({ ...prev, [categoryId]: color }));

  const handleRandomize = () => {
    const assets: Record<string, AvatarAsset> = {};
    const colors: Record<string, string> = {};
    categories.forEach((cat) => {
      if (cat.assets.length > 0) {
        const skip = (cat.removable || cat.removible) && Math.random() < 0.35;
        if (!skip) assets[cat.id] = cat.assets[Math.floor(Math.random() * cat.assets.length)];
      }
      const rc = getRandomColorForCategory(cat.id, palettes);
      if (rc) colors[rc.key] = rc.color;
    });
    setSelectedAssets(assets);
    setSelectedColors(colors);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await saveFullUserAvatar(selectedAssets, selectedColors);
      showToast({ type: "success", title: "¡ÉXITO!", message: "Avatar guardado correctamente" });
    } catch {
      showToast({ type: "error", title: "ERROR", message: "No se pudo guardar el avatar" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground font-black">
        Cargando avatar...
      </div>
    );
  }

  return (
    <div className="h-full flex gap-4 relative">
      {/* Toast */}
      {toast && (
        <div className="absolute right-0 top-0 z-[999] flex items-center gap-3 rounded-xl border border-vcf-orange bg-card px-4 py-3 shadow-2xl max-w-xs">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-vcf-orange text-white font-black text-sm">
            {toast.type === "success" ? "✓" : "!"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-vcf-orange text-xs">{toast.title}</p>
            <p className="text-xs text-foreground mt-0.5">{toast.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* ── Canvas card ── */}
      <div className="relative flex-1 rounded-2xl overflow-hidden bg-[#120f2b] border border-white/10 shadow-xl">
        <AvatarCanvas selectedAssets={selectedAssets} selectedColors={selectedColors} />

        {/* Action buttons overlaid top-right */}
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <button
            type="button"
            onClick={handleRandomize}
            disabled={saving}
            className="rounded-lg bg-black/50 backdrop-blur-sm border border-white/20 px-3 py-1.5 text-xs font-black text-white disabled:opacity-50 transition-all hover:-translate-y-1 cursor-pointer hover:bg-black/70"
          >
            ↻ Aleatorio
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-vcf-orange px-4 py-1.5 text-xs font-black text-white shadow-md shadow-vcf-orange/30 disabled:opacity-50 transition-all hover:-translate-y-1 cursor-pointer"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      {/* ── Controls card ── */}
      <div className="w-[360px] flex-shrink-0 rounded-2xl overflow-hidden bg-card border border-border shadow-xl">
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
      </div>
    </div>
  );
}
