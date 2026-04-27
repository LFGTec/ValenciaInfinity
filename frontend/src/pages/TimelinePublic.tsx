import { useEffect, useState } from "react";
import { getTimelineEvents, type TimelineEvent } from "../services/timelineService";
import { TimelineCard } from "../components/TimelineCard";

export function TimelinePublic() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);

    const data = await getTimelineEvents();

    setEvents(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-sm font-bold text-gray-500">
        Cargando acontecimientos...
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
        <h3 className="text-xl font-black text-gray-800">
          Todavía no hay acontecimientos
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Cuando el administrador agregue eventos, aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full text-[#111111]">
      <div className="mb-10">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-[#ff6a00]">
          Historia del club
        </p>

        <h2 className="text-3xl font-black uppercase tracking-tight md:text-5xl">
          Línea del Tiempo
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 md:text-base">
          Los momentos que han marcado nuestra historia y construido la
          identidad del equipo.
        </p>
      </div>

      <TimelineBody
        events={events}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
      />
    </div>
  );
}

type TimelineBodyProps = {
  events: TimelineEvent[];
  selectedEvent: number | null;
  setSelectedEvent: (id: number | null) => void;
};

function TimelineBody({
  events,
  selectedEvent,
  setSelectedEvent,
}: TimelineBodyProps) {
  return (
    <section className="relative mx-auto max-w-[1250px]">
      <div className="absolute left-1/2 top-0 hidden h-full w-[2px] -translate-x-1/2 bg-gray-300 md:block" />

      <div className="absolute left-5 top-0 h-full w-[2px] bg-gray-300 md:hidden" />

      <div className="space-y-8 md:space-y-14">
        {events.map((event, index) => {
          const isLeft = index % 2 === 0;
          const isSelected = selectedEvent === event.id;

          return (
            <div
              key={event.id}
              className={`relative flex items-center ${
                isLeft ? "md:justify-start" : "md:justify-end"
              }`}
            >
              <button
                onClick={() => setSelectedEvent(isSelected ? null : event.id)}
                className={`absolute left-1/2 z-10 hidden h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full shadow-lg transition-all md:flex ${
                  isSelected ? "scale-125 bg-[#111111]" : "bg-[#ff6a00]"
                }`}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-white" />
              </button>

              <button
                onClick={() => setSelectedEvent(isSelected ? null : event.id)}
                className={`absolute left-5 z-10 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full shadow-lg transition-all md:hidden ${
                  isSelected ? "bg-[#111111]" : "bg-[#ff6a00]"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-white" />
              </button>

              <TimelineCard
                event={event}
                isLeft={isLeft}
                isSelected={isSelected}
                onSelect={() => setSelectedEvent(isSelected ? null : event.id)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}