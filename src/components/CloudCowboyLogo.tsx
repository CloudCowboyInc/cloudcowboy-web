interface CloudCowboyLogoProps {
  size?: number;
  className?: string;
}

export default function CloudCowboyLogo({ size = 32, className = "" }: CloudCowboyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Circle outline */}
      <circle cx="50" cy="50" r="46" stroke="#62A2DD" strokeWidth="5" fill="none" />
      {/* Left C - sky blue */}
      <path
        d="M52 30C40 30 30 39 30 50C30 61 40 70 52 70"
        stroke="#62A2DD"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right C - burnt orange, mirrored */}
      <path
        d="M48 30C60 30 70 39 70 50C70 61 60 70 48 70"
        stroke="#BF5700"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
