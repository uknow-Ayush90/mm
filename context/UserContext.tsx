"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import type { LocalUser } from "@/types";
import { generateAvatarColor } from "@/lib/utils";

interface UserContextValue {
  user: LocalUser | null;
  setUser: (u: LocalUser) => void;
  isLoading: boolean;
  showOnboarding: boolean;
  setShowOnboarding: (v: boolean) => void;
}

interface State {
  user: LocalUser | null;
  isLoading: boolean;
  showOnboarding: boolean;
}

type Action =
  | { type: "INIT"; user: LocalUser | null }
  | { type: "SET_USER"; user: LocalUser }
  | { type: "SET_ONBOARDING"; show: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INIT":
      return { user: action.user, isLoading: false, showOnboarding: !action.user };
    case "SET_USER":
      return { user: action.user, isLoading: false, showOnboarding: false };
    case "SET_ONBOARDING":
      return { ...state, showOnboarding: action.show };
  }
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    isLoading: true,
    showOnboarding: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem("ashoka_user");
    let parsed: LocalUser | null = null;
    if (stored) {
      try {
        parsed = JSON.parse(stored);
      } catch {
        localStorage.removeItem("ashoka_user");
      }
    }
    dispatch({ type: "INIT", user: parsed });
  }, []);

  function setUser(u: LocalUser) {
    localStorage.setItem("ashoka_user", JSON.stringify(u));
    dispatch({ type: "SET_USER", user: u });
  }

  function setShowOnboarding(show: boolean) {
    dispatch({ type: "SET_ONBOARDING", show });
  }

  return (
    <UserContext.Provider
      value={{
        user: state.user,
        setUser,
        isLoading: state.isLoading,
        showOnboarding: state.showOnboarding,
        setShowOnboarding,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}

export function generateUserId(): string {
  return "u_" + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

export { generateAvatarColor };
