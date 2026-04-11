import React, { useState } from "react";
import {
  Video,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import vcfShield from "../../assets/EscudoValenciaCF.png";

// ─── Calendar Data ────────────────────────────────────────────────────────────
interface CalendarMatch {
  day: number;
  month: number; // 0-based (Feb=1, Mar=2)
  time: string;
  opponent: string;
  competition: string;
  home: boolean;
}

const CALENDAR_MATCHES: CalendarMatch[] = [
  {
    day: 22,
    month: 1,
    time: "21:00h",
    opponent: "Real Madrid",
    competition: "LA LIGA",
    home: true,
  },
  {
    day: 26,
    month: 1,
    time: "19:00h",
    opponent: "Barcelona FC",
    competition: "COPA DEL REY",
    home: false,
  },
  {
    day: 2,
    month: 2,
    time: "16:00h",
    opponent: "Atlético de Madrid",
    competition: "LA LIGA",
    home: false,
  },
  {
    day: 8,
    month: 2,
    time: "20:00h",
    opponent: "Sevilla FC",
    competition: "LA LIGA",
    home: true,
  },
  {
    day: 15,
    month: 2,
    time: "21:00h",
    opponent: "Villarreal CF",
    competition: "LA LIGA",
    home: false,
  },
  {
    day: 19,
    month: 2,
    time: "18:45h",
    opponent: "Osasuna",
    competition: "LA LIGA",
    home: true,
  },
  {
    day: 29,
    month: 2,
    time: "16:00h",
    opponent: "Getafe CF",
    competition: "LA LIGA",
    home: false,
  },
  {
    day: 5,
    month: 3,
    time: "21:00h",
    opponent: "Valencia CF (vuelta)",
    competition: "COPA DEL REY",
    home: true,
  },
  {
    day: 12,
    month: 3,
    time: "19:00h",
    opponent: "Rayo Vallecano",
    competition: "LA LIGA",
    home: true,
  },
];

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const DAY_NAMES = ["L", "M", "X", "J", "V", "S", "D"];

const COMP_COLORS: Record<string, string> = {
  "LA LIGA": "#ff671f",
  "COPA DEL REY": "#ff671f",
  CHAMPIONS: "#1a1a2e",
};

function getFirstDayOfMonth(
  year: number,
  month: number,
): number {
  // Returns 0=Mon … 6=Sun
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// ─── Month Calendar Modal ─────────────────────────────────────────────────────
function MonthCalendar({
  onClose,
  setCurrentPage,
}: {
  onClose: () => void;
  setCurrentPage: (p: string) => void;
}) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-based
  const [selected, setSelected] =
    useState<CalendarMatch | null>(null);

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const firstDay = getFirstDayOfMonth(year, month);
  const daysInMo = getDaysInMonth(year, month);
  const cells = Array.from(
    { length: firstDay + daysInMo },
    (_, i) => (i < firstDay ? null : i - firstDay + 1),
  );
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const matchOnDay = (d: number | null) =>
    d
      ? CALENDAR_MATCHES.find(
          (m) => m.day === d && m.month === month,
        )
      : undefined;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card border-2 border-vcf-orange rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-black via-vcf-orange/30 to-black border-b-2 border-vcf-orange">
          <button
            onClick={prevMonth}
            className="w-9 h-9 rounded-full bg-vcf-orange/20 hover:bg-vcf-orange hover:text-white flex items-center justify-center transition-all text-foreground"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="text-center">
            <h2 className="font-black text-2xl text-white uppercase tracking-widest">
              {MONTH_NAMES[month]}
            </h2>
            <span className="text-muted-foreground text-sm">
              {year}
            </span>
          </div>
          <button
            onClick={nextMonth}
            className="w-9 h-9 rounded-full bg-vcf-orange/20 hover:bg-vcf-orange hover:text-white flex items-center justify-center transition-all text-foreground"
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={onClose}
            className="ml-4 w-9 h-9 rounded-full bg-muted hover:bg-vcf-red hover:text-white flex items-center justify-center transition-all text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 px-6 py-3 border-b border-border bg-muted/40">
          {Object.entries(COMP_COLORS).map(([comp, color]) => (
            <div key={comp} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-muted-foreground font-bold">
                {comp}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full inline-block bg-[#4CAF50]" />
            <span className="text-sm text-muted-foreground font-bold">
              HOY
            </span>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {DAY_NAMES.map((d) => (
            <div
              key={d}
              className="py-2 text-center text-sm font-black text-muted-foreground uppercase tracking-wider"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            const match = matchOnDay(day);
            const isToday =
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();
            const dotColor = match
              ? (COMP_COLORS[match.competition] ?? "#D18817")
              : null;
            return (
              <div
                key={idx}
                onClick={() => match && setSelected(match)}
                className={`relative min-h-[72px] p-2 border-b border-r border-border flex flex-col items-center
                  ${match ? "cursor-pointer hover:bg-vcf-orange/10 transition-colors" : ""}
                  ${!day ? "bg-muted/30" : ""}
                `}
              >
                {/* Day number */}
                {day && (
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-sm mb-1
                    ${isToday ? "bg-[#4CAF50] text-white" : "text-foreground"}
                  `}
                  >
                    {day}
                  </span>
                )}
                {/* Match chip */}
                {match && (
                  <div
                    className="w-full rounded-md px-1 py-0.5 text-center"
                    style={{
                      backgroundColor: dotColor + "33",
                      border: `1px solid ${dotColor}88`,
                    }}
                  >
                    <div
                      className="text-xs font-black truncate"
                      style={{ color: dotColor }}
                    >
                      {match.home ? "🏟" : "✈️"}{" "}
                      {match.opponent.split(" ")[0]}
                    </div>
                    <div className="text-xs text-foreground/70">
                      {match.time}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Match detail tooltip */}
        {selected && (
          <div className="px-6 py-4 bg-vcf-orange/10 border-t-2 border-vcf-orange flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor:
                    (COMP_COLORS[selected.competition] ??
                      "#D18817") + "33",
                }}
              >
                <span className="text-2xl">
                  {selected.home ? "🏟" : "✈️"}
                </span>
              </div>
              <div>
                <div className="font-black text-foreground text-lg">
                  Valencia CF vs {selected.opponent}
                </div>
                <div className="text-muted-foreground text-base">
                  {MONTH_NAMES[selected.month]} {selected.day} ·{" "}
                  {selected.time}
                </div>
                <span
                  className="inline-block text-sm font-black px-2 py-0.5 rounded mt-1 text-white"
                  style={{
                    backgroundColor:
                      COMP_COLORS[selected.competition] ??
                      "#D18817",
                  }}
                >
                  {selected.competition}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onClose();
                  setCurrentPage("match-rooms");
                }}
                className="px-4 py-2 bg-vcf-orange text-white rounded-lg font-black text-sm hover:bg-[#a86d12] transition-colors"
              >
                ROOM
              </button>
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-muted border border-border rounded-lg font-black text-sm text-foreground hover:bg-border transition-colors"
              >
                CERRAR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Matches Page ─────────────────────────────────────────────────────────────
export function MatchesPage({
  setCurrentPage,
}: {
  setCurrentPage: (page: string) => void;
}) {
  const [showCalendar, setShowCalendar] = useState(false);

  const upcoming = [
    {
      month: "FEB",
      day: 22,
      time: "21:00h",
      opponent: "Real Madrid",
      competition: "LA LIGA",
      home: true,
    },
    {
      month: "FEB",
      day: 26,
      time: "19:00h",
      opponent: "Barcelona FC",
      competition: "COPA DEL REY",
      home: false,
    },
    {
      month: "MAR",
      day: 2,
      time: "16:00h",
      opponent: "Atlético de Madrid",
      competition: "LA LIGA",
      home: false,
    },
    {
      month: "MAR",
      day: 8,
      time: "20:00h",
      opponent: "Sevilla FC",
      competition: "LA LIGA",
      home: true,
    },
    {
      month: "MAR",
      day: 15,
      time: "21:00h",
      opponent: "Villarreal CF",
      competition: "LA LIGA",
      home: false,
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12 bg-content">
      {showCalendar && (
        <MonthCalendar
          onClose={() => setShowCalendar(false)}
          setCurrentPage={setCurrentPage}
        />
      )}

      <div className="mb-8">
        <h1 className="text-5xl font-black mb-3 text-foreground">
          PARTIDOS
        </h1>
        <p className="text-base text-muted-foreground">
          Calendario completo de la temporada 2025/26
        </p>
      </div>

      {/* Filters + Calendar button */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex gap-3 overflow-x-auto pb-1 flex-1">
          {[
            "TODOS",
            "LA LIGA",
            "COPA DEL REY",
            "CHAMPIONS",
            "EN CASA",
            "FUERA",
          ].map((filter) => (
            <button
              key={filter}
              className={`px-6 py-3 rounded-lg font-bold whitespace-nowrap transition-all text-base ${
                filter === "TODOS"
                  ? "bg-vcf-orange text-white"
                  : "bg-card border-2 border-border hover:border-vcf-orange text-foreground"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        {/* Calendar toggle button */}
        <button
          onClick={() => setShowCalendar(true)}
          className="flex items-center gap-2 px-5 py-3 bg-white text-black border-2 border-black rounded-xl font-black hover:bg-black hover:text-white transition-all shadow-lg hover:scale-105 whitespace-nowrap text-base"
        >
          <Calendar size={20} />
          VER CALENDARIO
        </button>
      </div>

      {/* Next Match Hero */}
      <div className="bg-white text-black rounded-2xl p-8 mb-8 shadow-2xl border-2 border-vcf-orange">
        <div className="flex flex-wrap items-center justify-between gap-6">
          {/* Left: info */}
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-xs font-bold text-vcf-orange tracking-widest mb-1">
                LA LIGA · JOR. 24
              </div>
              <div className="text-sm font-bold text-black/70">
                Sáb. 22 Feb 2026
              </div>
              <div className="text-2xl font-black text-vcf-orange">
                21:00h
              </div>
            </div>
            <div className="w-px h-16 bg-black/20" />
            {/* Teams */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full mb-2 mx-auto flex items-center justify-center shadow-xl p-2 border-2 border-vcf-orange">
                  <img
                    src={vcfShield}
                    alt="Valencia CF"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="font-black text-base text-black">
                  VALENCIA CF
                </div>
                <div className="text-xs text-black/60">
                  Local
                </div>
              </div>
              <div className="text-3xl font-black text-vcf-orange">
                VS
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full mb-2 mx-auto flex items-center justify-center shadow-xl border-2 border-gray-300">
                  <span className="text-lg font-black text-black">
                    RMA
                  </span>
                </div>
                <div className="font-black text-base text-black">
                  REAL MADRID
                </div>
                <div className="text-xs text-black/60">
                  Visitante
                </div>
              </div>
            </div>
          </div>
          {/* Right: CTAs */}
          <div className="flex flex-col gap-3 min-w-[180px]">
            <button
              onClick={() => setCurrentPage("match-rooms")}
              className="px-6 py-3 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2 text-base"
            >
              <Video size={18} /> MATCH ROOM
            </button>
            <button className="px-6 py-3 bg-white border-2 border-white text-vcf-orange rounded-lg font-black hover:bg-gray-100 hover:border-gray-100 transition-all shadow-md hover:shadow-lg hover:scale-105 text-base">
              COMPRAR ENTRADAS
            </button>
            <button className="px-6 py-3 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-md hover:shadow-lg hover:scale-105 text-base">
              HACER PREDICCIÓN
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Matches — compact table */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-3xl font-black text-foreground">
            PRÓXIMOS{" "}
            <span className="text-vcf-orange">PARTIDOS</span>
          </h2>
        </div>

        <div className="bg-card rounded-xl border-2 border-border overflow-hidden shadow-lg">
          {/* Table header */}
          <div className="grid grid-cols-[100px_1fr_auto_auto] gap-4 items-center px-6 py-3 bg-black border-b-2 border-black text-sm font-black text-white uppercase tracking-widest">
            <span>Fecha</span>
            <span>Partido</span>
            <span className="text-center">Lugar</span>
            <span className="text-center">Acciones</span>
          </div>

          {upcoming.map((match, i) => (
            <div
              key={i}
              className="grid grid-cols-[100px_1fr_auto_auto] gap-4 items-center px-6 py-5 border-b border-border last:border-0 hover:bg-vcf-orange/5 transition-colors"
            >
              {/* Date */}
              <div className="text-center">
                <div className="text-vcf-orange font-black text-sm tracking-widest">
                  {match.month}
                </div>
                <div className="text-4xl font-black text-foreground leading-none">
                  {match.day}
                </div>
                <div className="text-base text-muted-foreground font-bold">
                  {match.time}
                </div>
              </div>

              {/* Match info */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0 p-1">
                    <img
                      src={vcfShield}
                      alt="Valencia CF"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="font-black text-lg text-foreground">
                    VALENCIA CF
                  </span>
                </div>
                <span className="font-black text-vcf-orange text-xl px-2">
                  VS
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-muted rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-xs font-bold text-foreground">
                      {match.opponent.slice(0, 3).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-black text-lg text-foreground">
                      {match.opponent}
                    </div>
                    <span
                      className="inline-block px-2 py-0.5 rounded text-sm font-black text-white"
                      style={{
                        backgroundColor:
                          COMP_COLORS[match.competition] ??
                          "#D18817",
                      }}
                    >
                      {match.competition}
                    </span>
                  </div>
                </div>
              </div>

              {/* Home/Away */}
              <div className="flex items-center gap-1 text-base font-bold px-4">
                <MapPin
                  size={16}
                  className={
                    match.home
                      ? "text-vcf-orange"
                      : "text-muted-foreground"
                  }
                />
                <span
                  className={
                    match.home
                      ? "text-vcf-orange"
                      : "text-muted-foreground"
                  }
                >
                  {match.home ? "Casa" : "Fuera"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage("match-rooms")}
                  className="px-4 py-2 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg text-base font-black hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-md hover:shadow-lg hover:scale-105"
                >
                  ROOM
                </button>
                <button className="px-4 py-2 bg-white border-2 border-white text-vcf-orange rounded-lg text-base font-black hover:bg-gray-100 hover:border-gray-100 transition-all shadow-md hover:shadow-lg hover:scale-105">
                  INFO
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}