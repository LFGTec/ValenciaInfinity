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
        group ml-12 flex w-[calc(100%-3rem)] cursor-pointer overflow-hidden rounded-2xl border bg-white shadow-md transition-all duration-300
        hover:-translate-y-1 hover:border-[#ff6a00] hover:shadow-xl
        md:ml-0 md:w-[43%]
        ${isLeft ? "md:mr-auto" : "md:ml-auto"}
        ${
          isSelected
            ? "border-[#ff6a00] shadow-xl ring-2 ring-[#ff6a00]/20"
            : "border-gray-200"
        }
      `}
    >
      {event.image_url && (
        <div className="hidden w-40 shrink-0 overflow-hidden bg-gray-200 sm:block md:w-44">
          <img
            src={event.image_url}
            alt={event.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between p-4 md:p-5">
        <div>
          <span className="inline-block rounded-md bg-[#ff6a00] px-2.5 py-1 text-xs font-black text-white shadow-sm">
            {event.year}
          </span>

          <h3 className="mt-3 text-base font-black leading-tight text-[#111111] md:text-lg">
            {event.title}
          </h3>

          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
            {event.description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Calendar size={14} className="text-[#ff6a00]" />
            <span>{event.date}</span>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:transition md:group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="rounded-lg border border-gray-200 p-2 text-gray-700 transition hover:border-[#ff6a00] hover:text-[#ff6a00]"
                title="Editar"
              >
                <Edit2 size={16} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
                className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
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