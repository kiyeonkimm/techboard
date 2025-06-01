'use client';

import Link from 'next/link';

interface BoardCardProps {
  title: string;
  href: string;
}

export default function BoardCard({ title, href }: BoardCardProps) {
  return (
    <Link
      href={href}
      className='block p-6 border rounded hover:shadow transition'
    >
      <h2 className='text-lg font-semibold'>{title}</h2>
    </Link>
  );
}
