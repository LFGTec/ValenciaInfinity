import { atom } from "jotai";
import type { Partido, EstadisticasTemporada } from "../hooks/usePartidosVCF";

export interface PartidosState {
  proximos: Partido[];
  jugados: Partido[];
  estadisticas: EstadisticasTemporada | null;
  cargando: boolean;
  error: string | null;
  fetched: boolean;
}

export const partidosAtom = atom<PartidosState>({
  proximos: [],
  jugados: [],
  estadisticas: null,
  cargando: true,
  error: null,
  fetched: false,
});

export const proximosAtom = atom((get) => get(partidosAtom).proximos);
export const jugadosAtom = atom((get) => get(partidosAtom).jugados);
export const estadisticasAtom = atom((get) => get(partidosAtom).estadisticas);
export const cargandoAtom = atom((get) => get(partidosAtom).cargando);
export const errorPartidosAtom = atom((get) => get(partidosAtom).error);
