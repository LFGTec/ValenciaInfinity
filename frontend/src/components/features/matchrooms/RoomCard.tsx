import { motion } from "framer-motion";
import { Lock, Share2, Crown } from "lucide-react";
import type { RoomDB } from "@/services/matchRoomsService";

const spring = { type: "spring", stiffness: 300, damping: 20 } as const;

interface RoomCardProps {
  room: RoomDB;
  variant: "discover" | "mine";
  onJoin?: (room: RoomDB) => void;
  onDelete?: (roomId: string) => void;
}

export function RoomCard({ room, variant, onJoin, onDelete }: RoomCardProps) {
  const copyInviteLink = () => {
    if (room.invite_code) {
      navigator.clipboard.writeText(
        `${window.location.origin}/match-rooms?code=${room.invite_code}`
      );
    }
  };

  if (variant === "discover") {
    return (
      <motion.div
        className="bg-card border-2 border-border rounded-xl p-6 shadow-md cursor-pointer group"
        whileHover={{ y: -6, transition: spring }}
        style={{ boxShadow: undefined }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {room.is_main_room && (
                <Crown size={14} className="text-vcf-yellow flex-shrink-0" />
              )}
              <h3 className="font-black text-xl text-foreground transition-colors duration-300 group-hover:text-vcf-orange">
                {room.name}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">{room.match_label}</p>
          </div>
          {room.is_private && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              <Lock size={12} />
              <span>Privado</span>
            </div>
          )}
        </div>

        <motion.button
          onClick={() => onJoin?.(room)}
          className="w-full py-3 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black text-base"
          whileHover={{ scale: 1.05, backgroundColor: "#e05516", borderColor: "#e05516" }}
          whileTap={{ scale: 0.97 }}
          transition={spring}
        >
          UNIRSE AL ROOM
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-card border-2 border-border rounded-xl p-6 flex items-center justify-between shadow-md"
      whileHover={{ y: -4, transition: spring }}
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-black text-xl text-foreground">{room.name}</h3>
          {room.is_private && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
              <Lock size={12} />
              Privado
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{room.match_label}</p>
        {room.invite_code && (
          <p className="text-xs text-vcf-orange font-bold mt-1">Código: {room.invite_code}</p>
        )}
      </div>
      <div className="flex gap-2">
        {room.invite_code && (
          <motion.button
            onClick={copyInviteLink}
            className="px-4 py-3 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black flex items-center gap-2"
            whileHover={{ scale: 1.05, backgroundColor: "#e05516", borderColor: "#e05516" }}
            whileTap={{ scale: 0.97 }}
            transition={spring}
          >
            <Share2 size={16} />
            INVITAR
          </motion.button>
        )}
        {onDelete && (
          <motion.button
            onClick={() => onDelete(room.id)}
            className="px-4 py-3 bg-muted border-2 border-border text-foreground rounded-lg font-black"
            whileHover={{ scale: 1.05, borderColor: "#e05516" }}
            whileTap={{ scale: 0.97 }}
            transition={spring}
          >
            ELIMINAR
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
