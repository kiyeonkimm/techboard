'use client';

import { Input } from '@/components/ui/input';
import { use } from 'react';

type Params = {
  searchParams: Promise<{ email: string }>;
};
export default function Regist({ searchParams }: Params) {
  const { email } = use(searchParams);

  const regist = async (formData: FormData) => {
    formData.get('email');
  };

  return (
    <>
      <h1 className='text-2xl'>Regist</h1>
      <form action={regist}>
        <Input type='email' name='email' defaultValue={email} />
      </form>
    </>
  );
}
