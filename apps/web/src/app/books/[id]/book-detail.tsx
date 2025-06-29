'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { PDFViewer } from '@/components/pdf-viewer';
import { Button } from '@/components/ui/button';
import { ABI_BOOK_MARKETPLACE } from '@/lib/constants';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { toast } from 'sonner';

export function BookDetail({ id }: { id: string }) {
  const router = useRouter();
  const { address } = useAccount();
  const { data: book, refetch } = useReadContract({
    abi: ABI_BOOK_MARKETPLACE,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as '0x',
    functionName: 'getBook',
    args: [BigInt(id)],
  });
  const {
    data: hash,
    writeContract,
    isPending: isDeleting,
    isSuccess: isDeleted,
  } = useWriteContract();

  const isAuthor = address === book?.authorAddress;

  const handleDelete = async () => {
    writeContract({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as '0x',
      abi: ABI_BOOK_MARKETPLACE,
      functionName: 'deleteBook',
      args: [BigInt(id)],
    });
  };

  useEffect(() => {
    if (isDeleted) {
      toast.success('Book deleted successfully');
      router.push('/');
    }
  }, [isDeleted]);

  return (
    <section className='container mx-auto p-6'>
      <div className='flex flex-col gap-6 rounded-lg border shadow-sm sm:flex-row'>
        <div className='w-full p-6 sm:w-1/2'>
          <h2 className='mb-4 text-2xl font-semibold'>Book Details</h2>
          <div className='space-y-3'>
            <p>
              <span className='font-medium'>Title:</span> {book?.title}
            </p>
            <p>
              <span className='font-medium'>Author Address:</span>{' '}
              {book?.authorAddress}
            </p>
            <p>
              <span className='font-medium'>Description:</span>{' '}
              {book?.description}
            </p>
            <p>
              <span className='font-medium'>Price:</span>{' '}
              {book?.price?.toString()} wei
            </p>
          </div>
          <Button className='cursor-pointer'>Buy This Book</Button>
          {isAuthor && (
            <Button
              variant='destructive'
              className='ml-2 cursor-pointer'
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Book'}
            </Button>
          )}
        </div>

        <div className='relative h-full w-full rounded-b-lg sm:rounded-r-lg sm:w-1/2 sm:rounded-bl-none'>
          <div className='pointer-events-none text-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-45deg] text-6xl font-bold uppercase text-gray-900 opacity-30 z-10'>
            Copyright Crypto Book
            <span className='block'>Alright reserved</span>
            <span className='block'>🤡🤡🤡����🤡</span>
          </div>

          {book?.cid ? (
            <iframe
              src={book.cid}
              title='PDF Preview'
              className='h-[600px] w-full rounded-lg border z-0'
            ></iframe>
          ) : (
            <div className='flex h-[600px] items-center justify-center rounded-lg border border-dashed border-gray-300 text-gray-400'>
              PDF Preview Not Available
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
