"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotesPage() {
  const router = useRouter();

  useEffect(() => {
    // On desktop, redirect to the welcome note
    // On mobile, show the sidebar (handled by SidebarLayout)
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) {
      router.push("/notes/welcome");
    }
  }, [router]);

  // This page is primarily for mobile - desktop users get redirected
  return (
    <div className="flex items-center justify-center h-full text-center p-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Welcome to Your Notes</h1>
        <p className="text-gray-600">Select a note from the sidebar to get started.</p>
      </div>
    </div>
  );
}
