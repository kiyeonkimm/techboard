'use client';

import Image from 'next/image';

type Props = {
  name: string;
  image?: string | null;
  logoutAction: () => void;
};
export default function ProfileImageButton({
  name,
  image,
  logoutAction,
}: Props) {
  return (
    <button onClick={logoutAction} className='cursor-pointer hover:scale-105'>
      {image ? (
        <Image
          alt={name}
          src={image}
          width={100}
          height={100}
          className='rounded-full'
        />
      ) : (
        name
      )}
    </button>
  );
}
