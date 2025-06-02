// hanaro/app/signup/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// hanaro/app/signup/page.tsx

// hanaro/app/signup/page.tsx
export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const result = await res.json();
    if (res.ok) {
      alert('회원가입 성공');
      router.push('/login');
    } else {
      alert(`회원가입 실패: ${result.error}`);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-md'
      >
        <h2 className='text-2xl font-semibold text-center'>회원가입</h2>
        <Input
          name='name'
          placeholder='이름'
          onChange={handleChange}
          required
        />
        <Input
          type='email'
          name='email'
          placeholder='이메일'
          onChange={handleChange}
          required
        />
        <Input
          type='password'
          name='password'
          placeholder='비밀번호'
          onChange={handleChange}
          required
        />
        <Button type='submit' className='w-full'>
          회원가입
        </Button>
      </form>
    </div>
  );
}
