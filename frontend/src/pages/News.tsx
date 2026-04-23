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
    <section className="news-page-wrapper">
      <div className="news-page-container">
        <div className="news-header">
          <h1 className="news-main-title">NOTICIAS</h1>
          <p className="news-main-subtitle">
            Toda la actualidad del Valencia CF
          </p>
        </div>

        <div className="news-filters">
          {["TODAS", "EQUIPO", "FICHAJES", "PARTIDOS", "CANTERA", "CLUB"].map(
            (cat, index) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat as Categoria);
                  setVisibleCount(9);
                }}
                className={`news-filter-btn ${selectedCategory === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            )
          )}
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