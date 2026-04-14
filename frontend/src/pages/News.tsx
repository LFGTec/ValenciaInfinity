import NewsList from "../components/NewsList";

export function News() {
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
                className={`news-filter-btn ${index === 0 ? "active" : ""}`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        <div className="news-list-spacing">
          <NewsList category="TODAS" />
        </div>

        <div className="news-load-more-container">
          <button className="news-load-more-btn">CARGAR MÁS NOTICIAS</button>
        </div>
      </div>
    </section>
  );
}