import { useState, useEffect, useRef } from "react";
import { supabase } from "../services/supabaseClient";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface EmojiMessage {
  id: string;
  userId: string;
  username: string;
  emoji: string;
  sentAt: string;
}

export function useRoomChat(roomId: string | null) {
  const [messages, setMessages] = useState<EmojiMessage[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const channel = supabase.channel(`room_chat_${roomId}`);

    channel
      .on("broadcast", { event: "emoji" }, ({ payload }) => {
        setMessages((prev) => [...prev.slice(-99), payload as EmojiMessage]);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [roomId]);

  const sendEmoji = async (emoji: string, user: { id: string; username: string }) => {
    if (!channelRef.current) return;

    const message: EmojiMessage = {
      id: crypto.randomUUID(),
      userId: user.id,
      username: user.username,
      emoji,
      sentAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev.slice(-99), message]);

    await channelRef.current.send({
      type: "broadcast",
      event: "emoji",
      payload: message,
    });
  };

  return { messages, sendEmoji };
}
