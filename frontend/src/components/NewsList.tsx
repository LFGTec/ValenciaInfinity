import { useEffect, useState } from "react";
import { getNews } from "../services/newsService";
import type { News } from "../services/newsService";

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

  if (loading) return <p>Cargando noticias...</p>;

  return (
    <div className="news-grid">
      {news.map((item) => (
        <div key={item.id} className="news-card">
          <h2 className="news-title">{item.titulo}</h2>

          <p className="news-content">{item.contenido}</p>

          <div className="news-footer">
            <span className="news-author">{item.autor}</span>
            <span className="news-views">👁 {item.vistas}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
