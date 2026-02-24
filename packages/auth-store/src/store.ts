import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import type { UserRead } from "@flockloop/shared-types";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: UserRead | null;
}

interface AuthActions {
  setAuth: (token: string, refreshToken: string | null, user: UserRead | null) => void;
  setTokens: (token: string, refreshToken: string) => void;
  setUser: (user: UserRead) => void;
  logout: () => void;
}

interface AuthStore extends AuthState, AuthActions {}

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  user: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setAuth: (token, refreshToken, user) => set({ token, refreshToken, user }),
      setTokens: (token, refreshToken) => set({ token, refreshToken }),
      setUser: (user) => set({ user }),
      logout: () => set(initialState),
    }),
    {
      name: "flockloop-auth",
    },
  ),
);

// Derived selectors — compute during rendering, not via useEffect
export const selectIsAuthenticated = (state: AuthStore) =>
  state.token !== null;
export const selectIsCreator = (state: AuthStore) =>
  state.user?.type === "content_creator";
export const selectIsManager = (state: AuthStore) =>
  state.user?.type === "campaign_manager";
export const selectIsAdmin = (state: AuthStore) =>
  state.user?.is_admin === true;

// For mobile: allow injecting AsyncStorage as custom storage
export function createAuthStoreWithStorage(storage: StateStorage) {
  return create<AuthStore>()(
    persist(
      (set) => ({
        ...initialState,
        setAuth: (token, refreshToken, user) => set({ token, refreshToken, user }),
        setTokens: (token, refreshToken) => set({ token, refreshToken }),
        setUser: (user) => set({ user }),
        logout: () => set(initialState),
      }),
      {
        name: "flockloop-auth",
        storage: createJSONStorage(() => storage),
      },
    ),
  );
}
