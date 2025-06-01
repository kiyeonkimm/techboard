import { redirect } from 'next/navigation';
//import { auth } from '@/lib/auth';
import db from '@/lib/db';

export default async function PostPage({
  params,
}: {
  params: Promise<{ categoryId: string; postId: string }>;
}) {
  const { postId, categoryId } = await params; // ✅ await 구조분해로 경고 회피

  const numericPostId = Number(postId);
  const numericCategoryId = Number(categoryId);

  if (Number.isNaN(numericPostId) || Number.isNaN(numericCategoryId)) {
    return <div>잘못된 경로입니다.</div>;
  }

  const post = await db.post.findUnique({
    where: { id: numericPostId },
  });

  if (!post) {
    return <div>존재하지 않는 게시글입니다.</div>;
  }

  // const session = await auth();
  // const isAuthor = session?.user?.id === post.user_id;

  return (
    <div className='max-w-4xl mx-auto px-6 py-12 space-y-6'>
      <h1 className='text-2xl font-bold'>{post.title}</h1>
      <p className='text-sm text-gray-500'>
        작성일: {new Date(post.created_at).toLocaleString('ko-KR')}
      </p>
      <div className='whitespace-pre-wrap text-gray-800'>{post.content}</div>

      {/* {isAuthor && ( */}
      <form
        action={async () => {
          'use server';
          await db.post.delete({ where: { id: numericPostId } });
          redirect(`/category/${numericCategoryId}`);
        }}
      >
        <div className='flex justify-end space-x-2 pt-8'>
          <a
            href={`/category/${numericCategoryId}/${numericPostId}/edit`}
            className='px-4 py-2 rounded bg-blue-500 text-white text-sm hover:bg-blue-600'
          >
            ✏️ 수정
          </a>
          <button
            type='submit'
            className='px-4 py-2 rounded bg-red-500 text-white text-sm hover:bg-red-600'
          >
            🗑️ 삭제
          </button>
        </div>
      </form>
      {/* )} */}
    </div>
  );
}
