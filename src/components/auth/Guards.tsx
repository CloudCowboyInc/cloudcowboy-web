import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

function Centered({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

/** Requires an approved (allowlisted) user. Admins included. */
export function RequireAllowed({ children }: { children: ReactNode }) {
  const { configured, loading, user, isAllowed } = useAuth();
  // Local/dev mode (no Supabase yet): run open, like Phase 1.
  if (!configured) return <>{children}</>;
  if (loading) return <Centered>Checking access…</Centered>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAllowed)
    return (
      <Centered>
        Your account isn't approved yet. We'll email you once it is.
      </Centered>
    );
  return <>{children}</>;
}

/** Requires an admin (team) user. */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { configured, loading, user, isAdmin } = useAuth();
  // Local/dev mode (no Supabase yet): run open, like Phase 1.
  if (!configured) return <>{children}</>;
  if (loading) return <Centered>Checking access…</Centered>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Centered>Admins only.</Centered>;
  return <>{children}</>;
}
