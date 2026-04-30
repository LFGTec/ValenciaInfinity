import { useEffect, useState } from "react";
import {
  getAvatarCategories,
  getAvatarPalettes,
  saveFullUserAvatar,
  type AvatarCategory,
  type AvatarAsset,
} from "../../../services/avatarService";

import { supabase } from "../../../services/supabaseClient";
import { AvatarCanvas } from "./AvatarCanvas";
import { AvatarControls } from "./AvatarControls";

type ToastType = {
  type: "success" | "error";
  title: string;
  message: string;
};

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

        setCategories(data);
        setPalettes(paletteData);

        if (data.length > 0) {
          setSelectedCategory(data[0].id);

          const initialAssets: Record<string, AvatarAsset> = {};
          const initialColors: Record<string, string> = {};

          data.forEach((cat) => {
            if (cat.assets.length > 0 && !cat.removable) {
              initialAssets[cat.id] = cat.assets[0];
            }
          });

          paletteData.forEach((palette: any) => {
            if (palette?.categoria && palette?.colores?.length > 0) {
              initialColors[palette.categoria] = palette.colores[0];
            }
          });

          setSelectedAssets(initialAssets);
          setSelectedColors(initialColors);
        }
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
        const shouldRemove = cat.removable && Math.random() < 0.35;

        if (!shouldRemove) {
          const randomIndex = Math.floor(Math.random() * cat.assets.length);
          randomAssets[cat.id] = cat.assets[randomIndex];
        }
      }

      const palette = palettes.find(
        (p) => p.categoria?.toLowerCase() === cat.id?.toLowerCase()
      );

      if (palette?.colores?.length > 0) {
        const randomColorIndex = Math.floor(Math.random() * palette.colores.length);
        randomColors[palette.categoria] = palette.colores[randomColorIndex];
      }
    });

    setSelectedAssets(randomAssets);
    setSelectedColors(randomColors);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("No hay usuario logeado:", error);

        showToast({
          type: "error",
          title: "ERROR",
          message: "Necesitas iniciar sesión para guardar tu avatar",
        });

        return;
      }

      await saveFullUserAvatar({
        userId: user.id,
        selectedAssets,
        selectedColors,
      });

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