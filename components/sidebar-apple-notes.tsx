"use client";

import { useState, useEffect, useContext, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SessionNotesContext } from "@/app/notes/session-notes";
import { ScrollArea } from "./ui/scroll-area";
import { Search, Folder } from "lucide-react";

// Helper function to group notes by date
function groupNotesByDate(notes: any[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const grouped = {
    today: [] as any[],
    yesterday: [] as any[],
    "7": [] as any[],
    "30": [] as any[],
    older: [] as any[]
  };

  notes.forEach(note => {
    const noteDate = new Date(note.created_at);

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

export default function SidebarAppleNotes({
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
    return groupNotesByDate(filteredNotes);
  }, [filteredNotes]);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: '2-digit' 
    });
  };

  const getContentPreview = (note: any) => {
    if (note.content && note.content.trim()) {
      // Remove markdown headers and formatting, but preserve text
      let plainText = note.content
        .replace(/^#+\s*/gm, '') // Remove markdown headers (# ## ###)
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting but keep text
        .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting but keep text
        .replace(/`(.*?)`/g, '$1') // Remove code formatting but keep text
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links but keep link text
        .replace(/\n+/g, ' ') // Replace newlines with spaces
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim();
      
      // If content is very short, return as is
      if (plainText.length <= 60) {
        return plainText;
      }
      
      // Find a good breaking point (end of sentence or word)
      const truncated = plainText.substring(0, 60);
      const lastSpace = truncated.lastIndexOf(' ');
      const lastPeriod = truncated.lastIndexOf('.');
      const lastComma = truncated.lastIndexOf(',');
      
      if (lastPeriod > 40) {
        return plainText.substring(0, lastPeriod + 1);
      } else if (lastComma > 40) {
        return plainText.substring(0, lastComma + 1) + '..';
      } else if (lastSpace > 40) {
        return plainText.substring(0, lastSpace) + '...';
      } else {
        return truncated + '...';
      }
    }
    
    // Return empty string for cleaner look when no content
    return '';
  };

  const renderNoteItem = (note: any) => {
    const isSelected = selectedNoteSlug === note.slug;
    
    return (
      <button
        key={note.id}
        onClick={() => handleNoteSelect(note)}
        className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
          isSelected
            ? "border border-transparent"
            : "hover:bg-muted/50 border border-transparent"
        }`}
        style={isSelected ? { backgroundColor: '#ffe391' } : {}}
      >
        <div className="space-y-1">
          <div>
            <h3 className={`font-medium text-sm leading-tight ${
              isSelected ? "text-gray-900" : "text-foreground"
            }`}>
              {note.emoji} {note.title}
            </h3>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatDate(note.created_at)}
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {getContentPreview(note)}
            </p>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Folder className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Notes</span>
          </div>
        </div>
      </button>
    );
  };

  const renderSection = (title: string, notes: any[]) => {
    if (notes.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="px-3 py-2 mb-2">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </h2>
        </div>
        <div className="space-y-1 px-2">
          {notes.map(note => renderNoteItem(note))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-[340px] h-screen bg-background border-r border-border flex flex-col">
      {/* Mac Traffic Light Dots */}
      <div className="flex items-center justify-start px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer"></div>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-muted border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-background transition-all duration-200"
          />
        </div>
      </div>

      {/* Notes List */}
      <ScrollArea className="flex-1" isMobile={isMobile}>
        <div className="py-4">
          {renderSection("Today", groupedNotes.today)}
          {renderSection("Yesterday", groupedNotes.yesterday)}
          {renderSection("Previous 7 Days", groupedNotes["7"])}
          {renderSection("Previous 30 Days", groupedNotes["30"])}
          {renderSection("Older", groupedNotes.older)}
          
          {filteredNotes.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-12">
              <div className="space-y-2">
                <div className="text-muted-foreground">
                  <Search className="w-8 h-8 mx-auto mb-2" />
                </div>
                <p>No notes found</p>
                <p className="text-xs text-muted-foreground">Try a different search term</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
