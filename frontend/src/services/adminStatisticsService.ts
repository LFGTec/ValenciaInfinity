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
  key: "trades" | "matchRooms";
  title: string;
  value: number;
  description: string;
  changePercent: number;
  changeLabel: string;
};

type TriviaAttemptRow = {
  user_id: string | null;
  trivia_id?: string | null;
  percentage: number | string | null;
  completed_at: string | null;
  profiles?: {
    full_name?: string | null;
    email?: string | null;
    puntos?: number | string | null;
  } | null;
  trivias?: {
    title?: string | null;
  } | null;
};

const getStartDateByRange = (range: TimeRange): string => {
  const date = new Date();

  if (range === "day") date.setDate(date.getDate() - 1);
  if (range === "week") date.setDate(date.getDate() - 7);
  if (range === "month") date.setMonth(date.getMonth() - 1);

  return date.toISOString();
};

const getRangeStartDate = (range: TimeRange): Date => {
  const date = new Date();

  if (range === "day") date.setDate(date.getDate() - 1);
  if (range === "week") date.setDate(date.getDate() - 7);
  if (range === "month") date.setMonth(date.getMonth() - 1);

  return date;
};

const getPreviousRangeStartDate = (range: TimeRange): Date => {
  const date = getRangeStartDate(range);

  if (range === "day") date.setDate(date.getDate() - 1);
  if (range === "week") date.setDate(date.getDate() - 7);
  if (range === "month") date.setMonth(date.getMonth() - 1);

  return date;
};

const formatDate = (date?: string | null): string => {
  if (!date) return "Sin fecha";

  return new Date(date).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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

const getCountBetweenDates = async (
  tableName: string,
  dateColumn: string,
  startDate: Date,
  endDate: Date
): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select("*", { count: "exact", head: true })
      .gte(dateColumn, startDate.toISOString())
      .lt(dateColumn, endDate.toISOString());

    if (error) throw error;

    return count ?? 0;
  } catch (error) {
    console.error(`Error contando ${tableName} entre fechas:`, error);
    return 0;
  }
};

const calculateChangePercent = (
  currentValue: number,
  previousValue: number
): number => {
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0;
  }

  return Math.round(((currentValue - previousValue) / previousValue) * 100);
};

export const getAdminStatsSummary = async (
  range: TimeRange = "week"
): Promise<AdminStatsSummary> => {
  const startDate = getStartDateByRange(range);

  let query: any = supabase
    .from("trivia_attempts")
    .select("user_id, percentage, completed_at")
    .gte("completed_at", startDate);

  let { data, error } = await query;

  if (error) {
    console.warn(
      "No se pudo filtrar trivia_attempts por fecha. Se usará el total general.",
      error
    );

    const fallback = await supabase
      .from("trivia_attempts")
      .select("user_id, percentage, completed_at");

    data = fallback.data;
    error = fallback.error;
  }

  if (error) {
    console.error("Error obteniendo resumen de estadísticas:", error);

    return {
      activeUsers: 0,
      triviasPlayed: 0,
      averageScore: 0,
      completionRate: 0,
    };
  }

  const attempts: TriviaAttemptRow[] = (data ?? []) as TriviaAttemptRow[];

  const uniqueUsers = new Set(
    attempts
      .map((attempt: TriviaAttemptRow) => attempt.user_id)
      .filter(Boolean)
  );

  const averageScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce(
            (total: number, attempt: TriviaAttemptRow) =>
              total + Number(attempt.percentage ?? 0),
            0
          ) / attempts.length
        )
      : 0;

  return {
    activeUsers: uniqueUsers.size,
    triviasPlayed: attempts.length,
    averageScore,
    completionRate: attempts.length > 0 ? 100 : 0,
  };
};

export const getMostActiveUsers = async (
  range: TimeRange = "week"
): Promise<ActiveUserStat[]> => {
  const startDate = getStartDateByRange(range);

  let query: any = supabase
    .from("trivia_attempts")
    .select(`
      user_id,
      completed_at,
      profiles:user_id (
        full_name,
        email,
        puntos
      )
    `)
    .gte("completed_at", startDate);

  let { data, error } = await query;

  if (error) {
    console.warn(
      "No se pudo filtrar usuarios activos por fecha. Se usará el total general.",
      error
    );

    const fallback = await supabase
      .from("trivia_attempts")
      .select(`
        user_id,
        completed_at,
        profiles:user_id (
          full_name,
          email,
          puntos
        )
      `);

    data = fallback.data;
    error = fallback.error;
  }

  if (error) {
    console.error("Error obteniendo usuarios más activos:", error);
    return [];
  }

  const attempts: TriviaAttemptRow[] = (data ?? []) as TriviaAttemptRow[];
  const groupedUsers = new Map<string, ActiveUserStat>();

  attempts.forEach((attempt: TriviaAttemptRow) => {
    if (!attempt.user_id) return;

    const profile = Array.isArray(attempt.profiles)
      ? attempt.profiles[0]
      : attempt.profiles;

    const current = groupedUsers.get(attempt.user_id) ?? {
      userId: attempt.user_id,
      username: profile?.full_name || profile?.email || "Usuario sin nombre",
      triviasCompleted: 0,
      points: Number(profile?.puntos ?? 0),
      lastActive: formatDate(attempt.completed_at),
    };

    current.triviasCompleted += 1;
    current.points = Number(profile?.puntos ?? current.points ?? 0);
    current.lastActive = formatDate(attempt.completed_at);

    groupedUsers.set(attempt.user_id, current);
  });

  return Array.from(groupedUsers.values())
    .sort((a: ActiveUserStat, b: ActiveUserStat) => {
      return b.triviasCompleted - a.triviasCompleted;
    })
    .slice(0, 5);
};

export const getPopularTrivias = async (
  range: TimeRange = "week"
): Promise<PopularTriviaStat[]> => {
  const startDate = getStartDateByRange(range);

  let query: any = supabase
    .from("trivia_attempts")
    .select(`
      trivia_id,
      percentage,
      completed_at,
      trivias:trivia_id (
        title
      )
    `)
    .gte("completed_at", startDate);

  let { data, error } = await query;

  if (error) {
    console.warn(
      "No se pudo filtrar trivias populares por fecha. Se usará el total general.",
      error
    );

    const fallback = await supabase
      .from("trivia_attempts")
      .select(`
        trivia_id,
        percentage,
        completed_at,
        trivias:trivia_id (
          title
        )
      `);

    data = fallback.data;
    error = fallback.error;
  }

  if (error) {
    console.error("Error obteniendo trivias populares:", error);
    return [];
  }

  const attempts: TriviaAttemptRow[] = (data ?? []) as TriviaAttemptRow[];

  const groupedTrivias = new Map<
    string,
    {
      triviaId: string;
      title: string;
      participants: number;
      totalScore: number;
    }
  >();

  attempts.forEach((attempt: TriviaAttemptRow) => {
    if (!attempt.trivia_id) return;

    const trivia = Array.isArray(attempt.trivias)
      ? attempt.trivias[0]
      : attempt.trivias;

    const current = groupedTrivias.get(attempt.trivia_id) ?? {
      triviaId: attempt.trivia_id,
      title: trivia?.title || "Trivia sin título",
      participants: 0,
      totalScore: 0,
    };

    current.participants += 1;
    current.totalScore += Number(attempt.percentage ?? 0);

    groupedTrivias.set(attempt.trivia_id, current);
  });

  return Array.from(groupedTrivias.values())
    .map((trivia) => ({
      triviaId: trivia.triviaId,
      title: trivia.title,
      participants: trivia.participants,
      avgScore:
        trivia.participants > 0
          ? Math.round(trivia.totalScore / trivia.participants)
          : 0,
    }))
    .sort((a: PopularTriviaStat, b: PopularTriviaStat) => {
      return b.participants - a.participants;
    })
    .slice(0, 5);
};

export const getFeatureUsageStats = async (
  range: TimeRange = "week"
): Promise<FeatureUsageStat[]> => {
  const [matchRooms, trivias, album, rankings, trades, virtualWorld] =
    await Promise.all([
      safeCount("match_rooms", range, "created_at"),
      safeCount("trivia_attempts", range, "completed_at"),
      safeCount("user_cards", range, "created_at"),
      safeCount("profiles"),
      safeCount("trade_requests", range, "created_at"),
      safeCount("user_locations", range, "updated_at"),
    ]);

  return [
    {
      key: "matchRooms",
      name: "Match Rooms",
      value: matchRooms,
      description: "Salas creadas",
    },
    {
      key: "trivias",
      name: "Trivias",
      value: trivias,
      description: "Intentos registrados",
    },
    {
      key: "album",
      name: "Álbum",
      value: album,
      description: "Cartas guardadas",
    },
    {
      key: "rankings",
      name: "Rankings",
      value: rankings,
      description: "Usuarios registrados",
    },
    {
      key: "trades",
      name: "Intercambios",
      value: trades,
      description: "Solicitudes de intercambio",
    },
    {
      key: "virtualWorld",
      name: "Mundo Virtual",
      value: virtualWorld,
      description: "Usuarios con ubicación",
    },
  ];
};

export const getComparisonStats = async (
  range: TimeRange = "week"
): Promise<ComparisonStat[]> => {
  const now = new Date();
  const currentStart = getRangeStartDate(range);
  const previousStart = getPreviousRangeStartDate(range);

  const [tradesCurrent, tradesPrevious, matchRoomsCurrent, matchRoomsPrevious] =
    await Promise.all([
      getCountBetweenDates("trade_requests", "created_at", currentStart, now),
      getCountBetweenDates(
        "trade_requests",
        "created_at",
        previousStart,
        currentStart
      ),
      getCountBetweenDates("match_rooms", "created_at", currentStart, now),
      getCountBetweenDates(
        "match_rooms",
        "created_at",
        previousStart,
        currentStart
      ),
    ]);

  const tradesChange = calculateChangePercent(tradesCurrent, tradesPrevious);
  const matchRoomsChange = calculateChangePercent(
    matchRoomsCurrent,
    matchRoomsPrevious
  );

  return [
    {
      key: "trades",
      title: "Cartas Intercambiadas",
      value: tradesCurrent,
      description: "Solicitudes de intercambio",
      changePercent: tradesChange,
      changeLabel: `${tradesChange >= 0 ? "+" : ""}${tradesChange}% vs período anterior`,
    },
    {
      key: "matchRooms",
      title: "Visitas a Match Rooms",
      value: matchRoomsCurrent,
      description: "Actividad en Match Rooms",
      changePercent: matchRoomsChange,
      changeLabel: `${matchRoomsChange >= 0 ? "+" : ""}${matchRoomsChange}% vs período anterior`,
    },
  ];
};