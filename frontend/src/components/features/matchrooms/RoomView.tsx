import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Share2,
  Check,
  ArrowLeft,
  Clock,
  BarChart2,
  List,
  MessageCircle,
  RotateCcw,
} from "lucide-react";
import type { RoomDB } from "@/services/matchRoomsService";
import { resetMatchLiveState } from "@/services/matchRoomsService";
import { useLiveMatch } from "@/hooks/useLiveMatch";
import { useMatchSimulation } from "@/hooks/useMatchSimulation";
import { useRoomPresence } from "@/hooks/useRoomPresence";
import { useRoomChat } from "@/hooks/useRoomChat";
import { LiveScoreBoard } from "./LiveScoreBoard";
import { EventsTimeline } from "./EventsTimeline";
import { MatchStatsPanel } from "./MatchStatsPanel";
import { TeamLineup } from "./TeamLineup";
import { RoomChat } from "./RoomChat";

type Tab = "events" | "stats" | "lineups" | "chat";

interface RoomViewProps {
  room: RoomDB;
  user: { id: string; username: string; avatar_url?: string };
  onLeave: () => void;
}

export function RoomView({ room, user, onLeave }: RoomViewProps) {
  const [showCopied, setShowCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("events");
  const [simKey, setSimKey] = useState(0);
  const [resetting, setResetting] = useState(false);

  const { liveMatch, loading } = useLiveMatch(room.match_id);
  useMatchSimulation(room.match_id, liveMatch, loading, simKey);

  const isSimMatch = room.match_id.startsWith("sim-");

  const handleResetSimulation = async () => {
    setResetting(true);
    try {
      await resetMatchLiveState(room.match_id);
      setSimKey((k) => k + 1);
    } finally {
      setResetting(false);
    }
  };
  const { count: spectatorCount } = useRoomPresence(room.id, user);
  const { messages, sendEmoji } = useRoomChat(room.id);

  const isLive =
    liveMatch?.status === "IN_PLAY" || liveMatch?.status === "PAUSED";

  const copyInviteLink = () => {
    const url = room.invite_code
      ? `${window.location.origin}/match-rooms?code=${room.invite_code}`
      : `${window.location.origin}/match-rooms`;
    navigator.clipboard.writeText(url);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  // On desktop "chat" tab doesn't exist — fall back to events
  const desktopTab: Exclude<Tab, "chat"> =
    activeTab === "chat" ? "events" : activeTab;

  const matchContent = (tab: Tab) => {
    if (tab === "events")
      return (
        <EventsTimeline
          events={liveMatch?.events ?? []}
          homeTeam={liveMatch?.home_team ?? ""}
        />
      );
    if (tab === "stats")
      return (
        <MatchStatsPanel
          stats={liveMatch?.stats ?? {}}
          homeTeam={liveMatch?.home_team ?? "Local"}
          awayTeam={liveMatch?.away_team ?? "Visitante"}
        />
      );
    if (tab === "lineups")
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      );
    return null;
  };

  return (
    <div className="h-[calc(100vh-90px)] overflow-hidden flex flex-col bg-content">
      {/* ── Header ── */}
      <div className="flex-shrink-0 bg-card/95 backdrop-blur-sm border-b border-border z-30">
        <div className="h-0.5 bg-gradient-to-r from-vcf-orange via-vcf-yellow to-vcf-orange" />
        <div className="px-3 sm:px-4 py-2">
          <div className="flex items-center justify-between gap-2">
            {/* Left */}
            <div className="flex items-center gap-2 min-w-0">
              <motion.button
                onClick={onLeave}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-vcf-orange/5 transition-colors font-bold flex-shrink-0 cursor-pointer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <ArrowLeft size={14} />
                <span className="hidden sm:inline text-xs">Salir</span>
              </motion.button>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-foreground truncate">
                    {room.name}
                  </h2>
                  {isLive && (
                    <span className="flex-shrink-0 bg-red-500/10 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded-full text-[9px] font-black tracking-wider animate-pulse">
                      EN VIVO
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground truncate hidden sm:block">
                  {room.match_label}
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="flex items-center gap-1 px-2 py-1.5 bg-muted/60 rounded-lg">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <Users size={11} className="text-muted-foreground" />
                <span className="font-bold text-xs text-foreground">
                  {spectatorCount}
                </span>
              </div>
              {isSimMatch && (
                <motion.button
                  onClick={handleResetSimulation}
                  disabled={resetting}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-muted border border-border text-muted-foreground hover:text-foreground rounded-xl font-bold text-xs disabled:opacity-50"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  title="Reiniciar simulación"
                >
                  <RotateCcw
                    size={13}
                    className={resetting ? "animate-spin" : ""}
                  />
                  <span className="hidden sm:inline cursor-pointer">
                    {resetting ? "..." : "Reiniciar"}
                  </span>
                </motion.button>
              )}
              <motion.button
                onClick={copyInviteLink}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-vcf-orange text-white rounded-xl font-bold text-xs shadow-md shadow-vcf-orange/20 cursor-pointer"
                whileHover={{ scale: 1.04, backgroundColor: "#e05516" }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {showCopied ? <Check size={13} /> : <Share2 size={13} />}
                <span className="hidden sm:inline">
                  {showCopied ? "¡Copiado!" : "Invitar"}
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-hidden p-2 sm:p-3 lg:p-3">
        {/* ── MOBILE / TABLET (< lg): scoreboard + 4 tabs including chat ── */}
        <div className="lg:hidden h-full flex flex-col gap-2">
          <div className="flex-shrink-0">
            <LiveScoreBoard liveMatch={liveMatch} />
          </div>

          <div className="flex-1 min-h-0 bg-card border border-border rounded-2xl flex flex-col overflow-hidden shadow-lg">
            {/* Tab bar */}
            <div className="flex-shrink-0 flex border-b border-border">
              {(
                [
                  { id: "events", icon: <Clock size={12} />, label: "Eventos" },
                  {
                    id: "stats",
                    icon: <BarChart2 size={12} />,
                    label: "Stats",
                  },
                  { id: "lineups", icon: <List size={12} />, label: "Lineup" },
                  {
                    id: "chat",
                    icon: <MessageCircle size={12} />,
                    label: "Chat",
                  },
                ] as { id: Tab; icon: React.ReactNode; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-[10px] sm:text-xs font-bold transition-colors border-b-2 cursor-pointer ${
                    activeTab === tab.id
                      ? "text-vcf-orange border-vcf-orange"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden xs:inline sm:inline">
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab content — chat gets full height, others scroll */}
            <div
              className={`flex-1 min-h-0 ${activeTab === "chat" ? "overflow-hidden" : "overflow-y-auto p-3"}`}
            >
              {activeTab !== "chat" && matchContent(activeTab)}
              {activeTab === "chat" && (
                <RoomChat
                  messages={messages}
                  spectatorCount={spectatorCount}
                  currentUserId={user.id}
                  currentUserAvatarUrl={user.avatar_url}
                  onSendEmoji={(emoji) => sendEmoji(emoji, user)}
                />
              )}
            </div>
          </div>
        </div>

        {/* ── DESKTOP (>= lg): match panel fills space, chat fixed width ── */}
        <div className="hidden lg:flex h-full gap-3">
          {/* Left: scoreboard + tabs — takes all remaining space */}
          <div className="flex-1 min-w-0 h-full flex flex-col gap-3">
            <div className="flex-shrink-0">
              <LiveScoreBoard liveMatch={liveMatch} />
            </div>

            <div className="flex-1 min-h-0 bg-card border border-border rounded-2xl flex flex-col overflow-hidden shadow-lg">
              {/* Desktop tab bar */}
              <div className="flex-shrink-0 flex border-b border-border px-2 pt-2 gap-1">
                {(
                  [
                    {
                      id: "events",
                      label: "Eventos",
                      icon: <Clock size={13} />,
                    },
                    {
                      id: "stats",
                      label: "Estadísticas",
                      icon: <BarChart2 size={13} />,
                    },
                    {
                      id: "lineups",
                      label: "Alineaciones",
                      icon: <List size={13} />,
                    },
                  ] as {
                    id: Exclude<Tab, "chat">;
                    label: string;
                    icon: React.ReactNode;
                  }[]
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-bold transition-colors ${
                      desktopTab === tab.id
                        ? "bg-vcf-orange/10 text-vcf-orange border-b-2 border-vcf-orange"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {matchContent(desktopTab)}
              </div>
            </div>
          </div>

          {/* Right: chat — fixed width */}
          <div className="w-72 xl:w-80 flex-shrink-0 h-full">
            <RoomChat
              messages={messages}
              spectatorCount={spectatorCount}
              currentUserId={user.id}
              onSendEmoji={(emoji) => sendEmoji(emoji, user)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
