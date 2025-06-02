import db from '@/lib/db';

export default async function AdminPage() {
  const users = await db.user.findMany({
    orderBy: { id: 'asc' },
  });

  return (
    <div className='max-w-4xl mx-auto px-6 py-12 space-y-6'>
      <h1 className='text-2xl font-bold'>회원 목록</h1>

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
