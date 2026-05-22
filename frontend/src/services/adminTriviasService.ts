import { supabase } from "./supabaseClient";
import type { Trivia, TriviaQuestion } from "./triviasService";

export type AdminTrivia = Trivia & {
  created_at?: string;
  updated_at?: string;
  computedStatus: "active" | "inactive" | "draft" | "expired";
  realQuestionCount: number;
};

const getComputedStatus = (trivia: Trivia): AdminTrivia["computedStatus"] => {
  if (trivia.expires_at && new Date(trivia.expires_at).getTime() <= Date.now()) {
    return "expired";
  }

  return trivia.status;
};

export const getAdminTrivias = async (): Promise<AdminTrivia[]> => {
  const { data, error } = await supabase
    .from("trivias")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error obteniendo trivias de administrador:", error);
    return [];
  }

  return (data ?? []).map((trivia) => {
    const typedTrivia = trivia as Trivia;

    return {
      ...typedTrivia,
      created_at: trivia.created_at,
      updated_at: trivia.updated_at,
      computedStatus: getComputedStatus(typedTrivia),
      realQuestionCount: Number(typedTrivia.questions ?? 0),
    };
  });
};

export const getAdminQuestionsByTriviaId = async (
  triviaId: string
): Promise<TriviaQuestion[]> => {
  const { data, error } = await supabase
    .from("trivia_questions")
    .select("*")
    .eq("trivia_id", triviaId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error obteniendo preguntas de trivia:", error);
    return [];
  }

  return data as TriviaQuestion[];
};