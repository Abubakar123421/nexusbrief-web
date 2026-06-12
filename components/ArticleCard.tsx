'use client';

import React from 'react';
import Image from 'next/image';
import { ThumbsUp, ThumbsDown, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatRelativeTime, estimateReadTime } from '@/lib/utils';

interface BriefItem {
  id: string;
  headline: string;
  summary: string;
  source_url: string;
  thumbnail_url?: string | null;
  published_at: string | null;
  item_rank: number | null;
  is_bookmarked: boolean;
  is_exported: boolean;
}

interface ArticleCardProps {
  item: BriefItem;
  rank: number;
  onLike: () => void;
  onDislike: () => void;
  onBookmark: () => void;
  showBookmark?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  item,
  rank,
  onLike,
  onDislike,
  onBookmark,
  showBookmark = true,
}) => {
  const relativeTime = formatRelativeTime(item.published_at);
  const readTime = estimateReadTime(item.summary);

  return (
    <article className="border border-ink/20 bg-[#FDFCFA] p-8 transition-all hover:shadow-xl hover:-translate-y-1 relative group">
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-ink/40" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-ink/40" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-ink/40" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-ink/40" />
      
      {/* Paper texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.4] mix-blend-multiply z-0"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
      />

      <div className="relative z-10 flex flex-col md:flex-row gap-8">
        {/* Left: Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-montserrat text-[11px] font-bold uppercase tracking-[0.2em] border-b border-ink text-ink pb-0.5">
              Rank No. {rank}
            </span>
            {item.is_exported && (
              <span className="font-montserrat text-[9px] uppercase tracking-widest text-ink/50 flex items-center gap-1 border border-ink/10 px-2 py-0.5">
                <span>✓</span> Syndicated
              </span>
            )}
          </div>

          <a
            href={item.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-playfair italic text-3xl font-bold leading-tight text-ink hover:text-ink/70 cursor-pointer mb-4 decoration-ink/30 hover:decoration-ink/70 underline-offset-4"
          >
            {item.headline}
          </a>

          <div className="w-12 border-t-2 border-ink mb-4" />

          <p className="font-garamond text-[19px] text-ink/80 leading-relaxed line-clamp-3 mb-4">
            {item.summary}
          </p>

          {/* Meta row */}
          <div className="mt-auto font-montserrat text-[10px] uppercase tracking-widest text-ink/50 flex items-center gap-3 font-semibold">
            <span>{relativeTime}</span>
            <span className="text-ink/30">&bull;</span>
            <span>{readTime}</span>
          </div>
        </div>

        {/* Right: Big Thumbnail with slight curve */}
        {item.thumbnail_url && (
          <div className="flex-shrink-0 w-full md:w-[280px]">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-ink/10 group-hover:border-ink/30 transition-colors shadow-sm">
              <Image
                src={item.thumbnail_url}
                alt={item.headline}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale-[0.2]"
                sizes="(max-width: 768px) 100vw, 280px"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="relative z-10 flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-ink/10">
        <Button variant="ghost" size="sm" onClick={onLike} className="group/btn flex items-center gap-2 !px-3 !py-2 hover:bg-ink/5 rounded-none">
          <ThumbsUp size={16} strokeWidth={1.5} className="text-ink/70 group-hover/btn:text-ink" />
        </Button>

        <Button variant="ghost" size="sm" onClick={onDislike} className="group/btn flex items-center gap-2 !px-3 !py-2 hover:bg-ink/5 rounded-none">
          <ThumbsDown size={16} strokeWidth={1.5} className="text-ink/70 group-hover/btn:text-ink" />
        </Button>

        {showBookmark && (
          <Button variant="ghost" size="sm" onClick={onBookmark} className="group/btn flex items-center gap-2 !px-3 !py-2 hover:bg-ink/5 rounded-none">
            {item.is_bookmarked ? (
              <BookmarkCheck size={16} strokeWidth={1.5} className="text-ink" />
            ) : (
              <Bookmark size={16} strokeWidth={1.5} className="text-ink/70 group-hover/btn:text-ink" />
            )}
            <span className="font-montserrat text-[10px] uppercase tracking-[0.15em] font-semibold text-ink/70 group-hover/btn:text-ink">
              {item.is_bookmarked ? 'Saved to Archive' : 'Archive'}
            </span>
          </Button>
        )}

        <div className="ml-auto">
          <a
            href={item.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-transparent text-ink border border-ink hover:bg-ink hover:text-white px-5 py-2.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.15em] transition-colors"
          >
            Read Full <ExternalLink size={12} strokeWidth={2} />
          </a>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
