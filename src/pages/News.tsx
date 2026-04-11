import NewsList from "../components/NewsList";

function News() {
  return (
    <div className="news-page">
      <h1 className="news-page-title">
        Últimas <span>Noticias</span>
      </h1>

      <NewsList />
    </div>
  );
}

export default News;
