export type GNewsArticle = {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: { name: string; url: string };
};

const GNEWS_CATEGORIES: Record<string, { category: string; query?: string }> = {
  general:    { category: 'general' },
  technology: { category: 'technology' },
  sports:     { category: 'sports' },
  business:   { category: 'business' },
  science:    { category: 'science' },
  stocks:     { category: 'business', query: 'stock market investing' },
  crypto:     { category: 'business', query: 'cryptocurrency bitcoin' },
  politics:   { category: 'nation',   query: 'politics government' },
};

export async function fetchGNewsArticles(
  category: string,
  max = 10
): Promise<GNewsArticle[]> {
  const token = process.env.GNEWS_API_KEY;
  if (!token) {
    console.warn('[GNews] No API key — returning mock data');
    return getMockArticles(category);
  }

  const mapping = GNEWS_CATEGORIES[category.toLowerCase()] ?? { category: 'general' };
  const url = new URL('https://gnews.io/api/v4/top-headlines');
  url.searchParams.set('token', token);
  url.searchParams.set('lang', 'en');
  url.searchParams.set('max', String(max));
  url.searchParams.set('category', mapping.category);
  if (mapping.query) url.searchParams.set('q', mapping.query);

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 900 } });
    if (!res.ok) throw new Error(`GNews HTTP ${res.status}`);
    const data = await res.json();
    return (data.articles ?? []) as GNewsArticle[];
  } catch (err) {
    console.error('[GNews] Fetch failed:', err);
    return getMockArticles(category);
  }
}

function getMockArticles(category: string): GNewsArticle[] {
  const mocks: GNewsArticle[] = [
    {
      title: 'Markets Rally on Strong Earnings Reports',
      description: 'Investors showed strong confidence as companies exceeded quarterly expectations, sending indexes near record highs.',
      url: '#',
      image: null,
      publishedAt: new Date().toISOString(),
      source: { name: 'Mock News', url: '#' },
      content: '',
    },
    {
      title: 'Tech Giant Unveils Groundbreaking AI Model',
      description: 'The latest model outperforms industry benchmarks by a significant margin across multiple standards.',
      url: '#',
      image: null,
      publishedAt: new Date(Date.now() - 3_600_000).toISOString(),
      source: { name: 'Tech Daily', url: '#' },
      content: '',
    },
    {
      title: 'Global Summit Reaches Historic Climate Agreement',
      description: 'World leaders signed a landmark accord pledging ambitious emissions reductions by 2035.',
      url: '#',
      image: null,
      publishedAt: new Date(Date.now() - 7_200_000).toISOString(),
      source: { name: 'World Report', url: '#' },
      content: '',
    },
    {
      title: 'Scientists Announce Breakthrough Cancer Treatment',
      description: 'A new immunotherapy approach showed 90% effectiveness in early-stage trials across three major hospitals.',
      url: '#',
      image: null,
      publishedAt: new Date(Date.now() - 10_800_000).toISOString(),
      source: { name: 'Science Today', url: '#' },
      content: '',
    },
    {
      title: 'Central Bank Signals Rate Cut Amid Slowing Growth',
      description: 'The central bank chair indicated economic conditions may warrant a policy adjustment in coming months.',
      url: '#',
      image: null,
      publishedAt: new Date(Date.now() - 14_400_000).toISOString(),
      source: { name: 'Finance Wire', url: '#' },
      content: '',
    },
  ];
  return mocks;
}
