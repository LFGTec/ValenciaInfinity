import React from "react";
import { Eye, MessageSquare } from "lucide-react";
import newsImage1 from "../../assets/Noticia4.png";
import newsImage2 from "../../assets/Noticia5.png";
import newsImage3 from "../../assets/Noticia6.png";

export function NewsPage({
  setCurrentPage,
}: {
  setCurrentPage: (page: string) => void;
}) {
  const newsImages = [newsImage1, newsImage2, newsImage3];

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12 bg-content">
      <div className="mb-8">
        <h1 className="text-5xl font-black mb-3 text-foreground">
          NOTICIAS
        </h1>
        <p className="text-base text-muted-foreground">
          Toda la actualidad del Valencia CF
        </p>
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {[
          "TODAS",
          "EQUIPO",
          "FICHAJES",
          "PARTIDOS",
          "CANTERA",
          "CLUB",
        ].map((cat) => (
          <button
            key={cat}
            className={`px-6 py-3 rounded-lg font-bold whitespace-nowrap transition-all text-base ${
              cat === "TODAS"
                ? "bg-vcf-orange text-white"
                : "bg-card border-2 border-border hover:border-vcf-orange text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 9 }).map((_, i) => {
          const category =
            i % 3 === 0
              ? "EQUIPO"
              : i % 3 === 1
                ? "PARTIDO"
                : "CLUB";
          const backgroundImage =
            newsImages[i % newsImages.length];

          return (
            <article key={i} className="group cursor-pointer">
              <div className="relative h-64 bg-muted rounded-xl overflow-hidden mb-4 shadow-md hover:shadow-lg transition-all">
                <img
                  src={backgroundImage}
                  alt={`Noticia ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <span className="absolute top-4 left-4 bg-vcf-orange text-white px-3 py-1 rounded font-black shadow-md text-sm">
                  {category}
                </span>
              </div>
              <h3 className="font-black text-base mb-3 group-hover:text-vcf-orange transition-colors text-foreground leading-snug">
                Título de la noticia importante del Valencia CF
                #{i + 1}
              </h3>
              <p className="text-muted-foreground mb-3 text-sm leading-relaxed">
                Descripción breve de la noticia para dar
                contexto al lector sobre el contenido del
                artículo.
              </p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>Hace {i + 1} horas</span>
                <span className="text-vcf-orange">•</span>
                <span className="flex items-center gap-1">
                  <Eye size={15} className="text-vcf-blue" />{" "}
                  {1000 - i * 50}
                </span>
                <span className="text-vcf-orange">•</span>
                <span className="flex items-center gap-1">
                  <MessageSquare
                    size={15}
                    className="text-vcf-blue"
                  />{" "}
                  {50 - i * 3}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <button className="px-8 py-4 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-lg hover:shadow-xl hover:scale-105 text-base">
          CARGAR MÁS NOTICIAS
        </button>
      </div>
    </div>
  );
}