import LikeButton from '@/app/components/LikeButton';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import db from '@/lib/db';

export default async function PostPage({
  params,
}: {
  params: Promise<{ categoryId: string; postId: string }>;
}) {
  const { postId, categoryId } = await params;

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

  const session = await auth();
  const isAdmin = session?.user?.is_admin === true;

  return (
    <div className='max-w-4xl mx-auto px-6 py-12 space-y-6'>
      <h1 className='text-2xl font-bold'>{post.title}</h1>

      <p className='text-sm text-gray-500 flex gap-4'>
        작성일: {new Date(post.created_at).toLocaleString()}
        {post.updated_at &&
          post.updated_at.getTime() !== post.created_at.getTime() && (
            <span className='text-gray-400'>
              수정일: {new Date(post.updated_at).toLocaleString()}
            </span>
          )}
      </p>

      <div className='whitespace-pre-wrap text-gray-800'>{post.content}</div>

      {/* 관리자만 삭제/수정 가능 */}
      {isAdmin && (
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
              수정
            </a>
            <Button type='submit' variant='delete'>
              삭제
            </Button>
          </div>
        </form>
      )}

      <LikeButton
        postId={numericPostId}
        userId={Number(session?.user?.id) ?? 0}
      />

      <a
        href={`/category/${numericCategoryId}`}
        className='px-3 py-2 rounded bg-gray-500 text-white text-sm hover:bg-gray-600'
      >
        목록으로
      </a>
    </div>
  );
}
