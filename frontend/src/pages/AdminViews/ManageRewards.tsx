import { useEffect, useState } from "react";
import { Save, Gift, Star, Trophy, Crown } from "lucide-react";
import { getDailyRewards, upsertDailyReward, type DailyRewardDef } from "@/services/dailyRewardsService";
import { getDaysInCurrentMonth } from "@/services/streakService";

const TYPE_OPTIONS: { value: DailyRewardDef["type"]; label: string; icon: typeof Star }[] = [
  { value: "points", label: "Puntos",  icon: Star   },
  { value: "card",   label: "Carta",   icon: Trophy  },
  { value: "bonus",  label: "Bono",    icon: Crown   },
];

const typeColors: Record<DailyRewardDef["type"], string> = {
  points: "bg-vcf-orange text-white",
  card:   "bg-purple-600 text-white",
  bonus:  "bg-yellow-500 text-black",
};

const MONTH_NAMES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

export function ManageRewards() {
  const [rows, setRows]     = useState<DailyRewardDef[]>([]);
  const [saving, setSaving] = useState<number | null>(null);
  const [toast, setToast]   = useState<{ message: string; type: "success" | "error" } | null>(null);

  const now           = new Date();
  const daysInMonth   = getDaysInCurrentMonth();
  const monthLabel    = MONTH_NAMES[now.getMonth()];
  const yearLabel     = now.getFullYear();

  useEffect(() => {
    getDailyRewards()
      .then((data) => {
        const byDay = Object.fromEntries(data.map((r) => [r.day, r]));
        const full: DailyRewardDef[] = Array.from({ length: 31 }, (_, i) => {
          const day = i + 1;
          return byDay[day] ?? { day, type: "points", reward: 0, description: "", active: false };
        });
        setRows(full);
      })
      .catch(() => showToast("Error cargando recompensas", "error"));
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const update = (day: number, field: keyof DailyRewardDef, value: unknown) =>
    setRows((prev) => prev.map((r) => (r.day === day ? { ...r, [field]: value } : r)));

  const save = async (row: DailyRewardDef) => {
    setSaving(row.day);
    const { error } = await upsertDailyReward(row);
    setSaving(null);
    showToast(error ? `Error: ${error}` : `Día ${row.day} guardado`, error ? "error" : "success");
  };

  return (
    <div className="min-h-screen bg-content py-8">
      <div className="max-w-[1600px] mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-foreground">
            GESTIONAR <span className="text-vcf-orange">RECOMPENSAS</span>
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-lg text-muted-foreground">
              Configura el catálogo de recompensas diarias del mes actual
            </p>
            <span className="px-3 py-1 bg-vcf-orange/10 border border-vcf-orange/40 rounded-full text-sm font-black text-vcf-orange">
              {monthLabel} {yearLabel} — {daysInMonth} días
            </span>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">

          {/* Cabecera */}
          <div className="grid grid-cols-[56px_1fr_160px_180px_72px_88px] gap-4 px-6 py-4 border-b-2 border-border">
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Día</span>
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Descripción</span>
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Tipo</span>
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Puntos / valor</span>
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Activo</span>
            <span></span>
          </div>

          {rows.map((row) => {
            const outOfMonth = row.day > daysInMonth;
            return (
            <div
              key={row.day}
              className={`grid grid-cols-[56px_1fr_160px_180px_72px_88px] gap-4 items-center px-6 py-4 border-b border-border transition-colors ${
                outOfMonth ? "opacity-35" : "hover:bg-muted/30"
              }`}
            >
              {/* Día */}
              <div className="w-10 h-10 rounded-full bg-vcf-orange flex items-center justify-center font-black text-white text-sm flex-shrink-0">
                {row.day}
              </div>

              {/* Descripción */}
              <input
                value={row.description}
                onChange={(e) => update(row.day, "description", e.target.value)}
                className="w-full px-3 py-2 bg-muted border-2 border-transparent rounded-lg focus:border-vcf-orange outline-none transition-all text-foreground text-sm"
              />

              {/* Tipo */}
              <div className="flex gap-1">
                {TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update(row.day, "type", opt.value)}
                    title={opt.label}
                    className={`flex-1 py-2 rounded-lg text-xs font-black transition-all border-2 ${
                      row.type === opt.value
                        ? `${typeColors[opt.value]} border-transparent`
                        : "bg-muted text-muted-foreground border-border hover:border-vcf-orange/50"
                    }`}
                  >
                    <opt.icon size={14} className="mx-auto" />
                  </button>
                ))}
              </div>

              {/* Valor */}
              <input
                type="number"
                min={0}
                value={row.reward}
                onChange={(e) => update(row.day, "reward", Number(e.target.value))}
                disabled={row.type === "card"}
                className="w-full px-3 py-2 bg-muted border-2 border-transparent rounded-lg focus:border-vcf-orange outline-none transition-all text-foreground text-sm disabled:opacity-40"
              />

              {/* Toggle activo */}
              <button
                onClick={() => update(row.day, "active", !row.active)}
                className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                  row.active ? "bg-vcf-orange" : "bg-muted border-2 border-border"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    row.active ? "left-7" : "left-1"
                  }`}
                />
              </button>

              {/* Guardar */}
              <button
                onClick={() => save(row)}
                disabled={saving === row.day}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-black border-2 border-black text-white rounded-lg font-black text-xs hover:bg-gray-900 transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
              >
                <Save size={13} />
                {saving === row.day ? "..." : "GUARDAR"}
              </button>
            </div>
            );
          })}

          {rows.length === 0 && (
            <div className="py-20 text-center">
              <Gift size={48} className="mx-auto mb-4 text-muted-foreground opacity-30" />
              <p className="text-muted-foreground font-bold">No hay recompensas configuradas.</p>
              <p className="text-sm text-muted-foreground mt-1">Ejecuta el seed SQL en Supabase para poblar la tabla.</p>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl font-black text-white text-sm shadow-2xl z-50 ${
          toast.type === "success" ? "bg-green-600" : "bg-red-600"
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
