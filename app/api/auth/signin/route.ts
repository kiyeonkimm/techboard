import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호는 필수입니다.' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: '존재하지 않는 사용자입니다.' },
        { status: 404 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // TODO: 세션 또는 토큰 발급 로직 추가 필요

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (err) {
    console.error('❌ 로그인 오류:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
