import { Calendar, Edit2, Trash2 } from "lucide-react";
import type { TimelineEvent } from "../services/timelineService";

type TimelineCardProps = {
  event: TimelineEvent;
  isLeft: boolean;
  isSelected: boolean;
  isAdmin?: boolean;
  onSelect: () => void;
  onDelete?: () => void;
};

export function TimelineCard({
  event,
  isLeft,
  isSelected,
  isAdmin = false,
  onSelect,
  onDelete,
}: TimelineCardProps) {
  return (
    <article
      onClick={onSelect}
      className={`
        group ml-12 flex w-[calc(100%-3rem)] cursor-pointer overflow-hidden rounded-2xl border
        bg-card text-foreground shadow-md transition-all duration-300
        hover:-translate-y-1 border-border dark:border-white hover:border-vcf-orange hover:shadow-xl
        md:ml-0 md:w-[43%]
        ${isLeft ? "md:mr-auto" : "md:ml-auto"}
        ${
          isSelected
            ? "border-vcf-orange shadow-xl ring-2 ring-vcf-orange/20"
            : "border-border"
        }
      `}
    >
      {event.image_url && (
        <div className="hidden w-40 shrink-0 overflow-hidden bg-muted sm:block md:w-44">
          <img
            src={event.image_url}
            alt={event.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between p-4 md:p-5">
        <div>
          <span className="inline-block rounded-md bg-vcf-orange px-2.5 py-1 text-xs font-black text-white shadow-sm">
            {event.year}
          </span>

          <h3 className="mt-3 text-base font-black leading-tight text-foreground md:text-lg">
            {event.title}
          </h3>

          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {event.description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Calendar size={14} className="text-vcf-orange" />
            <span>{event.date}</span>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:transition md:group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="rounded-lg border border-border p-2 text-muted-foreground transition hover:border-vcf-orange hover:text-vcf-orange"
              >
                <Edit2 size={16} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
                className="rounded-lg border border-red-300/30 p-2 text-red-500 transition hover:bg-red-500/10"
                title="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}