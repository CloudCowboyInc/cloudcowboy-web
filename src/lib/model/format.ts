/** Formatting helpers for model figures. */

/** Full USD, no decimals: $1,234,567. Negatives use a minus sign. */
export function usd(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

/** Compact USD: $1.2B / $797K / $450. Sign-aware. */
export function compactUSD(n: number): string {
  const sign = n < 0 ? "-" : "";
  const a = Math.abs(n);
  if (a >= 1e9) return `${sign}$${(a / 1e9).toFixed(a >= 1e10 ? 0 : 1)}B`;
  if (a >= 1e6) return `${sign}$${(a / 1e6).toFixed(a >= 1e7 ? 0 : 1)}M`;
  if (a >= 1e3) return `${sign}$${Math.round(a / 1e3)}K`;
  return `${sign}$${Math.round(a)}`;
}

/** Signed compact USD with explicit + / − for deltas. */
export function signedCompactUSD(n: number): string {
  if (Math.round(n) === 0) return "$0";
  return `${n > 0 ? "+" : "−"}${compactUSD(Math.abs(n))}`;
}

/** Percentage from a fraction: 0.02 → "2.0%". */
export function pct(fraction: number, dp = 1): string {
  return `${(fraction * 100).toFixed(dp)}%`;
}

/** Multiple: 240 → "240×". */
export function multiple(n: number, dp = 0): string {
  return `${n.toFixed(dp)}×`;
}
