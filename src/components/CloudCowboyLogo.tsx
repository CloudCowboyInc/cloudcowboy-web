import logoSvg from "@/assets/cloud-cowboy-logo.svg";

interface CloudCowboyLogoProps {
  size?: number;
  className?: string;
}

export default function CloudCowboyLogo({ size = 32, className = "" }: CloudCowboyLogoProps) {
  return (
    <img
      src={logoSvg}
      alt="Cloud Cowboy"
      width={size}
      height={size}
      className={className}
    />
  );
}
