import { supabase } from "./supabaseClient";

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

const formatDate = (date?: string | null): string => {
  if (!date) return "Sin fecha";

  return new Date(date).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const getAdminStatsSummary = async (): Promise<AdminStatsSummary> => {
  const { data, error } = await supabase
    .from("trivia_attempts")
    .select("user_id, percentage");

  if (error) {
    console.error("Error obteniendo resumen de estadísticas:", error);

    return {
      activeUsers: 0,
      triviasPlayed: 0,
      averageScore: 0,
      completionRate: 0,
    };
  }

  const attempts = data ?? [];
  const uniqueUsers = new Set(attempts.map((attempt) => attempt.user_id));

  const averageScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce(
            (total, attempt) => total + Number(attempt.percentage ?? 0),
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

export const getMostActiveUsers = async (): Promise<ActiveUserStat[]> => {
  const { data, error } = await supabase
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

  if (error) {
    console.error("Error obteniendo usuarios más activos:", error);
    return [];
  }

  const groupedUsers = new Map<string, ActiveUserStat>();

  (data ?? []).forEach((attempt: any) => {
    const userId = attempt.user_id;
    const profile = attempt.profiles;

    const current = groupedUsers.get(userId) ?? {
      userId,
      username: profile?.full_name || profile?.email || "Usuario sin nombre",
      triviasCompleted: 0,
      points: Number(profile?.puntos ?? 0),
      lastActive: formatDate(attempt.completed_at),
    };

    current.triviasCompleted += 1;
    current.points = Number(profile?.puntos ?? current.points ?? 0);
    current.lastActive = formatDate(attempt.completed_at);

    groupedUsers.set(userId, current);
  });

  return Array.from(groupedUsers.values())
    .sort((a, b) => b.triviasCompleted - a.triviasCompleted)
    .slice(0, 5);
};

export const getPopularTrivias = async (): Promise<PopularTriviaStat[]> => {
  const { data, error } = await supabase
    .from("trivia_attempts")
    .select(`
      trivia_id,
      percentage,
      trivias:trivia_id (
        title
      )
    `);

  if (error) {
    console.error("Error obteniendo trivias populares:", error);
    return [];
  }

  const groupedTrivias = new Map<
    string,
    {
      triviaId: string;
      title: string;
      participants: number;
      totalScore: number;
    }
  >();

  (data ?? []).forEach((attempt: any) => {
    const triviaId = attempt.trivia_id;
    const trivia = attempt.trivias;

    const current = groupedTrivias.get(triviaId) ?? {
      triviaId,
      title: trivia?.title || "Trivia sin título",
      participants: 0,
      totalScore: 0,
    };

    current.participants += 1;
    current.totalScore += Number(attempt.percentage ?? 0);

    groupedTrivias.set(triviaId, current);
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
    .sort((a, b) => b.participants - a.participants)
    .slice(0, 5);
};