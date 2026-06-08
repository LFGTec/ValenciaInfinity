import { useState } from "react";
import NewsList from "../components/NewsList";
import type { Categoria } from "@/hooks/useNoticias";

export function News() {
  const [selectedCategory, setSelectedCategory] = useState<Categoria>("TODAS");
  const [visibleCount, setVisibleCount] = useState(9);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <section className="min-h-screen max-w-[1400px] mx-auto px-4 py-12 bg-content">
      <div>
        <div className="mb-8">
          <h1 className="text-5xl font-black mb-3 text-foreground">NOTICIAS</h1>
          <p className="text-base text-muted-foreground">
            Toda la actualidad del Valencia CF
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex gap-3 overflow-x-auto pb-1 flex-1">
            {["TODAS", "EQUIPO", "FICHAJES", "PARTIDOS", "CANTERA", "CLUB"].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat as Categoria);
                    setVisibleCount(9);
                  }}
                  className={`px-6 py-3 rounded-lg font-bold whitespace-nowrap transition-all text-base ${
                    selectedCategory === cat
                      ? "bg-vcf-orange text-white"
                      : "bg-card border-2 border-border hover:border-vcf-orange text-foreground"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>

        <div className="news-list-spacing">
          <NewsList 
            category={selectedCategory} 
            visibleCount={visibleCount}
            onLoadMore={handleLoadMore}
          />
        </div>

        
      </div>
    </section>
  );
}