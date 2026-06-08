import { useState } from "react";
import type {
  AvatarCategory,
  AvatarAsset,
} from "../../../services/avatarService";

type Props = {
  categories?: AvatarCategory[];
  selectedCategory?: string;
  selectedAssets?: Record<string, AvatarAsset>;
  selectedColors?: Record<string, string>;
  palettes?: any[];
  onSelectCategory?: (categoryId: string) => void;
  onSelectAsset?: (categoryId: string, asset: AvatarAsset) => void;
  onRemoveAsset?: (categoryId: string) => void;
  onSelectColor?: (categoryId: string, color: string) => void;
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
    cabeza: ["cabeza", "head"],
    cabello: ["cabello", "hair", "pelo"],
    rostro: ["rostro", "face", "cara"],
    pantalon: ["pantalon", "bottom"],
    playera: ["playera", "top"],
    sombrero: ["sombrero", "hat"],
    zapatos: ["zapatos", "shoes"],
    ojos: ["ojos", "eyes"],
    cejas: ["cejas", "eyebrow", "eyebrows"],
    aretes: ["aretes", "earring", "earrings"],
    nariz: ["nariz", "nose"],
    lentes: ["lentes", "glasses"],
    barba: ["barba", "facialhair", "facial hair"],
  };

  return Object.values(aliases).some(
    (group) => group.includes(x) && group.includes(y)
  );
}

function getPaletteCategory(categoryId: string) {
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

  if (
    category === "cabeza" ||
    category === "rostro" ||
    category === "cara" ||
    category === "head" ||
    category === "face"
  ) {
    return "Cabeza";
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

function getAssetPosition(asset: any) {
  return (
    asset?.posicion_item ??
    asset?.position_item ??
    asset?.posicion ??
    asset?.orden ??
    asset?.order ??
    asset?.numero ??
    999
  );
}

function canPaintAsset(categoryId: string, asset?: any) {
  const category = normalize(categoryId);

  if (!asset) return true;

  const position = getAssetPosition(asset);

  if (
    category === "ojos" ||
    category === "eyes" ||
    category === "rostro" ||
    category === "face" ||
    category === "cara"
  ) {
    return false;
  }

  if (category === "lentes" || category === "glasses") {
    return position === 1 || position === 4;
  }

  if (category === "sombrero" || category === "hat") {
    return position === 2;
  }

  if (category === "playera" || category === "top") {
    return position <= 3;
  }

  if (category === "pantalon" || category === "bottom") {
    return position <= 3;
  }

  return true;
}

export function AvatarControls({
  categories = [],
  selectedCategory = "",
  selectedAssets = {},
  selectedColors = {},
  palettes = [],
  onSelectCategory = () => {},
  onSelectAsset = () => {},
  onRemoveAsset = () => {},
  onSelectColor = () => {},
}: Props) {
  const [mode, setMode] = useState<"customize" | "view">("customize");

  const currentCategory = categories.find((cat) => cat.id === selectedCategory);
  const selectedAsset = currentCategory ? selectedAssets[currentCategory.id] : undefined;
  const colorCategory = getPaletteCategory(selectedCategory);

  const currentPalette = palettes.find((palette) => {
    return (
      sameCategory(palette?.categoria, colorCategory) ||
      sameCategory(palette?.nombre, colorCategory) ||
      sameCategory(palette?.categoria, selectedCategory) ||
      sameCategory(palette?.nombre, selectedCategory) ||
      sameCategory(palette?.categoria, currentCategory?.id) ||
      sameCategory(palette?.nombre, currentCategory?.id) ||
      sameCategory(palette?.categoria, (currentCategory as any)?.etiqueta_categoria) ||
      sameCategory(palette?.nombre, (currentCategory as any)?.etiqueta_categoria)
    );
  });

  const paletteColors = getPaletteColors(currentPalette?.colores);
  const paletteCategory = currentPalette?.categoria || colorCategory;
  const selectedColor =
    selectedColors[paletteCategory] ||
    selectedColors[colorCategory] ||
    selectedColors[selectedCategory];

  const canShowColors = paletteColors.length > 0 && canPaintAsset(selectedCategory, selectedAsset);

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("customize")}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all hover:-translate-y-1 cursor-pointer ${
            mode === "customize"
              ? "bg-vcf-orange text-white shadow-lg shadow-vcf-orange/20"
              : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
          }`}
        >
          Customizar
        </button>
        <button
          type="button"
          onClick={() => setMode("view")}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all hover:-translate-y-1 cursor-pointer ${
            mode === "view"
              ? "bg-vcf-orange text-white shadow-lg shadow-vcf-orange/20"
              : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
          }`}
        >
          Visualización
        </button>
      </div>

      {mode === "customize" && (
        <>
          {/* Category tabs */}
          <div>
            <p className="text-white/40 text-[10px] font-black tracking-widest mb-2">CATEGORÍA</p>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-vcf-orange text-white"
                      : "bg-white/10 text-white/80 hover:bg-white/20 border border-white/10"
                  }`}
                >
                  {(cat as any).etiqueta_categoria || cat.id}
                </button>
              ))}
            </div>
          </div>

          {/* Color palette */}
          {canShowColors && (
            <div>
              <p className="text-white/40 text-[10px] font-black tracking-widest mb-2">COLOR</p>
              <div className="flex flex-wrap gap-2">
                {paletteColors.map((color: string) => {
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => onSelectColor(colorCategory, color)}
                      style={{ backgroundColor: color }}
                      className={`w-7 h-7 rounded-lg border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "scale-110 border-vcf-orange shadow-lg"
                          : "border-white/20 hover:border-white/60"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Asset grid */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <p className="text-white/40 text-[10px] font-black tracking-widest mb-2">ESTILO</p>
            <div className="grid grid-cols-3 gap-2">
              {currentCategory?.removable && selectedAssets[currentCategory.id] && (
                <button
                  type="button"
                  onClick={() => onRemoveAsset(currentCategory.id)}
                  className="h-[68px] rounded-xl border border-red-400/40 bg-red-500/10 text-white/70 font-black text-xs cursor-pointer hover:bg-red-500/20 hover:text-white hover:border-red-400 transition-all"
                >
                  Quitar
                </button>
              )}

              {currentCategory?.assets?.map((asset) => {
                const isSelected = selectedAssets[currentCategory.id]?.id === asset.id;
                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => onSelectAsset(currentCategory.id, asset)}
                    className={`h-[68px] rounded-xl border-2 bg-black/40 p-1.5 text-white transition-all cursor-pointer ${
                      isSelected
                        ? "border-vcf-orange shadow-lg shadow-vcf-orange/20"
                        : "border-white/15 hover:border-white/50"
                    }`}
                  >
                    <div className="w-full h-full">
                      {asset.thumbnail ? (
                        <img
                          src={asset.thumbnail}
                          alt=""
                          className="w-full h-full object-cover rounded-lg"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs opacity-50">
                          GLB
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {mode === "view" && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white/30 text-sm font-black text-center">
            Modo visualización<br />
            <span className="text-xs font-normal opacity-60">Gira el avatar con el ratón</span>
          </p>
        </div>
      )}
    </div>
  );
}
