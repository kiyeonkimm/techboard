// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const categoryId = Number(formData.get('categoryId'));

  if (!title || !content || isNaN(categoryId)) {
    return NextResponse.json(
      { error: '입력값이 잘못됐습니다.' },
      { status: 400 }
    );
  }

  // 세션에서 userId 가져오기 (로그인 연동되면 아래처럼 교체)
  // const session = await getServerSession(authOptions);
  // const userId = session?.user?.id;
  // if (!userId) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

  await db.post.create({
    data: {
      title,
      content,
      category_id: categoryId,
      user_id: 1, // ← 로그인 연동되면 위처럼 교체
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
