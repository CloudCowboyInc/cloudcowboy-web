import { Fragment } from "react";
import { Globe, FileText, Calendar, Users, Clock, Smartphone, MapPin, Activity, TrendingUp } from "lucide-react";

const RUST = "#d96c47";
const RUST_DEEP = "#c25b3a";

function DataChips({ items }: { items: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5 justify-center">
      {items.map((d) => (
        <span
          key={d}
          className="text-[10px] tracking-[0.22em] uppercase text-[#d96c47]/90 font-medium"
        >
          · {d}
        </span>
      ))}
    </div>
  );
}

function PillarShell({
  n,
  title,
  tag,
  body,
  visual,
  data,
}: {
  n: string;
  title: string;
  tag: string;
  body: string;
  visual: React.ReactNode;
  data: string[];
}) {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#1a2332]/65 backdrop-blur-sm p-7 transition-all duration-300 hover:border-[#c25b3a]/45 hover:-translate-y-1 hover:shadow-[0_0_30px_-12px_rgba(217,108,71,0.4)]">
      <span className="text-xs tracking-[0.3em] text-[#c25b3a] font-medium">PILLAR · {n}</span>
      <h3 className="font-display text-2xl font-semibold text-[#e8ecf1] mt-2 mb-2 leading-tight">{title}</h3>
      <p className="text-[#b9c2d2] text-base mb-3">{tag}</p>
      <p className="text-[#8b95a8] text-sm leading-relaxed mb-5">{body}</p>
      <div className="rounded-xl border border-[#c25b3a]/20 bg-[#0f1722]/50 p-4 flex items-center justify-center min-h-[120px]">
        {visual}
      </div>
      <DataChips items={data} />
    </div>
  );
}

/* Animated dashed connector with traveling particle.
   Horizontal on lg+, vertical on smaller screens. */
function Connector({ label }: { label: string }) {
  return (
    <div className="relative flex items-center justify-center my-4 lg:my-0 lg:mx-1">
      {/* Vertical (mobile) */}
      <div className="lg:hidden flex flex-col items-center w-full">
        <div className="relative h-20 w-px overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(to bottom, ${RUST} 0 6px, transparent 6px 12px)`,
              opacity: 0.55,
            }}
          />
          <span
            className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
            style={{
              background: RUST,
              boxShadow: `0 0 12px ${RUST}`,
              animation: "cc-flow-down 2.4s linear infinite",
            }}
          />
        </div>
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#d96c47] mt-2">{label}</span>
      </div>

      {/* Horizontal (desktop) */}
      <div className="hidden lg:flex flex-col items-center justify-center w-full">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#d96c47] mb-2 whitespace-nowrap">
          {label}
        </span>
        <div className="relative h-px w-full overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(to right, ${RUST} 0 6px, transparent 6px 12px)`,
              opacity: 0.55,
            }}
          />
          <span
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
            style={{
              background: RUST,
              boxShadow: `0 0 12px ${RUST}`,
              animation: "cc-flow-right 2.4s linear infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────── Per-pillar visuals ─────────── */

function VisualQuoting() {
  return (
    <div className="flex items-center gap-3 text-[#e8ecf1]">
      <div className="flex flex-col items-center gap-1">
        <Globe className="w-7 h-7 text-[#8b95a8]" />
        <span className="text-[9px] tracking-[0.2em] text-[#8b95a8]">SITE</span>
      </div>
      <span className="text-[#c25b3a]/60 text-xs tracking-widest">- - -</span>
      <div className="flex flex-col items-center gap-1">
        <FileText className="w-7 h-7" style={{ color: RUST }} />
        <span className="text-[9px] tracking-[0.2em] text-[#8b95a8]">QUOTE</span>
      </div>
      <span className="text-[#c25b3a]/60 text-xs tracking-widest">- - -</span>
      <div className="flex flex-col items-center gap-1">
        <div className="relative">
          <Calendar className="w-7 h-7 text-[#8b95a8]" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full" style={{ background: RUST, boxShadow: `0 0 8px ${RUST}` }} />
        </div>
        <span className="text-[9px] tracking-[0.2em] text-[#8b95a8]">BOOKED</span>
      </div>
    </div>
  );
}

function VisualPlanning() {
  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 100 70" className="w-28 h-20">
        <polygon
          points="10,20 80,8 92,40 70,62 18,58"
          fill={`${RUST_DEEP}10`}
          stroke={`${RUST_DEEP}66`}
          strokeWidth="1"
        />
        <path
          d="M14,55 L30,30 L55,42 L75,18 L88,38"
          fill="none"
          stroke={RUST}
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <circle cx="14" cy="55" r="2" fill={RUST} />
        <circle cx="88" cy="38" r="2" fill={RUST} />
      </svg>
      <div className="flex flex-col gap-2">
        <Users className="w-6 h-6" style={{ color: RUST }} />
        <Clock className="w-6 h-6 text-[#8b95a8]" />
      </div>
    </div>
  );
}

function VisualOps() {
  return (
    <div className="relative w-[120px] h-[150px] rounded-[18px] border-2 border-[#8b95a8]/40 bg-[#0f1722] p-2 shadow-[0_0_20px_-6px_rgba(217,108,71,0.4)]">
      <div className="flex items-center justify-between mb-1.5">
        <Smartphone className="w-3 h-3 text-[#8b95a8]" />
        <Activity className="w-3 h-3" style={{ color: RUST }} />
      </div>
      <div className="relative h-14 rounded-md bg-[#1a2332] overflow-hidden mb-1.5">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `linear-gradient(rgba(194,91,58,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(194,91,58,0.12) 1px, transparent 1px)`,
            backgroundSize: "10px 10px",
          }}
        />
        <MapPin className="absolute top-2 left-3 w-3 h-3" style={{ color: RUST }} />
        <MapPin className="absolute top-5 right-4 w-3 h-3" style={{ color: RUST }} />
        <MapPin className="absolute bottom-1.5 left-7 w-3 h-3" style={{ color: RUST }} />
      </div>
      <div className="h-2 rounded bg-[#1a2332] overflow-hidden mb-1.5">
        <div className="h-full w-[68%]" style={{ background: RUST }} />
      </div>
      <div className="flex items-center justify-between text-[8px] tracking-widest text-[#8b95a8]">
        <span>ETA</span>
        <span style={{ color: RUST }}>14:32</span>
      </div>
    </div>
  );
}

function VisualInsights() {
  return (
    <div className="w-full max-w-[220px]">
      <div className="grid grid-cols-3 gap-1.5 mb-2">
        {["MARGIN", "UTIL", "JOBS"].map((k) => (
          <div key={k} className="rounded-md border border-[#c25b3a]/30 bg-[#1a2332] p-1.5 text-center">
            <div className="text-[8px] tracking-widest text-[#8b95a8]">{k}</div>
            <div className="text-xs font-semibold" style={{ color: RUST }}>↑</div>
          </div>
        ))}
      </div>
      <div className="rounded-md border border-[#c25b3a]/20 bg-[#1a2332] p-2 flex items-end gap-1 h-14">
        {[30, 55, 40, 70, 50, 85, 65].map((h, i) => (
          <div key={i} className="flex-1 rounded-sm" style={{ background: RUST, height: `${h}%`, opacity: 0.55 + i * 0.05 }} />
        ))}
      </div>
      <div className="flex items-center gap-1 mt-1.5 text-[9px] text-[#8b95a8]">
        <TrendingUp className="w-3 h-3" style={{ color: RUST }} /> trending up
      </div>
    </div>
  );
}

/* ─────────── Main flow ─────────── */

const PILLARS = [
  {
    n: "01",
    title: "Quoting & Scheduling",
    tag: "Stop chasing quotes. Start closing them.",
    body: "A farmer requests a job through a widget on your existing website. Cloud Cowboy generates the price, drafts the contract, takes payment, and books your schedule — automatically. You never had to pick up the phone.",
    visual: <VisualQuoting />,
    data: ["Job location", "Acreage", "Service type", "Schedule"],
    next: "Sold job → executable plan",
  },
  {
    n: "02",
    title: "Mission Planning",
    tag: "From sold job to ready-to-execute, automatically.",
    body: "Once a job is paid, Cloud Cowboy plans the work — field geometry, route, materials, crew, timing. By the time your operator wakes up, the day is mapped and the equipment knows where to go.",
    visual: <VisualPlanning />,
    data: ["Optimized route", "Materials list", "Crew assignment", "Time window"],
    next: "Plan → live operations",
  },
  {
    n: "03",
    title: "Operations",
    tag: "See every crew, every job, every minute, live.",
    body: "Operators run the day from a mobile app. You see every vehicle, every drone, every supply level, every ETA from one screen. Catch problems before they become fires.",
    visual: <VisualOps />,
    data: ["Live telemetry", "Completion times", "Supply usage", "Exceptions"],
    next: "Live data → actionable insight",
  },
  {
    n: "04",
    title: "Business Insights",
    tag: "Know your business in real time, not at year-end.",
    body: "Margin per job. Utilization per operator. Trends per service type. Cloud Cowboy turns the data your business already produces into the dashboard you wish you had.",
    visual: <VisualInsights />,
    data: ["Sharper next quote", "Better next plan", "Smarter next job"],
    next: null,
  },
];

export default function PillarFlow() {
  return (
    <div className="w-full">
      <div className="grid lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-y-2 lg:gap-x-3 items-stretch">
        {PILLARS.map((p, i) => (
          <Fragment key={p.n}>
            <PillarShell {...p} />
            {p.next && <Connector label={p.next} />}
          </Fragment>
        ))}
      </div>

      {/* Loop-close arc */}
      <div className="relative mt-6 hidden lg:block">
        <svg viewBox="0 0 1200 80" className="w-full h-16" preserveAspectRatio="none">
          <path
            d="M 1150,5 C 1150,70 50,70 50,5"
            fill="none"
            stroke={RUST}
            strokeWidth="1.2"
            strokeDasharray="6 6"
            opacity="0.55"
          />
          <circle r="3.5" fill={RUST} style={{ filter: `drop-shadow(0 0 6px ${RUST})` }}>
            <animateMotion dur="6s" repeatCount="indefinite" path="M 1150,5 C 1150,70 50,70 50,5" />
          </circle>
        </svg>
        <p className="text-center text-xs tracking-[0.25em] uppercase text-[#d96c47] -mt-2">
          Insights sharpen the next quote · The platform learns from every job
        </p>
      </div>

      <p className="text-center text-[#b9c2d2] text-base md:text-lg mt-10 max-w-3xl mx-auto leading-relaxed">
        This is what "one platform" actually means. Not four products bolted together — one continuous loop where every signal makes the next decision smarter.
      </p>
    </div>
  );
}
