import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import db from '@/lib/db';

export default async function Home() {
  // 1. 모든 카테고리 조회
  const categories = await db.category.findMany();

  // 2. 각 카테고리별로 최신 게시글 3개 조회
  const categoriesWithPosts = await Promise.all(
    categories.map(async (category) => {
      const posts = await db.post.findMany({
        where: { category_id: category.id },
        orderBy: { created_at: 'desc' },
        take: 3,
      });
      return { ...category, posts };
    })
  );

  return (
    <main className='max-w-4xl mx-auto py-10'>
      <h1 className='text-2xl font-bold mb-6'>게시판</h1>

      <form action='/search' method='GET' className='flex gap-2 mb-8'>
        <Input type='text' name='q' placeholder='검색어 입력하세요' />
        <Button type='submit' variant='default'>
          검색
        </Button>
      </form>

      <div className='grid grid-cols-2 gap-4'>
        {categoriesWithPosts.map((category) => (
          <div
            key={category.id}
            className='border rounded-lg p-4 hover:bg-gray-50'
          >
            <Link
              href={`/category/${category.id}`}
              className='text-lg font-semibold hover:underline block mb-2'
            >
              {category.category}
            </Link>

            {category.posts.length === 0 ? (
              <p className='text-sm text-gray-400'>게시글 없음</p>
            ) : (
              <ul className='text-sm text-gray-600 space-y-1'>
                {category.posts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/category/${category.id}/${post.id}`}
                      className='hover:underline'
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
