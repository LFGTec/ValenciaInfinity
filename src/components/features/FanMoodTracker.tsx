import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  Share2,
  ChevronRight,
  BarChart2,
  Flame,
  Frown,
  Meh,
  Smile,
  Star,
} from "lucide-react";

const FANS_IMG =
  "https://images.unsplash.com/photo-1746815514001-73bee47b34f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";

interface Mood {
  id: string;
  icon: React.ElementType;
  label: string;
  color: string;
  bg: string;
  border: string;
  value: number;
}

interface MatchMood {
  match: string;
  date: string;
  result: string;
  score: string;
  moods: { [key: string]: number };
  totalVotes: number;
  myVote?: string;
  topComment: string;
}

const MOODS: Mood[] = [
  {
    id: "fire",
    icon: Flame,
    label: "Eufórico",
    color: "#ff671f",
    bg: "bg-vcf-orange/10",
    border: "border-vcf-orange",
    value: 5,
  },
  {
    id: "happy",
    icon: Smile,
    label: "Feliz",
    color: "#ff671f",
    bg: "bg-vcf-orange/10",
    border: "border-vcf-orange",
    value: 4,
  },
  {
    id: "ok",
    icon: Meh,
    label: "Regular",
    color: "#000000",
    bg: "bg-black/10",
    border: "border-black",
    value: 3,
  },
  {
    id: "sad",
    icon: Frown,
    label: "Triste",
    color: "#ff671f",
    bg: "bg-vcf-orange/10",
    border: "border-vcf-orange",
    value: 2,
  },
  {
    id: "furious",
    icon: Frown,
    label: "Frustrado",
    color: "#000000",
    bg: "bg-black/10",
    border: "border-black",
    value: 1,
  },
];

const MATCH_HISTORY: MatchMood[] = [
  {
    match: "Valencia CF vs Real Madrid",
    date: "15 Feb 2025",
    result: "Victoria",
    score: "3 - 2",
    moods: {
      fire: 1245,
      happy: 876,
      ok: 234,
      sad: 45,
      furious: 12,
    },
    totalVotes: 2412,
    myVote: "fire",
    topComment:
      "REMONTADA HISTÓRICA! Pepelu en el 89... nunca me lo voy a olvidar",
  },
  {
    match: "Valencia CF vs Barcelona",
    date: "8 Feb 2025",
    result: "Empate",
    score: "1 - 1",
    moods: {
      fire: 234,
      happy: 567,
      ok: 890,
      sad: 345,
      furious: 156,
    },
    totalVotes: 2192,
    topComment:
      "Mereció más, pero un punto en el Camp Nou no es malo tampoco.",
  },
  {
    match: "Villarreal vs Valencia CF",
    date: "1 Feb 2025",
    result: "Derrota",
    score: "2 - 0",
    moods: {
      fire: 45,
      happy: 89,
      ok: 345,
      sad: 678,
      furious: 890,
    },
    totalVotes: 2047,
    topComment:
      "Sin palabras. Hay que mejorar si queremos Europa este año.",
  },
  {
    match: "Valencia CF vs Sevilla",
    date: "25 Ene 2025",
    result: "Victoria",
    score: "2 - 1",
    moods: {
      fire: 987,
      happy: 1234,
      ok: 345,
      sad: 56,
      furious: 23,
    },
    totalVotes: 2645,
    topComment:
      "Hugo Duro en estado puro, dos golazos impresionantes. AMUNT!",
  },
];

function MoodBar({
  mood,
  votes,
  total,
  animated,
}: {
  mood: Mood;
  votes: number;
  total: number;
  animated: boolean;
}) {
  const pct = total > 0 ? Math.round((votes / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 flex justify-center">
        <mood.icon size={20} className="text-foreground" />
      </div>
      <div className="flex-1">
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: mood.color }}
            initial={{ width: 0 }}
            animate={{ width: animated ? `${pct}%` : 0 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: "easeOut",
            }}
          />
        </div>
      </div>
      <div className="w-16 text-right">
        <span className="font-black text-foreground text-base">
          {pct}%
        </span>
      </div>
      <div className="w-12 text-right">
        <span className="text-muted-foreground text-sm">
          {votes.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

function SentimentScore({
  moods,
  total,
}: {
  moods: { [k: string]: number };
  total: number;
}) {
  const weights = {
    fire: 5,
    happy: 4,
    ok: 3,
    sad: 2,
    furious: 1,
  };
  const weighted = Object.entries(moods).reduce(
    (acc, [k, v]) =>
      acc + (weights[k as keyof typeof weights] || 3) * v,
    0,
  );
  const score =
    total > 0 ? Math.round((weighted / (total * 5)) * 100) : 50;
  const color =
    score >= 70
      ? "#ff671f"
      : score >= 50
        ? "#000000"
        : "#ff671f";
  const label =
    score >= 70
      ? "Buenas Vibras"
      : score >= 50
        ? "Ambiente Tenso"
        : "La Peña Está Inquieta";
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg
          className="w-16 h-16 -rotate-90"
          viewBox="0 0 64 64"
        >
          <circle
            cx="32"
            cy="32"
            r="26"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="6"
          />
          <motion.circle
            cx="32"
            cy="32"
            r="26"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 26}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
            animate={{
              strokeDashoffset:
                2 * Math.PI * 26 * (1 - score / 100),
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-black text-foreground text-sm">
            {score}
          </span>
        </div>
      </div>
      <div>
        <div className="font-black text-foreground text-base">
          {label}
        </div>
        <div className="text-muted-foreground text-sm">
          Índice de sentimiento
        </div>
      </div>
    </div>
  );
}

export function FanMoodTracker() {
  const [currentMatchVote, setCurrentMatchVote] = useState<
    string | null
  >(null);
  const [voted, setVoted] = useState(false);
  const [selectedMatch, setSelectedMatch] =
    useState<MatchMood | null>(null);
  const [animateChart, setAnimateChart] = useState(false);
  const [activeView, setActiveView] = useState<
    "vote" | "history" | "stats"
  >("vote");
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setAnimateChart(true), 300);
    return () => clearTimeout(t);
  }, [selectedMatch, activeView]);

  // Upcoming match to vote on
  const upcomingMatch = {
    match: "Valencia CF vs Real Madrid",
    date: "Sábado, 22 Feb 2025 - 21:00h",
    competition: "LA LIGA - JOR. 24",
    preVotes: {
      fire: 567,
      happy: 345,
      ok: 123,
      sad: 45,
      furious: 34,
    },
    totalPreVotes: 1114,
  };

  const handleVote = (moodId: string) => {
    setCurrentMatchVote(moodId);
    setVoted(true);
  };

  const resultColor = (result: string) => {
    if (result === "Victoria")
      return "text-vcf-orange bg-vcf-orange/10 border-vcf-orange";
    if (result === "Derrota")
      return "text-black bg-black/10 border-black";
    return "text-vcf-orange bg-vcf-orange/10 border-vcf-orange";
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12 bg-white min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl mb-8 shadow-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${FANS_IMG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent" />
        <div className="relative z-10 p-10">
          <div className="flex items-center gap-3 mb-3"></div>
          <h1 className="text-5xl font-black text-white mb-3 leading-tight">
            FAN MOOD
            <br />
            <span className="text-vcf-orange">TRACKER</span>
          </h1>
          <p className="text-white/80 max-w-xl text-lg leading-relaxed">
            Vota cómo te sientes después de cada partido y
            descubre el estado emocional colectivo de toda la
            afición del Valencia CF en tiempo real.
          </p>
          <div className="flex flex-wrap items-center gap-6 mt-6">
            {[
              {
                icon: Users,
                label: "12,450 fans votando",
                color: "text-vcf-orange",
              },
              {
                icon: BarChart2,
                label: "Análisis en tiempo real",
                color: "text-white",
              },
              {
                icon: TrendingUp,
                label: "Historial de temporada",
                color: "text-vcf-orange",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-white/80 text-base"
              >
                <f.icon size={18} className={f.color} />
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b-2 border-gray-200">
        {[
          { id: "vote", label: "VOTAR" },
          { id: "history", label: "HISTORIAL" },
          { id: "stats", label: "ESTADÍSTICAS" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveView(tab.id as any);
              setAnimateChart(false);
              setTimeout(() => setAnimateChart(true), 200);
            }}
            className={`px-6 py-3 font-black transition-all text-base ${
              activeView === tab.id
                ? "border-b-4 border-vcf-orange text-vcf-orange"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* === VOTE VIEW === */}
      {activeView === "vote" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Vote Card */}
          <div>
            <div className="bg-white border-2 border-vcf-orange rounded-2xl overflow-hidden shadow-2xl mb-6">
              {/* Match Header */}
              <div className="p-6 border-b border-gray-200 bg-vcf-orange/5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-vcf-orange rounded-full animate-pulse" />
                  <span className="text-vcf-orange font-black text-sm tracking-widest">
                    {upcomingMatch.competition}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-gray-900 font-black text-2xl mb-1">
                      {upcomingMatch.match}
                    </h2>
                    <p className="text-gray-600 text-base">
                      {upcomingMatch.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-500 text-sm mb-1">
                      Pre-votos
                    </div>
                    <div className="text-vcf-orange font-black text-xl">
                      {upcomingMatch.totalPreVotes.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vote Area */}
              <div className="p-6 bg-white">
                <AnimatePresence mode="wait">
                  {!voted ? (
                    <motion.div
                      key="voting"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <h3 className="text-gray-900 font-black text-xl mb-2">
                        ¿Cómo crees que irá el partido?
                      </h3>
                      <p className="text-gray-600 text-base mb-6">
                        Vota tu expectativa antes del partido
                      </p>
                      <div className="grid grid-cols-5 gap-3">
                        {MOODS.map((mood) => (
                          <motion.button
                            key={mood.id}
                            onClick={() => handleVote(mood.id)}
                            whileHover={{ scale: 1.12, y: -4 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${mood.bg} ${mood.border} hover:shadow-lg bg-white`}
                          >
                            <mood.icon
                              size={32}
                              style={{ color: mood.color }}
                            />
                            <span className="text-gray-900 font-black text-xs text-center leading-tight">
                              {mood.label}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="voted"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="text-center mb-6">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            delay: 0.2,
                          }}
                          className="mb-3 flex justify-center"
                        >
                          {React.createElement(
                            MOODS.find(
                              (m) => m.id === currentMatchVote,
                            )?.icon || Smile,
                            {
                              size: 64,
                              style: {
                                color: MOODS.find(
                                  (m) =>
                                    m.id === currentMatchVote,
                                )?.color,
                              },
                            },
                          )}
                        </motion.div>
                        <div className="text-gray-900 font-black text-2xl mb-1">
                          Voto registrado!
                        </div>
                        <div className="text-gray-600 text-base">
                          Votaste:{" "}
                          <span
                            style={{
                              color: MOODS.find(
                                (m) =>
                                  m.id === currentMatchVote,
                              )?.color,
                            }}
                          >
                            {
                              MOODS.find(
                                (m) =>
                                  m.id === currentMatchVote,
                              )?.label
                            }
                          </span>
                        </div>
                      </div>
                      {/* Live pre-vote chart */}
                      <div className="space-y-3">
                        <div className="text-gray-600 text-sm font-black mb-3 uppercase tracking-wider">
                          Resultados en vivo
                        </div>
                        {MOODS.map((mood) => (
                          <MoodBar
                            key={mood.id}
                            mood={mood}
                            votes={
                              upcomingMatch.preVotes[
                                mood.id as keyof typeof upcomingMatch.preVotes
                              ]
                            }
                            total={upcomingMatch.totalPreVotes}
                            animated={animateChart}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sentiment Score */}
              {voted && (
                <div className="px-6 pb-6 bg-white">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <SentimentScore
                      moods={upcomingMatch.preVotes}
                      total={upcomingMatch.totalPreVotes}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Comment box */}
            {voted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg"
              >
                <h3 className="font-black text-gray-900 text-lg mb-3">
                  Deja tu comentario
                </h3>
                <textarea
                  value={commentText}
                  onChange={(e) =>
                    setCommentText(e.target.value)
                  }
                  placeholder="¿Qué esperas del partido? ¿Cómo te sientes?"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-vcf-orange outline-none resize-none text-base"
                  rows={3}
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-gray-500 text-sm">
                    {commentText.length}/200
                  </span>
                  <button className="px-6 py-2 bg-vcf-orange text-white rounded-lg font-black hover:bg-[#e05a1a] transition-colors text-base">
                    PUBLICAR
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Community Activity */}
          <div>
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
              <h3 className="font-black text-gray-900 text-xl mb-4 flex items-center gap-2">
                <MessageCircle
                  className="text-vcf-orange"
                  size={24}
                />
                ACTIVIDAD DE LA COMUNIDAD
              </h3>
              <div className="space-y-4">
                {[
                  {
                    user: "Carlos M.",
                    time: "hace 2 min",
                    comment:
                      "Tenemos que ganar este sí o sí. Mestalla tiene que empujar!",
                    mood: "fire",
                  },
                  {
                    user: "María L.",
                    time: "hace 5 min",
                    comment:
                      "Con ganas pero sin presión. Vamos Valencia!",
                    mood: "happy",
                  },
                  {
                    user: "Juan P.",
                    time: "hace 8 min",
                    comment:
                      "Difícil pero no imposible. AMUNT!",
                    mood: "ok",
                  },
                ].map((activity, i) => (
                  <div
                    key={i}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-vcf-orange to-black rounded-full"></div>
                        <span className="font-bold text-gray-900">
                          {activity.user}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {React.createElement(
                          MOODS.find(
                            (m) => m.id === activity.mood,
                          )?.icon || Smile,
                          {
                            size: 20,
                            style: {
                              color: MOODS.find(
                                (m) => m.id === activity.mood,
                              )?.color,
                            },
                          },
                        )}
                        <span className="text-sm text-gray-500">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      {activity.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === HISTORY VIEW === */}
      {activeView === "history" && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
            <h2 className="font-black text-gray-900 text-2xl mb-4">
              HISTORIAL DE PARTIDOS
            </h2>
            <p className="text-gray-600 mb-6">
              Revive el sentimiento de la afición en cada
              encuentro de la temporada
            </p>
          </div>

          {MATCH_HISTORY.map((match, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:border-vcf-orange transition-all cursor-pointer"
              onClick={() => {
                setSelectedMatch(match);
                setAnimateChart(false);
                setTimeout(() => setAnimateChart(true), 100);
              }}
            >
              {/* Match Header */}
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-black text-gray-900 text-xl mb-1">
                      {match.match}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {match.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-block px-4 py-2 rounded-full border-2 font-black ${resultColor(match.result)}`}
                    >
                      {match.result}
                    </div>
                    <div className="text-3xl font-black text-gray-900 mt-2">
                      {match.score}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {match.totalVotes.toLocaleString()} votos
                  </span>
                  {match.myVote && (
                    <div className="flex items-center gap-2 text-vcf-orange">
                      {React.createElement(
                        MOODS.find((m) => m.id === match.myVote)
                          ?.icon || Smile,
                        { size: 16 },
                      )}
                      <span className="font-bold">
                        Tu voto:{" "}
                        {
                          MOODS.find(
                            (m) => m.id === match.myVote,
                          )?.label
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Match Moods */}
              {selectedMatch?.match === match.match && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-6 bg-white"
                >
                  <div className="mb-6">
                    <h4 className="font-black text-gray-900 mb-4 uppercase text-sm tracking-wider">
                      Distribución de votos
                    </h4>
                    <div className="space-y-3">
                      {MOODS.map((mood) => (
                        <MoodBar
                          key={mood.id}
                          mood={mood}
                          votes={
                            match.moods[
                              mood.id as keyof typeof match.moods
                            ] || 0
                          }
                          total={match.totalVotes}
                          animated={animateChart}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4">
                    <SentimentScore
                      moods={match.moods}
                      total={match.totalVotes}
                    />
                  </div>

                  {match.topComment && (
                    <div className="bg-vcf-orange/10 border-l-4 border-vcf-orange rounded-r-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star
                          size={16}
                          className="text-vcf-orange"
                        />
                        <span className="font-bold text-gray-900 text-sm">
                          COMENTARIO DESTACADO
                        </span>
                      </div>
                      <p className="text-gray-800 italic">
                        {match.topComment}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* === STATS VIEW === */}
      {activeView === "stats" && (
        <div>
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-8 shadow-lg">
            <h2 className="font-black text-gray-900 text-2xl mb-4">
              ANÁLISIS DE LA TEMPORADA
            </h2>
            <p className="text-gray-600 mb-8">
              Tendencias emocionales de la afición a lo largo de
              la temporada
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  label: "Partido más emotivo",
                  value: "VCF 3-2 Real Madrid",
                  subtext: "89% votos positivos",
                },
                {
                  label: "Racha de victorias",
                  value: "4 partidos",
                  subtext: "Enero - Febrero",
                },
                {
                  label: "Sentimiento promedio",
                  value: "68/100",
                  subtext: "Por encima de la media",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                >
                  <div className="text-sm text-gray-600 mb-2">
                    {stat.label}
                  </div>
                  <div className="text-2xl font-black text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-vcf-orange">
                    {stat.subtext}
                  </div>
                </div>
              ))}
            </div>

            {/* Overall Distribution */}
            <div className="mb-8">
              <h3 className="font-black text-gray-900 text-lg mb-4">
                DISTRIBUCIÓN GENERAL DE VOTOS
              </h3>
              <div className="space-y-3">
                {MOODS.map((mood) => {
                  const totalVotes = MATCH_HISTORY.reduce(
                    (sum, m) =>
                      sum +
                      (m.moods[
                        mood.id as keyof typeof m.moods
                      ] || 0),
                    0,
                  );
                  const overallTotal = MATCH_HISTORY.reduce(
                    (sum, m) => sum + m.totalVotes,
                    0,
                  );
                  return (
                    <MoodBar
                      key={mood.id}
                      mood={mood}
                      votes={totalVotes}
                      total={overallTotal}
                      animated={animateChart}
                    />
                  );
                })}
              </div>
            </div>

            {/* Season Trend */}
            <div className="bg-vcf-orange/5 rounded-xl p-6 border border-vcf-orange/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-vcf-orange rounded-lg flex items-center justify-center">
                  <TrendingUp
                    size={20}
                    className="text-white"
                  />
                </div>
                <div>
                  <h3 className="font-black text-gray-900">
                    TENDENCIA DE LA TEMPORADA
                  </h3>
                  <p className="text-gray-600 text-sm">
                    El ánimo de los fans está en aumento
                  </p>
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-vcf-orange rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "72%" }}
                  transition={{
                    duration: 1.2,
                    ease: "easeOut",
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>Inicio de temporada</span>
                <span className="font-bold text-vcf-orange">
                  72% positivo
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}