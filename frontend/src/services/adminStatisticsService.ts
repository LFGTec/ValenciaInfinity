import { supabase } from "./supabaseClient";

export type TimeRange = "day" | "week" | "month";

export type AdminStatsSummary = {
  activeUsers: number;
  triviasPlayed: number;
  averageScore: number;
  completionRate: number;
};

export type ActiveUserStat = {
  userId: string;
  username: string;
  triviasCompleted: number;
  points: number;
  lastActive: string;
};

export type PopularTriviaStat = {
  triviaId: string;
  title: string;
  participants: number;
  avgScore: number;
};

export type FeatureUsageKey =
  | "matchRooms"
  | "trivias"
  | "album"
  | "rankings"
  | "trades"
  | "virtualWorld";

export type FeatureUsageStat = {
  key: FeatureUsageKey;
  name: string;
  value: number;
  description: string;
};

export type ComparisonStat = {
  key: "trades" | "trivias";
  title: string;
  value: number;
  description: string;
  changePercent: number;
  changeLabel: string;
};

const getStartDateByRange = (range: TimeRange): string => {
  const date = new Date();

  if (range === "day") date.setDate(date.getDate() - 1);
  if (range === "week") date.setDate(date.getDate() - 7);
  if (range === "month") date.setMonth(date.getMonth() - 1);

  return date.toISOString();
};

const safeCount = async (
  tableName: string,
  range?: TimeRange,
  dateColumn?: string
): Promise<number> => {
  try {
    let query: any = supabase
      .from(tableName)
      .select("*", { count: "exact", head: true });

    if (range && dateColumn) {
      query = query.gte(dateColumn, getStartDateByRange(range));
    }

    const { count, error } = await query;

    if (error) throw error;

    return count ?? 0;
  } catch (error) {
    console.warn(
      `No se pudo contar ${tableName} con filtro de fecha. Se intenta total general.`,
      error
    );

    try {
      const { count, error: fallbackError } = await supabase
        .from(tableName)
        .select("*", { count: "exact", head: true });

      if (fallbackError) throw fallbackError;

      return count ?? 0;
    } catch (fallbackError) {
      console.error(`No se pudo contar ${tableName}:`, fallbackError);
      return 0;
    }
  }
};


export const getAdminStatsSummary = async (
  range: TimeRange = "week"
): Promise<AdminStatsSummary> => {
  const startDate = getStartDateByRange(range);

  // Try with date filter; if created_at doesn't exist fall back to all rows
  const { data: filtered, error: filteredErr } = await supabase
    .from("trivia_attempts")
    .select("user_id, percentage")
    .gte("created_at", startDate);

  let data: any[] | null;
  if (filteredErr) {
    const { data: all, error: allErr } = await supabase
      .from("trivia_attempts")
      .select("user_id, percentage");
    if (allErr) {
      console.error("Error obteniendo resumen de estadísticas:", allErr);
      return { activeUsers: 0, triviasPlayed: 0, averageScore: 0, completionRate: 0 };
    }
    data = all;
  } else {
    data = filtered;
  }

  if (!data || data.length === 0) {
    return { activeUsers: 0, triviasPlayed: 0, averageScore: 0, completionRate: 0 };
  }

  const uniqueUsers = new Set(data.map((r: any) => r.user_id).filter(Boolean));
  const averageScore = Math.round(
    data.reduce((sum: number, r: any) => sum + Number(r.percentage ?? 0), 0) / data.length
  );

  return {
    activeUsers: uniqueUsers.size,
    triviasPlayed: data.length,
    averageScore,
    completionRate: 100,
  };
};

export const getMostActiveUsers = async (
  range: TimeRange = "week"
): Promise<ActiveUserStat[]> => {
  const startDate = getStartDateByRange(range);

  // Try with date filter; fall back to all rows if created_at doesn't exist
  const { data: filtered, error: filteredErr } = await supabase
    .from("trivia_attempts")
    .select("user_id")
    .gte("created_at", startDate);

  let allAttempts: any[];
  if (filteredErr) {
    const { data: all } = await supabase.from("trivia_attempts").select("user_id");
    allAttempts = all ?? [];
  } else {
    allAttempts = filtered ?? [];
  }

  if (allAttempts.length === 0) return [];

  // Step 2: count trivias per user
  const userCountMap = new Map<string, number>();
  for (const row of allAttempts) {
    if (!row.user_id) continue;
    userCountMap.set(row.user_id, (userCountMap.get(row.user_id) ?? 0) + 1);
  }

  // Top 5 by trivia count
  const top5 = Array.from(userCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const top5Ids = top5.map(([id]) => id);

  // Step 3: fetch profiles separately
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, puntos")
    .in("id", top5Ids);

  const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));

  return top5.map(([userId, count]) => {
    const profile = profileMap.get(userId) as any;
    return {
      userId,
      username: profile?.full_name || profile?.email || "Usuario sin nombre",
      triviasCompleted: count,
      points: Number(profile?.puntos ?? 0),
      lastActive: "-",
    };
  });
};

export const getPopularTrivias = async (
  range: TimeRange = "week"
): Promise<PopularTriviaStat[]> => {
  const startDate = getStartDateByRange(range);

  // Try with date filter; fall back to all rows if created_at doesn't exist
  const { data: filtered, error: filteredErr } = await supabase
    .from("trivia_attempts")
    .select("trivia_id, percentage")
    .gte("created_at", startDate);

  let attemptsData: any[];
  if (filteredErr) {
    const { data: all } = await supabase.from("trivia_attempts").select("trivia_id, percentage");
    attemptsData = all ?? [];
  } else {
    attemptsData = filtered ?? [];
  }

  if (attemptsData.length === 0) return [];

  // Step 2: group by trivia_id
  const triviaMap = new Map<string, { participants: number; totalScore: number }>();
  for (const row of attemptsData) {
    if (!row.trivia_id) continue;
    const prev = triviaMap.get(row.trivia_id);
    triviaMap.set(row.trivia_id, {
      participants: (prev?.participants ?? 0) + 1,
      totalScore: (prev?.totalScore ?? 0) + Number(row.percentage ?? 0),
    });
  }

  // Top 5 by participants
  const top5 = Array.from(triviaMap.entries())
    .sort((a, b) => b[1].participants - a[1].participants)
    .slice(0, 5);

  const top5Ids = top5.map(([id]) => id);

  // Step 3: fetch trivia titles separately
  const { data: trivias } = await supabase
    .from("trivias")
    .select("id, title")
    .in("id", top5Ids);

  const triviaNames = new Map((trivias ?? []).map((t: any) => [t.id, t.title]));

  return top5.map(([triviaId, { participants, totalScore }]) => ({
    triviaId,
    title: triviaNames.get(triviaId) || "Trivia sin título",
    participants,
    avgScore: participants > 0 ? Math.round(totalScore / participants) : 0,
  }));
};

export const getFeatureUsageStats = async (
  range: TimeRange = "week"
): Promise<FeatureUsageStat[]> => {
  const [matchRooms, trivias, album, rankings, trades, virtualWorld] =
    await Promise.all([
      safeCount("match_rooms", range, "created_at"),
      safeCount("trivia_attempts", range, "created_at"),
      safeCount("user_cards", range, "created_at"),
      safeCount("profiles", range, "created_at"),
      safeCount("trade_requests", range, "created_at"),
      safeCount("user_locations", range, "created_at"),
    ]);

  return [
    {
      key: "matchRooms",
      name: "Match Rooms",
      value: matchRooms,
      description: "Salas en el período",
    },
    {
      key: "trivias",
      name: "Trivias",
      value: trivias,
      description: "Intentos en el período",
    },
    {
      key: "album",
      name: "Álbum",
      value: album,
      description: "Cartas en el período",
    },
    {
      key: "rankings",
      name: "Rankings",
      value: rankings,
      description: "Usuarios en el período",
    },
    {
      key: "trades",
      name: "Intercambios",
      value: trades,
      description: "Solicitudes en el período",
    },
    {
      key: "virtualWorld",
      name: "Mundo Virtual",
      value: virtualWorld,
      description: "Ubicaciones en el período",
    },
  ];
};

export const getComparisonStats = async (
  range: TimeRange = "week"
): Promise<ComparisonStat[]> => {
  // Use safeCount with range — falls back to total if created_at doesn't exist
  const [tradesCurrent, triviasCurrent] = await Promise.all([
    safeCount("trade_requests", range, "created_at"),
    safeCount("trivia_attempts", range, "created_at"),
  ]);

  return [
    {
      key: "trades" as const,
      title: "Cartas Intercambiadas",
      value: tradesCurrent,
      description: "Solicitudes en el período",
      changePercent: 0,
      changeLabel: "Período seleccionado",
    },
    {
      key: "trivias" as const,
      title: "Trivias Jugadas",
      value: triviasCurrent,
      description: "Intentos en el período",
      changePercent: 0,
      changeLabel: "Período seleccionado",
    },
  ];
};