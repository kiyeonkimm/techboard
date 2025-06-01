'use client';

import { PropsWithChildren } from 'react';
import { Button } from './button';

type Props = {
  action: () => void;
};
export default function ActionButton({
  action,
  children,
}: PropsWithChildren<Props>) {
  return (
    <form action={action}>
      <Button>{children}</Button>
    </form>
  );
}
