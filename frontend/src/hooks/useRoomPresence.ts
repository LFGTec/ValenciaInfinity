import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

export interface PresenceUser {
  userId: string;
  username: string;
  joinedAt: string;
}

export function useRoomPresence(
  roomId: string | null,
  user: { id: string; username: string } | null
) {
  const [spectators, setSpectators] = useState<PresenceUser[]>([]);

  useEffect(() => {
    if (!roomId || !user) return;

    const channel = supabase.channel(`room_presence_${roomId}`, {
      config: { presence: { key: user.id } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<PresenceUser>();
        const users = Object.values(state).flatMap((presences) =>
          presences.map((p) => ({
            userId: p.userId,
            username: p.username,
            joinedAt: p.joinedAt,
          }))
        );
        setSpectators(users);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            userId: user.id,
            username: user.username,
            joinedAt: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [roomId, user?.id]);

  return { spectators, count: spectators.length };
}
