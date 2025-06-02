// components/post/EditForm.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// components/post/EditForm.tsx

// components/post/EditForm.tsx

export default function EditForm({
  post,
  categoryId,
}: {
  post: { id: number; title: string; content: string };
  categoryId: number;
}) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/posts/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, categoryId }),
    });

    if (res.ok) {
      router.push(`/category/${categoryId}/${post.id}`);
    } else {
      alert('수정 실패');
    }
  };

  return (
    <form onSubmit={handleUpdate} className='space-y-4'>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        required
      />
      <Button type='submit'>수정하기</Button>
    </form>
  );
}
