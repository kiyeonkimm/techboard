'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className='flex justify-between items-center p-4 border-b'>
      <Link href='/' className='text-2xl font-bold'>
        TechBlog
      </Link>
      <div className='space-x-4'>
        <Link href='/login'>로그인</Link>
        <Link href='/signup'>회원가입</Link>
      </div>
    </header>
  );
}
