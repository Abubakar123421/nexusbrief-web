export type DigestItem = {
  id: string;
  headline: string;
  summary: string | null;
  source_url: string | null;
  thumbnail_url: string | null;
  published_at: string | null;
  item_rank: number;
  is_bookmarked: boolean;
  is_exported: boolean;
  source_id: string | null;
};

export type PrioritizationMode = 'LATEST_FIRST' | 'MOST_RELEVANT' | 'MOST_POPULAR';

export function rankByRecency(items: DigestItem[], topN = 5): DigestItem[] {
  return [...items]
    .sort((a, b) => {
      const da = a.published_at ? new Date(a.published_at).getTime() : 0;
      const db = b.published_at ? new Date(b.published_at).getTime() : 0;
      return db - da;
    })
    .slice(0, topN);
}

export function rankByRelevance(items: DigestItem[], topN = 5): DigestItem[] {
  return [...items].sort((a, b) => a.item_rank - b.item_rank).slice(0, topN);
}

export function rankByPopularity(items: DigestItem[], topN = 5): DigestItem[] {
  return [...items]
    .sort((a, b) => (b.summary?.length ?? 0) - (a.summary?.length ?? 0))
    .slice(0, topN);
}

export function applyStrategy(items: DigestItem[], mode: PrioritizationMode, topN = 5): DigestItem[] {
  switch (mode) {
    case 'MOST_RELEVANT': return rankByRelevance(items, topN);
    case 'MOST_POPULAR':  return rankByPopularity(items, topN);
    default:              return rankByRecency(items, topN);
  }
}
