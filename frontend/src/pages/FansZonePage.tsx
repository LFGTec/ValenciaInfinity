import {
  Video, BookOpen, Gamepad2,
  Share2, Globe, ArrowRight, Heart
} from 'lucide-react';
import { NavLink } from "react-router-dom";

import { AvatarSection } from "../components/features/avatar/AvatarSection";

export function FansZonePage() {

  return (
    <div className=" mx-auto px-4 py-12 bg-content">
      
     
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
          { icon: Video, title: 'MATCH ROOMS', desc: 'Ve los partidos en directo con tus amigos', path: '/match-rooms' },
          { icon: BookOpen, title: 'ÁLBUM DE CARTAS', desc: 'Colecciona y completa tu álbum', path: '/album' },
          { icon: Gamepad2, title: 'TRIVIAS & QUIZZES', desc: 'Demuestra tus conocimientos', path: '/trivias' },
          { icon: Share2, title: 'INTERCAMBIO', desc: 'Comercia cartas con otros fans', path: '/exchange' },
          { icon: Globe, title: 'MUNDO VIRTUAL', desc: 'Explora y conecta globalmente', path: '/virtual-world' },
          { icon: Heart, title: 'FAN MOOD TRACKER', desc: 'Vota tu emoción después de cada partido', path: '/mood-tracker' },
        ].map((feature, i) => (
          <NavLink
            key={i}
            to={feature.path}
            className="group relative overflow-hidden rounded-xl p-8 transition-all hover:scale-105 shadow-lg hover:shadow-2xl border-4 border-vcf-orange bg-white block"
          >
            <div className="relative z-10 text-left">
              <feature.icon size={44} className="mb-4 text-vcf-orange" strokeWidth={2.5} />
              <h3 className="text-xl font-black mb-2 text-black">{feature.title}</h3>
              <p className="text-sm mb-4 font-semibold text-black">{feature.desc}</p>

              <div className="flex items-center gap-2 font-black text-sm group-hover:gap-3 transition-all text-black">
                EXPLORAR <ArrowRight size={16} strokeWidth={3} className="text-vcf-orange" />
              </div>
            </div>
          </NavLink>
        ))}
      </div>

     
      <div className="rounded-xl bg-gray-100 p-6 mb-6">
        <h2 className="text-4xl md:text-5xl font-black text-black">
          PERSONALIZA TU <span className="text-vcf-orange">AVATAR</span>
        </h2>
        <p className="mt-2 text-gray-600 text-base">
          Crea tu identidad única como valencianista
        </p>
      </div>

      <div>
        <AvatarSection />
      </div>

    </div>
  );
}