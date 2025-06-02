// app/api/user/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import db from '@/lib/db';

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: '로그인이 필요합니다.' },
      { status: 401 }
    );
  }

  const { name } = await req.json();

  if (!name || typeof name !== 'string') {
    return NextResponse.json(
      { error: '닉네임이 필요합니다.' },
      { status: 400 }
    );
  }

  await db.user.update({
    where: { id: Number(session.user.id) },
    data: { name },
  });

  return NextResponse.json({ ok: true });
}
