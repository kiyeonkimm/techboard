//hanaro/app/page.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import db from '@/lib/db';

export default async function Home() {
  const categories = await db.category.findMany();

  return (
    <main className='max-w-4xl mx-auto py-10'>
      <h1 className='text-2xl font-bold mb-6'>게시판을 선택해주세요</h1>
      <form action='/search' method='GET' className='flex gap-2 mb-8'>
        <Input type='text' name='q' placeholder='검색어 입력하세요' />
        <Button
          type='submit'
          className='bg-pink-400 text-white px-4 py-1 rounded'
        >
          검색
        </Button>
      </form>

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
