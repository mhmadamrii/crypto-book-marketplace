'use client';

import Link from 'next/link';

import { ModeToggle } from './mode-toggle';

export default function Header() {
  const links = [
    {
      to: '/',
      label: 'Home',
    },
    {
      to: '/publish',
      label: 'Publish',
    },
    {
      to: '/collections',
      label: 'Collections',
    },
  ];

  return (
    <div>
      <div className='flex flex-row items-center justify-between px-10 py-1'>
        <nav className='flex gap-5 text-lg h-[80px] items-center'>
          {links.map(({ to, label }) => {
            return (
              <Link className='hover:underline' key={to} href={to}>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className='flex items-center gap-2'>
          <ModeToggle />
        </div>
      </div>
      <hr />
    </div>
  );
}
