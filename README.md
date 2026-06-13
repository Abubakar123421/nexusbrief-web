# NexusBrief

> **The World, Curated For You.**
> A premium, personalized daily news digest and productivity dashboard featuring a stunning black-and-white broadsheet editorial aesthetic.

![NexusBrief Showcase](https://via.placeholder.com/1200x630.png?text=NexusBrief+Dashboard) *(Replace this placeholder with a high-res screenshot or video GIF of your UI)*

## Overview

NexusBrief started as a JavaFX 17 desktop application and has now been fully modernized and rebuilt for the web. It provides users with a centralized, beautiful dashboard to start their day. 

By aggregating live news, personal schedules, and academic assignments into a single, high-contrast, editorial-style interface, NexusBrief helps you cut through the noise. It seamlessly integrates with external services to keep you organized without ever leaving the page.

### Key Features
- **Personalized News Digests:** Live news aggregation across multiple categories, powered by the GNews API.
- **Academic Integration:** Direct connection to Google Classroom to track and display upcoming assignments and deadlines.
- **Calendar Export & Scheduling:** Schedule reading times for articles or export assignments directly to Google Calendar or as `.ics` files.
- **User Authentication:** Secure sign-up, login, and profile management with Google OAuth support.
- **Bespoke Editorial UI:** A custom design system leveraging classic typography (Playfair Display, EB Garamond) and a monochromatic palette to emulate a premium digital newspaper.
- **Scroll-Linked Animations:** Cinematic hero video transitions and fluid micro-interactions using Framer Motion.

## Tech Stack

This project was rebuilt from the ground up to leverage modern web technologies for maximum performance, accessibility, and developer experience.

**Core:**
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

**Backend & Data:**
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication:** Supabase Auth (Email/Password & Google OAuth)
- **Hosting:** [Vercel](https://vercel.com)

**External APIs:**
- [GNews API](https://gnews.io/) (Live news aggregation)
- [Google Classroom REST API](https://developers.google.com/classroom)
- [Google Calendar Integration](https://developers.google.com/calendar)

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project
- API Keys for GNews and Google Cloud (Classroom/Calendar scopes)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/nexusbrief-web.git
   cd nexusbrief-web
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure Environment Variables
   Rename `.env.local.example` to `.env.local` and add your keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GNEWS_API_KEY=your_gnews_key
   GOOGLE_CLASSROOM_API_KEY=your_google_classroom_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture & Design
For an in-depth look at the design system, database schema, ranking strategies, and component breakdown, please refer to the [System Specification Document](./src/nexusbrief_system_spec.md).

---
*Built with ❤️ for a cleaner, more organized daily reading experience.*
