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
  return Object.values(aliases).some((g) => g.includes(x) && g.includes(y));
}

function getPaletteCategory(categoryId: string) {
  const c = normalize(categoryId);
  if (["cabello","cejas","barba","hair","eyebrow","eyebrows","facialhair"].includes(c)) return "Cabello";
  if (["cabeza","rostro","cara","head","face","nariz","nose"].includes(c)) return "Cabeza";
  if (["pantalon","bottom"].includes(c)) return "Pantalón";
  if (["playera","top"].includes(c)) return "Playera";
  if (["lentes","glasses"].includes(c)) return "Lentes";
  if (["sombrero","hat"].includes(c)) return "Sombrero";
  if (["zapatos","shoes"].includes(c)) return "Zapatos";
  return categoryId;
}

function getAssetPosition(asset: any) {
  return asset?.posicion_item ?? asset?.position_item ?? asset?.posicion ?? asset?.orden ?? asset?.order ?? asset?.numero ?? 999;
}

function canPaintAsset(categoryId: string, asset?: any) {
  const c = normalize(categoryId);
  if (!asset) return true;
  const pos = getAssetPosition(asset);
  if (["ojos","eyes","rostro","face","cara"].includes(c)) return false;
  if (["lentes","glasses"].includes(c)) return pos === 1 || pos === 4;
  if (["sombrero","hat"].includes(c)) return pos === 2;
  if (["playera","top","pantalon","bottom"].includes(c)) return pos <= 3;
  return true;
}

// Used for sort order (ropa appears first)
const ROPA_IDS = ["playera","top","pantalon","bottom","zapatos","shoes","cabeza","head","rostro","face","cara","ojos","eyes"];

// These categories never get a "Quitar" button
const NO_QUITAR_IDS = ["playera","top","pantalon","bottom","zapatos","shoes","cabeza","head","ojos","eyes","nariz","nose"];

const ROPA_ORDER: Record<string, number> = {
  playera: 0, top: 0,
  pantalon: 1, bottom: 1,
  zapatos: 2, shoes: 2,
};

function ropaOrder(label: string) {
  const n = normalize(label);
  return ROPA_ORDER[n] ?? 99;
}

function isRopa(categoryId: string) {
  return ROPA_IDS.includes(normalize(categoryId));
}

function isNoQuitar(categoryId: string) {
  return NO_QUITAR_IDS.includes(normalize(categoryId));
}

function categoryLabel(cat: AvatarCategory) {
  return (cat as any).etiqueta_categoria || cat.id;
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
  const sortedCategories = [...categories].sort((a, b) => {
    const aLabel = categoryLabel(a);
    const bLabel = categoryLabel(b);
    const aRopa = isRopa(aLabel);
    const bRopa = isRopa(bLabel);
    if (aRopa && bRopa) return ropaOrder(aLabel) - ropaOrder(bLabel);
    if (aRopa && !bRopa) return -1;
    if (!aRopa && bRopa) return 1;
    return 0;
  });

  const currentCategory = categories.find((cat) => cat.id === selectedCategory);
  const selectedAsset = currentCategory ? selectedAssets[currentCategory.id] : undefined;
  const colorCategory = getPaletteCategory(selectedCategory);

  const currentPalette = palettes.find((p) =>
    sameCategory(p?.categoria, colorCategory) ||
    sameCategory(p?.nombre, colorCategory) ||
    sameCategory(p?.categoria, selectedCategory) ||
    sameCategory(p?.nombre, selectedCategory) ||
    sameCategory(p?.categoria, currentCategory?.id) ||
    sameCategory(p?.nombre, currentCategory?.id) ||
    sameCategory(p?.categoria, (currentCategory as any)?.etiqueta_categoria) ||
    sameCategory(p?.nombre, (currentCategory as any)?.etiqueta_categoria)
  );

  const paletteColors = getPaletteColors(currentPalette?.colores);
  const paletteCategory = currentPalette?.categoria || colorCategory;
  const selectedColor =
    selectedColors[paletteCategory] ||
    selectedColors[colorCategory] ||
    selectedColors[selectedCategory];

  const canShowColors = paletteColors.length > 0 && canPaintAsset(selectedCategory, selectedAsset);

  return (
    <div className="flex flex-col h-full">

      {/* ── Header label ── */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-border">
        <p className="font-black text-sm text-foreground">Personalizar</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">Elige categoría y estilo</p>
      </div>

      {/* ── Category strip ── */}
      <div className="flex-shrink-0 px-3 pt-3 pb-2 border-b border-border">
        <p className="text-muted-foreground text-[9px] font-black tracking-widest mb-2">CATEGORÍA</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {sortedCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-vcf-orange text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {(cat as any).etiqueta_categoria || cat.id}
            </button>
          ))}
        </div>
      </div>

      {/* ── Asset grid ── */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3">
        <p className="text-muted-foreground text-[9px] font-black tracking-widest mb-2.5">ESTILO</p>
        <div className="grid grid-cols-4 gap-1.5">
          {currentCategory &&
            selectedAssets[currentCategory.id] &&
            !isNoQuitar(categoryLabel(currentCategory)) && (
            <button
              type="button"
              onClick={() => onRemoveAsset(currentCategory.id)}
              className="h-[58px] rounded-xl border border-red-300/50 bg-red-50 dark:bg-red-500/10 text-red-400 font-black text-[10px] cursor-pointer hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
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
                className={`h-[58px] rounded-xl border-2 bg-muted p-1 transition-all cursor-pointer ${
                  isSelected
                    ? "border-vcf-orange shadow-md shadow-vcf-orange/15"
                    : "border-border hover:border-vcf-orange/50"
                }`}
              >
                {asset.thumbnail ? (
                  <img
                    src={asset.thumbnail}
                    alt=""
                    className="w-full h-full object-cover rounded-lg"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    GLB
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Color palette (pinned bottom) ── */}
      {canShowColors && (
        <div className="flex-shrink-0 px-3 py-3 border-t border-border">
          <p className="text-muted-foreground text-[9px] font-black tracking-widest mb-2">COLOR</p>
          <div className="flex flex-wrap gap-2">
            {paletteColors.map((color: string) => (
              <button
                key={color}
                type="button"
                onClick={() => onSelectColor(colorCategory, color)}
                style={{ backgroundColor: color }}
                className={`w-6 h-6 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedColor === color
                    ? "scale-110 border-vcf-orange shadow-md"
                    : "border-border hover:border-vcf-orange/60 hover:scale-105"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
