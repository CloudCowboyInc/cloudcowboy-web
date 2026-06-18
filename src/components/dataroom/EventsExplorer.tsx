import { useState } from "react";
import { List, CalendarRange } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import EventsToggleList from "./EventsToggleList";
import EventsCalendar from "./EventsCalendar";
import { useModel } from "@/lib/model/store";

type View = "list" | "calendar";

/**
 * Events explorer — toggle between the include/exclude list (which drives the
 * finance model) and a calendar view of the whole circuit with travel days,
 * colour-coded by priority. Both open per-event detail on click.
 */
export default function EventsExplorer() {
  const [view, setView] = useState<View>("calendar");
  const { eventToggles } = useModel();
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(v) => v && setView(v as View)}
          className="rounded-lg border border-border/60 bg-card/60 p-0.5"
          aria-label="Events view"
        >
          <ToggleGroupItem value="list" aria-label="List" className="h-8 gap-1.5 px-3 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            <List className="h-3.5 w-3.5" /> List
          </ToggleGroupItem>
          <ToggleGroupItem value="calendar" aria-label="Calendar" className="h-8 gap-1.5 px-3 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            <CalendarRange className="h-3.5 w-3.5" /> Calendar
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {view === "list" ? <EventsToggleList /> : <EventsCalendar includedIds={eventToggles} />}
    </div>
  );
}
