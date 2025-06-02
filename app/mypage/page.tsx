'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MyPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [name, setName] = useState('');

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session]);

  const handleUpdate = async () => {
    const res = await fetch('/api/user/rename', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      alert('정보가 수정되었습니다.');
      router.refresh();
    } else {
      alert('수정 실패');
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말 탈퇴하시겠습니까?')) return;

    const res = await fetch('/api/user/delete', {
      method: 'DELETE',
    });

    if (res.ok) {
      alert('탈퇴 완료');
      router.push('/');
    } else {
      alert('탈퇴 실패');
    }
  };

  return (
    <div className='max-w-md mx-auto p-6 space-y-4'>
      <h1 className='text-xl font-bold'>내 정보</h1>
      <Input value={name} onChange={(e) => setName(e.target.value)} />

      <Button onClick={handleUpdate}>정보 수정</Button>
      <Button onClick={handleDelete} variant='destructive'>
        회원 탈퇴
      </Button>
    </div>
  );
}
