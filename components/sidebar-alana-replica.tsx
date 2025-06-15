"use client";

import { useState, useEffect, useContext, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SessionNotesContext } from "@/app/notes/session-notes";
import { ScrollArea } from "./ui/scroll-area";
import { Search, Pin } from "lucide-react";

// Helper function to group notes by date
function groupNotesByDate(notes: any[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const grouped = {
    pinned: [] as any[],
    today: [] as any[],
    yesterday: [] as any[],
    "7": [] as any[],
    "30": [] as any[],
    older: [] as any[]
  };

  notes.forEach(note => {
    const noteDate = new Date(note.created_at);
    const noteDateOnly = new Date(noteDate.getFullYear(), noteDate.getMonth(), noteDate.getDate());

    if (noteDate >= today) {
      grouped.today.push(note);
    } else if (noteDate >= yesterday) {
      grouped.yesterday.push(note);
    } else if (noteDate >= sevenDaysAgo) {
      grouped["7"].push(note);
    } else if (noteDate >= thirtyDaysAgo) {
      grouped["30"].push(note);
    } else {
      grouped.older.push(note);
    }
  });

  return grouped;
}

export default function SidebarAlanaReplica({
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
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedNotes, setPinnedNotes] = useState<Set<string>>(new Set());
  
  const { notes: sessionNotes } = useContext(SessionNotesContext);
  const allNotes = [...publicNotes, ...sessionNotes];

  // Filter notes based on search
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return allNotes;
    return allNotes.filter(note => 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allNotes, searchQuery]);

  // Group notes by date
  const groupedNotes = useMemo(() => {
    const grouped = groupNotesByDate(filteredNotes);
    
    // Add pinned notes
    grouped.pinned = filteredNotes.filter(note => pinnedNotes.has(note.slug));
    
    return grouped;
  }, [filteredNotes, pinnedNotes]);

  useEffect(() => {
    if (pathname) {
      const slug = pathname.split("/").pop();
      setSelectedNoteSlug(slug || null);
    }
  }, [pathname]);

  // Load pinned notes from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("pinnedNotes");
    if (stored) {
      setPinnedNotes(new Set(JSON.parse(stored)));
    }
  }, []);

  const handleNoteSelect = (note: any) => {
    onNoteSelect(note);
    if (!isMobile) {
      router.push(`/notes/${note.slug}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const renderNoteItem = (note: any, isPinned = false) => {
    const isSelected = selectedNoteSlug === note.slug;
    
    return (
      <button
        key={note.id}
        onClick={() => handleNoteSelect(note)}
        className={`w-full text-left p-2 rounded-md transition-colors group ${
          isSelected || isPinned
            ? "bg-yellow-200 text-gray-900"
            : "hover:bg-gray-100 text-gray-700"
        }`}
      >
        <div className="flex items-start gap-2">
          <span className="text-sm mt-0.5">{note.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{note.title}</div>
            <div className="text-xs text-gray-500 mt-0.5">
              {formatDate(note.created_at)} {note.content?.substring(0, 50)}...
            </div>
          </div>
        </div>
      </button>
    );
  };

  const renderSection = (title: string, notes: any[], icon?: React.ReactNode) => {
    if (notes.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
          {icon}
          {title}
        </div>
        <div className="space-y-1">
          {notes.map(note => renderNoteItem(note, title === "Pinned"))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-[300px] h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Search Bar */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Notes List */}
      <ScrollArea className="flex-1" isMobile={isMobile}>
        <div className="p-3 space-y-4">
          {renderSection("Pinned", groupedNotes.pinned, <Pin className="w-3 h-3" />)}
          {renderSection("Today", groupedNotes.today)}
          {renderSection("Yesterday", groupedNotes.yesterday)}
          {renderSection("Previous 7 Days", groupedNotes["7"])}
          {renderSection("Previous 30 Days", groupedNotes["30"])}
          {renderSection("Older", groupedNotes.older)}
          
          {filteredNotes.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-8">
              No notes found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
