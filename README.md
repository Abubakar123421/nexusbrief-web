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

### Frontend
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (99.4% of codebase)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Package Manager:** npm

### Backend & Data
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication:** Supabase Auth (Email/Password & Google OAuth)
- **Hosting:** [Vercel](https://vercel.com)
- **API Layer:** Next.js API Routes

### External APIs & Integrations
- **[GNews API](https://gnews.io/)** - Live news aggregation across multiple categories
- **[Google Classroom REST API](https://developers.google.com/classroom)** - Academic assignment tracking
- **[Google Calendar API](https://developers.google.com/calendar)** - Calendar integration and exports

### Development Tools
- **Version Control:** Git & GitHub
- **Code Quality:** TypeScript strict mode
- **Styling:** Tailwind CSS utilities with custom configuration
- **Component Library:** shadcn/ui (built on Radix UI primitives)

## Getting Started

### Prerequisites
- **Node.js** 18+ (recommended: 20 LTS)
- **npm** 9+ or **yarn**
- A **Supabase** project ([create one here](https://supabase.com))
- **API Keys:**
  - GNews API key ([get it here](https://gnews.io))
  - Google Cloud API keys with:
    - Google Classroom API enabled
    - Google Calendar API enabled
  - Google OAuth 2.0 Client ID

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abubakar123421/nexusbrief-web.git
   cd nexusbrief-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   
   Rename `.env.local.example` to `.env.local` and add your configuration:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # External APIs
   GNEWS_API_KEY=your_gnews_api_key
   GOOGLE_CLASSROOM_API_KEY=your_google_classroom_api_key
   GOOGLE_CALENDAR_API_KEY=your_google_calendar_api_key
   
   # Google OAuth
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Application URLs
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
   
   # Optional: Analytics & Monitoring
   NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
nexusbrief-web/
├── public/                 # Static assets (images, icons, fonts)
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── api/           # API routes
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── auth/          # Authentication pages
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/        # Reusable React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── dashboard/     # Dashboard-specific components
│   │   └── common/        # Shared components
│   ├── lib/               # Utility functions & helpers
│   │   ├── supabase.ts    # Supabase client
│   │   ├── api/           # API client functions
│   │   └── utils.ts       # Helper functions
│   ├── styles/            # Global styles & Tailwind config
│   ├── types/             # TypeScript type definitions
│   ├── hooks/             # Custom React hooks
│   └── nexusbrief_system_spec.md  # Comprehensive system documentation
├── .env.local.example     # Environment variables template
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── next.config.ts         # Next.js configuration
└── package.json           # Project dependencies
```

## Available Scripts

```bash
# Development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check

# Format code
npm run format
```

## Database Schema

The application uses Supabase (PostgreSQL) with the following main tables:

- **users** - User profiles and authentication data
- **articles** - Cached news articles from GNews API
- **user_preferences** - User news category and personalization settings
- **saved_articles** - User's bookmarked/saved articles
- **classroom_assignments** - Synced Google Classroom assignments
- **reading_schedules** - User's scheduled reading times
- **calendar_exports** - Calendar event exports

For detailed schema information, refer to the [System Specification Document](./src/nexusbrief_system_spec.md).

## Authentication Flow

NexusBrief supports two authentication methods:

### 1. Email/Password
- User signs up with email and password
- Credentials stored securely in Supabase Auth
- Session management via Supabase JWT tokens

### 2. Google OAuth
- Users can sign in with their Google account
- Automatically grants access to Google Classroom and Calendar APIs
- Scopes requested:
  - `https://www.googleapis.com/auth/classroom.readonly` (assignments)
  - `https://www.googleapis.com/auth/calendar` (calendar integration)
  - `https://www.googleapis.com/auth/userinfo.profile` (profile info)

## API Integrations

### GNews API
Fetches live news articles based on:
- User-selected categories (business, technology, sports, entertainment, health, science, etc.)
- Search keywords
- Language preferences
- Sorting and ranking algorithms

### Google Classroom API
Syncs:
- Upcoming assignments and deadlines
- Course information
- Student submissions status
- Due dates and descriptions

### Google Calendar API
Enables:
- Reading schedule creation
- Assignment deadline export
- Calendar integration
- `.ics` file generation

## Design System

NexusBrief uses a carefully curated design system emphasizing:

- **Typography:** 
  - Headlines: Playfair Display (serif)
  - Body: EB Garamond (serif)
  - UI: Inter (sans-serif)

- **Color Palette:** 
  - Primary: Black (#000000)
  - Secondary: White (#FFFFFF)
  - Accents: Subtle grays for hierarchy

- **Layout:** 
  - Broadsheet-style grid
  - Generous whitespace
  - High contrast for readability

For complete design guidelines, see the [System Specification Document](./src/nexusbrief_system_spec.md).

## Performance Optimization

- **Next.js Image Optimization** for responsive images
- **Code Splitting** via Next.js automatic route splitting
- **Static Generation** for marketing pages
- **Incremental Static Regeneration (ISR)** for news feeds
- **API Response Caching** with strategic TTLs
- **Framer Motion** animations optimized for 60fps

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repo to [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Deploy with a single click

```bash
# Or deploy from CLI
npm install -g vercel
vercel
```

### Manual Deployment

```bash
# Build production bundle
npm run build

# Start production server
npm start
```

## Environment Setup for Different Environments

### Development
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Staging
```env
NEXT_PUBLIC_APP_URL=https://staging.nexusbrief.com
NODE_ENV=production
```

### Production
```env
NEXT_PUBLIC_APP_URL=https://nexusbrief.com
NODE_ENV=production
```

## Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow TypeScript strict mode
- Use functional components with hooks
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Ensure all tests pass before submitting PR

## Issues & Bug Reports

Found a bug or have a feature request? [Open an issue](https://github.com/Abubakar123421/nexusbrief-web/issues) with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Your environment details

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Dark mode toggle
- [ ] Article summarization with AI
- [ ] Advanced filtering and search
- [ ] Collaborative reading lists
- [ ] Email digest subscriptions
- [ ] Offline reading support
- [ ] Multiple language support

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- 📧 Email: support@nexusbrief.com
- 🐛 Issues: [GitHub Issues](https://github.com/Abubakar123421/nexusbrief-web/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Abubakar123421/nexusbrief-web/discussions)

## Acknowledgments

- **Next.js** community and documentation
- **Supabase** for backend infrastructure
- **shadcn/ui** for beautiful, accessible components
- **Framer Motion** for smooth animations
- **Vercel** for hosting and deployment

---

## Additional Resources

- [System Specification Document](./src/nexusbrief_system_spec.md) - Detailed architecture and design
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

*Built with ❤️ for a cleaner, more organized daily reading experience.*

**Last Updated:** June 2026
**Version:** 1.0.0
