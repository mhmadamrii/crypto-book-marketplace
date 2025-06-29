'use client';

import Link from 'next/link';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ABI_BOOK_MARKETPLACE } from '@/lib/constants';
import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';

export default function Home() {
  const { data } = useReadContract({
    abi: ABI_BOOK_MARKETPLACE,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as '0x',
    functionName: 'getAllBooks',
  });

  console.log('data', data);

  return (
    <div className='container mx-auto max-w-5xl px-4 py-8'>
      <section className='text-center py-16 w-full flex flex-col items-center justify-center'>
        <h1 className='text-4xl font-bold mb-4'>
          Discover, Collect, and Sell Crypto Books
        </h1>
        <p className='text-lg text-gray-600 mb-8'>
          A decentralized marketplace for crypto books.
        </p>
        <ConnectButton />
      </section>

      <section className='py-8'>
        <h2 className='text-2xl font-semibold mb-4'>Featured Books</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {data
            ?.filter((book) => book.title !== '')
            ?.map((item, id) => (
              <Link
                href={`/books/${item.id}`}
                key={id}
                className='rounded-lg border p-4'
              >
                <h3 className='font-medium truncate text-lg'>{item.title}</h3>
                <p className='text-sm text-gray-500 truncate max-w-full'>
                  {item.description}
                </p>
                <p className='text-lg font-semibold'>
                  {formatEther(item.price)} ETH
                </p>
              </Link>
            ))}
        </div>
      </section>

      <section className='py-8'>
        <h2 className='text-2xl font-semibold mb-4'>Testimonials</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='rounded-lg border p-4'>
            <p className='text-sm italic text-gray-600 mb-2'>
              "Great platform for discovering new crypto books!"
            </p>
            <p className='text-xs font-medium'>- John Doe</p>
          </div>
          <div className='rounded-lg border p-4'>
            <p className='text-sm italic text-gray-600 mb-2'>
              "Easy to use and a great selection of books."
            </p>
            <p className='text-xs font-medium'>- Jane Smith</p>
          </div>
        </div>
      </section>
    </div>
  );
}
