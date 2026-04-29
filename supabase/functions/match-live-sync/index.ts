import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "@supabase/functions-js/edge-runtime.d.ts";

const FOOTBALL_API_BASE = "https://api.football-data.org/v4";
const VALENCIA_TEAM_ID = 95;

Deno.serve(async () => {
  const API_KEY = Deno.env.get("FOOTBALL_API_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Missing env vars" }), { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const apiHeaders = { "X-Auth-Token": API_KEY };

  // Check IN_PLAY and PAUSED (halftime) in parallel — 2 requests
  const [liveRes, pausedRes] = await Promise.all([
    fetch(`${FOOTBALL_API_BASE}/teams/${VALENCIA_TEAM_ID}/matches?status=IN_PLAY`, { headers: apiHeaders }),
    fetch(`${FOOTBALL_API_BASE}/teams/${VALENCIA_TEAM_ID}/matches?status=PAUSED`, { headers: apiHeaders }),
  ]);

  const [liveData, pausedData] = await Promise.all([liveRes.json(), pausedRes.json()]);

  const activeMatches = [
    ...(liveData.matches ?? []),
    ...(pausedData.matches ?? []),
  ];

  if (activeMatches.length === 0) {
    return new Response(JSON.stringify({ message: "No live match" }), { status: 200 });
  }

  const match = activeMatches[0];

  // Fetch full detail: events, lineups — 1 request
  const detailRes = await fetch(`${FOOTBALL_API_BASE}/matches/${match.id}`, { headers: apiHeaders });
  const detail = await detailRes.json();

  // Parse events: goals, cards, substitutions
  const events: any[] = [];

  for (const goal of detail.goals ?? []) {
    events.push({
      type: "GOAL",
      minute: goal.minute,
      team: goal.team.name,
      player: goal.scorer?.name ?? null,
      assist: goal.assist?.name ?? null,
    });
  }

  for (const booking of detail.bookings ?? []) {
    events.push({
      type: booking.card,
      minute: booking.minute,
      team: booking.team.name,
      player: booking.playerReceivingCard?.name ?? null,
    });
  }

  for (const sub of detail.substitutions ?? []) {
    events.push({
      type: "SUBSTITUTION",
      minute: sub.minute,
      team: sub.team.name,
      playerIn: sub.playerIn?.name ?? null,
      playerOut: sub.playerOut?.name ?? null,
    });
  }

  events.sort((a, b) => (a.minute ?? 0) - (b.minute ?? 0));

  // Parse lineups
  const lineups = {
    home: (detail.homeTeam?.lineup ?? []).map((p: any) => ({
      number: p.shirtNumber,
      name: p.name,
      position: p.position,
    })),
    away: (detail.awayTeam?.lineup ?? []).map((p: any) => ({
      number: p.shirtNumber,
      name: p.name,
      position: p.position,
    })),
  };

  // Score — prefer fullTime, fallback to halfTime
  const score = detail.score ?? match.score;
  const homeScore = score?.fullTime?.home ?? score?.halfTime?.home ?? 0;
  const awayScore = score?.fullTime?.away ?? score?.halfTime?.away ?? 0;

  const { error } = await supabase.from("match_live_state").upsert({
    match_id: String(match.id),
    home_team: match.homeTeam.name,
    away_team: match.awayTeam.name,
    home_score: homeScore,
    away_score: awayScore,
    minute: detail.minute ?? null,
    status: match.status,
    events,
    stats: {},
    lineups,
    competition: match.competition.name,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(
    JSON.stringify({
      message: "Updated",
      match: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
      score: `${homeScore} - ${awayScore}`,
      minute: detail.minute ?? null,
      status: match.status,
    }),
    { status: 200 }
  );
});
