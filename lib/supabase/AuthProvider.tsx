"use client";

import * as React from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "./client";
import { AuthLoadingOverlay } from "@/components/auth/AuthLoadingOverlay";

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
    // Fetch session on load
    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      setSession(activeSession);
      setUser(activeSession?.user ?? null);
      setLoading(false);
    });

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
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
      <AuthLoadingOverlay
        isVisible={isAuthActionLoading}
        message={authLoadingMessage}
      />
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access authentication context.
 */
export const useAuth = () => React.useContext(AuthContext);

