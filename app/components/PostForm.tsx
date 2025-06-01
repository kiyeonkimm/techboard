'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PostForm({
  mode,
  categoryId,
  postId,
  defaultValue,
}: {
  mode: 'write' | 'edit';
  categoryId: number;
  postId?: number;
  defaultValue?: { title: string; content: string };
}) {
  const router = useRouter();
  const [title, setTitle] = useState(defaultValue?.title ?? '');
  const [content, setContent] = useState(defaultValue?.content ?? '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'edit' && !postId) {
      alert('postId가 유효하지 않습니다.');
      return;
    }

    const url = mode === 'edit' ? `/api/post/${postId}` : `/api/post`;

    const body =
      mode === 'edit'
        ? JSON.stringify({ title, content, categoryId })
        : (() => {
            const form = new FormData();
            form.set('title', title);
            form.set('content', content);
            form.set('categoryId', String(categoryId));
            return form;
          })();

    setIsLoading(true);

    try {
      const res = await fetch(url, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        ...(mode === 'edit'
          ? {
              headers: { 'Content-Type': 'application/json' },
              body,
            }
          : { body }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '서버 오류');
      }

      router.push(
        mode === 'edit'
          ? `/category/${categoryId}/${postId}`
          : `/category/${categoryId}`
      );
    } catch (e) {
      alert(
        `${mode === 'edit' ? '수정' : '작성'} 실패: ${(e as Error).message}`
      );
    } finally {
      setIsLoading(false);
    }

    // console.log('🔍 postId:', postId);
    // console.log('🔍 요청 URL:', url);
    // console.log('🔍 title:', title);
    // console.log('🔍 content:', content);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <Input
        name='title'
        placeholder='제목을 입력하세요'
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isLoading}
      />
      <Textarea
        name='content'
        placeholder='내용을 입력하세요'
        rows={10}
        required
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isLoading}
      />
      <Button type='submit' disabled={isLoading}>
        {isLoading
          ? mode === 'edit'
            ? '수정 중...'
            : '작성 중...'
          : mode === 'edit'
            ? '✏️ 수정하기'
            : '📝 작성하기'}
      </Button>
    </form>
  );
}
