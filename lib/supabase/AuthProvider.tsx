"use client";

import * as React from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "./client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthActionLoading: boolean;
  authLoadingMessage: string;
  setAuthActionLoading: (loading: boolean, message?: string) => void;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAuthActionLoading: false,
  authLoadingMessage: "",
  setAuthActionLoading: () => {},
  signOut: async () => {},
});

/**
 * Authentication Context Provider that manages and distributes the Supabase authentication state.
 * Also provides a global mature loading animation overlay for background auth processes
 * (signup, sign in, sign out, and session hydration) preventing hydration pops and layout shift.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Background action loading state (for sign up, sign in, sign out, etc.)
  const [isAuthActionLoading, setIsAuthActionLoading] = React.useState(false);
  const [authLoadingMessage, setAuthLoadingMessage] = React.useState("Authenticating secure session...");

  // Memoize the supabase client instance to avoid recreating it on every render
  const supabase = React.useMemo(() => createClient(), []);

  const setAuthActionLoading = React.useCallback((isLoading: boolean, message?: string) => {
    setIsAuthActionLoading(isLoading);
    if (message) {
      setAuthLoadingMessage(message);
    }
  }, []);

  React.useEffect(() => {
    // 1. Immediate detection of recovery hash or recovery code landing on homepage / other pages
    if (typeof window !== "undefined") {
      const { pathname, search, hash } = window.location;
      if (!pathname.includes("/auth/reset-password")) {
        // Case A: Supabase redirected to Site URL with recovery tokens in hash
        if (hash && (hash.includes("type=recovery") || hash.includes("access_token="))) {
          window.location.replace("/auth/reset-password" + hash);
          return;
        }
        // Case B: Supabase redirected to homepage with PKCE code
        const params = new URLSearchParams(search);
        if (pathname === "/" && params.has("code")) {
          window.location.replace(`/auth/reset-password${search}`);
          return;
        }
      }
    }

    // Fetch session on load
    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      setSession(activeSession);
      setUser(activeSession?.user ?? null);
      setLoading(false);
    });

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);

      if (event === "PASSWORD_RECOVERY") {
        if (typeof window !== "undefined" && !window.location.pathname.includes("/auth/reset-password")) {
          window.location.replace("/auth/reset-password");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = React.useCallback(async () => {
    setAuthActionLoading(true, "Terminating secure session & purging credentials...");
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
      setAuthActionLoading(false);
    }
  }, [supabase, setAuthActionLoading]);

  const value = React.useMemo(
    () => ({
      user,
      session,
      loading,
      isAuthActionLoading,
      authLoadingMessage,
      setAuthActionLoading,
      signOut,
    }),
    [user, session, loading, isAuthActionLoading, authLoadingMessage, setAuthActionLoading, signOut]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access authentication context.
 */
export const useAuth = () => React.useContext(AuthContext);

