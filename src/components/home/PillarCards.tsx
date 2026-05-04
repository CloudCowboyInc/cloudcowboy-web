import { useState } from "react";
import { ChevronDown } from "lucide-react";

const PILLARS = [
  {
    n: "01",
    title: "Quoting & Scheduling",
    tag: "Stop chasing quotes. Start closing them.",
    detail:
      "A farmer requests a job through a widget on your existing website. Cloud Cowboy generates the price, drafts the contract, takes payment, and books your schedule — automatically. You never had to pick up the phone.",
  },
  {
    n: "02",
    title: "Mission Planning",
    tag: "From sold job to ready-to-execute, automatically.",
    detail:
      "Once a job is paid, Cloud Cowboy plans the work — field geometry, route, materials, crew, timing. By the time your operator wakes up, the day is mapped and the equipment knows where to go.",
  },
  {
    n: "03",
    title: "Operations",
    tag: "See every crew, every job, every minute, live.",
    detail:
      "Operators run the day from a mobile app. You see every vehicle, every drone, every supply level, every ETA from one screen. Catch problems before they become fires. Run your business from your phone if you want to.",
  },
  {
    n: "04",
    title: "Business Insights",
    tag: "Know your business in real time, not at year-end.",
    detail:
      "Margin per job. Utilization per operator. Trends per service type. Cloud Cowboy turns the data your business already produces into the dashboard you wish you had — so you make decisions on Monday morning, not after tax season.",
  },
];

export default function PillarCards() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {PILLARS.map((p, i) => {
        const isOpen = open === i;
        return (
          <button
            key={p.n}
            type="button"
            onClick={() => setOpen(isOpen ? null : i)}
            aria-expanded={isOpen}
            className={`group relative text-left rounded-2xl border transition-all duration-300 p-7 cursor-pointer
              ${isOpen
                ? "border-[#c25b3a]/60 bg-[#1a2332]/80 shadow-[0_0_40px_-10px_rgba(194,91,58,0.45)]"
                : "border-white/8 bg-[#1a2332]/55 hover:bg-[#1f2a3c]/70 hover:border-[#c25b3a]/40 hover:-translate-y-1 hover:shadow-[0_0_30px_-12px_rgba(194,91,58,0.35)]"
              } backdrop-blur-sm`}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <span className="text-xs tracking-[0.3em] text-[#c25b3a] font-medium">
                PILLAR · {p.n}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-[#8b95a8] transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-[#d96c47]" : ""
                }`}
              />
            </div>

            <h3 className="font-display text-2xl md:text-[1.65rem] font-semibold text-[#e8ecf1] mb-2 leading-tight">
              {p.title}
            </h3>
            <p className="text-[#b9c2d2] text-base mb-3">{p.tag}</p>

            <div
              className="grid transition-all duration-500 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="text-[#8b95a8] leading-relaxed pt-3 border-t border-[#c25b3a]/20">
                  {p.detail}
                </p>
              </div>
            </div>

            {!isOpen && (
              <div className="mt-4 text-xs tracking-[0.2em] text-[#8b95a8] group-hover:text-[#d96c47] transition-colors">
                CLICK TO EXPAND →
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
