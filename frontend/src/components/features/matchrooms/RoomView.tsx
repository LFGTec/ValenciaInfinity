import { useState } from "react";
import { Users, Share2, Settings, Check } from "lucide-react";
import type { MatchRoom, Player } from "./types";
import { LiveScoreBoard } from "./LiveScoreBoard";
import { EventsTimeline } from "./EventsTimeline";
import { MatchStatsPanel } from "./MatchStatsPanel";
import { TeamLineup } from "./TeamLineup";
import { RoomChat } from "./RoomChat";

const valenciaPlayers: Player[] = [
  { num: 1, name: "Mamardashvili", pos: "POR" },
  { num: 2, name: "Foulquier", pos: "DEF" },
  { num: 15, name: "Cenk Ozkacar", pos: "DEF" },
  { num: 24, name: "Mosquera", pos: "DEF" },
  { num: 21, name: "Gaya", pos: "DEF" },
  { num: 18, name: "Pepelu", pos: "MED", hasCard: true },
  { num: 6, name: "Guillamon", pos: "MED" },
  { num: 10, name: "Fran Perez", pos: "DEL", scored: true },
  { num: 16, name: "Diego Lopez", pos: "DEL" },
  { num: 9, name: "Hugo Duro", pos: "DEL", scored: true },
  { num: 22, name: "Yaremchuk", pos: "DEL", hasCard: true },
];

const madridPlayers: Player[] = [
  { num: 1, name: "Courtois", pos: "POR" },
  { num: 2, name: "Carvajal", pos: "DEF" },
  { num: 3, name: "Militao", pos: "DEF" },
  { num: 4, name: "Alaba", pos: "DEF" },
  { num: 23, name: "Mendy", pos: "DEF" },
  { num: 10, name: "Modric", pos: "MED", subbed: true },
  { num: 8, name: "Kroos", pos: "MED" },
  { num: 15, name: "Valverde", pos: "MED" },
  { num: 11, name: "Rodrygo", pos: "DEL" },
  { num: 9, name: "Benzema", pos: "DEL" },
  { num: 20, name: "Vinicius Jr", pos: "DEL", scored: true },
];

interface RoomViewProps {
  room: MatchRoom;
  onLeave: () => void;
}

export function RoomView({ room, onLeave }: RoomViewProps) {
  const [showCopied, setShowCopied] = useState(false);

  const copyInviteLink = () => {
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-content">
      {/* Header */}
      <div className="bg-card border-b-2 border-vcf-orange">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onLeave}
                className="px-4 py-2 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-bold hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-md hover:shadow-lg hover:scale-105"
              >
                SALIR
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-foreground">{room.name}</h2>
                  {room.isLive && (
                    <span className="bg-vcf-red text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-md">
                      EN VIVO
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{room.match}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-foreground bg-vcf-blue/20 px-3 py-2 rounded-lg">
                <Users size={20} className="text-vcf-blue" />
                <span className="font-bold">
                  {room.participants}/{room.maxParticipants}
                </span>
              </div>
              <button
                onClick={copyInviteLink}
                className="px-4 py-2 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-bold hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"
              >
                {showCopied ? <Check size={18} /> : <Share2 size={18} />}
                {showCopied ? "COPIADO" : "INVITAR"}
              </button>
              <button className="p-2 text-foreground hover:bg-muted rounded-lg transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 space-y-4">
            <LiveScoreBoard />
            <EventsTimeline />
            <MatchStatsPanel />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TeamLineup teamName="VALENCIA CF" players={valenciaPlayers} variant="home" />
              <TeamLineup teamName="REAL MADRID" players={madridPlayers} variant="away" />
            </div>
          </div>

          <div className="lg:col-span-1">
            <RoomChat participants={room.participants} />
          </div>
        </div>
      </div>
    </div>
  );
}
