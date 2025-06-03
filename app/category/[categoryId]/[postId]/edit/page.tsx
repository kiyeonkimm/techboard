import PostForm from '@/app/components/PostForm';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import db from '@/lib/db';

export default async function EditPage({
  params,
}: {
  params: Promise<{ categoryId: string; postId: string }>;
}) {
  const { postId, categoryId } = await params;

  const session = await auth();
  if (!session?.user?.is_admin) {
    redirect(`/category/${categoryId}?error=not_admin`);
  }

  const post = await db.post.findUnique({
    where: { id: Number(postId) },
    select: { title: true, content: true },
  });

  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <PostForm
      mode='edit'
      categoryId={Number(categoryId)}
      postId={Number(postId)}
      defaultValue={post}
    />
  );
}
