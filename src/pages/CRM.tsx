import { useMemo, useState } from "react";
import { CRMProvider, useCRM } from "@/lib/crm-store";
import { PIPELINE_STATUSES, type Lead } from "@/data/leads";
import USLeadMap from "@/components/crm/USLeadMap";
import LeadDetailDrawer from "@/components/crm/LeadDetailDrawer";
import MassEmailDialog from "@/components/crm/MassEmailDialog";
import {
  STATUS_COLORS,
  READINESS_COLORS,
  READINESS_LABEL,
  OPERATOR_COLORS,
  OPERATOR_LABEL,
} from "@/components/crm/statusConfig";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plane, Bot, Tractor, Mail, Search } from "lucide-react";

type ColorMode = "status" | "readiness" | "operator";

const OP_ICON = { drone: Bot, aerial: Plane, ground: Tractor, "": Tractor } as const;

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
  const [colorMode, setColorMode] = useState<ColorMode>("operator");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [emailOpen, setEmailOpen] = useState(false);

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [opFilter, setOpFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const states = useMemo(
    () => Array.from(new Set(leads.map((l) => l.state).filter(Boolean))).sort(),
    [leads]
  );
  const sources = useMemo(
    () => Array.from(new Set(leads.map((l) => l.source).filter(Boolean))).sort(),
    [leads]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (stateFilter !== "all" && l.state !== stateFilter) return false;
      if (opFilter !== "all" && l.operatorType !== opFilter) return false;
      if (sourceFilter !== "all" && l.source !== sourceFilter) return false;
      if (needle) {
        const hay = `${l.name} ${l.dba} ${l.contact} ${l.city} ${l.county} ${l.state}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [leads, q, statusFilter, stateFilter, opFilter, sourceFilter]);

  const count = (fn: (l: Lead) => boolean) => leads.filter(fn).length;
  const selectedLeads = filtered.filter((l) => checked[l.id]);
  const allVisibleChecked = filtered.length > 0 && filtered.every((l) => checked[l.id]);
  const toggleAll = () => {
    const next = { ...checked };
    filtered.forEach((l) => (next[l.id] = !allVisibleChecked));
    setChecked(next);
  };

  const legend =
    colorMode === "status"
      ? PIPELINE_STATUSES.map((s) => ({ key: s, label: s, color: STATUS_COLORS[s] }))
      : colorMode === "operator"
      ? (["drone", "aerial", "ground"] as const).map((k) => ({ key: k, label: OPERATOR_LABEL[k], color: OPERATOR_COLORS[k] }))
      : (Object.keys(READINESS_COLORS) as Array<keyof typeof READINESS_COLORS>).map((k) => ({
          key: k, label: READINESS_LABEL[k], color: READINESS_COLORS[k],
        }));

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        {leads.length.toLocaleString()} applicators ·{" "}
        {count((l) => l.operatorType === "drone")} drone ·{" "}
        {count((l) => l.operatorType === "aerial")} manned-aerial ·{" "}
        {count((l) => l.operatorType === "ground")} ground · {states.length} states
      </p>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat label="Total companies" value={leads.length} />
        <Stat label="Drone operators" value={count((l) => l.operatorType === "drone")} accent={OPERATOR_COLORS.drone} />
        <Stat label="Contactable" value={count((l) => !!(l.phone || l.email))} accent={READINESS_COLORS.ready} />
        <Stat label="Engaged+" value={count((l) => ["Engaged", "Qualified", "Proposal", "Won"].includes(l.status))} accent={STATUS_COLORS.Engaged} />
        <Stat label="Won" value={count((l) => l.status === "Won")} accent={STATUS_COLORS.Won} />
      </div>

      {/* Map */}
      <Card className="overflow-hidden border-border/60 bg-card/40 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-medium text-muted-foreground">
            Target map · two-finger / scroll to zoom, drag to pan, hover for info, click to open
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Color by</span>
            <Select value={colorMode} onValueChange={(v) => setColorMode(v as ColorMode)}>
              <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="operator">Operator type</SelectItem>
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
        </div>
      </Card>

      {/* Filters + bulk actions */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, contact, city…" className="h-9 w-56 pl-8" />
        </div>
        <Select value={opFilter} onValueChange={setOpFilter}>
          <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Operator" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All operators</SelectItem>
            <SelectItem value="drone">Drone</SelectItem>
            <SelectItem value="aerial">Aerial (manned)</SelectItem>
            <SelectItem value="ground">Ground</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {PIPELINE_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={stateFilter} onValueChange={setStateFilter}>
          <SelectTrigger className="h-9 w-32"><SelectValue placeholder="State" /></SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="all">All states</SelectItem>
            {states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Source" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            {sources.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{selectedLeads.length} selected</span>
          <Button size="sm" className="h-9 gap-1" disabled={selectedLeads.length === 0} onClick={() => setEmailOpen(true)}>
            <Mail className="h-4 w-4" /> Email selected
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="border-border/60 bg-card/40">
        <div className="max-h-[560px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card">
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox checked={allVisibleChecked} onCheckedChange={toggleAll} aria-label="Select all" />
                </TableHead>
                <TableHead>Business</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden lg:table-cell">Contact</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => {
                const Icon = OP_ICON[l.operatorType] ?? Tractor;
                return (
                  <TableRow key={l.id} className="cursor-pointer" onClick={() => setSelected(l)}>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={!!checked[l.id]} onCheckedChange={(v) => setChecked((p) => ({ ...p, [l.id]: !!v }))} aria-label={`Select ${l.name}`} />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{l.dba || l.name}</div>
                      <div className="text-xs text-muted-foreground">{l.phone || l.email || "no contact on file"}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: OPERATOR_COLORS[l.operatorType] }}>
                        <Icon className="h-3.5 w-3.5" /> {OPERATOR_LABEL[l.operatorType]}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {l.city}{l.city && l.state ? ", " : ""}{l.state}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{l.contact}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-sm">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLORS[l.status] }} />
                        {l.status}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No companies match these filters.</TableCell>
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

export default function CrmBoard() {
  return (
    <CRMProvider>
      <CRMInner />
    </CRMProvider>
  );
}
