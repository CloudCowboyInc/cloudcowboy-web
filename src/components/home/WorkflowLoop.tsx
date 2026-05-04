import logoSvg from "@/assets/cloud-cowboy-logo.svg";

const RUST = "#d96c47";

// Inline icon contents (24x24 viewBox). All strokes use currentColor via parent <g color>.
const ICON_PATHS: Record<string, JSX.Element> = {
  drone: (
    <g fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2.2" />
      <line x1="12" y1="12" x2="5" y2="5" />
      <line x1="12" y1="12" x2="19" y2="5" />
      <line x1="12" y1="12" x2="5" y2="19" />
      <line x1="12" y1="12" x2="19" y2="19" />
      <circle cx="5" cy="5" r="2.4" />
      <circle cx="19" cy="5" r="2.4" />
      <circle cx="5" cy="19" r="2.4" />
      <circle cx="19" cy="19" r="2.4" />
    </g>
  ),
  // lucide Tractor
  tractor: (
    <g fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h9l1 7" />
      <path d="M4 11V4" />
      <path d="M8 10V4" />
      <path d="M18 5c-.6 0-1 .4-1 1v5.5" />
      <path d="m22 14-4.5-4.5" />
      <circle cx="7" cy="15" r="3" />
      <circle cx="17" cy="18" r="3" />
    </g>
  ),
  // Semi tractor cab (no trailer)
  truck: (
    <g fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M 16 6 L 16 17 L 8 17 L 8 12 L 11 12 L 11 6 Z" />
      <line x1="11" y1="6" x2="8" y2="12" />
      <line x1="3" y1="17" x2="8" y2="17" />
      <line x1="3" y1="14" x2="3" y2="17" />
      <line x1="3" y1="14" x2="8" y2="14" />
      <line x1="14" y1="6" x2="14" y2="2" strokeWidth={1.5} />
      <circle cx="14" cy="1.6" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="6" cy="19" r="1.8" />
      <circle cx="14" cy="19" r="1.8" />
    </g>
  ),
  // Crop duster biplane
  plane: (
    <g fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="12" x2="18" y2="12" />
      <line x1="9" y1="8" x2="16" y2="8" />
      <line x1="7" y1="16" x2="17" y2="16" />
      <line x1="10.5" y1="8" x2="10.5" y2="16" strokeWidth={1} />
      <line x1="14.5" y1="8" x2="14.5" y2="16" strokeWidth={1} />
      <path d="M 18 10 L 21 12 L 18 14 Z" fill="currentColor" />
      <line x1="3" y1="9" x2="3" y2="15" strokeWidth={2} />
      <circle cx="4" cy="12" r="0.6" fill="currentColor" stroke="none" />
    </g>
  ),
};

const ICONS: { key: string; rotate?: number }[] = [
  { key: "drone" },
  { key: "tractor" },
  { key: "truck" },
  { key: "plane" },
];

/**
 * Animated SVG showing four labeled circular nodes arranged in an oval:
 * QUOTE → PLAN → EXECUTE → LEARN, connected by a dashed oval path.
 * Pulsing concentric rings on each node + four ag-service vehicle icons
 * orbiting the loop via animateMotion.
 */
export default function WorkflowLoop() {
  // Oval geometry
  const cx = 300;
  const cy = 230;
  const rx = 230;
  const ry = 150;

  // Node positions on the oval (left, top, right, bottom)
  const nodes = [
    { x: cx - rx, y: cy, label: "QUOTE", delay: 0 },
    { x: cx, y: cy - ry, label: "PLAN", delay: 0.75 },
    { x: cx + rx, y: cy, label: "EXECUTE", delay: 1.5 },
    { x: cx, y: cy + ry, label: "LEARN", delay: 2.25 },
  ];

  // Closed oval path used as the orbit track for particles
  const ovalPath = `M ${cx - rx},${cy}
    a ${rx},${ry} 0 1,1 ${rx * 2},0
    a ${rx},${ry} 0 1,1 -${rx * 2},0 Z`;

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <svg
        viewBox="0 0 600 460"
        className="w-full h-auto"
        role="img"
        aria-label="Cloud Cowboy continuous workflow loop"
      >
        <defs>
          <linearGradient id="loopStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c25b3a" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#d96c47" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#8a3d24" stopOpacity="0.55" />
          </linearGradient>
          <filter id="iconGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* The orbit path (referenced by mpath) */}
          <path id="cc-orbit" d={ovalPath} />
        </defs>

        {/* Dashed oval track */}
        <path
          d={ovalPath}
          fill="none"
          stroke="url(#loopStroke)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          opacity="0.7"
        />

        {/* Orbiting ag-service vehicle icons (evenly spaced 90deg apart) */}
        {ICONS.map(({ key, rotate }, i) => {
          const size = 28;
          const half = size / 2;
          const begins = [0, 3.5, 7, 10.5];
          return (
            <g key={key} color={RUST} filter="url(#iconGlow)">
              <g transform={`translate(${-half},${-half}) ${rotate ? `rotate(${rotate} ${half} ${half})` : ""}`}>
                <svg width={size} height={size} viewBox="0 0 24 24" overflow="visible">
                  {ICON_PATHS[key]}
                </svg>
              </g>
              <animateMotion dur="14s" repeatCount="indefinite" begin={`${begins[i]}s`}>
                <mpath href="#cc-orbit" />
              </animateMotion>
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((n) => (
          <g key={n.label}>
            {/* Pulsing concentric ring */}
            <circle cx={n.x} cy={n.y} r="34" fill="none" stroke="#d96c47" strokeWidth="1.5">
              <animate
                attributeName="r"
                values="34;48;34"
                dur="3s"
                begin={`${n.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.4;0;0.4"
                dur="3s"
                begin={`${n.delay}s`}
                repeatCount="indefinite"
              />
            </circle>

            {/* Node body */}
            <circle
              cx={n.x}
              cy={n.y}
              r="34"
              fill="#0f1722"
              stroke="#c25b3a"
              strokeWidth="2"
            />
            {/* Cloud Cowboy logo watermark behind label */}
            <image
              href={logoSvg}
              x={n.x - 26}
              y={n.y - 26}
              width="52"
              height="52"
              opacity="0.13"
              style={{ pointerEvents: "none" }}
            />
            <text
              x={n.x}
              y={n.y + 4}
              textAnchor="middle"
              fontFamily="Space Grotesk, sans-serif"
              fontSize="11"
              fontWeight={600}
              fill="#e8ecf1"
              letterSpacing="0.12em"
            >
              {n.label}
            </text>
          </g>
        ))}

        {/* Center label */}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="13"
          fontWeight={600}
          fill="#8b95a8"
          letterSpacing="0.18em"
        >
          THE WORKFLOW:
        </text>
        <text
          x={cx}
          y={cy + 18}
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="17"
          fontWeight={600}
          fill="#c25b3a"
          letterSpacing="0.1em"
        >
          ONE CONTINUOUS LOOP
        </text>
      </svg>
    </div>
  );
}
