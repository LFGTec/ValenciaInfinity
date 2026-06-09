import { useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowRight, Gift, Shuffle } from "lucide-react";
import { CardAlbum } from "../components/features/CardAlbum";

export default function Album() {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const scrollTarget = searchParams.get("scroll");
    if (!scrollTarget) return;

    let attempts = 0;
    const tryScroll = () => {
      const el = document.getElementById(scrollTarget);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (attempts < 20) {
        attempts++;
        setTimeout(tryScroll, 200);
      }
    };
    setTimeout(tryScroll, 100);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <div id="card-album">
        <CardAlbum userId={userId} />
      </div>
      {!userId && <section className="mx-auto max-w-5xl px-4 pb-16 pt-2 md:px-8 pt-10">
        <div className="relative overflow-hidden rounded-2xl border-2 border-vcf-orange bg-gradient-to-br from-white via-orange-50 to-yellow-50 dark:from-card dark:via-card dark:to-card p-6 shadow-[0_18px_50px_rgba(255,103,31,0.16)] md:p-8">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-vcf-orange/15 blur-3xl" />
          <div className="absolute -bottom-14 -left-10 h-40 w-40 rounded-full bg-vcf-yellow/30 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.35fr_0.9fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-vcf-orange/20 bg-card px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-vcf-orange shadow-sm">
                <Gift size={14} />
                Bonus del álbum
              </div>

              <h2 className="text-3xl md:text-5xl font-black leading-tight text-foreground">
                ¿QUIERES MÁS <span className="text-vcf-orange">CARTAS</span>?
              </h2>

              <p className="mt-4 max-w-2xl text-base md:text-lg font-medium text-muted-foreground">
                Completa trivias, asiste a partidos y participa en eventos para
                ganar sobres gratis.
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  to="/store"
                  onClick={() => window.scrollTo(0, 0)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-vcf-orange bg-vcf-orange px-6 py-3 font-black text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#e85c17] hover:shadow-lg"
                >
                  COMPRAR SOBRES
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/exchange"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-foreground bg-foreground px-6 py-3 font-black text-background shadow-md transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  IR A INTERCAMBIO
                  <Shuffle size={16} />
                </Link>
              </div>
            </div>

            <div className="relative rounded-2xl border-2 border-border bg-card p-5 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Ruta rápida
                </span>
                <span className="rounded-full bg-vcf-orange/10 px-3 py-1 text-xs font-black text-vcf-orange">
                  Gana más sobres
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: "Trivias",
                    desc: "Responde preguntas y suma sobres gratis.",
                  },
                  {
                    title: "Partidos",
                    desc: "Participa en la experiencia del equipo.",
                  },
                  {
                    title: "Intercambios",
                    desc: "Completa tu colección con otros fans.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-xl border border-border bg-muted px-4 py-3"
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-vcf-orange text-white shadow-sm">
                      <Gift size={16} />
                    </div>
                    <div>
                      <p className="font-black text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>}
    </div>
  );
}
