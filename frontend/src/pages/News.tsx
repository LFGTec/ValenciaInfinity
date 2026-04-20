import { useState } from "react";
import NewsList from "../components/NewsList";
import type { Categoria } from "@/hooks/useNoticias";

const CATEGORIAS: Categoria[] = ["TODAS", "EQUIPO", "FICHAJES", "PARTIDOS", "CANTERA", "CLUB"];
const STEP = 6;

export function News() {
  const [activeFilter, setActiveFilter] = useState<Categoria>("TODAS");
  const [visibleCount, setVisibleCount] = useState(STEP);

  function handleFilter(cat: Categoria) {
    setActiveFilter(cat);
    setVisibleCount(STEP);
  }

  return (
    <section className="min-h-screen bg-background text-foreground">
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="mb-6">
          <h1 className="text-[45px] font-black leading-none text-foreground mb-3.5">
            NOTICIAS
          </h1>
          <p className="text-base text-muted-foreground mb-7">
            Toda la actualidad del Valencia CF
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`px-6 py-3 rounded-[10px] text-base font-bold cursor-pointer border-2 whitespace-nowrap transition-all duration-300 ${
                activeFilter === cat
                  ? "bg-[#ff671f] border-[#ff671f] text-white"
                  : "bg-card text-foreground border-border hover:border-[#ff671f] hover:text-[#ff671f]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-2.5">
          <NewsList
            category={activeFilter}
            visibleCount={visibleCount}
            onLoadMore={() => setVisibleCount((n) => n + STEP)}
          />
        </div>
      </div>
    </section>
  );
}
