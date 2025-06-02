'use client';

import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';
import { useState } from 'react';

export default function LikeButton({
  postId,
  userId,
}: {
  postId: number;
  userId: number;
}) {
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    const res = await fetch('/api/like', {
      method: 'POST',
      body: JSON.stringify({ postId, userId }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      setLiked(true);
    } else {
      const err = await res.json();
      alert(`좋아요 실패: ${err.error}`);
    }
  };

  return (
    <Button
      onClick={handleLike}
      disabled={liked}
      className={`bg:no px-4 py-2 rounded flex items-center gap-2 ${
        liked ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <ThumbsUp size={16} />
      {liked ? '좋아요 완료' : '좋아요'}
    </Button>
  );
}
