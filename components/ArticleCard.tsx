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
  published_at: string;
  item_rank: number;
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
    <article className="border border-[#E0DDD8] bg-white p-6 transition-shadow hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
      {/* Header row */}
      <div className="flex items-center gap-3 mb-4">
        <span className="font-montserrat text-[10px] font-bold uppercase tracking-widest border border-[#0A0A0A] px-2 py-0.5 text-[#0A0A0A]">
          #{rank}
        </span>
        {item.is_exported && (
          <span className="font-montserrat text-[10px] uppercase tracking-widest text-[#1A5C2A] flex items-center gap-1">
            <span>✓</span> Scheduled
          </span>
        )}
      </div>

      {/* Content area */}
      <div className="flex gap-5">
        {/* Left: text */}
        <div className="flex-1 min-w-0">
          <a
            href={item.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-playfair italic text-[22px] font-medium leading-snug text-[#0A0A0A] hover:underline cursor-pointer mb-1"
          >
            {item.headline}
          </a>

          <div className="border-b border-[#E0DDD8]/60 my-3" />

          <p className="font-garamond text-[16px] text-[#3A3A3A] leading-relaxed line-clamp-3">
            {item.summary}
          </p>
        </div>

        {/* Right: thumbnail */}
        {item.thumbnail_url && (
          <div className="flex-shrink-0">
            <div className="relative w-[140px] h-[95px] overflow-hidden">
              <Image
                src={item.thumbnail_url}
                alt={item.headline}
                fill
                className="object-cover"
                sizes="140px"
              />
            </div>
          </div>
        )}
      </div>

      {/* Meta row */}
      <div className="mt-3 font-montserrat text-[11px] text-[#8A8A8A] flex items-center gap-3">
        <span>{relativeTime}</span>
        <span>&middot;</span>
        <span>{readTime} min read</span>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#E0DDD8]">
        <Button variant="ghost" size="sm" onClick={onLike} className="flex items-center gap-1.5 !px-2 !py-1.5">
          <ThumbsUp size={14} strokeWidth={1.8} />
          <span className="sr-only">Like</span>
        </Button>

        <Button variant="ghost" size="sm" onClick={onDislike} className="flex items-center gap-1.5 !px-2 !py-1.5">
          <ThumbsDown size={14} strokeWidth={1.8} />
          <span className="sr-only">Dislike</span>
        </Button>

        {showBookmark && (
          <Button variant="ghost" size="sm" onClick={onBookmark} className="flex items-center gap-1.5 !px-2 !py-1.5">
            {item.is_bookmarked ? (
              <BookmarkCheck size={14} strokeWidth={1.8} className="text-[#0A0A0A]" />
            ) : (
              <Bookmark size={14} strokeWidth={1.8} />
            )}
            <span className="font-montserrat text-[10px] uppercase tracking-wider">
              {item.is_bookmarked ? 'Saved' : 'Read Later'}
            </span>
          </Button>
        )}

        <div className="ml-auto">
          <a
            href={item.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-transparent text-[#0A0A0A] border border-[#E0DDD8] hover:bg-[#0A0A0A] hover:text-white hover:border-[#0A0A0A] px-4 py-2 font-montserrat text-[10px] font-semibold uppercase tracking-[0.1em] transition-all duration-200"
          >
            <ExternalLink size={12} strokeWidth={1.8} />
            Read Article
          </a>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
