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
    .replace(/[\u0300-\u036f]/g, "")
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

  if (category === "pantalon" || category === "bottom") {
    return "Pantalón";
  }

  if (category === "playera" || category === "top") {
    return "Playera";
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

  if (category === "pantalon" || category === "bottom") {
    return position <= 3;
  }

  if (category === "playera" || category === "top") {
    return position <= 5;
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

  const currentCategory = categories.find(
    (cat) => cat.id === selectedCategory
  );

  const selectedAsset = currentCategory
    ? selectedAssets[currentCategory.id]
    : undefined;

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

  const canShowColors =
    paletteColors.length > 0 &&
    canPaintAsset(selectedCategory, selectedAsset);

  return (
    <div className="absolute bottom-0 left-1/2 z-30 w-[88%] -translate-x-1/2 rounded-t-2xl bg-black/45 backdrop-blur-md px-6 pt-6 pb-0">
      {mode === "customize" && (
        <>
          {canShowColors && (
            <div className="mb-5 flex gap-3">
              {paletteColors.map((color: string) => {
                const isSelected =
                  selectedColors[paletteCategory] === color ||
                  selectedColors[colorCategory] === color ||
                  selectedColors[selectedCategory] === color;

                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onSelectColor(paletteCategory, color)}
                    style={{ backgroundColor: color }}
                    className={`w-8 h-8 rounded-md border-2 transition ${
                      isSelected
                        ? "scale-110 border-vcf-orange"
                        : "border-white"
                    }`}
                  />
                );
              })}
            </div>
          )}

          <div className="mb-5 flex flex-wrap gap-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`pb-2 text-lg font-black text-white transition ${
                  selectedCategory === cat.id
                    ? "border-b-4 border-white"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                {(cat as any).etiqueta_categoria || cat.id}
              </button>
            ))}
          </div>

          <div className="flex gap-3 overflow-x-auto pb-6">
            {currentCategory?.removable && selectedAssets[currentCategory.id] && (
              <button
                type="button"
                onClick={() => onRemoveAsset(currentCategory.id)}
                className="min-w-[95px] h-[95px] rounded-xl border-2 border-white bg-black/40 text-white font-black"
              >
                Quitar
              </button>
            )}

            {currentCategory?.assets?.map((asset) => {
              const isSelected =
                selectedAssets[currentCategory.id]?.id === asset.id;

              return (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => onSelectAsset(currentCategory.id, asset)}
                  className={`min-w-[95px] h-[95px] rounded-xl border-2 bg-black/40 p-2 text-white transition ${
                    isSelected
                      ? "border-white"
                      : "border-white/30 hover:border-white"
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
                      <div className="flex h-full items-center justify-center text-xs opacity-70">
                        GLB
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      <div className="grid grid-cols-2">
        <button
          type="button"
          onClick={() => setMode("customize")}
          className="bg-vcf-orange py-5 text-center text-lg font-black text-white"
        >
          Customizar avatar
        </button>

        <button
          type="button"
          onClick={() => setMode("view")}
          className="bg-white py-5 text-center text-lg font-black text-vcf-orange"
        >
          Visualización
        </button>
      </div>
    </div>
  );
}