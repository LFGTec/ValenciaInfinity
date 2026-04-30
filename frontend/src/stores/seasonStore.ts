import { atom } from "jotai";

export interface SeasonStatus {
  in_season: boolean;
  off_season: boolean;
  season_start: string;
  season_end: string;
  season_name: string;
}

interface SeasonState {
  data: SeasonStatus | null;
  cargando: boolean;
  error: string | null;
  fetched: boolean;
}

export const seasonAtom = atom<SeasonState>({
  data: null,
  cargando: true,
  error: null,
  fetched: false,
});