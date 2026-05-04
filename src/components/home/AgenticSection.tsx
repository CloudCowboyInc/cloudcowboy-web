import { Cog, Server, ShieldCheck } from "lucide-react";

const RUST = "#d96c47";

const CARDS = [
  {
    eyebrow: "BESPOKE",
    Icon: Cog,
    headline: "Purpose-built for the work.",
    body: "Each agent is built for a single function. Quoting, planning, dispatching, reporting — every agent does one thing exceptionally well. Smaller, faster, and more controllable than general-purpose AI.",
  },
  {
    eyebrow: "LOCAL",
    Icon: Server,
    headline: "No third parties. No external APIs.",
    body: "Inference runs natively on Cloud Cowboy. We don't ship your data off to OpenAI, Anthropic, or any other third-party AI vendor for processing. The agents live with the data they serve.",
  },
  {
    eyebrow: "PRIVATE BY DEFAULT",
    Icon: ShieldCheck,
    headline: "Your data stays your data.",
    body: "Customer information, contracts, and operational telemetry never cross our perimeter. Sensitive by default, secure by design — what happens inside Cloud Cowboy stays inside Cloud Cowboy.",
  },
];

function PerimeterDiagram() {
  const cx = 300;
  const cy = 300;
  const r = 180;

  const agents = [
    { angle: -90, label: "QUOTING AGENT" },
    { angle: 0, label: "PLANNING AGENT" },
    { angle: 90, label: "OPS AGENT" },
    { angle: 180, label: "INSIGHTS AGENT" },
  ];

  const pos = (angleDeg: number, radius: number) => {
    const a = (angleDeg * Math.PI) / 180;
    return { x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius };
  };

  return (
    <svg viewBox="0 0 600 600" className="w-full max-w-[600px] mx-auto">
      {/* Outside-perimeter dimmed third-parties */}
      {[
        { x: 60, y: 80, label: "Third-party AI" },
        { x: 480, y: 90, label: "External APIs" },
        { x: 70, y: 500, label: "External APIs" },
        { x: 480, y: 510, label: "Third-party AI" },
      ].map((t, i) => (
        <g key={i} opacity="0.28">
          <rect x={t.x} y={t.y} width="80" height="32" rx="6" fill="none" stroke="#8b95a8" strokeDasharray="3 3" />
          <text x={t.x + 40} y={t.y + 19} textAnchor="middle" fontSize="9" fill="#8b95a8" letterSpacing="1.2">
            {t.label.toUpperCase()}
          </text>
          <text x={t.x + 40} y={t.y + 48} textAnchor="middle" fontSize="14" fill="#8b95a8">×</text>
        </g>
      ))}

      {/* Glow halo */}
      <circle cx={cx} cy={cy} r={r + 14} fill={`${RUST}10`} />
      <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke={RUST} strokeOpacity="0.18" strokeWidth="1" />

      {/* Perimeter ring */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={RUST}
        strokeWidth="1.5"
        className="cc-perimeter-ring"
      />

      {/* Perimeter label */}
      <text x={cx} y={cy - r - 14} textAnchor="middle" fontSize="10" fill={RUST} letterSpacing="3">
        YOUR PERIMETER
      </text>

      {/* Lines from center to agent nodes */}
      {agents.map((a) => {
        const p = pos(a.angle, r * 0.62);
        return (
          <line
            key={`l-${a.label}`}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke={RUST}
            strokeOpacity="0.4"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
        );
      })}

      {/* Center mark */}
      <circle cx={cx} cy={cy} r="34" fill="#0f1722" stroke={RUST} strokeWidth="1.5" />
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="11" fill="#e8ecf1" letterSpacing="2">
        CLOUD
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fill={RUST} letterSpacing="2">
        COWBOY
      </text>

      {/* Agent nodes */}
      {agents.map((a) => {
        const p = pos(a.angle, r * 0.62);
        return (
          <g key={a.label}>
            <circle cx={p.x} cy={p.y} r="22" fill="#1a2332" stroke={RUST} strokeWidth="1.2" />
            <circle cx={p.x} cy={p.y} r="4" fill={RUST} />
            <text
              x={p.x}
              y={p.y + 38}
              textAnchor="middle"
              fontSize="9"
              fill="#b9c2d2"
              letterSpacing="1.6"
            >
              {a.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function AgenticSection() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-3 gap-5 mb-16">
        {CARDS.map(({ eyebrow, Icon, headline, body }) => (
          <div
            key={eyebrow}
            className="rounded-2xl border border-white/10 bg-[#1a2332]/65 backdrop-blur-sm p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#c25b3a]/55 hover:shadow-[0_0_30px_-10px_rgba(217,108,71,0.55)]"
          >
            <Icon className="w-8 h-8 mb-4" style={{ color: RUST }} />
            <p className="text-[10px] tracking-[0.3em] text-[#c25b3a] font-medium mb-3">{eyebrow}</p>
            <h3 className="font-display text-xl font-semibold text-[#e8ecf1] mb-3 leading-tight">
              {headline}
            </h3>
            <p className="text-[#8b95a8] text-sm leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      <PerimeterDiagram />

      <p className="text-center text-[#b9c2d2] text-base md:text-lg mt-8 max-w-3xl mx-auto leading-relaxed">
        This is what AI for Ag should look like — built for the work, owned by the operator, private by default.
      </p>
    </div>
  );
}
