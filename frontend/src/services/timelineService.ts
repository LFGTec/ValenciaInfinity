import { supabase } from "./supabaseClient";

export interface TimelineEvent {
  id: number;
  title: string;
  date: string;
  year: number;
  description: string;
  image_url?: string | null;
  created_at?: string;
}

export interface CreateTimelineEvent {
  title: string;
  date: string;
  year: number;
  description: string;
  image_url?: string | null;
}

export const getTimelineEvents = async (): Promise<TimelineEvent[]> => {
  const { data, error } = await supabase
    .from("timeline_events")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error("Error obteniendo acontecimientos:", error);
    return [];
  }

  return data || [];
};

export const createTimelineEvent = async (
  event: CreateTimelineEvent
): Promise<TimelineEvent | null> => {
  const { data, error } = await supabase
    .from("timeline_events")
    .insert([event])
    .select()
    .single();

  if (error) {
    console.error("Error creando acontecimiento:", error);
    throw error;
  }

  return data;
};

export const deleteTimelineEvent = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from("timeline_events")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error eliminando acontecimiento:", error);
    throw error;
  }
};

export const uploadTimelineImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${fileExt}`;

  const filePath = `timeline/${fileName}`;

  console.log("Subiendo imagen:", {
    bucket: "timeline-images",
    filePath,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  });

  const { data, error } = await supabase.storage
    .from("timeline-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error("Error subiendo imagen a Storage:", error);
    throw error;
  }

  console.log("Imagen subida correctamente:", data);

  const { data: publicUrlData } = supabase.storage
    .from("timeline-images")
    .getPublicUrl(filePath);

  console.log("URL pública:", publicUrlData.publicUrl);

  return publicUrlData.publicUrl;
};

export const updateTimelineEvent = async (
  id: number,
  event: CreateTimelineEvent
): Promise<TimelineEvent | null> => {
  const { data, error } = await supabase
    .from("timeline_events")
    .update(event)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error actualizando acontecimiento:", error);
    throw error;
  }

  return data;
};