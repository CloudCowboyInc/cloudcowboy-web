import { SectionCard, WhyThis } from "@/components/dataroom";

/**
 * Finance page — placeholder shell (SADDLE_UP). The interactive proforma,
 * assumption panel, charts, and raise panel arrive in WAR_ROOM.
 */
export default function FinancePage() {
  return (
    <div className="space-y-6">
      <SectionCard
        eyebrow="Finance"
        title="The interactive proforma"
        description="Live unit economics, six-year P&L, monthly cash, and the raise — all from one engine."
      >
        <p className="text-sm text-muted-foreground">
          The dynamic model (table/graph views, assumption controls, raise &amp; returns)
          arrives in the WAR_ROOM sprint, powered by the ENGINE_ROOM engine.
        </p>
        <WhyThis className="mt-4" title="Why this matters">
          <p>
            Every number here will be computed by a single, tested engine — no spreadsheet
            drift. Change an assumption and the whole model, including the raise math,
            recomputes instantly.
          </p>
        </WhyThis>
      </SectionCard>
    </div>
  );
}
