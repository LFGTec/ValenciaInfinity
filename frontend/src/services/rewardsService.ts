import { supabase } from "./supabaseClient";

export type AddUserRewardParams = {
  reward: number;
};

export type AddUserRewardResponse = {
  success: boolean;
  message: string;
  newPoints: number;
  earnedPoints: number;
};

export const addRewardToCurrentUser = async ({
  reward,
}: AddUserRewardParams): Promise<AddUserRewardResponse> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "No hay usuario autenticado.",
      newPoints: 0,
      earnedPoints: 0,
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("puntos")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error obteniendo perfil:", profileError);

    return {
      success: false,
      message: "No se pudo obtener el perfil del usuario.",
      newPoints: 0,
      earnedPoints: 0,
    };
  }

  const currentPoints = Number(profile?.puntos ?? 0);
  const earnedPoints = Number(reward ?? 0);
  const newPoints = currentPoints + earnedPoints;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ puntos: newPoints })
    .eq("id", user.id);

  if (updateError) {
    console.error("Error actualizando puntos:", updateError);

    return {
      success: false,
      message: "No se pudieron actualizar los puntos del usuario.",
      newPoints: currentPoints,
      earnedPoints: 0,
    };
  }

  return {
    success: true,
    message: `Ganaste ${earnedPoints} puntos.`,
    newPoints,
    earnedPoints,
  };
};