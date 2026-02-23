'use client';

import { Github, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GithubStarsProps {
  repoUrl: string;
  starCount: string;
  showCount?: boolean;
  className?: string;
}

export function GithubStars({
  repoUrl,
  starCount,
  showCount = false,
  className,
}: GithubStarsProps) {
  return (
    <Button
      asChild
      variant="outline"
      size="sm"
      className={cn(
        'flex items-center gap-2 text-xs',
        className
      )}
    >
      <a
        href={repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2"
      >
        <Github className="size-4" />
        {showCount && (
          <>
            <Star className="size-3" />
            <span>{starCount}</span>
          </>
        )}
      </a>
    </Button>
  );
}
