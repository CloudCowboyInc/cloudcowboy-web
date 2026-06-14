import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone, Mail, Globe, MapPin, Plane } from "lucide-react";
import { PIPELINE_STATUSES, type Lead, type PipelineStatus } from "@/data/leads";
import { useCRM, type InteractionType } from "@/lib/crm-store";
import { STATUS_COLORS, READINESS_LABEL } from "./statusConfig";
import { toast } from "sonner";

const TYPES: InteractionType[] = ["call", "email", "meeting", "note"];

export default function LeadDetailDrawer({
  lead,
  onClose,
}: {
  lead: Lead | null;
  onClose: () => void;
}) {
  const { updateStatus, addInteraction, interactionsFor } = useCRM();
  const [type, setType] = useState<InteractionType>("note");
  const [summary, setSummary] = useState("");

  if (!lead) return null;
  const history = interactionsFor(lead.id);

  const logIt = () => {
    if (!summary.trim()) return;
    addInteraction({ leadId: lead.id, type, summary: summary.trim() });
    setSummary("");
    toast.success("Interaction logged");
  };

  return (
    <Sheet open={!!lead} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="pr-6 font-display text-xl">
            {lead.dba || lead.name}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-5 text-sm">
          <div className="flex flex-wrap gap-2">
            {lead.aerial && (
              <Badge className="gap-1 bg-primary/15 text-primary hover:bg-primary/15">
                <Plane className="h-3 w-3" /> Aerial operator
              </Badge>
            )}
            {lead.codes.map((c) => (
              <Badge key={c} variant="outline">
                Cat {c}
              </Badge>
            ))}
            <Badge variant="outline">
              {READINESS_LABEL[lead.readiness]}
            </Badge>
          </div>

          <div className="space-y-1.5 text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              {lead.city}, {lead.state} {lead.zip} · {lead.county} County
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              {lead.phone ? (
                <a href={`tel:${lead.phone}`} className="hover:text-primary">
                  {lead.phone}
                </a>
              ) : (
                <span className="italic opacity-60">no phone on file</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              {lead.email ? (
                <a href={`mailto:${lead.email}`} className="hover:text-primary">
                  {lead.email}
                </a>
              ) : (
                <span className="italic opacity-60">no email on file</span>
              )}
            </div>
            {lead.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 shrink-0" />
                <a
                  href={lead.website}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate hover:text-primary"
                >
                  {lead.website}
                </a>
              </div>
            )}
            {(lead.employees || lead.revenue) && (
              <div className="pl-6 text-xs">
                {lead.employees ? `~${lead.employees} staff` : ""}
                {lead.employees && lead.revenue ? " · " : ""}
                {lead.revenue ? `est. ${lead.revenue}` : ""}
              </div>
            )}
            <div className="pl-6 text-xs">Owner / contact: {lead.contact}</div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Pipeline status
            </label>
            <Select
              value={lead.status}
              onValueChange={(v) => {
                updateStatus(lead.id, v as PipelineStatus);
                toast.success(`Moved to ${v}`);
              }}
            >
              <SelectTrigger>
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: STATUS_COLORS[lead.status] }}
                  />
                  <SelectValue />
                </span>
              </SelectTrigger>
              <SelectContent>
                {PIPELINE_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Log an interaction
            </div>
            <div className="flex gap-2">
              <Select value={type} onValueChange={(v) => setType(v as InteractionType)}>
                <SelectTrigger className="w-32 capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="What happened? Next steps?"
              className="mt-2"
              rows={3}
            />
            <Button onClick={logIt} className="mt-2 w-full" disabled={!summary.trim()}>
              Log interaction
            </Button>
          </div>

          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              History ({history.length})
            </div>
            {history.length === 0 ? (
              <p className="text-xs italic text-muted-foreground">
                No interactions logged yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {history.map((h) => (
                  <li key={h.id} className="border-l-2 border-border pl-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold capitalize text-foreground">
                        {h.type}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(h.date).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{h.summary}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
