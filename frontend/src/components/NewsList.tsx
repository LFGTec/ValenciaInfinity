import { useNoticias } from "@/hooks/useNoticias";
import type { Categoria } from "@/hooks/useNoticias";

const fallbackImage =
  "https://images.unsplash.com/photo-1543357480-c60d40007a3f?auto=format&fit=crop&w=1200&q=80";

type Props = {
  category: Categoria;
  visibleCount: number;
  onLoadMore: () => void;
};

export default function NewsList({ category, visibleCount, onLoadMore }: Props) {
  const { noticias, cargando, error } = useNoticias();

  if (cargando) return <p className="text-foreground text-lg mt-5">Cargando noticias...</p>;
  if (error) return <p className="text-foreground text-lg mt-5">Error: {error}</p>;

  const filtradas =
    category === "TODAS"
      ? noticias
      : noticias.filter((n) => n.categoria === category);

  const visibles = filtradas.slice(0, visibleCount);
  const hayMas = visibleCount < filtradas.length;

  return (
    <>
      {filtradas.length === 0 ? (
        <p className="text-foreground text-lg mt-5">No hay noticias en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[30px] items-start">
          {visibles.map((item) => (
            <article
              key={item.url}
              className="relative flex flex-col cursor-pointer group transition-transform duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-2"
            >
              <div className="relative w-full h-[240px] md:h-[260px] rounded-[18px] overflow-hidden mb-[22px] bg-card shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-shadow duration-[350ms] group-hover:shadow-[0_16px_48px_rgba(255,103,31,0.25),0_8px_24px_rgba(0,0,0,0.2)]">
                <img
                  src={item.imagen || fallbackImage}
                  alt={item.titulo}
                  className="w-full h-full object-cover object-top block transition-[transform,filter] duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] brightness-100 saturate-[1.05] group-hover:scale-[1.07] group-hover:brightness-105 group-hover:saturate-110"
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

                <span className="absolute top-[18px] left-[18px] bg-[#ff671f] text-white px-4 py-[10px] rounded-lg text-sm font-black leading-none z-[2] uppercase transition-[background,box-shadow] duration-300 group-hover:bg-[#e55a18] group-hover:shadow-[0_4px_12px_rgba(255,103,31,0.45)]">
                  {item.categoria}
                </span>
              </div>

              <div className="flex flex-col gap-[14px]">
                <h2 className="text-[18px] md:text-xl font-black leading-[1.35] text-foreground m-0 transition-colors duration-300 group-hover:text-[#ff671f]">
                  {item.titulo}
                </h2>

                <p className="text-[15px] md:text-base leading-[1.65] text-muted-foreground m-0 mb-[18px] break-words">
                  {item.descripcion}
                </p>

                <div className="flex items-center gap-[10px] flex-wrap text-[15px] text-muted-foreground">
                  <span>
                    {new Date(item.fechaPublicacion).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>

                  <span className="text-[#ff671f]">•</span>

                  <span className="flex items-center gap-[5px] text-[#00a3e0]">
                    {item.fuente}
                  </span>

                  <span className="text-[#ff671f]">•</span>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-[5px] text-[#00a3e0]"
                  >
                    Leer más
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {hayMas && (
        <div className="text-center mt-12">
          <button
            className="bg-[#ff671f] text-white border-2 border-[#ff671f] px-8 py-[14px] rounded-[10px] text-lg font-extrabold cursor-pointer transition-all duration-300 hover:bg-[#e05516] hover:border-[#e05516]"
            onClick={onLoadMore}
          >
            Ver más noticias
          </button>
        </div>
      )}
    </>
  );
}
