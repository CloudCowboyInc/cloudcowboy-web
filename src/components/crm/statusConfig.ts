import type { PipelineStatus, Readiness } from "@/data/leads";

// Hex values chosen to sit on the dark brand background and echo the
// site palette (burnt-orange primary, sky-blue secondary).
export const STATUS_COLORS: Record<PipelineStatus, string> = {
  New: "#64748b",        // slate
  Contacted: "#5a9bd4",  // brand sky blue
  Engaged: "#e0b341",    // amber
  Qualified: "#d4782f",  // brand primary orange
  Proposal: "#a472d4",   // violet
  Won: "#3fb27f",        // green
  Lost: "#d4584f",       // destructive red
};

export const READINESS_COLORS: Record<Readiness, string> = {
  ready: "#3fb27f",
  partial: "#e0b341",
  thin: "#64748b",
};

export const READINESS_LABEL: Record<Readiness, string> = {
  ready: "Phone & email",
  partial: "Phone or email",
  thin: "No contact yet",
};


import type { OperatorType } from "@/data/leads";

export const OPERATOR_COLORS: Record<OperatorType, string> = {
  ground: "#5a9bd4",
  aerial: "#d4782f",
  drone: "#3fb27f",
  "": "#64748b",
};

export const OPERATOR_LABEL: Record<OperatorType, string> = {
  ground: "Ground",
  aerial: "Aerial (manned)",
  drone: "Drone",
  "": "Unknown",
};
