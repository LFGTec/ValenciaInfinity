import { useState } from "react";
import { motion } from "framer-motion";
import { Video } from "lucide-react";
import { createRoom, type RoomDB } from "@/services/matchRoomsService";

// Partidos disponibles para crear salas.
// El ID debe coincidir con SIMULATED_MATCH_ID del script scripts/simulate-match.mjs.
const AVAILABLE_MATCHES = [
  {
    id:    "sim-vcf-atm-001",
    label: "Valencia CF vs Atlético Madrid",
    display: "Valencia CF vs Atlético Madrid — LA LIGA",
  },
] as const;

interface CreateRoomFormProps {
  userId: string;
  onCreateRoom: (room: RoomDB) => void;
}

export function CreateRoomForm({ userId, onCreateRoom }: CreateRoomFormProps) {
  const [name, setName] = useState("");
  const [matchId, setMatchId] = useState("");
  const [matchLabel, setMatchLabel] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(20);
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim() || !matchId) {
      setError("Completa el nombre y selecciona un partido");
      return;
    }
    if (!userId) {
      setError("Debes iniciar sesión para crear una sala");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const room = await createRoom({ name, hostId: userId, matchId, matchLabel, isPrivate, maxParticipants });
      onCreateRoom(room);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al crear la sala");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-black mb-6 text-foreground">
        CREAR <span className="text-vcf-orange">NUEVO ROOM</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border-2 border-vcf-orange rounded-xl p-8 shadow-lg">
          <h3 className="text-xl font-black mb-6 text-foreground">CONFIGURACIÓN DEL ROOM</h3>

          <div className="space-y-6">
            <div>
              <label className="block font-black mb-2 text-foreground text-base">
                Nombre del Room
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Amigos del Mestalla"
                className="w-full px-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none text-base"
              />
            </div>

            <div>
              <label className="block font-black mb-2 text-foreground text-base">
                Selecciona el partido
              </label>
              <select
                value={matchId}
                onChange={(e) => {
                  const opt = e.target.options[e.target.selectedIndex];
                  setMatchId(e.target.value);
                  setMatchLabel(opt.dataset.label ?? "");
                }}
                className="w-full px-4 py-3 border-2 border-border bg-muted text-foreground rounded-lg focus:border-vcf-orange outline-none text-base"
              >
                <option value="">Selecciona un partido...</option>
                {AVAILABLE_MATCHES.map((m) => (
                  <option key={m.id} value={m.id} data-label={m.label}>
                    {m.display}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-black mb-2 text-foreground text-base">
                Máximo de participantes
              </label>
              <input
                type="number"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(Number(e.target.value))}
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
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer ${!isPrivate ? "border-vcf-orange bg-vcf-orange/10" : "border-border hover:border-vcf-orange"} transition-colors`}>
                  <input
                    type="radio"
                    name="type"
                    checked={!isPrivate}
                    onChange={() => setIsPrivate(false)}
                    className="accent-vcf-orange w-5 h-5"
                  />
                  <div>
                    <div className="font-black text-foreground text-base">Público</div>
                    <div className="text-sm text-muted-foreground">Cualquiera puede unirse</div>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer ${isPrivate ? "border-vcf-orange bg-vcf-orange/10" : "border-border hover:border-vcf-orange"} transition-colors`}>
                  <input
                    type="radio"
                    name="type"
                    checked={isPrivate}
                    onChange={() => setIsPrivate(true)}
                    className="accent-vcf-orange w-5 h-5"
                  />
                  <div>
                    <div className="font-black text-foreground text-base">Privado</div>
                    <div className="text-sm text-muted-foreground">Solo con enlace</div>
                  </div>
                </label>
              </div>
            </div>

            {error && (
              <p className="text-vcf-red text-sm font-bold">{error}</p>
            )}

            <motion.button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-vcf-orange border-2 border-vcf-orange text-white rounded-xl font-black flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={loading ? {} : { scale: 1.05, backgroundColor: "#e05516", borderColor: "#e05516" }}
              whileTap={loading ? {} : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Video size={22} />
              {loading ? "CREANDO..." : "CREAR ROOM AHORA"}
            </motion.button>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-vcf-yellow/10 border-2 border-vcf-yellow rounded-xl p-5 h-fit">
          <h3 className="text-lg font-black text-foreground mb-3">CONSEJOS PARA TU ROOM</h3>
          <ul className="space-y-2 text-base text-foreground">
            {[
              "Dale un nombre divertido para atraer fans",
              "Comparte el enlace antes del partido",
              "Las salas privadas generan un código único para compartir",
              "Máximo 100 personas por sala",
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
  );
}
