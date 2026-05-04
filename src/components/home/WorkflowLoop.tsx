/**
 * Animated SVG showing four labeled circular nodes arranged in an oval:
 * QUOTE → PLAN → EXECUTE → LEARN, connected by a dashed oval path.
 * Pulsing concentric rings on each node + three glowing rust particles
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
          <radialGradient id="particleGrad">
            <stop offset="0%" stopColor="#ffb38a" stopOpacity="1" />
            <stop offset="60%" stopColor="#d96c47" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#c25b3a" stopOpacity="0" />
          </radialGradient>

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

        {/* Orbiting particles */}
        {[0, 2, 4].map((delay, i) => (
          <circle key={i} r="6" fill="url(#particleGrad)">
            <animateMotion dur="8s" repeatCount="indefinite" begin={`${delay}s`} rotate="auto">
              <mpath href="#cc-orbit" />
            </animateMotion>
          </circle>
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
          fontSize="10"
          fill="#8b95a8"
          letterSpacing="0.28em"
        >
          THE WORKFLOW
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="10"
          fill="#c25b3a"
          letterSpacing="0.28em"
        >
          CONTINUOUS LOOP
        </text>
      </svg>
    </div>
  );
}
