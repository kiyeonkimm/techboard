//hanaro/app/page.tsx
import Link from 'next/link';
import db from '@/lib/db';

export default async function Home() {
  const categories = await db.category.findMany();

  return (
    <main className='max-w-4xl mx-auto py-10'>
      <h1 className='text-2xl font-bold mb-6'>게시판을 선택해주세요</h1>
      <div className='grid grid-cols-2 gap-4'>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.id}`} // ✅ 여기 숫자 ID로 고침
            className='border rounded-lg p-6 hover:bg-gray-50'
          >
            {category.category}
          </Link>
        ))}
      </div>
    </main>
  );
}
