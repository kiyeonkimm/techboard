import Link from 'next/link';
import db from '@/lib/db';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const raw = resolvedParams.q;
  const keyword = typeof raw === 'string' ? raw.trim() : '';

  if (!keyword) {
    return <div className='p-8 text-gray-500'>검색어를 입력해주세요.</div>;
  }

  // 1. 불용어 목록 불러오기
  const stopwords = await db.stopWord.findMany();
  const stopSet = new Set(stopwords.map((s) => s.value.toLowerCase()));

  // 2. 키워드에서 불용어 제거
  const terms = keyword
    .split(/\s+/)
    .map((w) => w.toLowerCase())
    .filter((w) => !stopSet.has(w));

  if (terms.length === 0) {
    return <div className='p-8 text-gray-500'>유효한 검색어가 없습니다.</div>;
  }

  // 3. 검색
  const posts = await db.post.findMany({
    where: {
      OR: terms.flatMap((term) => [
        { title: { contains: term } },
        { content: { contains: term } },
      ]),
    },
    orderBy: { created_at: 'desc' },
  });

  const categories = await db.category.findMany();
  const categoryMap = new Map(categories.map((c) => [c.id, c.category]));

  return (
    <div className='max-w-4xl mx-auto px-6 py-12 space-y-8'>
      <h1 className='text-2xl font-bold'>🔍 “{keyword}” 검색 결과</h1>
      {posts.length === 0 ? (
        <p className='text-gray-500'>검색 결과가 없습니다.</p>
      ) : (
        <ul className='space-y-4'>
          {posts.map((post) => (
            <li key={post.id} className='border-b pb-3'>
              <Link
                href={`/category/${post.category_id}/${post.id}`}
                className='block text-lg font-medium hover:underline'
              >
                {post.title}
              </Link>
              <p className='text-sm text-gray-500'>
                [{categoryMap.get(post.category_id)}] 작성일:{' '}
                {new Date(post.created_at).toLocaleDateString('ko-KR')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
