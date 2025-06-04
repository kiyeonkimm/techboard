'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signOut, useSession } from 'next-auth/react';
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
      alert('이름이 수정되었습니다.\n다시 로그인 해주세요.');
      await signOut({ callbackUrl: '/login' }); // 로그아웃 후 로그인 페이지로
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
      await signOut({ callbackUrl: '/' });
    } else {
      alert('탈퇴 실패');
    }
  };

  return (
    <div className='max-w-md mx-auto p-8 space-y-8'>
      <section className='space-y-4'>
        <h1 className='text-2xl font-bold'>프로필 수정</h1>
        <p className='text-sm text-gray-500'>이름을 수정할 수 있습니다.</p>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='닉네임'
        />

        <div className='flex justify-between'>
          <Button onClick={handleUpdate} className='w-1/2 mr-2'>
            정보 수정
          </Button>
          <Button
            type='button'
            variant='outline'
            className='w-1/2'
            onClick={() => router.back()}
          >
            취소
          </Button>
        </div>
      </section>

      <hr />

      <section className='text-center'>
        <Button onClick={handleDelete} variant='destructive' className='w-full'>
          회원 탈퇴
        </Button>
      </section>
    </div>
  );
}
