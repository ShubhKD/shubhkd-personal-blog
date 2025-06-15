const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function addAboutPost() {
  const aboutPost = {
    title: 'About Me',
    slug: 'about-me',
    emoji: '👋',
    content: `# About Me

hi, i'm shubh - a curious problem solver, designing both a life and products that compound.

## currently

- leading product-led growth at [CRED](https://cred.club/)
- building growth loops across FTUE, resurrection, referrals, gamified systems, and more
- exploring agentic AI, side quests, and the intersection of curiosity and execution
- building Version 2.0 of myself — stronger, sharper, more joyful
- planning travel like it's a product roadmap (and collecting memories like product wins)
- rediscovering the joy of fitness, journaling, and being fully present with people i care about

## previously

- led monetization products at [CRED](https://cred.club/) — made ₹ flow
- built products across [B2B SaaS](https://www.linkedin.com/company/recko/) (Recko), [EV tech](https://www.linkedin.com/company/yulu/posts/?feedView=all) (Yulu), and [health tech](https://www.linkedin.com/company/stepsetgo/) (StepSetGo) — well-rounded is the brand
- ran one of India's longest-running [TEDx](https://www.ted.com/profiles/15266686/about) conferences at BITS — learned a thing or two about storytelling and high-agency teams
- started out at [BITS Pilani](https://www.linkedin.com/school/birla-institute-of-technology-and-science-pilani/posts/?feedView=all) — where i learned to optimize sleep, deadlines, and dopamine all at once
- failed fast (and often), but always shipped`,
    created_at: '2025-06-13T10:00:00.000Z',
    public: false,
    category: 'personal'
  };

  try {
    const { data, error } = await supabase
      .from('notes')
      .insert([aboutPost])
      .select();

    if (error) {
      console.error('Error inserting post:', error);
      return;
    }

    console.log('✅ Successfully added "About Me" post!');
    console.log('📝 Post data:', data[0]);
    console.log('🌐 Available at: https://shubhkd.vercel.app/notes/about-me');
  } catch (err) {
    console.error('❌ Failed to add post:', err);
  }
}

addAboutPost();
