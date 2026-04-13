import { atom } from "jotai";
import type { User, AuthSession } from "../services/authService";

export const authAtom = atom<AuthSession>({
  user: null,
  loading: true,
  error: null,
});

export const userAtom = atom((get) => get(authAtom).user);
export const loadingAtom = atom((get) => get(authAtom).loading);
export const errorAtom = atom((get) => get(authAtom).error);

export const setAuthAtom = atom(
  null,
  (_get, set, newAuth: AuthSession) => {
    set(authAtom, newAuth);
  }
);

export const setUserAtom = atom(
  null,
  (get, set, user: User | null) => {
    const current = get(authAtom);
    set(authAtom, {
      ...current,
      user,
      error: null,
    });
  }
);

export const setErrorAtom = atom(
  null,
  (get, set, error: string | null) => {
    const current = get(authAtom);
    set(authAtom, {
      ...current,
      error,
    });
  }
);

export const setLoadingAtom = atom(
  null,
  (get, set, loading: boolean) => {
    const current = get(authAtom);
    set(authAtom, {
      ...current,
      loading,
    });
  }
);
