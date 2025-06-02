// app/api/like/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

console.log('🔥 like API 모듈 로드됨');

export async function POST(req: NextRequest) {
  console.log('✅ POST /api/like 실행됨');

  try {
    const body = await req.json();
    console.log('📦 Body:', body);

    const { postId, userId } = body;

    if (!postId || !userId) {
      console.log('❗ postId 또는 userId 누락');
      return NextResponse.json(
        { error: 'postId 또는 userId 누락' },
        { status: 400 }
      );
    }

    await db.like.create({
      data: {
        post_id: Number(postId),
        user_id: Number(userId),
        liked: true,
      },
    });

    console.log('✅ 좋아요 생성 완료');
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('❌ 서버 오류:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
