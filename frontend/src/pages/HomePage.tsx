import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getRanking, type Ranking } from "@/services/rankingService";
import { useNoticias } from "@/hooks/useNoticias";
import {
  Video,
  Clock,
  Users,
  ArrowRight,
  Gamepad2,
  Ticket,
} from "lucide-react";

import stadiumImage from "../assets/EquipoVF.png";
import matchRoomBgImage from "../assets/Vivelospartidos.png";
import card1 from "../assets/CartaAmarilla.png";
import card2 from "../assets/CartaAzul.png";
import card3 from "../assets/CartaRoja.png";
import card4 from "../assets/CartaVerde.png";
import avatar1 from "../assets/Avatar1.png";
import avatar2 from "../assets/Avatar2.png";
import avatar3 from "../assets/Avatar3.png";

const fallbackImage =
  "https://images.unsplash.com/photo-1543357480-c60d40007a3f?auto=format&fit=crop&w=1200&q=80";

export default function HomePage() {
  const [ranking, setRanking] = useState<Ranking[]>([]);
  const [rankingLoading, setRankingLoading] = useState(true);
  const navigate = useNavigate();
  const { noticias: news, cargando: newsLoading } = useNoticias();

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const fetchedData = await getRanking();
        setRanking(fetchedData ?? []);
      } catch (error) {
        console.error("Error cargando ranking:", error);
        setRanking([]);
      } finally {
        setRankingLoading(false);
      }
    };

    fetchRanking();
  }, []);

  return (
    <div className="bg-content">
      {/* Hero Section */}
      <section className="relative">
        <div className="h-[450px] md:h-[500px] flex items-center justify-center relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${stadiumImage})` }}
          />

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
              VS REAL MADRID
            </p>

            <div className="flex items-center justify-center gap-2 md:gap-4 mb-6">
              {[
                { v: "02", l: "DÍAS" },
                { v: "14", l: "HORAS" },
                { v: "35", l: "MIN" },
                { v: "22", l: "SEG" },
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

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/game"
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
                    whileHover={{ scale: 1.015, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                  >
                    <img
                      src={item.imagen || fallbackImage}
                      alt={item.titulo}
                      className="absolute inset-0 w-full h-full object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.05] group-hover:brightness-105"
                      onError={(e) => { e.currentTarget.src = fallbackImage; }}
                    />

                    {/* Shine sweep */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-20deg]" />
                    </div>

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                    {/* Category badge */}
                    <span className="absolute top-3 left-3 bg-[#ff671f] text-white px-3 py-[6px] rounded-md text-xs font-black uppercase z-[2] transition-[background,box-shadow,transform] duration-300 group-hover:bg-[#e55a18] group-hover:shadow-[0_4px_12px_rgba(255,103,31,0.55)] group-hover:scale-105">
                      {item.categoria}
                    </span>

                    {/* Bottom accent bar */}
                    <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-[#ff671f] to-[#ffdf1b] group-hover:w-full transition-all duration-500 ease-out z-[3]" />

                    {/* Text at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-[2]">
                      <h2 className={`font-black text-white leading-tight mb-2 transition-colors duration-300 group-hover:text-[#ff9a5c] ${isFeatured ? "text-xl md:text-2xl" : "text-sm md:text-base line-clamp-2"}`}>
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
                to="/game"
                className="inline-flex px-8 py-4 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-lg hover:shadow-xl hover:scale-105 items-center gap-2"
              >
                <Video size={20} />
                CREAR MI ROOM AHORA
              </Link>
            </div>
          </div>
        </section>

        {/* Trivias */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              DESAFÍOS <span className="text-foreground">ACTIVOS</span>
            </h2>

            <Link
              to="/game"
              className="flex items-center gap-2 text-sm font-bold text-vcf-blue hover:text-vcf-orange hover:gap-3 transition-all"
            >
              VER TODOS <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Quiz de la Semana",
                reward: "+50 PTS",
                time: "2 días",
                participants: "856",
                color: "from-vcf-orange to-vcf-yellow",
                iconColor: "text-[#ff671f]",
              },
              {
                title: "Predice el Resultado",
                reward: "+100 PTS",
                time: "1 día",
                participants: "1,234",
                color: "from-vcf-blue to-vcf-orange",
                iconColor: "text-[#ff671f]",
              },
              {
                title: "Trivia Histórica",
                reward: "+75 PTS",
                time: "5 días",
                participants: "634",
                color: "from-white to-white",
                iconColor: "text-[#ff671f]",
              },
            ].map((challenge, i) => (
              <div
                key={i}
                className="bg-card border-2 border-border rounded-lg p-6 hover:border-vcf-orange hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${challenge.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}
                  >
                    <Gamepad2 size={24} className={challenge.iconColor} />
                  </div>

                  <span className="bg-[#ff671f] text-white px-3 py-1 rounded-full text-xs font-black shadow-md">
                    {challenge.reward}
                  </span>
                </div>

                <h3 className="font-black text-xl mb-2 group-hover:text-vcf-orange transition-colors text-foreground">
                  {challenge.title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Clock size={14} className="text-foreground" />{" "}
                    {challenge.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={14} className="text-vcf-blue" />{" "}
                    {challenge.participants}
                  </span>
                </div>

                <Link
                  to="/game"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-card rounded-xl p-8 shadow-lg border-2 border-vcf-orange">
            <div>
              <h2 className="text-4xl font-black mb-4 text-foreground">
                COMPLETA TU <span className="text-vcf-orange">ÁLBUM</span> DE
                CARTAS
              </h2>

              <p className="text-lg text-muted-foreground mb-6">
                Colecciona cartas de jugadores, leyendas y momentos históricos.
              </p>

              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-black text-foreground">
                    Tu Progreso
                  </span>
                  <span className="font-black text-vcf-orange">
                    145/200 (72%)
                  </span>
                </div>

                <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-vcf-orange to-vcf-yellow"
                    style={{ width: "72%" }}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Link
                  to="/fanzone"
                  className="px-8 py-4 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-md hover:shadow-lg hover:scale-105"
                >
                  ABRIR SOBRES
                </Link>

                <Link
                  to="/fanzone"
                  className="px-8 py-4 bg-white border-2 border-white text-vcf-orange rounded-lg font-black hover:bg-gray-100 hover:border-gray-100 transition-all shadow-md hover:shadow-lg hover:scale-105"
                >
                  VER ÁLBUM
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[card1, card2, card3, card4, card1, card2].map((cardImg, i) => (
                <Link
                  key={i}
                  to="/fanzone"
                  className="aspect-[2/3] rounded-lg shadow-lg transform hover:scale-105 transition-transform cursor-pointer overflow-hidden"
                >
                  <img
                    src={cardImg}
                    alt={`Carta ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Rankings Preview */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              RANKING <span className="text-vcf-orange">SEMANAL</span>
            </h2>

            <Link
              to="/fanzone"
              className="flex items-center gap-2 text-sm font-bold text-vcf-orange hover:text-vcf-blue hover:gap-3 transition-all"
            >
              VER COMPLETO <ArrowRight size={16} />
            </Link>
          </div>

          <Link
            to="/fanzone"
            className="block bg-card border-2 border-vcf-orange rounded-lg overflow-hidden cursor-pointer hover:border-vcf-yellow hover:shadow-2xl transition-all"
          >
            {rankingLoading ? (
              <div className="p-8 text-center text-muted-foreground font-bold">
                Cargando ranking...
              </div>
            ) : ranking.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground font-bold">
                No hay datos de ranking disponibles.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-4 px-6 pt-6 pb-2 bg-gradient-to-b from-vcf-yellow/20 to-transparent border-b-2 border-vcf-orange items-end">
                  {[1, 0, 2].map((rankIndex) => {
                    const user = ranking[rankIndex];
                    if (!user) return null;
                    const place = rankIndex + 1;
                    const colors = [
                      "bg-vcf-yellow",
                      "bg-gray-300",
                      "bg-amber-600",
                    ];
                    const avatars = [avatar1, avatar2, avatar3];
                    const podiumMb = ["mb-8", "mb-4", "mb-0"];
                    const badgeSize =
                      rankIndex === 0
                        ? "w-20 h-20 text-2xl"
                        : "w-16 h-16 text-xl";
                    const imgSize = rankIndex === 0 ? "w-16 h-16" : "w-12 h-12";

                    return (
                      <div
                        key={user.id}
                        className={`text-center ${podiumMb[rankIndex]}`}
                      >
                        <div
                          className={`${badgeSize} mx-auto rounded-full mb-3 flex items-center justify-center shadow-lg ${colors[rankIndex]} text-white`}
                        >
                          <span className="font-black">{place}</span>
                        </div>

                        <img
                          src={avatars[rankIndex]}
                          alt={user.fan_nombre}
                          className={`${imgSize} rounded-full mx-auto mb-2 shadow-md object-cover`}
                        />

                        <div className="font-black mb-1 text-foreground text-sm">
                          {user.fan_nombre}
                        </div>

                        <div className="text-sm text-vcf-orange font-bold">
                          {user.puntos} pts
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="divide-y divide-border">
                  {ranking.slice(3, 10).map((user, i) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 hover:bg-vcf-yellow/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-vcf-orange/20 rounded-full flex items-center justify-center font-black text-vcf-orange">
                          {i + 4}
                        </div>

                        <div className="w-10 h-10 bg-gradient-to-br from-vcf-orange to-vcf-yellow rounded-full" />

                        <div>
                          <div className="font-black text-foreground">
                            {user.fan_nombre}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Nivel {user.nivel}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-black text-foreground">
                          {user.puntos} pts
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Link>
        </section>
      </div>
    </div>
  );
}
