import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Share2, Check } from "lucide-react";
import type { RoomDB } from "@/services/matchRoomsService";
import { useLiveMatch } from "@/hooks/useLiveMatch";
import { useRoomPresence } from "@/hooks/useRoomPresence";
import { useRoomChat } from "@/hooks/useRoomChat";
import { LiveScoreBoard } from "./LiveScoreBoard";
import { EventsTimeline } from "./EventsTimeline";
import { MatchStatsPanel } from "./MatchStatsPanel";
import { TeamLineup } from "./TeamLineup";
import { RoomChat } from "./RoomChat";

interface RoomViewProps {
  room: RoomDB;
  user: { id: string; username: string };
  onLeave: () => void;
}

export function RoomView({ room, user, onLeave }: RoomViewProps) {
  const [showCopied, setShowCopied] = useState(false);

  const { liveMatch } = useLiveMatch(room.match_id);
  const { count: spectatorCount } = useRoomPresence(room.id, user);
  const { messages, sendEmoji } = useRoomChat(room.id);

  const isLive = liveMatch?.status === "IN_PLAY" || liveMatch?.status === "PAUSED";

  const copyInviteLink = () => {
    const url = room.invite_code
      ? `${window.location.origin}/match-rooms?code=${room.invite_code}`
      : `${window.location.origin}/match-rooms`;
    navigator.clipboard.writeText(url);
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
              <motion.button
                onClick={onLeave}
                className="px-4 py-2 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-bold"
                whileHover={{ scale: 1.05, backgroundColor: "#e05516", borderColor: "#e05516" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                SALIR
              </motion.button>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-foreground">{room.name}</h2>
                  {isLive && (
                    <span className="bg-vcf-red text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-md">
                      EN VIVO
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{room.match_label}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-foreground bg-vcf-blue/20 px-3 py-2 rounded-lg">
                <Users size={20} className="text-vcf-blue" />
                <span className="font-bold">{spectatorCount} en vivo</span>
              </div>
              <motion.button
                onClick={copyInviteLink}
                className="px-4 py-2 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-bold flex items-center gap-2"
                whileHover={{ scale: 1.05, backgroundColor: "#e05516", borderColor: "#e05516" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {showCopied ? <Check size={18} /> : <Share2 size={18} />}
                {showCopied ? "COPIADO" : "INVITAR"}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 space-y-4">
            <LiveScoreBoard liveMatch={liveMatch} />
            <EventsTimeline
              events={liveMatch?.events ?? []}
              homeTeam={liveMatch?.home_team ?? ""}
            />
            <MatchStatsPanel
              stats={liveMatch?.stats ?? {}}
              homeTeam={liveMatch?.home_team ?? "Local"}
              awayTeam={liveMatch?.away_team ?? "Visitante"}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TeamLineup
                teamName={liveMatch?.home_team ?? "Local"}
                players={liveMatch?.lineups.home ?? []}
                events={liveMatch?.events ?? []}
                variant="home"
              />
              <TeamLineup
                teamName={liveMatch?.away_team ?? "Visitante"}
                players={liveMatch?.lineups.away ?? []}
                events={liveMatch?.events ?? []}
                variant="away"
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <RoomChat
              messages={messages}
              spectatorCount={spectatorCount}
              onSendEmoji={(emoji) => sendEmoji(emoji, user)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
