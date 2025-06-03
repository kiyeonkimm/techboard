import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import db from '@/lib/db';

function extractPostId(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  return Number(id);
}

// ✅ GET
export async function GET(req: NextRequest) {
  const postId = extractPostId(req);
  if (Number.isNaN(postId)) {
    return NextResponse.json(
      { error: '유효하지 않은 ID입니다.' },
      { status: 400 }
    );
  }

  const post = await db.post.findUnique({ where: { id: postId } });

  if (!post) {
    return NextResponse.json({ error: '게시글이 없습니다.' }, { status: 404 });
  }

  return NextResponse.json(post);
}

// ✅ PUT
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '로그인 필요' }, { status: 401 });
  }

  const userId = Number(session.user.id);
  const isAdmin = session.user.is_admin === true;

  const postId = extractPostId(req);
  if (Number.isNaN(postId)) {
    return NextResponse.json(
      { error: '유효하지 않은 ID입니다.' },
      { status: 400 }
    );
  }

  const { title, content, categoryId } = await req.json();
  if (!title || !content || isNaN(Number(categoryId))) {
    return NextResponse.json(
      { error: '입력값이 잘못됐습니다.' },
      { status: 400 }
    );
  }

  const post = await db.post.findUnique({ where: { id: postId } });
  if (!post || (!isAdmin && post.user_id !== userId)) {
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

// ✅ DELETE
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '로그인 필요' }, { status: 401 });
  }

  const userId = Number(session.user.id);
  const isAdmin = session.user.is_admin === true;

  const postId = extractPostId(req);
  if (Number.isNaN(postId)) {
    return NextResponse.json(
      { error: '유효하지 않은 ID입니다.' },
      { status: 400 }
    );
  }

  const post = await db.post.findUnique({ where: { id: postId } });
  if (!post || (!isAdmin && post.user_id !== userId)) {
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
