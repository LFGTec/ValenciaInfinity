import { supabase } from "./supabaseClient";

export interface RoomDB {
  id: string;
  name: string;
  host_id: string | null;
  match_id: string;
  match_label: string;
  is_private: boolean;
  is_main_room: boolean;
  invite_code: string | null;
  max_participants: number | null;
  created_at: string;
}

export interface LiveMatchState {
  match_id: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  minute: number | null;
  status: string;
  events: MatchEvent[];
  stats: Record<string, unknown>;
  lineups: { home: LineupPlayer[]; away: LineupPlayer[] };
  competition: string;
  updated_at: string;
}

export interface MatchEvent {
  type: "GOAL" | "YELLOW_CARD" | "RED_CARD" | "SUBSTITUTION";
  minute: number;
  team: string;
  player?: string | null;
  assist?: string | null;
  playerIn?: string | null;
  playerOut?: string | null;
}

export interface LineupPlayer {
  number: number;
  name: string;
  position: string;
}

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "VCF-";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function getPublicRooms(): Promise<RoomDB[]> {
  const { data, error } = await supabase
    .from("match_rooms")
    .select("*")
    .eq("is_private", false)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getMyRooms(userId: string): Promise<RoomDB[]> {
  const { data, error } = await supabase
    .from("match_rooms")
    .select("*")
    .eq("host_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getRoomByInviteCode(code: string): Promise<RoomDB | null> {
  const { data } = await supabase
    .from("match_rooms")
    .select("*")
    .eq("invite_code", code.toUpperCase())
    .single();

  return data ?? null;
}

export async function createRoom(params: {
  name: string;
  hostId: string;
  matchId: string;
  matchLabel: string;
  isPrivate: boolean;
  maxParticipants: number;
}): Promise<RoomDB> {
  const { data, error } = await supabase
    .from("match_rooms")
    .insert({
      name: params.name,
      host_id: params.hostId,
      match_id: params.matchId,
      match_label: params.matchLabel,
      is_private: params.isPrivate,
      is_main_room: false,
      invite_code: params.isPrivate ? generateInviteCode() : null,
      max_participants: params.maxParticipants,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrCreateMainRoom(matchId: string, matchLabel: string): Promise<RoomDB> {
  const roomName = `Sala General — ${matchLabel}`;

  const { data: existing } = await supabase
    .from("match_rooms")
    .select("*")
    .eq("match_id", matchId)
    .eq("is_main_room", true)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from("match_rooms")
      .update({ name: roomName, match_label: matchLabel })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("match_rooms")
    .insert({
      name: roomName,
      host_id: null,
      match_id: matchId,
      match_label: matchLabel,
      is_private: false,
      is_main_room: true,
      invite_code: null,
      max_participants: null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteRoom(roomId: string): Promise<void> {
  const { error } = await supabase.from("match_rooms").delete().eq("id", roomId);
  if (error) throw error;
}

export function subscribeToRooms(callback: () => void) {
  return supabase
    .channel("match_rooms_changes")
    .on("postgres_changes", { event: "*", schema: "public", table: "match_rooms" }, callback)
    .subscribe();
}
