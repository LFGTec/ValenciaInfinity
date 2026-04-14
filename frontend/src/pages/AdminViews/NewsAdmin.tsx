import { useState } from "react";
import NewsList from "../../components/NewsList";
import { addNews, uploadNewsImage } from "../../services/newsServiceAdmin";

function NewsAdmin() {
  const [selectedCategory, setSelectedCategory] = useState("TODAS");
  const [showAddForm, setShowAddForm] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const categories = ["TODAS", "EQUIPO", "FICHAJES", "PARTIDOS", "CANTERA", "CLUB"];

  const handleAddNews = async () => {
    if (!title || !content || !author || !category) {
      alert("Completa todos los campos");
      return;
    }

    try {
      let imageUrl: string | null = null;

      
      if (imageFile) {
        imageUrl = await uploadNewsImage(imageFile);
      }

      await addNews({
        titulo: title,
        contenido: content,
        autor: author,
        categoria: category,
        Imagen: imageUrl, 
        destacada: false,
        vistas: 0,
        published_at: null,
      });

      alert("Noticia guardada correctamente");

      setTitle("");
      setContent("");
      setAuthor("");
      setCategory("");
      setImageFile(null);
      setShowAddForm(false);

      window.location.reload();
    } catch (error) {
      console.error("Error al guardar noticia:", error);
      alert("No se pudo guardar la noticia");
    }
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

        <div className="news-admin-container">
          <button
            className="news-add-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            + AÑADIR NOTICIA
          </button>
        </div>

        <div className="news-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`news-filter-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {showAddForm && (
          <div className="news-add-form">
            <input
              type="text"
              placeholder="Título de la noticia"
              className="news-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Contenido de la noticia"
              className="news-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>

            <input
              type="text"
              placeholder="Autor"
              className="news-input"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />

            
            <input
              type="file"
              accept="image/*"
              className="news-input"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                }
              }}
            />

            <select
              className="news-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Selecciona una categoría</option>
              <option value="EQUIPO">EQUIPO</option>
              <option value="FICHAJES">FICHAJES</option>
              <option value="PARTIDOS">PARTIDOS</option>
              <option value="CANTERA">CANTERA</option>
              <option value="CLUB">CLUB</option>
            </select>

            <button className="news-submit-btn" onClick={handleAddNews}>
              GUARDAR NOTICIA
            </button>
          </div>
        )}

        <div className="news-list-spacing">
          <NewsList category={selectedCategory} />
        </div>

        <div className="news-load-more-container">
          <button className="news-load-more-btn">CARGAR MÁS NOTICIAS</button>
        </div>
      </div>
    </section>
  );
}

export default NewsAdmin;