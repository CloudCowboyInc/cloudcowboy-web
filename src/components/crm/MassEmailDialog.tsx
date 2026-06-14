import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { Lead } from "@/data/leads";
import { useCRM } from "@/lib/crm-store";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";

export default function MassEmailDialog({
  open,
  onOpenChange,
  recipients,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  recipients: Lead[];
}) {
  const { addInteraction } = useCRM();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const withEmail = recipients.filter((r) => r.email);
  const missing = recipients.length - withEmail.length;

  const [busy, setBusy] = useState(false);

  const send = async () => {
    if (isSupabaseConfigured && supabase) {
      // Phase 2: real send via the send-bulk edge function (Resend). The
      // function also logs an interaction per recipient server-side.
      setBusy(true);
      const { data, error } = await supabase.functions.invoke("send-bulk", {
        body: { leadIds: withEmail.map((r) => r.id), subject, body },
      });
      setBusy(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      const sent = (data as { sent?: number })?.sent ?? withEmail.length;
      toast.success(`Sent ${sent} email${sent === 1 ? "" : "s"}`);
    } else {
      // Local mode: log the touch so history is accurate (no real delivery).
      withEmail.forEach((r) =>
        addInteraction({
          leadId: r.id,
          type: "email",
          summary: `Mass email — "${subject || "(no subject)"}"`,
        })
      );
      toast.success(
        `Queued ${withEmail.length} email${withEmail.length === 1 ? "" : "s"} (local: logged, not sent)`
      );
    }
    setSubject("");
    setBody("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Compose mass email</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge variant="secondary">{withEmail.length} recipients</Badge>
            {missing > 0 && (
              <span className="text-xs text-muted-foreground">
                {missing} selected lead{missing === 1 ? "" : "s"} have no email and will be skipped
              </span>
            )}
          </div>
          <Input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Textarea
            placeholder={"Hi there,\n\n…\n\n— Chris, Cloud Cowboy"}
            rows={8}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <p className="rounded-md border border-border bg-muted/40 p-2 text-[11px] text-muted-foreground">
            {isSupabaseConfigured
              ? "Sends for real via Resend and logs a touch on each recipient."
              : "Backend not configured: this logs a touch against each recipient's history but does not deliver email yet."}
          </p>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={send} disabled={withEmail.length === 0 || busy}>
            Queue {withEmail.length} email{withEmail.length === 1 ? "" : "s"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
