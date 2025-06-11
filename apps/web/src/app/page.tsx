'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';

export default function Home() {
  return (
    <div className='container mx-auto max-w-5xl px-4 py-8'>
      {/* Hero Section */}
      <section className='text-center py-16 w-full flex flex-col items-center justify-center'>
        <h1 className='text-4xl font-bold mb-4'>
          Discover, Collect, and Sell Crypto Books
        </h1>
        <p className='text-lg text-gray-600 mb-8'>
          A decentralized marketplace for crypto books.
        </p>
        <ConnectButton />
      </section>

      {/* Featured Books */}
      <section className='py-8'>
        <h2 className='text-2xl font-semibold mb-4'>Featured Books</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Book 1 */}
          <div className='rounded-lg border p-4'>
            <Image
              src='/images/book1.jpg' // Replace with actual image URL
              alt='Book 1'
              width={200}
              height={300}
              className='mx-auto mb-4'
            />
            <h3 className='font-medium text-lg'>Mastering Bitcoin</h3>
            <p className='text-sm text-gray-500'>
              Unlocking Digital Cryptocurrencies
            </p>
          </div>
          {/* Book 2 */}
          <div className='rounded-lg border p-4'>
            <Image
              src='/images/book2.jpg' // Replace with actual image URL
              alt='Book 2'
              width={200}
              height={300}
              className='mx-auto mb-4'
            />
            <h3 className='font-medium text-lg'>The Internet of Money</h3>
            <p className='text-sm text-gray-500'>
              A collection of talks by Andreas Antonopoulos
            </p>
          </div>
          {/* Book 3 */}
          <div className='rounded-lg border p-4'>
            <Image
              src='/images/book3.jpg' // Replace with actual image URL
              alt='Book 3'
              width={200}
              height={300}
              className='mx-auto mb-4'
            />
            <h3 className='font-medium text-lg'>Programming Bitcoin</h3>
            <p className='text-sm text-gray-500'>
              Learn How to Program Bitcoin from Scratch
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className='py-8'>
        <h2 className='text-2xl font-semibold mb-4'>Testimonials</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Testimonial 1 */}
          <div className='rounded-lg border p-4'>
            <p className='text-sm italic text-gray-700 mb-2'>
              "Great platform for discovering new crypto books!"
            </p>
            <p className='text-xs font-medium'>- John Doe</p>
          </div>
          {/* Testimonial 2 */}
          <div className='rounded-lg border p-4'>
            <p className='text-sm italic text-gray-700 mb-2'>
              "Easy to use and a great selection of books."
            </p>
            <p className='text-xs font-medium'>- Jane Smith</p>
          </div>
        </div>
      </section>
    </div>
  );
}
