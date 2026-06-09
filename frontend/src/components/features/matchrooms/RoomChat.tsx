import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Smile, MessageSquareText } from "lucide-react";
import type { EmojiMessage } from "@/hooks/useRoomChat";

const EMOJI_GRID = [
  "⚽", "🔥", "👏", "😱", "💪", "🎉", "🏆", "🦇",
  "❤️", "😤", "😡", "😭", "🤩", "👊", "🙏", "⚡",
  "🥅", "🎯", "💥", "🤣", "😍", "😮", "🧡", "🫡",
  "🥶", "🤬", "🎊", "🫶", "🤦", "💔", "🫠", "🏅",
];

const QUICK_PHRASES = [
  "¡Goool! ⚽",
  "¡Vamos VCF! 🦇",
  "¡Qué pase! 👏",
  "¡Penalti! 😱",
  "¡Árbitro! 😡",
  "¡Fuera de juego!",
  "¡Qué golazo! 🔥",
  "¡Campeones! 🏆",
  "¡Nooo! 😭",
  "¡Eso es! 💪",
  "¡Qué fallo! 🤦",
  "¡Portero! 🥅",
];

type PickerTab = "emojis" | "frases";

interface RoomChatProps {
  messages: EmojiMessage[];
  spectatorCount: number;
  currentUserId: string;
  currentUserAvatarUrl?: string;
  onSendEmoji: (emoji: string) => void;
}

export function RoomChat({ messages, spectatorCount, currentUserId, currentUserAvatarUrl, onSendEmoji }: RoomChatProps) {
  const messagesRef = useRef<HTMLDivElement>(null);
  const [pickerTab, setPickerTab] = useState<PickerTab>("emojis");

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div className="h-full bg-card border border-border rounded-2xl flex flex-col shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-border bg-gradient-to-r from-vcf-orange/10 to-transparent flex items-center justify-between flex-shrink-0">
        <div>
          <h3 className="font-black text-foreground text-xs tracking-wide">CHAT EN VIVO</h3>
          <div className="flex items-center gap-1 mt-0.5">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Users size={10} />
              <span>{spectatorCount} espectadores</span>
            </div>
          </div>
        </div>
        <Smile size={14} className="text-vcf-orange/60" />
      </div>

      {/* Messages */}
      <div ref={messagesRef} className="flex-1 overflow-y-auto px-2.5 py-2 space-y-2 scrollbar-thin">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <span className="text-3xl">⚽</span>
            <p className="text-[11px] text-muted-foreground font-bold">
              Sé el primero en reaccionar
            </p>
          </div>
        )}
        {messages.map((msg) => {
          const isOwn = msg.userId === currentUserId;
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`flex items-end gap-1.5 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              {(() => {
                const avatarUrl = isOwn ? currentUserAvatarUrl : msg.avatar_url;
                return avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={msg.username}
                    className="w-6 h-6 rounded-full flex-shrink-0 object-cover border border-border"
                  />
                ) : (
                  <div
                    className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white font-black text-[10px] ${
                      isOwn
                        ? "bg-gradient-to-br from-vcf-orange to-orange-600"
                        : "bg-gradient-to-br from-gray-600 to-gray-500"
                    }`}
                  >
                    {msg.username.slice(0, 1).toUpperCase()}
                  </div>
                );
              })()}

              {/* Bubble */}
              <div className={`flex flex-col gap-0.5 max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}>
                <span className="text-[9px] font-bold px-1 text-muted-foreground">
                  {isOwn ? "Tú" : msg.username}
                </span>
                <div
                  className={`px-2.5 py-1.5 rounded-2xl leading-snug ${
                    msg.emoji.length > 4 ? "text-[11px] font-bold" : "text-xl leading-none"
                  } ${
                    isOwn
                      ? "bg-vcf-orange/15 rounded-br-sm border border-vcf-orange/30"
                      : "bg-muted rounded-bl-sm"
                  }`}
                >
                  {msg.emoji}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Picker */}
      <div className="border-t border-border flex-shrink-0">
        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setPickerTab("emojis")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-black tracking-widest transition-all cursor-pointer ${
              pickerTab === "emojis"
                ? "text-vcf-orange border-b-2 border-vcf-orange bg-vcf-orange/5"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Smile size={11} />
            EMOJIS
          </button>
          <button
            onClick={() => setPickerTab("frases")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-black tracking-widest transition-all cursor-pointer ${
              pickerTab === "frases"
                ? "text-vcf-orange border-b-2 border-vcf-orange bg-vcf-orange/5"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquareText size={11} />
            FRASES
          </button>
        </div>

        {/* Content */}
        <div className="px-2.5 py-2">
          <AnimatePresence mode="wait">
            {pickerTab === "emojis" ? (
              <motion.div
                key="emojis"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-8 gap-0.5"
              >
                {EMOJI_GRID.map((emoji) => (
                  <motion.button
                    key={emoji}
                    onClick={() => onSendEmoji(emoji)}
                    className="text-base p-1 rounded-lg hover:bg-vcf-orange/15 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.25, y: -2 }}
                    whileTap={{ scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="frases"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-2 gap-1.5"
              >
                {QUICK_PHRASES.map((phrase) => (
                  <motion.button
                    key={phrase}
                    onClick={() => onSendEmoji(phrase)}
                    className="px-2 py-1.5 rounded-xl border border-border bg-muted/50 text-[10px] font-black text-foreground hover:bg-vcf-orange hover:text-white hover:border-vcf-orange transition-colors cursor-pointer text-left leading-tight"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    {phrase}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
