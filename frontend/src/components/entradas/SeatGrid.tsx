import { SEAT_BLOCKS, ZONE_COLORS } from "./data/seat";
import type { Seat, Zone } from "./data/seat";

function sectorName(block: { zone: Zone; cx: number; cy: number }): string {
  if (block.zone === "Gol") return block.cy < 200 ? "Gol Norte" : "Gol Sur";
  if (block.cx < 200) return "Lateral Oeste";
  if (block.cx > 400) return "Lateral Este";
  if (block.cy > 250) return "Fondo";
  return "Tribuna Central";
}

interface Props {
  seats: Seat[];
  activeZone: Zone;
  onSeatClick: (seatId: string) => void;
}

export default function SeatGrid({ seats, activeZone, onSeatClick }: Props) {
  const blocks = SEAT_BLOCKS.map((b, bi) => ({ ...b, bi })).filter(
    (b) => b.zone === activeZone,
  );

  return (
    <div className="flex flex-col gap-3.5 overflow-y-auto max-h-[220px] pr-[2px]">
      {blocks.map(({ bi, rows, cols }) => {
        const blockSeats = seats.filter(
          (s) => parseInt(s.id.split("-")[1]) === bi,
        );

        return (
          <div key={bi}>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-[5px]">
              {sectorName(SEAT_BLOCKS[bi])}
            </div>

            {/* col hints — show every 5 */}
            <div className="flex items-center gap-[2px] mb-[2px]">
              <span className="w-3.5 text-[9px] text-[#8892a4] shrink-0 text-right pr-[3px] font-semibold" />
              {Array.from({ length: cols }, (_, c) => (
                <span
                  key={c}
                  className="w-[9px] text-[8px] text-[#3a3a50] text-center shrink-0 leading-none"
                >
                  {(c + 1) % 5 === 1 || c + 1 === cols ? c + 1 : ""}
                </span>
              ))}
            </div>

            {rows.map((row) => (
              <div key={row} className="flex items-center gap-[2px] mb-[2px]">
                <span className="w-3.5 text-[9px] text-[#8892a4] shrink-0 text-right pr-[3px] font-semibold">
                  {row}
                </span>
                {Array.from({ length: cols }, (_, c) => {
                  const seat = blockSeats.find(
                    (s) => s.row === row && s.col === c + 1,
                  );
                  if (!seat)
                    return (
                      <span
                        key={c}
                        className="w-[9px] h-[9px] rounded-[2px] shrink-0"
                        style={{
                          background: "transparent",
                          pointerEvents: "none",
                        }}
                      />
                    );
                  const state = seat.selected
                    ? "selected"
                    : seat.occupied
                      ? "occupied"
                      : "free";
                  const bgColor =
                    state === "selected"
                      ? "#6b7280"
                      : state === "occupied"
                        ? "#2a2a38"
                        : ZONE_COLORS[activeZone];
                  return (
                    <button
                      key={c}
                      className="w-[9px] h-[9px] rounded-[2px] border-none p-0 shrink-0 transition-transform"
                      style={{
                        background: bgColor,
                        opacity: state === "free" ? 0.8 : 1,
                        cursor:
                          state === "occupied" ? "not-allowed" : "pointer",
                        boxShadow:
                          state === "selected"
                            ? "0 0 5px rgba(226,75,74,0.5)"
                            : undefined,
                      }}
                      onClick={() =>
                        state !== "occupied" && onSeatClick(seat.id)
                      }
                      title={`Fila ${row} · Asiento ${c + 1}${state === "occupied" ? " · Ocupado" : ""}`}
                      onMouseEnter={(e) => {
                        if (state === "free") {
                          e.currentTarget.style.transform = "scale(1.5)";
                          e.currentTarget.style.opacity = "1";
                          e.currentTarget.style.filter = "brightness(1.2)";
                          e.currentTarget.style.zIndex = "1";
                          e.currentTarget.style.position = "relative";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (state === "free") {
                          e.currentTarget.style.transform = "";
                          e.currentTarget.style.opacity = "0.8";
                          e.currentTarget.style.filter = "";
                          e.currentTarget.style.zIndex = "";
                          e.currentTarget.style.position = "";
                        }
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
