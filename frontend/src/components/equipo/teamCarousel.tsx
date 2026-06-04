import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PlayerCard } from "@/components/equipo/playerCard";
import type { Player } from "@/services/teamService";
import useEmblaCarousel from 'embla-carousel-react';


interface Props {
  players: Player[];
}

export function TeamCarousel({ players }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: true,
  });

  const scroll = (dir: "left" | "right") => {
    if (!emblaApi) return;
    dir === "left" ? emblaApi.scrollPrev() : emblaApi.scrollNext();
  };

  return (
    <section className="w-full py-10">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-black">
          JUGADORES <span className="text-vcf-orange">PLANTILLA</span>
        </h2>
      </div>

      <div className="relative">
  
  {/* LEFT ARROW */}
  <button
    onClick={() => scroll("left")}
    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 
               bg-card/90 border border-border 
               p-3 rounded-full shadow-md 
               hover:border-vcf-orange hover:text-vcf-orange 
               transition-colors"
  >
    <ChevronLeft size={20} />
  </button>

  {/* EMBLA VIEWPORT */}
  <div ref={emblaRef} className="overflow-hidden">
    <div className="flex gap-4">
      {players.map((p) => (
        <div key={p.id} className="flex-shrink-0">
          <PlayerCard player={p} />
        </div>
      ))}
    </div>
  </div>

  {/* RIGHT ARROW */}
  <button
    onClick={() => scroll("right")}
    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 
               bg-card/90 border border-border 
               p-3 rounded-full shadow-md 
               hover:border-vcf-orange hover:text-vcf-orange 
               transition-colors"
  >
    <ChevronRight size={20} />
  </button>

</div>
    </section>
  );
}