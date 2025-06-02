import Link from 'next/link';
import { auth } from '@/lib/auth';
import db from '@/lib/db';

// ✅ 세션 불러오기 추가

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const session = await auth(); // ✅ 세션 확인
  const { categoryId: categoryIdParam } = await params;
  const categoryId = Number(categoryIdParam);

  if (Number.isNaN(categoryId)) {
    return <div>잘못된 경로입니다.</div>;
  }

  const category = await db.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    return <div>존재하지 않는 게시판입니다.</div>;
  }

  const posts = await db.post.findMany({
    where: { category_id: categoryId },
    orderBy: { created_at: 'desc' },
  });

  return (
    <div className='max-w-4xl mx-auto px-6 py-12 space-y-10'>
      <h1 className='text-3xl font-semibold'>{category.category} 게시판</h1>

      {/* ✅ 관리자만 글쓰기 버튼 */}
      {session?.user?.is_admin && (
        <div className='flex justify-end'>
          <Link
            href={`/category/${categoryId}/write`}
            className='inline-block bg-pink-400 text-white text-sm font-medium px-4 py-2 rounded hover:bg-pink-600'
          >
            글쓰기
          </Link>
        </div>
      )}

      {posts.length === 0 ? (
        <p className='text-gray-500'>아직 작성된 글이 없습니다.</p>
      ) : (
        <ul className='space-y-6'>
          {posts.map((post) => (
            <li key={post.id} className='border-b pb-4'>
              <Link href={`/category/${categoryId}/${post.id}`}>
                <div className='text-xl font-medium hover:underline'>
                  {post.title}
                </div>
              </Link>
              <p className='text-sm text-gray-500'>
                작성일: {new Date(post.created_at).toLocaleString()}
              </p>

              {post.updated_at &&
                post.updated_at.getTime() !== post.created_at.getTime() && (
                  <p className='text-sm text-gray-400'>
                    (수정일: {new Date(post.updated_at).toLocaleString()})
                  </p>
                )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
