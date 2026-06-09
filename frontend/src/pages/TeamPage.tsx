import { usePlayers } from "@/hooks/usePlayers";
import { TimelinePublic } from "./TimelinePublic";

import { TeamCarousel } from "@/components/equipo/teamCarousel";

export function TeamPage() {
 
  const { players: teamPlayers, loading } = usePlayers();

  if (loading) return <div className="min-h-screen" />;

  return (
    <div className="min-h-screen bg-content">
  
      <div className="mx-auto max-w-[1400px] px-4 py-12">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="mb-3 text-3xl md:text-5xl font-black text-foreground">
            EL <span className="text-vcf-orange">EQUIPO</span>
          </h1>

          <p className="text-base text-muted-foreground">
            Conoce a los jugadores del Valencia CF
          </p>
        </div>

        {/* CARRUSEL */}
        <div className="mt-6">
          <TeamCarousel players={teamPlayers} />
        </div>

      </div>

      {/* Separador visual */}
      <section className="mx-auto my-8 max-w-[1400px] px-4 md:my-14">
        <div
          className="relative overflow-hidden rounded-[2rem] px-6 py-12 text-center text-white shadow-xl md:px-10 md:py-16"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=1600&q=80")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Imagen más brillante */}
          <div className="absolute inset-0 bg-white/10" />

          {/* Overlay ligero */}
          <div className="absolute inset-0 bg-black/35" />

          {/* Degradado para que el texto se lea bien */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-black/55" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-[#ff6a00]">
              Historia valencianista
            </p>

            <h2 className="text-3xl font-black uppercase leading-tight md:text-5xl">
              Más que jugadores, una historia
            </h2>

            <p className="mt-5 text-sm leading-relaxed text-white/90 md:text-base">
              El equipo no solo se entiende por quienes lo representan hoy, sino
              también por los momentos que han construido su identidad a lo
              largo del tiempo.
            </p>
          </div>
        </div>
      </section>

      {/* Línea del tiempo pública */}
      <section
        id="historia"
        className="mx-auto max-w-[1400px] px-4 pb-16 md:pb-24"
      >
        <div className="rounded-[2rem] border border-border bg-card px-4 py-10 shadow-xl md:px-10 md:py-14">
          <TimelinePublic />
        </div>
      </section>
    </div>
  );
}
