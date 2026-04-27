import React from "react";
import { TimelinePublic } from "./TimelinePublic";

import player1 from "../assets/Jugador1.png";
import player2 from "../assets/Jugador2.png";
import player3 from "../assets/Jugador3.png";
import player4 from "../assets/Jugador4.png";
import player5 from "../assets/Jugador5.png";
import player6 from "../assets/Jugador6.png";
import player7 from "../assets/Jugador7.png";
import player8 from "../assets/Jugador8.png";
import player9 from "../assets/Jugador9.png";
import player10 from "../assets/Jugador10.png";

export function TeamPage() {
  const players = [
    { id: 18, name: "Pepelu", position: "Mediocampista", image: player1 },
    { id: 9, name: "Hugo Duro", position: "Delantero", image: player2 },
    { id: 11, name: "Rafa Mir", position: "Delantero", image: player3 },
    { id: 7, name: "Barrenechea", position: "Mediocampista", image: player4 },
    { id: 22, name: "López", position: "Delantero", image: player5 },
    { id: 8, name: "Javi Guerra", position: "Mediocampista", image: player6 },
    { id: 15, name: "Centelles", position: "Defensa", image: player7 },
    { id: 17, name: "Mosquera", position: "Mediocampista", image: player8 },
    { id: 5, name: "Guillamón", position: "Defensa", image: player9 },
    { id: 20, name: "Foulquier", position: "Defensa", image: player10 },
  ];

  const allPlayers = [...players, ...players, ...players.slice(0, 5)];

  return (
    <div className="min-h-screen bg-content">
      {/* Equipo */}
      <section className="mx-auto max-w-[1400px] px-4 py-12">
        <div className="mb-8">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-vcf-orange">
            Plantilla oficial
          </p>

          <h1 className="mb-3 text-5xl font-black text-foreground">
            EL <span className="text-vcf-orange">EQUIPO</span>
          </h1>

          <p className="text-base text-muted-foreground">
            Conoce a los jugadores del Valencia CF
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {allPlayers.map((player, i) => (
            <div
              key={i}
              className="group cursor-pointer rounded-xl border-2 border-border bg-card p-4 shadow-md transition-all hover:-translate-y-1 hover:border-vcf-orange hover:shadow-xl"
            >
              <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-muted to-card">
                <img
                  src={player.image}
                  alt={player.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                <div className="absolute left-3 top-3 rounded-lg bg-black/70 px-2 py-1 text-xs font-black text-white backdrop-blur-sm">
                  #{player.id}
                </div>
              </div>

              <div className="text-center">
                <div className="mb-1 text-sm font-black text-foreground">
                  {player.name}
                </div>

                <div className="text-xs font-medium text-muted-foreground">
                  {player.position}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

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
              El equipo no solo se entiende por quienes lo representan hoy,
              sino también por los momentos que han construido su identidad a lo
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