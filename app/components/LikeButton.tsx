'use client';

import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = {
  postId: number;
  userId: number;
};

export default function LikeButton({ postId, userId }: Props) {
  const [liked, setLiked] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 로그인한 경우에만 상태 불러오기
    const fetchLike = async () => {
      const res = await fetch(`/api/like?postId=${postId}&userId=${userId}`);
      const data = await res.json();
      setLiked(data.liked); // true / false / null
    };

    if (userId) fetchLike();
  }, [postId, userId]);

  const handleClick = async (newLiked: boolean) => {
    if (loading) return;

    if (!userId) {
      alert('로그인이 필요합니다.');
      router.push('/login'); // ✅ 로그인 페이지로 이동
      return;
    }

    setLoading(true);

    const res = await fetch('/api/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, liked: newLiked }),
    });

    if (res.ok) {
      if (liked === newLiked) {
        setLiked(null); // 같은 버튼 → 취소
      } else {
        setLiked(newLiked); // 반대 버튼 → 전환
      }
    }

    setLoading(false);
  };

  return (
    <div className='flex gap-4 pt-6'>
      <button
        onClick={() => handleClick(true)}
        className={`flex items-center gap-1 ${liked === true ? 'text-blue-500' : 'text-gray-400'}`}
        disabled={loading}
      >
        <ThumbsUp size={18} /> 좋아요
      </button>
      <button
        onClick={() => handleClick(false)}
        className={`flex items-center gap-1 ${liked === false ? 'text-red-500' : 'text-gray-400'}`}
        disabled={loading}
      >
        <ThumbsDown size={18} /> 싫어요
      </button>
    </div>
  );
}
