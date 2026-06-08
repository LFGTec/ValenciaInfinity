import { useState } from "react";
import { ChevronLeft, Users, X } from "lucide-react";
import { useTicketStore } from "./store/useTicketStore";
import { ZONE_COLORS, ZONE_PRICES, getSeatWorldCoords } from "./data/seat";
import type { Seat } from "./data/seat";
import { flyToSeat, flyToDefault } from "./cesiumController";
import SeatGrid from "./SeatGrid";

interface Props {
  onConfirmSeat: (seat: Seat) => void;
}

export default function ZonePanel({ onConfirmSeat }: Props) {
  const {
    seats,
    selectedSeats,
    selectedZone,
    setSelectedZone,
    toggleSeat,
    removeSeat,
  } = useTicketStore();
  const [toast, setToast] = useState("");

  if (!selectedZone) return null;

  const zoneColor = ZONE_COLORS[selectedZone];
  const zoneSeats = seats.filter((s) => s.zone === selectedZone);
  const freeCount = zoneSeats.filter((s) => !s.occupied && !s.selected).length;
  const takenCount = zoneSeats.filter((s) => s.occupied).length;
  const pickedCount = zoneSeats.filter((s) => s.selected).length;

  const subtotal = selectedSeats.reduce((t, s) => t + ZONE_PRICES[s.zone], 0);
  const fees = Math.round(subtotal * 0.1);

  function handleSeatClick(seatId: string) {
    const seat = seats.find((s) => s.id === seatId);
    if (!seat) return;
    const wasSelected = seat.selected;
    const ok = toggleSeat(seatId);
    if (ok === false) {
      flash("Máximo 8 entradas por compra");
      return;
    }
    if (!wasSelected) flyToSeat(getSeatWorldCoords(seat), selectedZone!);
  }

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  return (
    <div className="bg-card border-2 border-border rounded-2xl shadow-xl overflow-hidden">
      {/* ── Cabecera zona ── */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              setSelectedZone(null);
              flyToDefault();
            }}
            className="flex items-center gap-1.5 text-foreground hover:text-foreground/70 transition-colors text-sm font-bold cursor-pointer border border-border p-2 rounded-2xl hover:-translate-y-1"
          >
            <ChevronLeft size={16} />
            Cambiar zona
          </button>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ background: zoneColor }}
            />
            <div className="text-right">
              <div
                className="font-black text-gray-900 text-base leading-none"
                style={{ color: zoneColor }}
              >
                {selectedZone}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                desde {ZONE_PRICES[selectedZone]}€/entrada
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-muted rounded-xl py-3 text-center border border-border">
            <div className="text-xl font-black" style={{ color: zoneColor }}>
              {freeCount}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold mt-0.5">
              Libres
            </div>
          </div>
          <div className="bg-muted rounded-xl py-3 text-center border border-border">
            <div className="text-xl font-black text-foreground">{takenCount}</div>
            <div className="text-[10px] text-foreground uppercase tracking-wide font-bold mt-0.5">
              Ocupados
            </div>
          </div>
          <div className="bg-muted rounded-xl py-3 text-center border border-border">
            <div
              className="text-xl font-black text-muted-foreground"
            >
              {pickedCount > 0 ? pickedCount : "—"}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold mt-0.5">
              Elegidos
            </div>
          </div>
        </div>
      </div>

      {/* ── Grid de asientos ── */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-black text-foreground">
            Plano de asientos
          </h3>
          <span className="text-xs text-muted-foreground">Click para seleccionar</span>
        </div>
        <SeatGrid
          seats={seats}
          activeZone={selectedZone}
          onSeatClick={handleSeatClick}
        />

        {/* Leyenda */}
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="w-3 h-3 rounded-sm shrink-0"
              style={{ background: zoneColor }}
            />
            Libre
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-3 h-3 rounded-sm bg-black shrink-0" />
            Ocupado
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-3 h-3 rounded-sm bg-gray-500 shrink-0" />
            Seleccionado
          </span>
        </div>
      </div>

      {/* ── Carrito ── */}
      {selectedSeats.length > 0 ? (
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-foreground">Mis entradas</h3>
            <span className="text-xs bg-muted text-foreground font-bold px-2 py-0.5 rounded-full border border-border">
              {selectedSeats.length}/8
            </span>
          </div>

          <div className="space-y-2 mb-4 max-h-[150px] overflow-y-auto">
            {selectedSeats.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2.5 border border-border"
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    color: ZONE_COLORS[s.zone],
                    background: ZONE_COLORS[s.zone],
                  }}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-bold text-foreground">
                    {s.zone}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1.5">
                    Fila {s.row} · Asiento {s.col}
                  </span>
                </div>
                <span className="text-sm font-black text-foreground">
                  {ZONE_PRICES[s.zone]}€
                </span>
                <button
                  onClick={() => removeSeat(s.id)}
                  className="w-5 h-5 rounded-full bg-muted hover:bg-red-100 hover:text-[#EE3224] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>

          {/* Resumen precio */}
          <div className="space-y-1.5 mb-4 pt-3 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-bold text-foreground">
                €{subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Gestión (10%)</span>
              <span className="font-bold text-muted-foreground">
                €{fees.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="font-black text-foreground">Total</span>
              <span className="text-2xl font-black text-foreground">
                €{(subtotal + fees).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={() => selectedSeats[0] && onConfirmSeat(selectedSeats[0])}
            className="w-full py-4 bg-gray-500 cursor-pointer text-white rounded-xl font-black text-base transition-all shadow-lg active:scale-95 hover:-translate-y-1 hover:shadow-xl"
          >
            <Users size={16} className="inline mr-2 mb-0.5" />
            Ir al pago →
          </button>
        </div>
      ) : (
        <div className="p-5 text-center">
          <div className="w-12 h-12 bg-muted rounded-2xl mx-auto mb-3 flex items-center justify-center">
            <Users size={22} className="text-muted-foreground" />
          </div>
          <p className="text-sm font-bold text-foreground mb-1">
            Ningún asiento seleccionado
          </p>
          <p className="text-xs text-muted-foreground">
            Haz click en un asiento libre del plano
          </p>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-2xl text-sm font-bold z-50 shadow-2xl border border-white/10">
          {toast}
        </div>
      )}
    </div>
  );
}
