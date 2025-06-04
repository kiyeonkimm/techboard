'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function WritePage(props: any) {
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // const categoryId = props.params.categoryId;
  const categoryId = useParams().categoryId;

  useEffect(() => {
    getSession().then((session) => {
      const admin = session?.user?.is_admin;
      setIsAdmin(admin === true);
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    formData.set('categoryId', String(categoryId));

    const res = await fetch('/api/post', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      router.push(`/category/${categoryId}`);
    } else {
      const err = await res.json();
      alert(`작성 실패: ${err.error}`);
    }
  };

  if (isAdmin === null) {
    return <p className='text-gray-500'>권한 확인 중...</p>;
  }

  if (!isAdmin) {
    return <p className='text-red-500'>⚠️ 관리자만 글을 작성할 수 있습니다.</p>;
  }

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
