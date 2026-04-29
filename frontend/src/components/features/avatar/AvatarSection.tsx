import { useEffect, useState } from "react";
import {
  getAvatarCategories,
  type AvatarCategory,
  type AvatarAsset,
} from "../../../services/avatarService";

import { AvatarCanvas } from "./AvatarCanvas";
import { AvatarControls } from "./AvatarControls";

export function AvatarSection() {
  const [categories, setCategories] = useState<AvatarCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<Record<string, AvatarAsset>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAvatar() {
      try {
        const data = await getAvatarCategories();
        setCategories(data);

        if (data.length > 0) {
          setSelectedCategory(data[0].id);

          const initial: Record<string, AvatarAsset> = {};

          data.forEach((cat) => {
            if (cat.assets.length > 0 && !cat.removable) {
              initial[cat.id] = cat.assets[0];
            }
          });

          setSelectedAssets(initial);
        }
      } catch (error) {
        console.error("Error cargando avatar:", error);
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

  return (
    <section className="relative mt-12 mb-12 h-[760px] overflow-hidden rounded-2xl bg-[#120f2b] shadow-2xl border-4 border-black">
      {loading ? (
        <div className="flex h-full items-center justify-center text-white font-black">
          Cargando avatar...
        </div>
      ) : (
        <>
          <AvatarCanvas selectedAssets={selectedAssets} />

          <div className="absolute right-10 top-10 z-30 flex gap-3">
            <button
              type="button"
              className="rounded-xl bg-white px-5 py-4 font-black text-vcf-orange shadow-lg"
            >
              ↻
            </button>

            <button
              type="button"
              className="rounded-xl bg-vcf-orange px-7 py-4 font-black text-white shadow-lg"
            >
              Guardar
            </button>
          </div>

          <AvatarControls
            categories={categories}
            selectedCategory={selectedCategory}
            selectedAssets={selectedAssets}
            onSelectCategory={setSelectedCategory}
            onSelectAsset={handleSelectAsset}
            onRemoveAsset={handleRemoveAsset}
          />
        </>
      )}
    </section>
  );
}