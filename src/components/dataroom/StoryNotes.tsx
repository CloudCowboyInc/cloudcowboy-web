import WhyThis from "./WhyThis";
import { notesForPage, type StoryPage } from "@/data/storyNotes";

interface StoryNotesProps {
  page: StoryPage;
  className?: string;
}

/**
 * Renders the "Story & Notes" narrative for a page as a stack of WhyThis
 * expanders — contextual "why this" without shouting over the numbers.
 */
export default function StoryNotes({ page, className }: StoryNotesProps) {
  const notes = notesForPage(page);
  if (notes.length === 0) return null;
  return (
    <div className={className}>
      <div className="space-y-2">
        {notes.map((note) => (
          <WhyThis key={note.id} title={note.title}>
            {note.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </WhyThis>
        ))}
      </div>
    </div>
  );
}
