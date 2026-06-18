/**
 * Investor engagement hooks: auto-save the model config and track time spent
 * per section.
 */
import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { useModel } from "@/lib/model/store";
import { saveConfig, logActivity } from "./backend";

/** Debounced auto-save of the current model configuration to the backend. */
export function useConfigAutosave() {
  const { email } = useAuth();
  const { base, growth, eventToggles, orgToggles, result } = useModel();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);

  useEffect(() => {
    // Skip the very first render (initial/base state) to avoid a no-op write.
    if (first.current) {
      first.current = false;
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void saveConfig(email, {
        base,
        growth,
        eventToggles,
        orgToggles,
        metrics: result.metrics,
        savedAt: new Date().toISOString(),
      });
    }, 1500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [base, growth, eventToggles, orgToggles, result, email]);
}

/** Track active time on a section; flush periodically and on unmount. */
export function useSectionActivity(section: string) {
  const { email } = useAuth();
  const acc = useRef(0);
  const start = useRef<number | null>(null);

  useEffect(() => {
    const begin = () => {
      if (start.current == null && document.visibilityState === "visible") start.current = Date.now();
    };
    const pause = () => {
      if (start.current != null) {
        acc.current += (Date.now() - start.current) / 1000;
        start.current = null;
      }
    };
    const flush = () => {
      pause();
      if (acc.current >= 2) {
        void logActivity(email, section, "time", acc.current);
        acc.current = 0;
      }
      begin();
    };

    void logActivity(email, section, "visit", 0);
    begin();
    const onVis = () => (document.visibilityState === "visible" ? begin() : pause());
    document.addEventListener("visibilitychange", onVis);
    const iv = setInterval(flush, 30000);

    return () => {
      clearInterval(iv);
      document.removeEventListener("visibilitychange", onVis);
      pause();
      if (acc.current >= 2) void logActivity(email, section, "time", acc.current);
      acc.current = 0;
    };
  }, [section, email]);
}
