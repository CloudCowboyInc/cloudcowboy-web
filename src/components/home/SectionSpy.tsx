import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Loop" },
  { id: "ai", label: "AI" },
  { id: "pillars", label: "Platform" },
  { id: "hardware", label: "Hardware" },
  { id: "focus", label: "Focus" },
  { id: "believe", label: "Why" },
  { id: "cta", label: "Beta" },
];

export default function SectionSpy() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (e): e is HTMLElement => !!e
    );
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col gap-3">
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => go(s.id)}
            className="group flex items-center gap-3 justify-end"
            aria-label={`Jump to ${s.label}`}
          >
            <span
              className={`text-[10px] tracking-[0.25em] uppercase transition-all duration-300 ${
                isActive ? "text-[#d96c47] opacity-100" : "text-[#8b95a8] opacity-0 group-hover:opacity-100"
              }`}
            >
              {s.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? "w-2.5 h-2.5 bg-[#d96c47] shadow-[0_0_10px_rgba(217,108,71,0.8)]"
                  : "w-1.5 h-1.5 bg-[#8b95a8]/60 group-hover:bg-[#c25b3a]"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
