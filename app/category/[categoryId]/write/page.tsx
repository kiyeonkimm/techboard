'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';

export default function WritePage({
  params,
}: {
  params: { categoryId: string };
}) {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    formData.set('categoryId', params.categoryId);

    const res = await fetch('/api/post', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      router.push(`/category/${params.categoryId}`);
    } else {
      const err = await res.json();
      alert(`작성 실패: ${err.error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <Input name='title' placeholder='제목을 입력하세요' required />
      <Textarea
        name='content'
        placeholder='내용을 입력하세요'
        rows={10}
        required
      />
      <Button type='submit'>작성하기</Button>
    </form>
  );
}
