import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import type { EmojiMessage } from "@/hooks/useRoomChat";

const EMOJI_GRID = [
  "⚽", "🔥", "👏", "😱", "💪", "🎉", "😤", "❤️",
  "🏆", "😭", "🤩", "👊", "🦇", "😡", "🙏", "⚡",
  "🥅", "🤣", "😍", "💥", "🫡", "🎯", "😮", "🧡",
];

interface RoomChatProps {
  messages: EmojiMessage[];
  spectatorCount: number;
  onSendEmoji: (emoji: string) => void;
}

export function RoomChat({ messages, spectatorCount, onSendEmoji }: RoomChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="bg-card border-2 border-border rounded-lg flex flex-col shadow-lg"
      style={{ height: "calc(100vh - 180px)", minHeight: "700px" }}
    >
      <div className="p-3 border-b-2 border-border bg-vcf-orange/10">
        <h3 className="font-black text-foreground text-sm">CHAT DEL ROOM</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
          <Users size={12} />
          <span>{spectatorCount} en vivo</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-center gap-2 py-0.5">
            <div className="w-6 h-6 bg-gradient-to-br from-vcf-orange to-vcf-yellow rounded-full flex-shrink-0 flex items-center justify-center text-white font-black text-xs">
              {msg.username.slice(0, 1).toUpperCase()}
            </div>
            <span className="text-xs font-bold text-muted-foreground truncate max-w-[80px]">
              {msg.username}
            </span>
            <span className="text-2xl leading-none">{msg.emoji}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Emoji picker */}
      <div className="p-3 border-t-2 border-border">
        <p className="text-xs text-muted-foreground font-bold mb-2">REACCIONA</p>
        <div className="grid grid-cols-8 gap-1">
          {EMOJI_GRID.map((emoji) => (
            <motion.button
              key={emoji}
              onClick={() => onSendEmoji(emoji)}
              className="text-xl p-1.5 rounded"
              whileHover={{ scale: 1.3, backgroundColor: "rgba(255,103,31,0.2)" }}
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
