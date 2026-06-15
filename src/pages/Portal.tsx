import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

/**
 * Neutral landing after magic-link sign in. Routes by role:
 *   admin    -> /admin
 *   investor -> /investor
 *   signed in but not approved -> /investors (request access)
 *   not signed in -> /login
 */
export default function Portal() {
  const { loading, user, isAdmin, isAllowed } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login", { replace: true });
    else if (isAdmin) navigate("/admin", { replace: true });
    else if (isAllowed) navigate("/investor", { replace: true });
    else navigate("/investors", { replace: true });
  }, [loading, user, isAdmin, isAllowed, navigate]);

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center gap-2 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" /> Signing you in…
    </div>
  );
}
