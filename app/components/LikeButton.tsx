'use client';

import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = {
  postId: number;
  userId: number;
};

export default function LikeButton({ postId, userId }: Props) {
  const [liked, setLiked] = useState<null | boolean>(null); // true = 좋아요, false = 싫어요, null = 없음
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLike = async () => {
      if (!userId) return; // 로그인 안한 경우 요청 안 보냄
      try {
        const res = await fetch(`/api/like?postId=${postId}&userId=${userId}`);
        const data = await res.json();
        setLiked(data.liked); // null | true | false
      } catch (err) {
        console.error('좋아요 상태 조회 실패:', err);
      }
    };

    fetchLike();
  }, [postId, userId]);

  const handleClick = async (newLiked: boolean) => {
    if (!userId || loading) return;
    setLoading(true);

    try {
      const res = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, liked: newLiked }),
      });

      if (res.ok) {
        if (liked === newLiked) {
          setLiked(null); // 같은 걸 누르면 취소
        } else {
          setLiked(newLiked);
        }
      }
    } catch (err) {
      console.error('좋아요 변경 실패:', err);
    }

    setLoading(false);
  };

  return (
    <div className='flex gap-4 pt-6'>
      <button
        onClick={() => handleClick(true)}
        className={`flex items-center gap-1 ${liked === true ? 'text-blue-500' : 'text-gray-400'}`}
        disabled={loading || !userId}
      >
        <ThumbsUp size={18} /> 좋아요
      </button>
      <button
        onClick={() => handleClick(false)}
        className={`flex items-center gap-1 ${liked === false ? 'text-red-500' : 'text-gray-400'}`}
        disabled={loading || !userId}
      >
        <ThumbsDown size={18} /> 싫어요
      </button>
    </div>
  );
}
