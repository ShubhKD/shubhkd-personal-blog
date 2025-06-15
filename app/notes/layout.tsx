import { createClient } from "@/utils/supabase/server";
import SidebarLayoutStep1 from "@/components/sidebar-layout-step1";

export const revalidate = 0;

export default async function NotesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let notes: any[] = [];
  
  try {
    const supabase = createClient();
    // Use a more specific select to avoid potential RLS issues
    const { data, error } = await supabase
      .from("notes")
      .select("id, title, slug, emoji, category, created_at, public")
      .eq("public", true)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Supabase error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      notes = [];
    } else {
      console.log("Successfully fetched notes:", data?.length || 0);
      notes = data || [];
    }
  } catch (error) {
    console.error("Supabase connection error:", error);
    notes = [];
  }

  return (
    <SidebarLayoutStep1 notes={notes}>
      {children}
    </SidebarLayoutStep1>
  );
}
