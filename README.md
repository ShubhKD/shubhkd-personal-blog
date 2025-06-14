# Shubh KD - Personal Blog

A minimalist personal blog platform built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

- **Clean, minimal design** with excellent typography
- **Dark mode** support with system preference detection
- **Markdown support** with syntax highlighting
- **Search functionality** across all posts
- **Public/private notes** system
- **Mobile-responsive** design
- **SEO optimized** with dynamic meta tags
- **Fast loading** with Next.js optimization

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics

## 🏃‍♂️ Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/shubhkd-personal-blog.git
cd shubhkd-personal-blog
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Supabase credentials to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Set up the database:
- Run the SQL commands in `setup-database.sql` in your Supabase SQL editor

6. Start the development server:
```bash
npm run dev
```

## 📝 Adding Content

Currently, you can add new blog posts by inserting them directly into your Supabase database:

```sql
INSERT INTO notes (title, content, public, slug, category, emoji) 
VALUES (
  'Your Post Title',
  '# Your Post Title\n\nYour markdown content here...',
  true,
  'your-post-slug',
  'category',
  '✨'
);
```

## 🌐 Deployment

This blog is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## 📄 License

MIT License - feel free to use this for your own personal blog!

## 🙏 Acknowledgments

Inspired by [Alana Goyal's](https://alanagoyal.com) beautiful blog design.
