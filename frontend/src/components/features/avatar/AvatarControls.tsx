import type {
  AvatarCategory,
  AvatarAsset,
} from "../../../services/avatarService";

type Props = {
  categories?: AvatarCategory[];
  selectedCategory?: string;
  selectedAssets?: Record<string, AvatarAsset>;
  onSelectCategory?: (categoryId: string) => void;
  onSelectAsset?: (categoryId: string, asset: AvatarAsset) => void;
  onRemoveAsset?: (categoryId: string) => void;
};

export function AvatarControls({
  categories = [],
  selectedCategory = "",
  selectedAssets = {},
  onSelectCategory = () => {},
  onSelectAsset = () => {},
  onRemoveAsset = () => {},
}: Props) {
  const currentCategory = categories.find((cat) => cat.id === selectedCategory);

  return (
    <div className="absolute bottom-0 left-1/2 z-30 w-[88%] -translate-x-1/2 rounded-t-2xl bg-black/45 backdrop-blur-md px-6 pt-6 pb-0">
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
            {cat.id}
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
              <div className="flex h-full flex-col items-center justify-center">
                <span className="text-xs opacity-70">GLB</span>
                <span className="mt-2 text-xs font-black leading-tight">
                  {asset.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2">
        <button
          type="button"
          className="bg-vcf-orange py-5 text-center text-lg font-black text-white"
        >
          Customizar avatar
        </button>

        <button
          type="button"
          className="bg-white py-5 text-center text-lg font-black text-vcf-orange"
        >
          Visualizacion
        </button>
      </div>
    </div>
  );
}