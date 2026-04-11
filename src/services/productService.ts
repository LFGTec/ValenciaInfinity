import { supabase } from "./supabaseClient";
export type Product = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  stock: number;
};

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("Products")
    .select("*");

  if (error) {
    console.error(error);
    return [];
  }

  return data as Product[];
};