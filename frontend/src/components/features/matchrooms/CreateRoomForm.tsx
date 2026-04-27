import { Video, TrendingUp } from "lucide-react";
import type { UpcomingMatch } from "./types";

const upcomingMatches: UpcomingMatch[] = [
  { id: "1", teams: "Valencia CF vs Real Madrid", date: "Sabado, 22 Feb - 21:00h", competition: "LA LIGA" },
  { id: "2", teams: "Valencia CF vs Barcelona", date: "Miercoles, 26 Feb - 19:00h", competition: "COPA DEL REY" },
  { id: "3", teams: "Atletico vs Valencia CF", date: "Domingo, 2 Mar - 16:00h", competition: "LA LIGA" },
];

const additionalOptions = [
  { label: "Habilitar chat en tiempo real", defaultChecked: true },
  { label: "Permitir predicciones de partido", defaultChecked: true },
  { label: "Trivias durante el partido", defaultChecked: false },
  { label: "Notificaciones de goles", defaultChecked: true },
];

interface CreateRoomFormProps {
  onCreateRoom: () => void;
}

export function CreateRoomForm({ onCreateRoom }: CreateRoomFormProps) {
  return (
    <div>
      <h2 className="text-3xl font-black mb-6 text-foreground">
        CREAR <span className="text-vcf-orange">NUEVO ROOM</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-card border-2 border-vcf-orange rounded-xl p-8 shadow-lg">
          <h3 className="text-xl font-black mb-6 text-foreground">CONFIGURACION DEL ROOM</h3>

          <div className="space-y-6">
            <div>
              <label className="block font-black mb-2 text-foreground text-base">
                Nombre del Room
              </label>
              <input
                type="text"
                placeholder="Ej: Amigos del Mestalla"
                className="w-full px-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none text-base"
              />
            </div>

            <div>
              <label className="block font-black mb-2 text-foreground text-base">
                Selecciona el partido
              </label>
              <select className="w-full px-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none text-base">
                <option>Selecciona un partido...</option>
                {upcomingMatches.map((match) => (
                  <option key={match.id} value={match.id}>
                    {match.teams} - {match.date}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-black mb-2 text-foreground text-base">
                Maximo de participantes
              </label>
              <input
                type="number"
                defaultValue={20}
                min={2}
                max={100}
                className="w-full px-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none text-base"
              />
            </div>

            <div>
              <label className="block font-black mb-3 text-foreground text-base">
                Tipo de Room
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-vcf-orange bg-vcf-orange/10 cursor-pointer">
                  <input type="radio" name="type" defaultChecked className="accent-vcf-orange w-5 h-5" />
                  <div>
                    <div className="font-black text-foreground text-base">Publico</div>
                    <div className="text-sm text-muted-foreground">Cualquiera puede unirse</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-border cursor-pointer hover:border-vcf-orange transition-colors">
                  <input type="radio" name="type" className="accent-vcf-orange w-5 h-5" />
                  <div>
                    <div className="font-black text-foreground text-base">Privado</div>
                    <div className="text-sm text-muted-foreground">Solo con enlace</div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-black mb-3 text-foreground text-base">
                Opciones adicionales
              </label>
              <div className="space-y-3">
                {additionalOptions.map((opt) => (
                  <label key={opt.label} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={opt.defaultChecked}
                      className="w-5 h-5 accent-vcf-orange"
                    />
                    <span className="text-base text-foreground">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={onCreateRoom}
              className="w-full py-4 bg-vcf-orange text-white rounded-xl font-black hover:bg-[#ff8c4a] transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-3 text-lg"
            >
              <Video size={22} />
              CREAR ROOM AHORA
            </button>
          </div>
        </div>

        {/* Preview + Tips */}
        <div className="space-y-6">
          {/* Preview */}
          <div className="bg-card border-2 border-vcf-orange rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-black text-foreground mb-4 flex items-center gap-2">
              <TrendingUp size={22} className="text-vcf-orange" />
              VISTA PREVIA DEL ROOM
            </h3>
            <div className="bg-vcf-orange/10 rounded-xl p-5 mb-4 border border-vcf-orange/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-vcf-orange to-vcf-yellow rounded-full flex items-center justify-center">
                  <span className="text-white font-black text-sm">TU</span>
                </div>
                <div>
                  <div className="text-foreground font-black text-base">Mi Room Privado</div>
                  <div className="text-muted-foreground text-sm">Host: Tu · 0/20 participantes</div>
                </div>
                <span className="ml-auto bg-vcf-orange text-white text-sm px-3 py-1 rounded-full font-black">
                  NUEVO
                </span>
              </div>
              <div className="bg-white rounded-lg p-3 border border-vcf-orange/30">
                <div className="text-vcf-orange font-bold text-sm">Valencia CF vs Real Madrid</div>
                <div className="text-muted-foreground text-sm">Sabado, 22 Feb · 21:00h</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Predicciones", active: true },
                { label: "Trivias", active: false },
              ].map((f) => (
                <div
                  key={f.label}
                  className={`rounded-lg p-3 text-center border ${
                    f.active
                      ? "border-vcf-orange bg-vcf-orange/20"
                      : "border-border bg-muted opacity-50"
                  }`}
                >
                  <div className="text-foreground text-sm font-bold">{f.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming matches */}
          <div className="bg-card border-2 border-border rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-black text-foreground mb-4">PROXIMOS PARTIDOS</h3>
            <div className="space-y-3">
              {upcomingMatches.map((match, i) => (
                <div
                  key={match.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    i === 0 ? "border-vcf-orange bg-vcf-orange/10" : "border-border hover:border-vcf-orange"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      i === 0 ? "bg-vcf-orange" : "bg-muted-foreground"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="font-black text-foreground text-base">{match.teams}</div>
                    <div className="text-muted-foreground text-sm">{match.date}</div>
                  </div>
                  <span className="text-sm font-black bg-vcf-blue/20 text-vcf-blue px-2 py-1 rounded">
                    {match.competition}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-vcf-yellow/10 border-2 border-vcf-yellow rounded-xl p-5">
            <h3 className="text-lg font-black text-foreground mb-3">CONSEJOS PARA TU ROOM</h3>
            <ul className="space-y-2 text-base text-foreground">
              {[
                "Dale un nombre divertido para atraer fans",
                "Activa las trivias para mas emocion",
                "Comparte el enlace antes del partido",
                "Maximo 50 personas para una mejor experiencia",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-vcf-orange font-black mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
