// components/album/VisitorAlbumHeader.tsx

import { UserPlus, User, Send, Users, CheckCheck } from "lucide-react";
import { type VisitingProfile } from "@/hooks/useVisitingAlbum";

type Props = {
  friend: VisitingProfile;
  onSendFriendRequest: () => void;
};

export function VisitorAlbumHeader({
  friend,
  onSendFriendRequest,
}: Props) {

  return (
    <div className="bg-card border-2 border-vcf-orange rounded-lg p-8 mb-8 shadow-lg">

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

            {/* Avatar */}
            <div className="relative">

            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-vcf-orange to-vcf-yellow p-1 shadow-xl">

                <img
                src={friend.avatar_url}
                alt={friend.full_name}
                className="
                    w-full
                    h-full
                    rounded-full
                    border-4
                    border-card
                    object-cover
                "
                />

            </div>

            <div
                className="
                absolute
                -bottom-2
                -right-2
                w-10
                h-10
                bg-vcf-orange
                rounded-full
                flex
                items-center
                justify-center
                border-4
                border-card
                shadow-lg
                "
            >

                <CheckCheck
                size={20}
                className="text-white"
                />

            </div>

            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">

            <h1
                className="
                text-3xl
                md:text-4xl
                font-black
                text-foreground
                mb-2
                "
            >
                {friend.full_name}
            </h1>

            

            {/* Social button */}
            {friend.friendship_status === "NONE" && (

                <button
                onClick={onSendFriendRequest}
                className="
                    px-6
                    py-3
                    bg-vcf-orange
                    text-white
                    rounded-xl
                    font-black
                    shadow-lg
                    hover:scale-105
                    hover:bg-[#e5651a]
                    transition-all
                "
                >
                <UserPlus
                    size={18}
                    className="inline-block mr-2"
                />
                Agregar amigo
                </button>

            )}

            {(friend.friendship_status === "PENDING_SENT" ||
                friend.friendship_status === "PENDING_RECEIVED") && (

                <button
                disabled
                className="
                    px-6
                    py-3
                    bg-vcf-orange/20
                    text-vcf-orange
                    rounded-xl
                    font-black
                    cursor-not-allowed
                    border
                    border-vcf-orange/30
                "
                >
                <Send
                    size={18}
                    className="inline-block mr-2"
                />
                Solicitud enviada
                </button>

            )}

            {(friend.friendship_status === "FRIENDS") && (

                <button
                disabled
                className="
                    px-6
                    py-3
                    bg-vcf-orange/20
                    text-vcf-orange
                    rounded-xl
                    font-black
                    cursor-not-allowed
                    border
                    border-vcf-orange/30
                "
                >
                <Users
                    size={18}
                    className="inline-block mr-2"
                />
                Amigos
                </button>

            )}

            </div>

        </div>

    </div>
  );
}