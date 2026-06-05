import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PlayerCard } from "@/components/equipo/playerCard";
import type { Player } from "@/services/teamService";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from "embla-carousel-autoplay";

interface Props {
  players: Player[];
}

export function TeamCarousel({ players }: Props) {
  

  const scroll = (dir: "left" | "right") => {
    if (!emblaApi) return;
    dir === "left" ? emblaApi.scrollPrev() : emblaApi.scrollNext();
  };

    const autoplay = Autoplay({
    delay: 3000,
    stopOnInteraction: false, // sigue aunque el usuario interactúe
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
    },
    [autoplay]
  );

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
        <div className="overflow-hidden">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-4 px-6">
              {players.map((p) => (
                <div className="flex-[0_0_auto]">
                  <PlayerCard key={p.id} player={p} />
                </div>
              ))}
            </div>
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