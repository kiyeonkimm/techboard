'use server';

import { signIn, signOut } from '../auth';

export const login = async () => {
  await signIn('github', { redirectTo: '/' });
};

export const snsLogin = async (
  service: string = 'github',
  redirectTo: string = '/'
) => {
  await signIn(service, { redirectTo });
};

export const logout = async () => {
  await signOut({ redirectTo: '/api/auth/signin' });
};
