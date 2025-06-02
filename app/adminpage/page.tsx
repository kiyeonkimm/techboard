import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import db from '@/lib/db';

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const q = searchParams?.q?.trim() ?? '';

  const users = await db.user.findMany({
    where: q
      ? {
          OR: [{ name: { contains: q } }, { email: { contains: q } }],
        }
      : undefined,
    orderBy: { id: 'asc' },
  });

  return (
    <div className='max-w-4xl mx-auto px-6 py-12 space-y-6'>
      <h1 className='text-2xl font-bold'>회원 목록</h1>

      {/* 🔍 검색창 */}
      <form method='GET' className='mb-4 flex gap-2'>
        <Input
          type='text'
          name='q'
          defaultValue={q}
          placeholder='이름 또는 이메일 검색'
        />
        <Button>검색</Button>
      </form>

      <table className='w-full border'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border px-4 py-2'>이름</th>
            <th className='border px-4 py-2'>이메일</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className='text-center'>
              <td className='border px-4 py-2'>{user.name}</td>
              <td className='border px-4 py-2'>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
