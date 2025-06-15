"use client";

import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter, usePathname } from "next/navigation";
import { SessionNotesProvider } from "@/app/notes/session-notes";

interface SidebarLayoutProps {
  children: React.ReactNode;
  notes: any;
}

export default function SidebarLayoutDebug({ children, notes }: SidebarLayoutProps) {
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

  useEffect(() => {
    if (isMobile !== null && !isMobile && pathname === "/notes") {
      router.push("/notes/welcome");
    }
  }, [isMobile, router, pathname]);

  if (isMobile === null) {
    return <div>Loading...</div>;
  }

  return (
    <SessionNotesProvider>
      <div className="dark:text-white h-dvh flex">
        {/* Simplified sidebar for debugging */}
        <div className="w-[320px] border-r border-gray-200 bg-gray-50 p-4">
          <h2 className="font-bold mb-4">Debug Sidebar</h2>
          <p>Mobile: {isMobile ? "Yes" : "No"}</p>
          <p>Notes count: {notes?.length || 0}</p>
          <div className="mt-4">
            {notes?.map((note: any) => (
              <div key={note.id} className="p-2 border-b">
                <button
                  onClick={() => router.push(`/notes/${note.slug}`)}
                  className="text-left hover:text-blue-600"
                >
                  {note.emoji} {note.title}
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-grow h-dvh">
          <ScrollArea className="h-full" isMobile={isMobile}>
            {children}
          </ScrollArea>
        </div>
        <Toaster />
      </div>
    </SessionNotesProvider>
  );
}
