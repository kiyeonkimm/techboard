// hanaro/app/api/auth/signup/route.ts
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    const exists = await db.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json(
        { error: '이미 가입된 이메일입니다.' },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashed,
        is_admin: false,
      },
    });

    return NextResponse.json({ ok: true, user });
  } catch (err) {
    console.error('❌ 회원가입 오류:', err);
    return NextResponse.json({ error: '회원가입 실패' }, { status: 500 });
  }
}
