import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function NotesPage() {
  let notes: any[] = [];
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("notes")
      .select("id, title, slug, emoji, category, created_at")
      .eq("public", true)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Supabase error:", error);
      notes = [];
    } else {
      notes = data || [];
    }
  } catch (error) {
    console.error("Supabase connection error:", error);
    notes = [];
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Shubh KD - Notes</h1>
      
      {notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No notes found. Check your database connection.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <Link
              key={note.id}
              href={`/notes/${note.slug}`}
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                {note.emoji && <span className="text-xl">{note.emoji}</span>}
                <h2 className="text-xl font-semibold">{note.title}</h2>
              </div>
              {note.category && (
                <span className="text-sm text-gray-500 mt-1 block">
                  {note.category}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
