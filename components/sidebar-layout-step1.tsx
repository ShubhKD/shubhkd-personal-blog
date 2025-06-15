"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SessionNotesProvider } from "@/app/notes/session-notes";

interface SidebarLayoutProps {
  children: React.ReactNode;
  notes: any;
}

export default function SidebarLayoutStep1({ children, notes }: SidebarLayoutProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile === null) {
    return <div>Loading...</div>;
  }

  return (
    <SessionNotesProvider>
      <div className="h-screen flex">
        {/* Minimal sidebar with SessionNotesProvider */}
        <div className="w-80 border-r border-gray-200 bg-gray-50 p-4">
          <h2 className="font-bold mb-4">Step 1: With SessionNotesProvider</h2>
          <p>Mobile: {isMobile ? "Yes" : "No"}</p>
          <p>Notes count: {notes?.length || 0}</p>
          <div className="mt-4 space-y-2">
            {notes?.map((note: any) => (
              <div key={note.id} className="p-2 border border-gray-200 rounded">
                <button
                  onClick={() => router.push(`/notes/${note.slug}`)}
                  className="text-left hover:text-blue-600 w-full"
                >
                  {note.emoji} {note.title}
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </SessionNotesProvider>
  );
}
