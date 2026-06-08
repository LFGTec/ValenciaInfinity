import {
  Video, BookOpen, Gamepad2,
  Share2, Globe, ArrowRight, Heart,
  Users, UserCircle2
} from 'lucide-react';
import { NavLink, useNavigate } from "react-router-dom";

export function FansZonePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen mx-auto px-4 py-12 bg-content">
      
     
      <div className="mb-10">
        <h1 className="text-5xl font-black mb-3 text-foreground">
          ZONA <span className="text-vcf-orange">FAN</span>
        </h1>
        <p className="text-base text-muted-foreground">
          Tu espacio para interactuar y disfrutar
        </p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {[
          { icon: Video, title: "MATCH ROOMS", desc: "Ve los partidos en directo con tus amigos", path: "/match-rooms" },
          { icon: BookOpen, title: "ÁLBUM DE CARTAS", desc: "Colecciona y completa tu álbum", path: "/album" },
          { icon: Gamepad2, title: "TRIVIAS & QUIZZES", desc: "Demuestra tus conocimientos", path: "/trivias" },
          { icon: Share2, title: "INTERCAMBIO", desc: "Comercia cartas con otros fans", path: "/exchange" },
          { icon: Globe, title: "MUNDO VIRTUAL", desc: "Explora y conecta globalmente", path: "/virtual-world" },
          { icon: Users, title: "MIS AMIGOS", desc: "Conecta con otros fanáticos del Valencia CF", path: "/friends" },
        ].map((feature, i) => (
          <NavLink
            key={i}
            to={feature.path}
            className="group relative overflow-hidden rounded-xl p-8 transition-all hover:scale-105 shadow-lg hover:shadow-2xl border-2 border-vcf-orange/70 bg-card block"
          >
            <div className="relative z-10 text-left">
              <feature.icon
                size={44}
                className="mb-4 text-vcf-orange"
                strokeWidth={2.5}
              />

              <h3 className="text-xl font-black mb-2 text-foreground">
                {feature.title}
              </h3>

              <p className="text-sm mb-4 font-medium text-muted-foreground">
                {feature.desc}
              </p>

              <div className="flex items-center gap-2 font-black text-sm text-foreground group-hover:text-vcf-orange transition-colors">
                EXPLORAR
                <ArrowRight
                  size={16}
                  strokeWidth={3}
                  className="text-vcf-orange"
                />
              </div>
            </div>
          </NavLink>
        ))}
      </div>

     
      <div className="rounded-xl bg-card border-2 border-vcf-orange/70 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-lg">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-vcf-orange/10 flex items-center justify-center flex-shrink-0">
            <UserCircle2 size={32} className="text-vcf-orange" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-foreground">
              PERSONALIZA TU <span className="text-vcf-orange">AVATAR</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Crea tu identidad única como valencianista
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/avatar")}
          className="flex items-center gap-2 px-6 py-3 bg-vcf-orange text-white rounded-xl font-black text-sm shadow-lg shadow-vcf-orange/20 transition-all hover:-translate-y-1 cursor-pointer whitespace-nowrap"
        >
          PERSONALIZAR
          <ArrowRight size={16} strokeWidth={3} />
        </button>
      </div>

    </div>
  );
}