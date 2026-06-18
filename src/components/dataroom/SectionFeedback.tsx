import { useEffect, useState } from "react";
import { MessageSquarePlus, Send, CornerDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { addComment, myComments, type CommentRow } from "@/lib/investor/backend";
import { cn } from "@/lib/utils";

/**
 * Lightweight per-section feedback. Encourages a note while the investor is on
 * that thought path; saved against the section and visible to admins (who can
 * reply). Shows the investor's own prior notes + any reply.
 */
export default function SectionFeedback({ section, className }: { section: string; className?: string }) {
  const { email } = useAuth();
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [mine, setMine] = useState<CommentRow[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) myComments(email, section).then(setMine).catch(() => setMine([]));
  }, [open, email, section]);

  const submit = async () => {
    const text = body.trim();
    if (!text) return;
    setBusy(true);
    try {
      await addComment(email, section, text);
      setBody("");
      toast.success("Thanks — your note was saved.");
      myComments(email, section).then(setMine).catch(() => {});
    } catch {
      toast.error("Couldn't save your note.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className={cn("gap-1.5 text-muted-foreground hover:text-primary", className)}>
          <MessageSquarePlus className="h-4 w-4" /> Leave a note
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="space-y-3">
          <div>
            <div className="text-sm font-medium">Feedback on “{section}”</div>
            <p className="text-xs text-muted-foreground">Your note is saved to this section for the team.</p>
          </div>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What stood out, what's unclear, what would you want to see?"
            className="min-h-[90px] text-sm"
          />
          <Button size="sm" className="w-full gap-1.5" onClick={submit} disabled={busy || !body.trim()}>
            <Send className="h-4 w-4" /> Send note
          </Button>

          {mine.length > 0 && (
            <div className="max-h-40 space-y-2 overflow-y-auto border-t border-border/50 pt-2">
              {mine.map((c) => (
                <div key={c.id} className="text-xs">
                  <p className="text-foreground/90">{c.body}</p>
                  {c.reply && (
                    <p className="mt-1 flex gap-1.5 rounded bg-primary/10 p-1.5 text-primary">
                      <CornerDownRight className="h-3.5 w-3.5 shrink-0" /> {c.reply}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
