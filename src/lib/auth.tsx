import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "./supabase";

export type Role = "admin" | "investor" | null;

interface AuthValue {
  configured: boolean;
  loading: boolean;
  user: User | null;
  email: string | null;
  role: Role;          // from allowlist; null = authenticated but not approved
  isAllowed: boolean;  // has an approved allowlist row
  isAdmin: boolean;
  signIn: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role>(null);

  const email = session?.user?.email ?? null;

  async function loadRole(currentEmail: string | null) {
    if (!supabase || !currentEmail) {
      setRole(null);
      return;
    }
    // allowlist membership = approved. role column drives admin vs investor.
    const { data } = await supabase
      .from("allowlist")
      .select("role")
      .eq("email", currentEmail.toLowerCase())
      .maybeSingle();
    setRole((data?.role as Role) ?? null);
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      await loadRole(data.session?.user?.email ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, s) => {
      setSession(s);
      await loadRole(s?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const value: AuthValue = {
    configured: isSupabaseConfigured,
    loading,
    user: session?.user ?? null,
    email,
    role,
    isAllowed: role !== null,
    isAdmin: role === "admin",
    signIn: async (e) => {
      if (!supabase) return { error: "Backend not configured yet." };
      const { error } = await supabase.auth.signInWithOtp({
        email: e.trim().toLowerCase(),
        options: { emailRedirectTo: `${window.location.origin}/crm` },
      });
      return { error: error?.message ?? null };
    },
    signOut: async () => {
      if (supabase) await supabase.auth.signOut();
      setSession(null);
      setRole(null);
    },
    refreshRole: () => loadRole(email),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
