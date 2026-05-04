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
  // lucide Truck
  truck: (
    <g fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </g>
  ),
  // lucide Plane (rotated -45 in render)
  plane: (
    <g fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </g>
  ),
};

const ICONS: { key: string; rotate?: number }[] = [
  { key: "drone" },
  { key: "tractor" },
  { key: "truck" },
  { key: "plane", rotate: -45 },
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
        {ICONS.map(({ key, rotate }, i) => (
          <g key={key} color={RUST} filter="url(#iconGlow)">
            <g transform={`translate(-10,-10) ${rotate ? `rotate(${rotate} 10 10)` : ""}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" overflow="visible">
                {ICON_PATHS[key]}
              </svg>
            </g>
            <animateMotion dur="8s" repeatCount="indefinite" begin={`${i * 2}s`}>
              <mpath href="#cc-orbit" />
            </animateMotion>
          </g>
        ))}

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
