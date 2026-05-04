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
  // Semi truck — material-symbols:local-shipping (Iconify, viewBox 0 0 24 24)
  truck: (
    <path fill="currentColor" stroke="none" d="M3.875 19.125Q3 18.25 3 17H1V6q0-.825.588-1.412T3 4h14v4h3l3 4v5h-2q0 1.25-.875 2.125T18 20t-2.125-.875T15 17H9q0 1.25-.875 2.125T6 20t-2.125-.875m2.838-1.412Q7 17.425 7 17t-.288-.712T6 16t-.712.288T5 17t.288.713T6 18t.713-.288m12 0Q19 17.426 19 17t-.288-.712T18 16t-.712.288T17 17t.288.713T18 18t.713-.288M17 13h4.25L19 10h-2z" />
  ),
  // Crop duster biplane — game-icons:biplane (Iconify, viewBox 0 0 512 512)
  plane: (
    <svg x="0" y="0" width="24" height="24" viewBox="0 0 512 512" overflow="visible">
      <path fill="currentColor" d="M12.455 112.281v19.153h31.75l5.606 163.779H39.578v19.152h153.389l19.318-18.838a45.2 45.2 0 0 1-2.795-15.709c0-17.091 9.399-31.867 23.34-39.476v-40.51c-10.45 7.054-18.058 18.863-21.37 32.506c-12.957 11.747-21.122 28.696-21.122 47.48c0 2.654.182 5.265.498 7.836l-51.822-71.302l61.716-84.918h105.346l61.717 84.918l-49.414 67.988c.105-1.496.178-3 .178-4.522c0-17.758-7.302-33.87-19.047-45.504c-2.928-13.967-10.325-26.2-20.68-33.683v41.365c12.4 7.979 20.574 21.89 20.574 37.822a45.2 45.2 0 0 1-2.728 15.537l19.025 19.01H468.96v-19.152h-12.133l5.606-163.78h37.113v-19.152zm48.38 19.153h.003l61.717 84.916l-56.168 77.283zm16.464 0h106.97l-53.486 73.591zm245.238 0h106.97l-53.484 73.591zm123.256.244l-5.535 161.73l-56.004-77.056zm-190.957 23.115l-8.441 8.441v88.182c-12.387 3.658-21.534 15.184-21.534 28.691a29.6 29.6 0 0 0 4.053 14.936l-65.447 65.45v11.937l1.65 1.65h11.938l66.34-66.342a29.5 29.5 0 0 0 11.375 2.278c4.062 0 7.945-.829 11.49-2.323l65.758 65.756h11.937l1.65-1.65V359.86l-64.92-64.922a29.6 29.6 0 0 0 3.993-14.832c0-12.593-7.953-23.464-19.067-27.843v-89.03l-8.441-8.441zm-124.05 72.883l49.083 67.537H81.7zm245.237 0l49.084 67.537h-98.17zM254.77 268.199c6.683 0 11.908 5.225 11.908 11.908c0 6.684-5.225 11.909-11.908 11.909c-6.684 0-11.909-5.225-11.909-11.909c0-6.683 5.225-11.908 11.909-11.908m11.12 55.121a45.5 45.5 0 0 1-11.443 1.455a45.5 45.5 0 0 1-10.463-1.222L222.822 344.7h64.319zm-118.374 2.229V344.7h14.338l19.642-19.152zm179.377 0L346.06 344.7h14.652v-19.15zm-193.647 17.885c-6.044 0-9.576 5.43-9.576 10.418V389.3c0 4.987 3.532 10.418 9.576 10.418s9.576-5.431 9.576-10.418v-35.45c0-4.986-3.532-10.417-9.576-10.417zm240.8 0c-6.043 0-9.575 5.43-9.575 10.418V389.3c0 4.987 3.532 10.418 9.576 10.418s9.576-5.431 9.576-10.418v-35.45c0-4.986-3.532-10.417-9.576-10.417z" />
    </svg>
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
