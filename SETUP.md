# Personal Blog Platform Setup Guide

This is your personal blog platform based on Alana Goyal's open-source implementation. Follow these steps to get it running.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier is sufficient)
- Vercel account for deployment (optional)

## Step 1: Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is created, go to Settings > API
3. Copy your Project URL and anon/public key
4. Update the `.env.local` file with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
```

## Step 2: Database Setup

1. In your Supabase dashboard, go to the SQL Editor
2. Run the migration file content from `supabase/migrations/20240710180237_initial.sql`
3. This will create the notes table and all necessary functions

## Step 3: Customize Your Site

1. Edit `config/site.ts` to update your name and domain
2. Update the title and URL to match your preferences

## Step 4: Run Development Server

```bash
npm run dev
```

Your blog will be available at `http://localhost:3000`

## Step 5: Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

## Features Included

- ✅ Clean, minimal design with dark mode
- ✅ Markdown support for writing posts
- ✅ Public/private notes system
- ✅ Search functionality
- ✅ Mobile-responsive design
- ✅ SEO optimized with OG images
- ✅ Session-based note management
- ✅ Emoji support for notes
- ✅ Real-time updates

## How to Use

1. Visit your site and start creating notes
2. Notes are private by default (session-based)
3. You can make notes public to share them
4. Use markdown for formatting
5. Add emojis to categorize your notes

## Customization

- Edit components in `/components` folder
- Modify styles in `/app/notes/globals.css`
- Update theme colors in `tailwind.config.ts`
- Add new pages in the `/app` directory

Enjoy your new personal blog platform! 🚀
