// app/category/[categoryId]/[postId]/edit/page.tsx
import PostForm from '@/app/components/PostForm';
import db from '@/lib/db';

export default async function EditPage({
  params,
}: {
  params: Promise<{ categoryId: string; postId: string }>; // ✅ 여기 이렇게 바꿈
}) {
  const { postId, categoryId } = await params; // ✅ 여기 await

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
