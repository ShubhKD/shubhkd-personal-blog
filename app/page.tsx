import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to the notes page since that's where the main content is
  redirect('/notes')
}
