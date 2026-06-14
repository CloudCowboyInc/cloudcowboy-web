import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { CRMProvider, useCRM } from "@/lib/crm-store";
import {
  PIPELINE_STATUSES,
  type Lead,
  type PipelineStatus,
} from "@/data/leads";
import USLeadMap from "@/components/crm/USLeadMap";
import LeadDetailDrawer from "@/components/crm/LeadDetailDrawer";
import MassEmailDialog from "@/components/crm/MassEmailDialog";
import {
  STATUS_COLORS,
  READINESS_COLORS,
  READINESS_LABEL,
} from "@/components/crm/statusConfig";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plane, Mail, Lock, Search } from "lucide-react";

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <Card className="border-border/60 bg-card/60 p-4">
      <div className="font-display text-2xl font-bold" style={accent ? { color: accent } : undefined}>
        {value}
      </div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
    </Card>
  );
}

function CRMInner() {
  const { leads } = useCRM();
  const [colorMode, setColorMode] = useState<"status" | "readiness">("status");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [emailOpen, setEmailOpen] = useState(false);

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [countyFilter, setCountyFilter] = useState<string>("all");
  const [aerialOnly, setAerialOnly] = useState(false);

  const counties = useMemo(
    () => Array.from(new Set(leads.map((l) => l.county))).sort(),
    [leads]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (countyFilter !== "all" && l.county !== countyFilter) return false;
      if (aerialOnly && !l.aerial) return false;
      if (needle) {
        const hay = `${l.name} ${l.dba} ${l.contact} ${l.city} ${l.county}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [leads, q, statusFilter, countyFilter, aerialOnly]);

  const statusCounts = useMemo(() => {
    const m: Record<string, number> = {};
    PIPELINE_STATUSES.forEach((s) => (m[s] = 0));
    leads.forEach((l) => (m[l.status] += 1));
    return m;
  }, [leads]);

  const selectedLeads = filtered.filter((l) => checked[l.id]);
  const allVisibleChecked = filtered.length > 0 && filtered.every((l) => checked[l.id]);

  const toggleAll = () => {
    const next = { ...checked };
    if (allVisibleChecked) filtered.forEach((l) => (next[l.id] = false));
    else filtered.forEach((l) => (next[l.id] = true));
    setChecked(next);
  };

  const legend =
    colorMode === "status"
      ? PIPELINE_STATUSES.map((s) => ({ key: s, label: s, color: STATUS_COLORS[s] }))
      : (Object.keys(READINESS_COLORS) as Array<keyof typeof READINESS_COLORS>).map((k) => ({
          key: k,
          label: READINESS_LABEL[k],
          color: READINESS_COLORS[k],
        }));

  return (
    <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-28 md:px-8">
      <Helmet>
        <title>Lead CRM · Cloud Cowboy</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Internal-tool / security notice */}
      <div className="mb-6 flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span>
          Internal CRM (Phase 1). Runs on local seed data and your browser's storage —
          status changes and logged interactions persist on this device only.
          Authentication, shared persistence, and real email sending land in Phase 2 (Supabase).
          This route must be access-gated before the site goes live.
        </span>
      </div>

      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          <span className="text-gradient-primary">Lead</span> CRM
        </h1>
        <p className="mt-1 text-muted-foreground">
          {leads.length} Colorado ag chemical applicators · {leads.filter((l) => l.aerial).length} aerial operators · live pipeline
        </p>
      </div>

      {/* KPI row */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat label="Total leads" value={leads.length} />
        <Stat label="Aerial operators" value={leads.filter((l) => l.aerial).length} accent={STATUS_COLORS.Qualified} />
        <Stat label="Contactable" value={leads.filter((l) => l.phone || l.email).length} accent={READINESS_COLORS.ready} />
        <Stat label="Engaged+" value={leads.filter((l) => ["Engaged", "Qualified", "Proposal", "Won"].includes(l.status)).length} accent={STATUS_COLORS.Engaged} />
        <Stat label="Won" value={statusCounts.Won} accent={STATUS_COLORS.Won} />
      </div>

      {/* Map card */}
      <Card className="mb-6 overflow-hidden border-border/60 bg-card/40 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-medium text-muted-foreground">
            Target map · scroll to zoom, drag to pan, hover a pin for info, click to open
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Color by</span>
            <Select value={colorMode} onValueChange={(v) => setColorMode(v as "status" | "readiness")}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status">Pipeline status</SelectItem>
                <SelectItem value="readiness">Contact info</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <USLeadMap leads={filtered} colorMode={colorMode} onSelect={setSelected} />

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {legend.map((item) => (
            <span key={item.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-3 w-3 rounded-full border border-white" /> ringed = aerial
          </span>
        </div>
      </Card>

      {/* Filters + bulk actions */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, contact, city…"
            className="h-9 w-56 pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {PIPELINE_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={countyFilter} onValueChange={setCountyFilter}>
          <SelectTrigger className="h-9 w-44"><SelectValue placeholder="County" /></SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="all">All counties</SelectItem>
            {counties.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button
          variant={aerialOnly ? "default" : "outline"}
          size="sm"
          className="h-9 gap-1"
          onClick={() => setAerialOnly((v) => !v)}
        >
          <Plane className="h-4 w-4" /> Aerial only
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {selectedLeads.length} selected
          </span>
          <Button
            size="sm"
            className="h-9 gap-1"
            disabled={selectedLeads.length === 0}
            onClick={() => setEmailOpen(true)}
          >
            <Mail className="h-4 w-4" /> Email selected
          </Button>
        </div>
      </div>

      {/* Leads table */}
      <Card className="border-border/60 bg-card/40">
        <div className="max-h-[560px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card">
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox checked={allVisibleChecked} onCheckedChange={toggleAll} aria-label="Select all" />
                </TableHead>
                <TableHead>Business</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden lg:table-cell">Contact</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => (
                <TableRow
                  key={l.id}
                  className="cursor-pointer"
                  onClick={() => setSelected(l)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={!!checked[l.id]}
                      onCheckedChange={(v) =>
                        setChecked((prev) => ({ ...prev, [l.id]: !!v }))
                      }
                      aria-label={`Select ${l.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {l.aerial && <Plane className="h-3.5 w-3.5 shrink-0 text-primary" />}
                      <span className="font-medium">{l.dba || l.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {l.phone || l.email || "no contact on file"}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {l.city}, {l.state}
                    <div className="text-xs">{l.county} County</div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {l.contact}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLORS[l.status] }} />
                      {l.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    No leads match these filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <LeadDetailDrawer lead={selected} onClose={() => setSelected(null)} />
      <MassEmailDialog open={emailOpen} onOpenChange={setEmailOpen} recipients={selectedLeads} />
    </div>
  );
}

export default function CRM() {
  return (
    <CRMProvider>
      <CRMInner />
    </CRMProvider>
  );
}
