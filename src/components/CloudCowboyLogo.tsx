interface CloudCowboyLogoProps {
  size?: number;
  className?: string;
}

export default function CloudCowboyLogo({ size = 32, className = "" }: CloudCowboyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1500 1500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Circle outline */}
      <circle
        cx="750"
        cy="750"
        r="680"
        stroke="#62A2DD"
        strokeWidth="80"
        fill="none"
      />
      {/* Left C - sky blue */}
      <g transform="translate(200,112)">
        <path
          d="M680 200C680 200 620 80 480 80C280 80 120 280 120 520C120 760 280 960 480 960C620 960 680 840 680 840"
          stroke="#62A2DD"
          strokeWidth="100"
          strokeLinecap="round"
          fill="none"
        />
      </g>
      {/* Right C - burnt orange, mirrored */}
      <g transform="translate(698,283)">
        <path
          d="M20 200C20 200 80 80 220 80C420 80 580 280 580 520C580 760 420 960 220 960C80 960 20 840 20 840"
          stroke="#BF5700"
          strokeWidth="100"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
