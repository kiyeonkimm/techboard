'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function HeaderClient() {
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <header className='flex items-center justify-between px-6 py-4 border-b bg-white'>
      <Link href='/' className='text-lg font-semibold'>
        TechBlog
      </Link>

      <div className='flex gap-4 items-center'>
        {status === 'loading' ? null : user ? (
          <>
            {user.is_admin && (
              <Link
                href='/adminpage'
                className='text-sm text-blue-600 hover:underline font-medium'
              >
                관리자 페이지
              </Link>
            )}

            <span className='text-sm text-gray-600'>
              안녕하세요, {user.name} 님!
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className='text-sm text-red-500 hover:underline'
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link href='/login' className='text-sm hover:underline'>
              로그인
            </Link>
            <Link href='/signup' className='text-sm hover:underline'>
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
