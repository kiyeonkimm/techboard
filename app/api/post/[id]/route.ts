import { NextRequest, NextResponse } from 'next/server';
// import { auth } from '@/lib/auth'; // 🔒 로그인 연동 시 사용
import db from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const postId = Number(params.id);
  if (Number.isNaN(postId)) {
    return NextResponse.json(
      { error: '유효하지 않은 ID입니다.' },
      { status: 400 }
    );
  }

  const post = await db.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    return NextResponse.json({ error: '게시글이 없습니다.' }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // const session = await auth();
  // if (!session?.user?.id) {
  //   return NextResponse.json({ error: '로그인 필요' }, { status: 401 });
  // }

  // const userId = Number(session.user.id); // 로그인 연동 시 사용
  const userId = 1; // ✅ 임시 user_id (로그인 연동 시 교체)

  const postId = Number(params.id);
  if (Number.isNaN(postId)) {
    return NextResponse.json(
      { error: '유효하지 않은 ID입니다.' },
      { status: 400 }
    );
  }

  const body = await req.json();
  const { title, content, categoryId } = body;

  if (!title || !content || isNaN(Number(categoryId))) {
    return NextResponse.json(
      { error: '입력값이 잘못됐습니다.' },
      { status: 400 }
    );
  }

  const post = await db.post.findUnique({ where: { id: postId } });
  if (!post || post.user_id !== userId) {
    return NextResponse.json(
      { error: '수정 권한이 없습니다.' },
      { status: 403 }
    );
  }

  try {
    const updated = await db.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        category_id: Number(categoryId),
        updated_at: new Date(),
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: '게시글 수정 실패' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // const session = await auth();
  // if (!session?.user?.id) {
  //   return NextResponse.json({ error: '로그인 필요' }, { status: 401 });
  // }

  // const userId = Number(session.user.id); // 로그인 연동 시 사용
  const userId = 1; // ✅ 임시 user_id (로그인 연동 시 교체)

  const postId = Number(params.id);
  if (Number.isNaN(postId)) {
    return NextResponse.json(
      { error: '유효하지 않은 ID입니다.' },
      { status: 400 }
    );
  }

  const post = await db.post.findUnique({ where: { id: postId } });
  if (!post || post.user_id !== userId) {
    return NextResponse.json(
      { error: '삭제 권한이 없습니다.' },
      { status: 403 }
    );
  }

  try {
    await db.post.delete({ where: { id: postId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: '게시글 삭제 실패' }, { status: 500 });
  }
}
