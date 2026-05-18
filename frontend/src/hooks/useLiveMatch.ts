import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import type { LiveMatchState } from "../services/matchRoomsService";

export function useLiveMatch(matchId: string | null) {
  const [liveMatch, setLiveMatch] = useState<LiveMatchState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) {
      setLoading(false);
      return;
    }

    supabase
      .from("match_live_state")
      .select("*")
      .eq("match_id", matchId)
      .single()
      .then(({ data }) => {
        if (data) setLiveMatch(data as LiveMatchState);
        setLoading(false);
      });

    const channel = supabase
      .channel(`match_live_${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "match_live_state",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setLiveMatch(null);
          } else {
            setLiveMatch(payload.new as LiveMatchState);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [matchId]);

  return { liveMatch, loading };
}
