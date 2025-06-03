import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import db from '@/lib/db';

// ✅ POST: 좋아요/싫어요 처리
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '로그인 필요' }, { status: 401 });
  }

  const userId = Number(session.user.id);
  const { postId, liked } = await req.json();

  if (typeof postId !== 'number' || typeof liked !== 'boolean') {
    return NextResponse.json({ error: '입력값 오류' }, { status: 400 });
  }

  const existing = await db.like.findFirst({
    where: { post_id: postId, user_id: userId },
  });

  if (existing) {
    if (existing.liked === liked) {
      // 같은 버튼 → 취소
      await db.like.delete({ where: { id: existing.id } });
      return NextResponse.json({ ok: true, action: 'removed' });
    } else {
      // 반대 버튼 → 전환
      await db.like.update({
        where: { id: existing.id },
        data: { liked },
      });
      return NextResponse.json({ ok: true, action: 'updated' });
    }
  } else {
    // 처음 클릭 → 생성
    await db.like.create({
      data: { user_id: userId, post_id: postId, liked },
    });
    return NextResponse.json({ ok: true, action: 'created' });
  }
}

// ✅ GET: 좋아요/싫어요 상태 조회
export async function GET(req: NextRequest) {
  const postId = Number(req.nextUrl.searchParams.get('postId'));
  const userId = Number(req.nextUrl.searchParams.get('userId'));

  if (!postId || !userId) {
    return NextResponse.json({ liked: null });
  }

  const like = await db.like.findFirst({
    where: { post_id: postId, user_id: userId },
  });

  return NextResponse.json({ liked: like?.liked ?? null });
}
