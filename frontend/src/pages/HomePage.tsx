import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getTrivias, type Trivia } from "@/services/triviasService";
import { useNoticias } from "@/hooks/useNoticias";
import {
  Video,
  Clock,
  Users,
  ArrowRight,
  Gamepad2,
  Ticket,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

import matchRoomBgImage from "../assets/Vivelospartidos.png";
import { usePartidosVCF } from "@/hooks/usePartidosVCF";
import { useSeasonStatus } from "@/hooks/useSeasonStatus";
import { useAlbumProgress } from "@/hooks/useAlbumProgress";
import { AlbumProgressBar } from "@/components/AlbumProgress";

import { RankingPreview } from "@/components/RankingPreview";
import { useRanking } from "@/hooks/useRanking";

const fallbackImage =
  "https://images.unsplash.com/photo-1543357480-c60d40007a3f?auto=format&fit=crop&w=1200&q=80";

export default function HomePage() {
  const [homeTrivias, setHomeTrivias] = useState<Trivia[]>([]);
  const [triviasLoading, setTriviasLoading] = useState(true);

  const [countdown, setCountdown] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
  });

  const navigate = useNavigate();
  const { noticias: news, cargando: newsLoading } = useNoticias();
  const { proximos } = usePartidosVCF();

  // Temporizador fuera de temporada
  const { season } = useSeasonStatus();
  const inSeason = season?.in_season ?? true;
  const [seasonCountdown, setSeasonCountdown] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
  });
  const seasonTarget = season?.in_season ? null : season?.next_season_start;
  const { user } = useAuth(); // ya lo tienes
  const { obtained, total, missing, duplicated, progress } = useAlbumProgress(user?.id);

  useEffect(() => {
    if (!seasonTarget) return;

    const target = new Date(seasonTarget).getTime();

    const tick = () => {
      const diff = target - Date.now();

      if (diff <= 0) {
        setSeasonCountdown({
          dias: 0,
          horas: 0,
          minutos: 0,
          segundos: 0,
        });
        return;
      }

      setSeasonCountdown({
        dias: Math.floor(diff / 86_400_000),
        horas: Math.floor((diff % 86_400_000) / 3_600_000),
        minutos: Math.floor((diff % 3_600_000) / 60_000),
        segundos: Math.floor((diff % 60_000) / 1_000),
      });
    };

    tick();
    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  }, [seasonTarget]);

  const partidoDestacado = proximos[0];

  const showMatch = inSeason && !!partidoDestacado;
  const showSeason = !inSeason;
  const { ranking, rankingLoading } = useRanking();

  useEffect(() => {
    if (!showMatch || !partidoDestacado) return;

    const horaStr = partidoDestacado.hora.replace("h", "");
    const [hh, mm] = horaStr.split(":").map(Number);

    const fechaPartido = new Date(
      partidoDestacado.anio,
      partidoDestacado.mes,
      partidoDestacado.dia,
      hh,
      mm,
    );

    const calcular = () => {
      const diff = fechaPartido.getTime() - Date.now();

      if (diff <= 0) {
        setCountdown({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
        return;
      }

      setCountdown({
        dias: Math.floor(diff / 86_400_000),
        horas: Math.floor((diff % 86_400_000) / 3_600_000),
        minutos: Math.floor((diff % 3_600_000) / 60_000),
        segundos: Math.floor((diff % 60_000) / 1_000),
      });
    };

    calcular();

    const id = setInterval(calcular, 1000);

    return () => clearInterval(id);
  }, [partidoDestacado]);

  useEffect(() => {
    const fetchHomeTrivias = async () => {
      try {
        setTriviasLoading(true);

        const data = await getTrivias();

        setHomeTrivias(data.slice(0, 3));
      } catch (error) {
        console.error("Error cargando trivias:", error);
        setHomeTrivias([]);
      } finally {
        setTriviasLoading(false);
      }
    };

    fetchHomeTrivias();
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);

    if (isNaN(d.getTime())) return dateStr;

    return d.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getTriviaCountdown = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now();

    if (diff <= 0) return "Expirada";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-content">
      {/* Hero Section */}
      <section className="relative">
        <div className="h-[450px] md:h-[500px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-black bg-center scale-105" />

          <div className="absolute inset-0 bg-black/60" />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 40%, rgba(238,53,36,0.18) 65%, rgba(0,0,0,0.75) 100%)",
            }}
          />

          <div
            className="absolute bottom-0 left-0 w-full h-1"
            style={{
              background: "linear-gradient(90deg, #EE3524, #FFDF1B, #EE3524)",
            }}
          />

          <div className="max-w-[1600px] mx-auto px-4 z-10 text-white text-center">
            <h1 className="text-5xl md:text-6xl font-black mb-3 tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              VALENCIA CF
            </h1>

            <p className="text-base md:text-lg mb-6 font-bold text-vcf-orange uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              {showMatch
                ? partidoDestacado
                  ? `VS ${partidoDestacado.rival.toUpperCase()}`
                  : "PRÓXIMO PARTIDO"
                : "INICIO DE TEMPORADA"}
            </p>

            {showMatch ? (
              <div className="flex items-center justify-center gap-2 md:gap-4 mb-6">
                {[
                  { v: String(countdown.dias).padStart(2, "0"), l: "DÍAS" },
                  { v: String(countdown.horas).padStart(2, "0"), l: "HORAS" },
                  { v: String(countdown.minutos).padStart(2, "0"), l: "MIN" },
                  { v: String(countdown.segundos).padStart(2, "0"), l: "SEG" },
                ].map((t, i, arr) => (
                  <div key={i} className="flex items-center gap-2 md:gap-4">
                    <div className="text-center bg-black/60 backdrop-blur-sm border border-white/20 px-3 md:px-6 py-3 md:py-4 rounded-xl shadow-lg">
                      <div className="text-2xl md:text-3xl font-black text-[#ff671f] drop-shadow-md">
                        {t.v}
                      </div>

                      <div className="text-xs text-white/80 font-bold tracking-widest mt-1">
                        {t.l}
                      </div>
                    </div>

                    {i < arr.length - 1 && (
                      <div className="text-xl md:text-2xl font-black text-vcf-yellow drop-shadow-md">
                        :
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              showSeason &&
              seasonCountdown && (
                <div className="flex items-center justify-center gap-2 md:gap-4 mb-6">
                  {[
                    {
                      v: String(seasonCountdown.dias).padStart(2, "0"),
                      l: "DÍAS",
                    },
                    {
                      v: String(seasonCountdown.horas).padStart(2, "0"),
                      l: "HORAS",
                    },
                    {
                      v: String(seasonCountdown.minutos).padStart(2, "0"),
                      l: "MIN",
                    },
                    {
                      v: String(seasonCountdown.segundos).padStart(2, "0"),
                      l: "SEG",
                    },
                  ].map((t, i, arr) => (
                    <div key={i} className="flex items-center gap-2 md:gap-4">
                      <div className="text-center bg-black/60 backdrop-blur-sm border border-white/20 px-3 md:px-6 py-3 md:py-4 rounded-xl shadow-lg">
                        <div className="text-2xl md:text-3xl font-black text-[#ff671f] drop-shadow-md">
                          {t.v}
                        </div>

                        <div className="text-xs text-white/80 font-bold tracking-widest mt-1">
                          {t.l}
                        </div>
                      </div>

                      {i < arr.length - 1 && (
                        <div className="text-xl md:text-2xl font-black text-vcf-yellow drop-shadow-md">
                          :
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/match-rooms"
                className="px-6 md:px-8 py-3 md:py-4 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 text-sm md:text-base"
              >
                <Video size={20} />
                <span>CREAR MATCH ROOM</span>
              </Link>

              <Link
                to="/shop"
                className="px-6 md:px-8 py-3 md:py-4 bg-white border-2 border-white text-vcf-orange rounded-lg font-black hover:bg-gray-100 hover:border-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 text-sm md:text-base"
              >
                <Ticket size={20} />
                <span>COMPRAR ENTRADAS</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 py-6 md:py-8">
        {/* Latest News */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              ÚLTIMAS <span className="text-vcf-orange">NOTICIAS</span>
            </h2>

            <Link
              to="/news"
              className="flex items-center gap-2 text-sm font-bold text-vcf-orange hover:text-vcf-blue hover:gap-3 transition-all"
            >
              VER TODAS <ArrowRight size={16} />
            </Link>
          </div>

          {newsLoading ? (
            <div className="text-center py-8 text-muted-foreground font-bold">
              Cargando noticias...
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground font-bold">
              No hay noticias disponibles.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[220px] md:auto-rows-[240px]">
              {news.slice(0, 6).map((item, i) => {
                const isFeatured = i === 0;

                return (
                  <motion.div
                    key={item.url}
                    onClick={() => navigate("/news")}
                    className={`relative rounded-[14px] overflow-hidden cursor-pointer group no-underline shadow-[0_4px_20px_rgba(0,0,0,0.18)] ${
                      isFeatured ? "md:col-span-2 md:row-span-2" : ""
                    }`}
                    whileHover={{
                      scale: 1.015,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      },
                    }}
                  >
                    <img
                      src={item.imagen || fallbackImage}
                      alt={item.titulo}
                      className="absolute inset-0 w-full h-full object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.05] group-hover:brightness-105"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                    />

                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-20deg]" />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                    <span className="absolute top-3 left-3 bg-[#ff671f] text-white px-3 py-[6px] rounded-md text-xs font-black uppercase z-[2] transition-[background,box-shadow,transform] duration-300 group-hover:bg-[#e55a18] group-hover:shadow-[0_4px_12px_rgba(255,103,31,0.55)] group-hover:scale-105">
                      {item.categoria}
                    </span>

                    <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-[#ff671f] to-[#ffdf1b] group-hover:w-full transition-all duration-500 ease-out z-[3]" />

                    <div className="absolute bottom-0 left-0 right-0 p-4 z-[2]">
                      <h2
                        className={`font-black text-white leading-tight mb-2 transition-colors duration-300 group-hover:text-[#ff9a5c] ${
                          isFeatured
                            ? "text-xl md:text-2xl"
                            : "text-sm md:text-base line-clamp-2"
                        }`}
                      >
                        {item.titulo}
                      </h2>

                      {isFeatured && (
                        <p className="text-sm text-white/75 mb-3 line-clamp-2 leading-relaxed">
                          {item.descripcion}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-xs text-white/60 flex-wrap">
                        <span>{formatDate(item.fechaPublicacion)}</span>
                        <span className="text-[#ff671f]">•</span>
                        <span className="text-[#4db8e8]">{item.fuente}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* Match Rooms CTA */}
        <section className="mb-8">
          <div className="bg-black text-white rounded-xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
            <img
              src={matchRoomBgImage}
              alt="Match Room Background"
              className="absolute inset-0 w-full h-full object-cover opacity-110"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/90" />

            <div className="relative z-10 max-w-2xl">
              <div className="inline-block bg-vcf-orange text-white px-3 py-1 rounded text-xs font-black mb-4 shadow-md">
                TENDENCIA
              </div>

              <h2 className="text-4xl font-black mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                VIVE LOS PARTIDOS CON TUS{" "}
                <span className="text-vcf-orange">AMIGOS</span>
              </h2>

              <p className="text-lg mb-6 opacity-90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                Crea tu Match Room y disfruta de la experiencia de ver el
                partido en tiempo real.
              </p>

              <Link
                to="/match-rooms"
                className="inline-flex px-8 py-4 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-lg hover:shadow-xl hover:scale-105 items-center gap-2"
              >
                <Video size={20} />
                CREAR MI ROOM AHORA
              </Link>
            </div>
          </div>
        </section>

        {/* Desafíos activos */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              DESAFÍOS <span className="text-vcf-orange">ACTIVOS</span>
            </h2>

            <Link
              to="/juego"
              className="flex items-center gap-2 text-sm font-bold text-vcf-orange hover:text-vcf-blue hover:gap-3 transition-all"
            >
              VER TODOS <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {triviasLoading && (
              <p className="text-muted-foreground font-bold">
                Cargando trivias...
              </p>
            )}

            {!triviasLoading && homeTrivias.length === 0 && (
              <p className="text-muted-foreground font-bold">
                No hay trivias activas por ahora.
              </p>
            )}

            {!triviasLoading &&
              homeTrivias.map((trivia) => (
                <div
                  key={trivia.id}
                  className="bg-card border-2 border-border rounded-lg p-6 hover:border-vcf-orange hover:shadow-xl transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-vcf-orange to-vcf-yellow rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                      <Gamepad2 size={24} className="text-[#ff671f]" />
                    </div>

                    <span className="bg-[#ff671f] text-white px-3 py-1 rounded-full text-xs font-black shadow-md">
                      +{trivia.reward} PTS
                    </span>
                  </div>

                  <h3 className="font-black text-xl mb-2 group-hover:text-vcf-orange transition-colors text-foreground">
                    {trivia.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {trivia.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock size={14} className="text-foreground" />
                      {getTriviaCountdown(trivia.expires_at)}
                    </span>

                    <span className="flex items-center gap-1">
                      <Users size={14} className="text-vcf-blue" />
                      {trivia.questions} preguntas
                    </span>
                  </div>

                  <Link
                    to="/trivias"
                    className="block text-center w-full py-3 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-md hover:shadow-lg hover:scale-105"
                  >
                    JUGAR AHORA
                  </Link>
                </div>
              ))}
          </div>
        </section>

        {/* Album CTA */}
        <section className="mb-8">
          <div className="bg-card rounded-xl p-8 shadow-lg border-2 border-vcf-orange">
            {/* Header — ancho completo */}
            <h2 className="text-4xl font-black mb-2 text-foreground">
              COMPLETA TU <span className="text-vcf-orange">ÁLBUM</span> DE
              CARTAS
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Colecciona cartas de jugadores, leyendas y momentos históricos.
            </p>

            {/* Progress bar — ancho completo */}
            <AlbumProgressBar
              obtained={obtained}
              total={total}
              missing={missing}
              duplicated={duplicated}
              progress={progress}
            />

            {/* Botones */}
            <div className="flex gap-4 mt-6">
              <Link
                to="/album"
                className="px-8 py-4 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] transition-all shadow-md hover:scale-105"
                onClick={() => window.scrollTo(0, 0)}
              >
                ABRIR SOBRES
              </Link>
              <Link
                to="/album?scroll=album-book"
                className="px-8 py-4 bg-card border-2 border-border text-vcf-orange rounded-lg font-black hover:bg-muted transition-all shadow-md hover:scale-105"
              >
                VER ÁLBUM
              </Link>
            </div>
          </div>
        </section>

        {/* Rankings Preview */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              RANKING <span className="text-vcf-orange">GLOBAL</span>
            </h2>

            <Link
              to="/trivias"
              className="flex items-center gap-2 text-sm font-bold text-vcf-orange hover:text-vcf-blue hover:gap-3 transition-all"
            >
              VER COMPLETO <ArrowRight size={16} />
            </Link>
          </div>

          <RankingPreview ranking={ranking} loading={rankingLoading} preview />
        </section>
      </div>
    </div>
  );
}
