import React, { use } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
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

// import stadiumImage from "../assets/EquipoVF.png";
// import valenciaVictoryImage from "../../assets/Noticia1.png";
// import newsImage1 from "../../assets/Noticia2.png";
// import newsImage2 from "../../assets/Noticia3.png";
// import newsImage3 from "../../assets/Noticia4.png";
// import newsImage4 from "../../assets/Vivelospartidos.png";
// import matchRoomBgImage from "../../assets/Vivelospartidos.png";
// import card1 from "../../assets/CartaAmarilla.png";
// import card2 from "../../assets/CartaAzul.png";
// import card3 from "../../assets/CartaRoja.png";
// import card4 from "../../assets/CartaVerde.png";
// import avatar1 from "../../assets/Avatar1.png";
// import avatar2 from "../../assets/Avatar2.png";
// import avatar3 from "../../assets/Avatar3.png";
// import avatar4 from "../../assets/Avatar4.png";
// import avatar5 from "../../assets/Avatar5.png";
// import avatar6 from "../../assets/Avatar6.png";


;


export function HomePage() {
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
  
  return(
    <div className="bg-content">
      {/* Hero Section */}
      <section className="relative">
        <div className="h-[450px] md:h-[500px] flex items-center justify-center relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(/path-to-stadium.jpg)` }} // Usa tus variables
          />
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 40%, rgba(238,53,36,0.18) 65%, rgba(0,0,0,0.75) 100%)",
            }}
          />
          
          <div className="max-w-[1600px] mx-auto px-4 z-10 text-white text-center">
            <h1 className="text-5xl md:text-6xl font-black mb-3 tracking-tight drop-shadow-lg">
              VALENCIA CF
            </h1>
            <p className="text-base md:text-lg mb-6 font-bold text-vcf-orange uppercase">
              vs Real Madrid
            </p>

            {/* Contador (Lógica visual mantenida) */}
            <div className="flex items-center justify-center gap-2 md:gap-4 mb-6">
              {[{ v: "02", l: "DÍAS" }, { v: "14", l: "HORAS" }, { v: "35", l: "MIN" }].map((t, i) => (
                <div key={i} className="bg-black/60 backdrop-blur-sm border border-white/20 px-4 py-3 rounded-xl">
                  <div className="text-2xl font-black text-vcf-orange">{t.v}</div>
                  <div className="text-[10px] font-bold tracking-widest">{t.l}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* CAMBIO: Link en lugar de onClick */}
              <Link
                to="/game"
                className="px-8 py-4 bg-vcf-orange text-white rounded-lg font-black hover:scale-105 transition-all flex items-center gap-2"
              >
                <Video size={20} /> CREAR MATCH ROOM
              </Link>
              <Link 
                to="/shop" 
                className="px-8 py-4 bg-white text-vcf-orange rounded-lg font-black hover:scale-105 transition-all flex items-center gap-2"
              >
                <Ticket size={20} /> COMPRAR ENTRADAS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="bg-card border-b-2 border-border py-4">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Star, label: "TU RACHA", value: "12 DÍAS", path: "/fanzone" },
              { icon: Trophy, label: "NIVEL", value: "15", path: "/fanzone" },
              { icon: BookOpen, label: "ÁLBUM", value: "72%", path: "/fanzone" },
              { icon: Award, label: "PUNTOS", value: "2,340", path: "/fanzone" },
            ].map((stat, i) => (
              <Link
                key={i}
                to={stat.path}
                className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:border-vcf-orange border-2 border-transparent transition-all"
              >
                <div className="w-10 h-10 bg-vcf-orange rounded-lg flex items-center justify-center shadow-md text-white">
                  <stat.icon size={20} />
                </div>
                <div className="text-left">
                  <div className="text-xs text-muted-foreground font-bold">{stat.label}</div>
                  <div className="text-lg font-black">{stat.value}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        
        {/* News Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black">ÚLTIMAS <span className="text-vcf-orange">NOTICIAS</span></h2>
            <Link to="/news" className="flex items-center gap-2 font-bold text-vcf-orange hover:gap-3 transition-all">
              VER TODAS <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Aquí puedes mapear tus noticias usando <Link to={`/news/${id}`}> */}
             <Link to="/news" className="md:col-span-2 relative h-[400px] rounded-xl overflow-hidden group">
                <img src="/path-noticia.jpg" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-0 p-8 text-white">
                  <h3 className="text-3xl font-black mb-2">Victoria histórica en Mestalla</h3>
                  <div className="flex items-center gap-4 text-sm font-bold text-vcf-orange">
                    <span className="flex items-center gap-1"><Eye size={16}/> 1,234</span>
                    <span className="text-white">HACE 2 HORAS</span>
                  </div>
                </div>
             </Link>
             {/* ... otras noticias menores ... */}
          </div>
        </section>

        {/* Trivias / Desafíos */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black">DESAFÍOS <span className="text-vcf-orange">ACTIVOS</span></h2>
            <Link to="/game" className="flex items-center gap-2 font-bold text-vcf-orange hover:gap-3 transition-all">
              JUGAR TODO <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border-2 border-border rounded-xl p-6 hover:border-vcf-orange transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-vcf-orange/10 text-vcf-orange rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Gamepad2 size={24} />
                </div>
                <span className="bg-vcf-orange text-white text-[10px] font-black px-2 py-1 rounded">+50 PTS</span>
              </div>
              <h3 className="text-xl font-black mb-2">Quiz de la Semana</h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
                <span className="flex items-center gap-1"><Clock size={14}/> 2 DÍAS</span>
                <span className="flex items-center gap-1"><Users size={14}/> 856 FANS</span>
              </div>
              <Link to="/game" className="block text-center w-full py-3 bg-vcf-orange text-white rounded-lg font-black hover:bg-vcf-orange/90 transition-all shadow-md">
                JUGAR AHORA
              </Link>
            </div>
            {/* ... Repetir para otros desafíos ... */}
          </div>
        </section>

        {/* Álbum Section */}
        <section className="bg-card border-2 border-vcf-orange rounded-2xl p-8 shadow-xl">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-black mb-4 uppercase">Tu álbum de <span className="text-vcf-orange">Cartas</span></h2>
                <p className="text-muted-foreground mb-8 text-lg">Colecciona leyendas y momentos históricos. Intercambia con otros fans.</p>
                <div className="mb-8">
                   <div className="flex justify-between font-black mb-2">
                      <span>PROGRESO</span>
                      <span className="text-vcf-orange">72%</span>
                   </div>
                   <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-vcf-orange" style={{ width: '72%' }} />
                   </div>
                </div>
                <div className="flex gap-4">
                  <Link to="/fanzone" className="px-6 py-3 bg-vcf-orange text-white rounded-lg font-black shadow-lg hover:scale-105 transition-all">ABRIR SOBRES</Link>
                  <Link to="/fanzone" className="px-6 py-3 bg-background border-2 border-border rounded-lg font-black hover:scale-105 transition-all">VER ÁLBUM</Link>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                 {/* Visual de cartas */}
                 <div className="aspect-[2/3] bg-muted rounded-lg border-2 border-vcf-orange/20 rotate-[-5deg] hover:rotate-0 transition-transform" />
                 <div className="aspect-[2/3] bg-muted rounded-lg border-2 border-vcf-orange/20 z-10 scale-110 shadow-2xl" />
                 <div className="aspect-[2/3] bg-muted rounded-lg border-2 border-vcf-orange/20 rotate-[5deg] hover:rotate-0 transition-transform" />
              </div>
           </div>
        </section>

      </div>
    </div>
  );
}