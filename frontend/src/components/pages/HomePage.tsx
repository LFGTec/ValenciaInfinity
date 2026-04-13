import React, { use } from "react";
import { getRanking, type Ranking } from "@/services/rankingService";
import { useState, useEffect } from "react";
import {
  Video,
  Clock,
  Users,
  Star,
  Trophy,
  BookOpen,
  Award,
  ArrowRight,
  Eye,
  Gamepad2,
  Ticket,
  Image as ImageIcon,
} from "lucide-react";

import stadiumImage from "../../assets/EquipoVF.png";
import valenciaVictoryImage from "../../assets/Noticia1.png";
import newsImage1 from "../../assets/Noticia2.png";
import newsImage2 from "../../assets/Noticia3.png";
import newsImage3 from "../../assets/Noticia4.png";
import newsImage4 from "../../assets/Vivelospartidos.png";
import matchRoomBgImage from "../../assets/Vivelospartidos.png";
import card1 from "../../assets/CartaAmarilla.png";
import card2 from "../../assets/CartaAzul.png";
import card3 from "../../assets/CartaRoja.png";
import card4 from "../../assets/CartaVerde.png";
import avatar1 from "../../assets/Avatar1.png";
import avatar2 from "../../assets/Avatar2.png";
import avatar3 from "../../assets/Avatar3.png";
import avatar4 from "../../assets/Avatar4.png";
import avatar5 from "../../assets/Avatar5.png";
import avatar6 from "../../assets/Avatar6.png";


;




interface PageProps {
  setCurrentPage: (page: string) => void;
}

export function HomePage({ setCurrentPage }: PageProps) {
  const [ranking, setRanking] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchranking = async () => {
      try {
        const fetchedData = await getRanking();
        setRanking(fetchedData);
      } catch (error) {
        console.error("Error cargando ranking:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchranking();
  }, [])
  return (
    <div className="bg-content">
      {/* Hero Section - Reducido */}
      <section className="relative">
        <div className="h-[450px] md:h-[500px] flex items-center justify-center relative overflow-hidden">
          {/* Imagen de fondo del estadio */}
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{
              backgroundImage: `url(${stadiumImage})`,
            }}
          />
          {/* Overlay: negro sólido base + degradado naranja VCF centrado + oscuro arriba y abajo */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.62)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 40%, rgba(238,53,36,0.18) 65%, rgba(0,0,0,0.75) 100%)",
            }}
          />
          {/* Línea de acento inferior */}
          <div
            className="absolute bottom-0 left-0 w-full h-1"
            style={{
              background:
                "linear-gradient(90deg, #EE3524, #FFDF1B, #EE3524)",
            }}
          />

          <div className="max-w-[1600px] mx-auto px-4 z-10 text-white text-center">
            <h1 className="text-5xl md:text-6xl font-black mb-3 tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              VALENCIA CF
            </h1>
            <p className="text-base md:text-lg mb-6 font-bold text-vcf-orange drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              VS REAL MADRID
            </p>

            <div className="flex items-center justify-center gap-2 md:gap-4 mb-6">
              {[
                { val: "02", label: "DÍAS" },
                { val: "14", label: "HORAS" },
                { val: "35", label: "MIN" },
                { val: "22", label: "SEG" },
              ].map((t, i, arr) => (
                <div
                  key={i}
                  className="flex items-center gap-2 md:gap-4"
                >
                  <div className="text-center bg-black/60 backdrop-blur-sm border border-white/20 px-3 md:px-6 py-3 md:py-4 rounded-xl shadow-lg">
                    <div className="text-2xl md:text-3xl font-black text-[#ff671f] drop-shadow-md">
                      {t.val}
                    </div>
                    <div className="text-xs text-white/80 font-bold tracking-widest mt-1">
                      {t.label}
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
              <button
                onClick={() => setCurrentPage("match-rooms")}
                className="px-6 md:px-8 py-3 md:py-4 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 text-sm md:text-base"
              >
                <Video size={20} />
                <span>CREAR MATCH ROOM</span>
              </button>
              <button className="px-6 md:px-8 py-3 md:py-4 bg-white border-2 border-white text-vcf-orange rounded-lg font-black hover:bg-gray-100 hover:border-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 text-sm md:text-base">
                <Ticket size={20} />
                <span>COMPRAR ENTRADAS</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="bg-card border-b-2 border-border py-4">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                icon: Star,
                label: "TU RACHA",
                value: "12 DÍAS",
                page: "profile",
                color: "bg-vcf-orange",
              },
              {
                icon: Trophy,
                label: "NIVEL",
                value: "15",
                page: "profile",
                color: "bg-vcf-orange",
              },
              {
                icon: BookOpen,
                label: "ÁLBUM",
                value: "72%",
                page: "album",
                color: "bg-vcf-orange",
              },
              {
                icon: Award,
                label: "PUNTOS",
                value: "2,340",
                page: "rankings",
                color: "bg-vcf-orange",
              },
            ].map((stat, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(stat.page)}
                className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-card hover:shadow-lg transition-all border-2 border-transparent hover:border-vcf-orange"
              >
                <div
                  className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center shadow-md`}
                >
                  <stat.icon size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-bold text-left">
                    {stat.label}
                  </div>
                  <div className="text-lg md:text-xl font-black text-left text-foreground">
                    {stat.value}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 py-6 md:py-8">
        {/* Latest News */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              ÚLTIMAS{" "}
              <span className="text-vcf-orange">NOTICIAS</span>
            </h2>
            <button
              onClick={() => setCurrentPage("news")}
              className="flex items-center gap-2 text-sm font-bold text-vcf-orange hover:text-vcf-blue hover:gap-3 transition-all"
            >
              VER TODAS <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              onClick={() => setCurrentPage("news")}
              className="lg:col-span-2 lg:row-span-2 group cursor-pointer"
            >
              <div className="relative h-full min-h-[350px] bg-gradient-to-br from-vcf-orange to-vcf-yellow rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all">
                <img
                  src={valenciaVictoryImage}
                  alt="Valencia CF Victoria"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl md:text-3xl font-black mb-2 group-hover:text-vcf-yellow transition-colors">
                    Victoria histórica del Valencia CF en el
                    Mestalla
                  </h3>
                  <p className="text-sm mb-3 opacity-90">
                    El equipo suma tres puntos importantes en la
                    lucha por los puestos europeos con una
                    actuación brillante.
                  </p>
                  <div className="flex items-center gap-4 text-xs">
                    <span>Hace 2 horas</span>
                    <span className="text-vcf-yellow">•</span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} /> 1,234
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                onClick={() => setCurrentPage("news")}
                className="group cursor-pointer"
              >
                <div className="relative h-40 bg-muted rounded-lg overflow-hidden mb-3 shadow-md hover:shadow-lg transition-all">
                  <img
                    src={
                      item === 1
                        ? newsImage1
                        : item === 2
                          ? newsImage2
                          : item === 3
                            ? newsImage3
                            : newsImage4
                    }
                    alt={`Noticia ${item}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                </div>
                <h3 className="font-black text-base mb-2 group-hover:text-vcf-orange transition-colors text-foreground">
                  Noticia importante del equipo #{item}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Breve descripción de la noticia para captar la
                  atención del lector.
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>Hace {item} horas</span>
                  <span className="text-white">•</span>
                  <span className="flex items-center gap-1">
                    <Eye size={12} /> {500 - item * 50}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Match Rooms CTA */}
        <section className="mb-8">
          <div className="bg-black text-white rounded-xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
            {/* Background image */}
            <img
              src={matchRoomBgImage}
              alt="Match Room Background"
              className="absolute inset-0 w-full h-full object-cover opacity-110"
            />
            {/* Overlay gradient para mejorar legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/90"></div>

            <div className="relative z-10 max-w-2xl">
              <div className="inline-block bg-vcf-orange text-white px-3 py-1 rounded text-xs font-black mb-4 shadow-md">
                TENDENCIA
              </div>
              <h2 className="text-4xl font-black mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                VIVE LOS PARTIDOS CON TUS{" "}
                <span className="text-vcf-orange">AMIGOS</span>
              </h2>
              <p className="text-lg mb-6 opacity-90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                Crea tu Match Room y disfruta de la experiencia
                de ver el partido en tiempo real con
                comentarios, reacciones y predicciones.
              </p>
              <button
                onClick={() => setCurrentPage("match-rooms")}
                className="px-8 py-4 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                <Video size={20} />
                CREAR MI ROOM AHORA
              </button>
            </div>
          </div>
        </section>

        {/* Trivias */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              DESAFÍOS{" "}
              <span className="text-foreground">ACTIVOS</span>
            </h2>
            <button
              onClick={() => setCurrentPage("trivias")}
              className="flex items-center gap-2 text-sm font-bold text-vcf-blue hover:text-vcf-orange hover:gap-3 transition-all"
            >
              VER TODOS <ArrowRight size={16} />
            </button>
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
                onClick={() => setCurrentPage("trivias")}
                className="bg-card border-2 border-border rounded-lg p-6 hover:border-vcf-orange hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${challenge.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}
                  >
                    <Gamepad2
                      size={24}
                      className={challenge.iconColor}
                    />
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
                    <Clock
                      size={14}
                      className="text-foreground"
                    />{" "}
                    {challenge.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users
                      size={14}
                      className="text-vcf-blue"
                    />{" "}
                    {challenge.participants}
                  </span>
                </div>
                <button className="w-full py-3 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-md hover:shadow-lg hover:scale-105">
                  JUGAR AHORA
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Album CTA */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-card rounded-xl p-8 shadow-lg border-2 border-vcf-orange">
            <div>
              <h2 className="text-4xl font-black mb-4 text-foreground">
                COMPLETA TU{" "}
                <span className="text-vcf-orange">ÁLBUM</span>{" "}
                DE CARTAS
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Colecciona cartas de jugadores, leyendas y
                momentos históricos. Intercambia con otros fans
                y desbloquea recompensas exclusivas.
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
                  ></div>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentPage("album")}
                  className="px-8 py-4 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-md hover:shadow-lg hover:scale-105"
                >
                  ABRIR SOBRES
                </button>
                <button
                  onClick={() => setCurrentPage("album")}
                  className="px-8 py-4 bg-white border-2 border-white text-vcf-orange rounded-lg font-black hover:bg-gray-100 hover:border-gray-100 transition-all shadow-md hover:shadow-lg hover:scale-105"
                >
                  VER ÁLBUM
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[card1, card2, card3, card4, card1, card2].map(
                (cardImg, i) => (
                  <div
                    key={i}
                    onClick={() => setCurrentPage("album")}
                    className="aspect-[2/3] rounded-lg shadow-lg transform hover:scale-105 transition-transform cursor-pointer overflow-hidden"
                  >
                    <img
                      src={cardImg}
                      alt={`Carta ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        {/* Rankings Preview */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              RANKING{" "}
              <span className="text-vcf-orange">SEMANAL</span>
            </h2>
            <button
              onClick={() => setCurrentPage("rankings")}
              className="flex items-center gap-2 text-sm font-bold text-vcf-orange hover:text-vcf-blue hover:gap-3 transition-all"
            >
              VER COMPLETO <ArrowRight size={16} />
            </button>
          </div>

          <div
            onClick={() => setCurrentPage("rankings")}
            className="bg-card border-2 border-vcf-orange rounded-lg overflow-hidden cursor-pointer hover:border-vcf-yellow hover:shadow-2xl transition-all"
          >
            <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-b from-vcf-yellow/20 to-transparent border-b-2 border-vcf-orange">
              {ranking.slice(0, 3).map((user, i) => {
                const colors = ["bg-gray-300", "bg-vcf-orange", "bg-gray-400"];
                const avatars = [avatar2, avatar1, avatar3];

                return (
                  <div
                    key={user.id}
                    className={`text-center ${i === 0 ? "transform scale-110 -mt-4" : ""}`}
                  >
                    <div
                      className={`w-20 h-20 mx-auto rounded-full mb-3 flex items-center justify-center shadow-lg ${colors[i]} text-white`}
                    >
                      <span className="text-2xl font-black">{i + 1}</span>
                    </div>

                    <img
                      src={avatars[i]}
                      alt={user.fan_nombre}
                      className="w-16 h-16 rounded-full mx-auto mb-2 shadow-md object-cover"
                    />

                    <div className="font-black mb-1 text-foreground">
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

                    <div className="w-10 h-10 bg-gradient-to-br from-vcf-orange to-vcf-yellow rounded-full"></div>

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
          </div>
        </section>
      </div>
    </div>
  );
}