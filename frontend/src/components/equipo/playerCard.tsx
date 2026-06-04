import { useState } from "react";
import { Star } from "lucide-react";
import type { Player } from "@/services/teamService";
import { div } from "three/src/nodes/math/OperatorNode.js";

interface Props {
  player: Player;
}

export function PlayerCard({ player }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="cursor-pointer flex-shrink-0"
      style={{ perspective: "1000px", width: "260px", height: "360px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden shadow-lg bg-card border border-border hover:border-vcf-orange transition-colors duration-300 flex flex-col"
          style={{ backfaceVisibility: "hidden" }}
        >

          {/* IMAGEN — ocupa todo el espacio disponible */}
          <div className="relative flex-1 overflow-hidden">
            <img
              src={player.image_url}
              alt={player.name}
              className="w-full h-full object-cover object-top"
            />

            {/* HEADER OVERLAY — gradiente encima de la imagen */}
            <div
              className="absolute top-0 left-0 right-0 z-10 p-4 pt-6 group"
              style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)" }}
            >
              <div className="flex justify-between items-start">
                <div className="leading-tight">
                  <div className="text-base font-black uppercase tracking-wide text-gray-100 transition-colors duration-300 group-hover:text-vcf-orange">
                    {player.name}
                  </div>
                  <div className="text-xs text-gray-300 transition-colors duration-300 group-hover:text-vcf-orange">
                    {player.position}
                  </div>
                </div>
                <div className="text-2xl font-black text-gray-100 transition-colors duration-300 group-hover:text-vcf-orange">
                  {player.squad_number}
                </div>
              </div>
            </div>

            {/* BOTTOM FADE + NATIONALITY */}
            <div className="absolute bottom-0 w-full z-10">
              <div className="h-16 bg-gradient-to-t from-black/90 to-transparent" />
              <div className="bg-black/90 p-3 flex justify-center">
                <div className="text-[11px] tracking-widest uppercase text-gray-300">
                  {player.nationality}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-xl bg-card border border-vcf-orange p-3"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          {/* header */}
          <div className="mb-2">
            <div className="font-black text-sm">{player.name}</div>
            <div className="text-[10px] text-muted-foreground">
              #{player.squad_number} · {player.position}
            </div>
          </div>

          {/* stats */}
          <div className="grid grid-cols-2 gap-2 text-center mb-3">
            <div className="bg-muted rounded-lg p-2">
              <div className="text-vcf-orange font-black text-sm">
                {player.matches}
              </div>
              <div className="text-[9px] text-muted-foreground">
                Partidos
              </div>
            </div>

            <div className="bg-muted rounded-lg p-2">
              <div className="text-vcf-orange font-black text-sm">
                {player.goals}
              </div>
              <div className="text-[9px] text-muted-foreground">
                Goles
              </div>
            </div>

            <div className="bg-muted rounded-lg p-2">
              <div className="text-vcf-orange font-black text-sm">
                {player.assists}
              </div>
              <div className="text-[9px] text-muted-foreground">
                Asist.
              </div>
            </div>

            <div className="bg-muted rounded-lg p-2">
              <div className="text-vcf-orange font-black text-sm">
                {player.age}
              </div>
              <div className="text-[9px] text-muted-foreground">
                Edad
              </div>
            </div>
          </div>

          {/* description */}
          <p className="text-[10px] text-muted-foreground leading-snug line-clamp-4">
            {player.description}
          </p>
          

          <div className="text-[9px] text-center text-muted-foreground mt-2">
            click para voltear
          </div>
        </div>
      </div>
    </div>
  );
}