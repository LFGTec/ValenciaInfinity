import { supabase } from "./supabaseClient";

export type Trivia = {
  id: string;
  title: string;
  description: string;
  questions: number;
  expires_at: string;
  reward: number;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  status: "active" | "inactive" | "draft";
  image_url: string;
};

export type CreateTrivia = {
  title: string;
  description: string;
  questions: number;
  expires_at: string;
  reward: number;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  status: "active" | "inactive" | "draft";
  image_url: string;
};

export type TriviaQuestion = {
  id: string;
  trivia_id: string;
  question: string;
  options: string[];
  correct_answer: number;
};

export type CreateTriviaQuestion = {
  trivia_id: string;
  question: string;
  options: string[];
  correct_answer: number;
};

export const getTrivias = async (): Promise<Trivia[]> => {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("trivias")
    .select("*")
    .eq("status", "active")
    .gt("expires_at", now)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error obteniendo trivias:", error);
    return [];
  }

  return data as Trivia[];
};

export const createTrivia = async (trivia: CreateTrivia): Promise<Trivia | null> => {
  const { data, error } = await supabase
    .from("trivias")
    .insert(trivia)
    .select("*")
    .single();

  if (error) {
    console.error("Error creando trivia:", error);
    return null;
  }

  return data as Trivia;
};

export const createTriviaQuestions = async (
  questions: CreateTriviaQuestion[]
): Promise<boolean> => {
  const { error } = await supabase
    .from("trivia_questions")
    .insert(questions);

  if (error) {
    console.error("Error creando preguntas:", error);
    return false;
  }

  return true;
};

export const getQuestionsByTriviaId = async (
  triviaId: string
): Promise<TriviaQuestion[]> => {
  const { data, error } = await supabase
    .from("trivia_questions")
    .select("*")
    .eq("trivia_id", triviaId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error obteniendo preguntas:", error);
    return [];
  }

  return data as TriviaQuestion[];
};

export const deleteTrivia = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from("trivias").delete().eq("id", id);

  if (error) {
    console.error("Error eliminando trivia:", error);
    return false;
  }

  return true;
};

export const deleteExpiredTrivias = async (): Promise<boolean> => {
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("trivias")
    .delete()
    .lt("expires_at", now);

  if (error) {
    console.error("Error eliminando trivias expiradas:", error);
    return false;
  }

  return true;
};

export const uploadTriviaImage = async (file: File): Promise<string | null> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `trivias/${fileName}`;

  const { error } = await supabase.storage
    .from("trivia-images")
    .upload(filePath, file);

  if (error) {
    console.error("Error subiendo imagen:", error);
    return null;
  }

  const { data } = supabase.storage
    .from("trivia-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
};