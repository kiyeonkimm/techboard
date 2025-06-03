import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user?.id || !session.user?.is_admin) {
    return NextResponse.json(
      { error: '글 작성은 관리자만 가능합니다.' },
      { status: 403 }
    );
  }

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

  await db.post.create({
    data: {
      title,
      content,
      category_id: categoryId,
      user_id: Number(session.user.id),
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
