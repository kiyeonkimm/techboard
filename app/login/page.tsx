'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Github } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { snsLogin } from '@/lib/sign';

type Props = {
  searchParams: Promise<{ callbackUrl: string }>;
};

export default function LoginPage({ searchParams }: Props) {
  const { callbackUrl } = use(searchParams);
  const router = useRouter();

  const login = async (formData: FormData) => {
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

    if (!email || !password) {
      alert('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    let redirectTo = callbackUrl;
    if (!redirectTo || redirectTo.endsWith('signin')) redirectTo = '/';

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (!res?.error) {
      router.push(redirectTo);
    } else {
      alert('로그인 실패. 회원가입 페이지로 이동합니다.');
      router.push(`/auth/regist?email=${email}`);
    }
  };

  const myLogin = async (provider: string) => {
    let redirectTo = callbackUrl;
    if (!redirectTo || redirectTo.endsWith('signin')) redirectTo = '/';
    await snsLogin(provider, redirectTo);
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <form
        action={login}
        className='w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-md'
      >
        <h2 className='text-2xl font-semibold text-center'>로그인</h2>

        <Input type='email' name='email' placeholder='이메일 입력' required />
        <Input
          type='password'
          name='password'
          placeholder='비밀번호 입력'
          required
        />

        <Button type='submit' className='w-full'>
          로그인
        </Button>

        <Button
          type='button'
          variant='outline'
          className='w-full flex items-center justify-center gap-2'
          onClick={() => myLogin('github')}
        >
          <Github size={16} />
          Github로 로그인
        </Button>
      </form>
    </div>
  );
}
