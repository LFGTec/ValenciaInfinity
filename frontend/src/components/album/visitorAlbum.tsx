// components/album/VisitorAlbumHeader.tsx

import { useEffect, useState } from "react";
import { Send, Users, CheckCheck, UserPlus } from "lucide-react";
import { type VisitingProfile } from "@/hooks/useVisitingAlbum";
import {
  getUserAvatarByUserId,
  buildSavedAvatarState,
  type AvatarAsset,
} from "@/services/avatarService";
import { AvatarPreview } from "@/components/features/avatar/AvatarPreview";

type Props = {
  friend: VisitingProfile;
  onSendFriendRequest: () => void;
};

const ANIMATIONS = [
  { id: "Chill", label: "Like" },
  { id: "Cool",  label: "Pose" },
  { id: "Dram",  label: "Superestrella" },
  { id: "King",  label: "Rey" },
  { id: "Ninja", label: "Ninja" },
  { id: "Busy",  label: "Correr" },
  { id: "Punch", label: "Golpe" },
];

export function VisitorAlbumHeader({ friend, onSendFriendRequest }: Props) {
  const [selectedAssets, setSelectedAssets] = useState<Record<string, AvatarAsset>>({});
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [activeAnim, setActiveAnim] = useState("Idle");

  useEffect(() => {
    if (!friend.id) return;
    getUserAvatarByUserId(friend.id)
      .then((data) => {
        if (data.length > 0) {
          const { selectedAssets: assets, selectedColors: colors } = buildSavedAvatarState(data);
          setSelectedAssets(assets);
          setSelectedColors(colors);
        }
        setAvatarLoaded(true);
      })
      .catch(() => setAvatarLoaded(true));
  }, [friend.id]);

  const hasAvatar = avatarLoaded && Object.keys(selectedAssets).length > 0;

  return (
    <div className="bg-card border-2 border-vcf-orange rounded-xl mb-8 shadow-lg overflow-hidden">

      {/* Fila superior: foto + info + botón */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 md:p-8">

        {/* Foto de perfil */}
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-vcf-orange to-vcf-yellow p-1 shadow-xl">
            <img
              src={friend.avatar_url}
              alt={friend.full_name}
              className="w-full h-full rounded-full border-4 border-card object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-vcf-orange rounded-full flex items-center justify-center border-4 border-card shadow-lg">
            <CheckCheck size={20} className="text-white" />
          </div>
        </div>

        {/* Nombre + botón */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            {friend.full_name}
          </h1>

          {friend.friendship_status === "NONE" && (
            <button
              onClick={onSendFriendRequest}
              className="px-6 py-3 bg-vcf-orange text-white rounded-xl font-black shadow-lg hover:scale-105 hover:bg-[#e5651a] transition-all cursor-pointer"
            >
              <UserPlus size={18} className="inline-block mr-2" />
              Agregar amigo
            </button>
          )}

          {(friend.friendship_status === "PENDING_SENT" || friend.friendship_status === "PENDING_RECEIVED") && (
            <button disabled className="px-6 py-3 bg-vcf-orange/20 text-vcf-orange rounded-xl font-black cursor-not-allowed border border-vcf-orange/30">
              <Send size={18} className="inline-block mr-2" />
              Solicitud enviada
            </button>
          )}

          {friend.friendship_status === "FRIENDS" && (
            <button disabled className="px-6 py-3 bg-vcf-orange/20 text-vcf-orange rounded-xl font-black cursor-not-allowed border border-vcf-orange/30">
              <Users size={18} className="inline-block mr-2" />
              Amigos
            </button>
          )}
        </div>
      </div>

      {/* Avatar 3D — solo si tiene avatar guardado */}
      {hasAvatar && (
        <div className="border-t-2 border-border bg-muted/30">
          <div className="px-6 pt-5 pb-1 flex items-center gap-2">
            <div className="w-1 h-5 bg-vcf-orange rounded-full" />
            <p className="text-xs font-black text-foreground uppercase tracking-widest">
              CHEMATE DE <span className="text-vcf-orange">{friend.full_name.split(" ")[0].toUpperCase()}</span>
            </p>
          </div>
          <div style={{ height: 280 }} className="relative">
            <AvatarPreview
              selectedAssets={selectedAssets}
              selectedColors={selectedColors}
              className="w-full h-full"
              animation={activeAnim}
              onAnimationEnd={() => setActiveAnim("Idle")}
            />
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-muted/30 to-transparent pointer-events-none" />
          </div>
          {/* Botones de animación */}
          <div className="px-4 pb-4 flex flex-wrap gap-2 justify-center">
            {ANIMATIONS.map((anim) => (
              <button
                key={anim.id}
                onClick={() => setActiveAnim(anim.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                  activeAnim === anim.id
                    ? "bg-vcf-orange text-white shadow-md"
                    : "bg-card border border-border text-muted-foreground hover:border-vcf-orange hover:text-vcf-orange"
                }`}
              >
                {anim.label}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
