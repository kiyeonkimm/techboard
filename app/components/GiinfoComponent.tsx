'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function MyInfoComponent({
  user,
}: {
  user: {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
  } | null;
}) {
  const router = useRouter();
  const { update } = useSession();
  const [name, setName] = useState(user?.name ?? '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch('/api/user/rename', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      alert('수정 실패');
      return;
    }
    await fetch('/api/auth/session?update', { method: 'POST' }); // 서버에 새 세션 요청
    await update();

    alert('닉네임이 수정되었습니다!');
    router.push('/');
    // router.refresh(); // 필요하다면
  };

  const handleDelete = async () => {
    if (!confirm('정말 탈퇴하시겠습니까?')) return;

    const res = await fetch('/api/user/delete', {
      method: 'DELETE',
    });

    if (res.ok) {
      alert('탈퇴 완료');
      router.push('/login');
    } else {
      alert('탈퇴 실패');
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>내 정보</h1>
      <div className='space-y-2'>
        <p className='text-lg'>아이디 : {user?.name}</p>
        <p className='text-lg'>이메일 : {user?.email}</p>
      </div>
      <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
        <label className='block'>
          <span className='text-sm'>닉네임 수정</span>
          <input
            name='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='mt-1 block w-full rounded border bg-gray-100 px-3 py-2'
            placeholder='새 닉네임 입력'
          />
        </label>
        <button
          type='submit'
          className='rounded bg-blue-500 text-white px-4 py-2 text-sm font-semibold'
        >
          닉네임 수정
        </button>
      </form>
      <div className='mt-6'>{/* <DeleteButton /> */}</div>
    </div>
  );
}
