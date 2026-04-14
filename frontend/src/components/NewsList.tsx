import { useEffect, useState } from "react";
import { Eye, MessageSquare } from "lucide-react";
import { getNews } from "../services/newsService";
import type { News } from "../services/newsService";

const fallbackImage =
  "https://images.unsplash.com/photo-1543357480-c60d40007a3f?auto=format&fit=crop&w=1200&q=80";

export default function NewsList() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const data = await getNews();
      setNews(data);
      setLoading(false);
    };

    fetchNews();
  }, []);

  if (loading) return <p className="news-loading">Cargando noticias...</p>;

  return (
    <div className="news-grid">
      {news.map((item, i) => (
        <article key={item.id} className="news-card">
          <div className="news-image-wrapper">
            <img
              src={item.imagen || fallbackImage}
              alt={item.titulo}
              className="news-card-image"
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
            />

            <div className="news-image-overlay"></div>

            <span className="news-category-badge">
              {item.categoria || (i % 3 === 0 ? "EQUIPO" : i % 3 === 1 ? "PARTIDO" : "CLUB")}
            </span>
          </div>

          <div className="news-card-body">
            <h2 className="news-card-title">{item.titulo}</h2>

            <p className="news-card-content">{item.contenido}</p>

            <div className="news-card-footer">
              <span className="news-card-date">
                {item.fecha || `Hace ${i + 1} horas`}
              </span>

              <span className="news-dot">•</span>

              <span className="news-card-views">
                <Eye size={15} />
                {item.vistas ?? 0}
              </span>

              <span className="news-dot">•</span>

              <span className="news-card-comments">
                <MessageSquare size={15} />
                {item.comentarios ?? 0}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}