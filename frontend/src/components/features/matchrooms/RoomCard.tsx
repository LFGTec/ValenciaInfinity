import { Users, Lock, Share2 } from "lucide-react";
import type { MatchRoom } from "./types";

interface RoomCardProps {
  room: MatchRoom;
  variant: "discover" | "mine";
  onJoin?: (room: MatchRoom) => void;
}

export function RoomCard({ room, variant, onJoin }: RoomCardProps) {
  if (variant === "discover") {
    return (
      <div className="bg-card border-2 border-border rounded-xl p-6 hover:border-vcf-orange transition-all shadow-md hover:shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-black text-xl mb-1 text-foreground">{room.name}</h3>
            <p className="text-base text-muted-foreground">Host: {room.host}</p>
          </div>
          {room.isLive && (
            <span className="bg-vcf-red text-white px-3 py-1 rounded-full text-sm font-black shadow-md flex items-center gap-1">
              LIVE
            </span>
          )}
        </div>

        <p className="text-base text-muted-foreground mb-4">{room.match}</p>

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-base text-vcf-blue bg-vcf-blue/10 px-3 py-1 rounded-full">
            <Users size={16} />
            <span className="font-bold">
              {room.participants}/{room.maxParticipants}
            </span>
          </div>
          {room.isPrivate && (
            <div className="flex items-center gap-1 text-base text-muted-foreground">
              <Lock size={14} />
              <span>Privado</span>
            </div>
          )}
        </div>

        <button
          onClick={() => onJoin?.(room)}
          className="w-full py-3 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-md hover:shadow-lg hover:scale-105 text-base"
        >
          UNIRSE AL ROOM
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card border-2 border-border rounded-xl p-6 flex items-center justify-between shadow-md hover:border-vcf-orange transition-all">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-black text-xl text-foreground">{room.name}</h3>
          {room.isPrivate && (
            <span className="flex items-center gap-1 text-base text-muted-foreground bg-muted px-2 py-1 rounded">
              <Lock size={14} />
              Privado
            </span>
          )}
        </div>
        <p className="text-base text-muted-foreground mb-3">{room.match}</p>
        <div className="flex items-center gap-4 text-base text-foreground">
          <span className="flex items-center gap-1 bg-vcf-blue/10 text-vcf-blue px-2 py-1 rounded">
            <Users size={14} />
            {room.participants} miembros
          </span>
          <span className="text-muted-foreground">Max: {room.maxParticipants}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="px-6 py-3 bg-white border-2 border-white text-vcf-orange rounded-lg font-black hover:bg-gray-100 hover:border-gray-100 transition-all shadow-md hover:shadow-lg hover:scale-105 text-base">
          CONFIGURAR
        </button>
        <button className="px-6 py-3 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2 text-base">
          <Share2 size={18} />
          INVITAR
        </button>
      </div>
    </div>
  );
}
