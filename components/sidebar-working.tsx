"use client";

import { useState, useEffect, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SessionNotesContext } from "@/app/notes/session-notes";
import { ScrollArea } from "./ui/scroll-area";

export default function SidebarWorking({
  notes: publicNotes,
  onNoteSelect,
  isMobile,
}: {
  notes: any[];
  onNoteSelect: (note: any) => void;
  isMobile: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedNoteSlug, setSelectedNoteSlug] = useState<string | null>(null);
  
  const { notes: sessionNotes } = useContext(SessionNotesContext);
  const notes = [...publicNotes, ...sessionNotes];

  useEffect(() => {
    if (pathname) {
      const slug = pathname.split("/").pop();
      setSelectedNoteSlug(slug || null);
    }
  }, [pathname]);

  const handleNoteSelect = (note: any) => {
    onNoteSelect(note);
    if (!isMobile) {
      router.push(`/notes/${note.slug}`);
    }
  };

  return (
    <div
      className={`${
        isMobile
          ? "w-full max-w-full"
          : "w-[320px] border-r border-muted-foreground/20"
      } h-dvh flex flex-col dark:bg-muted bg-white`}
    >
      {/* Header */}
      <div className="p-4 border-b border-muted-foreground/20">
        <h1 className="text-lg font-semibold">Notes</h1>
        <p className="text-sm text-muted-foreground">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </p>
      </div>

      {/* Notes List */}
      <ScrollArea className="flex-1" isMobile={isMobile}>
        <div className="p-2 space-y-1">
          {notes.map((note) => (
            <button
              key={note.id}
              onClick={() => handleNoteSelect(note)}
              className={`w-full text-left p-3 rounded-lg transition-colors hover:bg-muted/50 ${
                selectedNoteSlug === note.slug
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">{note.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{note.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(note.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
