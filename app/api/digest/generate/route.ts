import { NextResponse } from 'next/server';
import { fetchGNewsArticles } from '@/lib/gnews';
import { applyStrategy, type PrioritizationMode } from '@/lib/strategies';
import { requireUser } from '@/lib/supabase/route';

export async function POST() {
  const { user, supabase, errorResponse } = await requireUser();
  if (errorResponse) return errorResponse;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Get preferences with categories
  const { data: prefs } = await supabase
    .from('digest_preferences')
    .select('*, preference_categories(*)')
    .eq('user_id', user.id)
    .single();

  const mode: PrioritizationMode = prefs?.prioritization_mode ?? 'LATEST_FIRST';

  // Determine active categories
  const activeCategories: string[] = prefs?.preference_categories
    ?.filter((c: any) => c.weight > 0)
    .map((c: any) => c.category_name.toLowerCase()) ?? ['general'];

  const finalCategories = activeCategories.length > 0 ? activeCategories : ['general'];

  // Fetch articles from GNews for each category
  let articlePool: any[] = [];
  for (const cat of finalCategories.slice(0, 4)) { // Max 4 categories to avoid rate limits
    const articles = await fetchGNewsArticles(cat, 5);
    articlePool.push(
      ...articles.map((a, i) => ({
        headline: a.title,
        summary: a.description,
        source_url: a.url,
        thumbnail_url: a.image,
        published_at: a.publishedAt,
        item_rank: i + 1,
        is_bookmarked: false,
        is_exported: false,
        source_id: null,
      }))
    );
  }

  // Apply strategy to get top 5
  const top5 = applyStrategy(articlePool, mode, 5);

  // Create digest record
  const { data: digest, error: digestErr } = await supabase
    .from('digests')
    .insert({ user_id: user.id, status: 'GENERATED', is_viewed: false })
    .select()
    .single();

  if (digestErr || !digest) {
    return NextResponse.json({ error: 'Failed to create digest' }, { status: 500 });
  }

  // Insert items
  const items = top5.map((item, i) => ({
    ...item,
    digest_id: digest.id,
    item_rank: i + 1,
  }));

  const { error: itemsErr } = await supabase.from('digest_items').insert(items);
  if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 });

  return NextResponse.json({ digestId: digest.id, itemCount: top5.length });
}
