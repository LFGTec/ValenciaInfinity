export const COMP_COLORS: Record<string, string> = {
  "LA LIGA": "#ff671f",
  CHAMPIONS: "#1a1a2e",
};

export const colorComp = (comp: string) => COMP_COLORS[comp] ?? "#D18817";

export const NOMBRES_MES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
export const NOMBRES_DIA = ["L", "M", "X", "J", "V", "S", "D"];

//funciones para calendario
export function primerDiaDeMes(anio: number, mes: number): number {
  const d = new Date(anio, mes, 1).getDay();
  return d === 0 ? 6 : d - 1;
}
export function diasEnMes(anio: number, mes: number): number {
  return new Date(anio, mes + 1, 0).getDate();
}