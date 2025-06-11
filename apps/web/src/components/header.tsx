'use client';

import Link from 'next/link';

import { ModeToggle } from './mode-toggle';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  const links = [
    {
      to: '/',
      label: 'Home',
    },
    {
      to: '/books',
      label: 'Books',
    },
  ];

  return (
    <div>
      <div className='flex flex-row items-center justify-between px-2 py-1'>
        <nav className='flex gap-4 text-lg h-[100px] items-center'>
          {links.map(({ to, label }) => {
            return (
              <Link key={to} href={to}>
                {label}
              </Link>
            );
          })}
          <ConnectButton />
        </nav>
        <div className='flex items-center gap-2'>
          <ModeToggle />
        </div>
      </div>
      <hr />
    </div>
  );
}
