'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ABI_BOOK_MARKETPLACE } from '@/lib/constants';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { toast } from 'sonner';
import { ContractFunctionExecutionError, formatEther } from 'viem';
import { waitForTransactionReceipt } from '@wagmi/core';
import { config } from '@/lib/wagmi/config';

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
    isPending,
    isSuccess,
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

  const handleTransactionSubmitted = async (txHash: string) => {
    const transactionReceipt = await waitForTransactionReceipt(config, {
      hash: txHash as `0x${string}`,
    });
    console.log('transactionReceipt', transactionReceipt);

    if (transactionReceipt.status === 'success') {
      toast.success('Transaction successful!');
      // router.push('/my-books');
    }
  };
  console.log(book);

  const handlePurchaseBook = () => {
    console.log('clicked');
    try {
      writeContract(
        {
          address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as '0x',
          abi: ABI_BOOK_MARKETPLACE,
          functionName: 'purchaseBook',
          args: [BigInt(id)],
          value: book?.price,
        },
        {
          onSuccess: handleTransactionSubmitted,
          onError: (error: any) => {
            toast.error('Error purchasing book');
            if (error instanceof ContractFunctionExecutionError) {
              console.error('Reason:', error.shortMessage);
            }
            console.log('error', error);
          },
        },
      );
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('Book deleted successfully');
      // router.push('/');
    }
  }, [isSuccess]);

  return (
    <section className='container mx-auto p-6'>
      <div className='flex flex-col gap-6 rounded-lg border shadow-sm sm:flex-row'>
        <div className='w-full p-6 sm:w-1/2'>
          <h2 className='mb-4 text-2xl font-semibold'>Book Details</h2>
          <div className='space-y-3'>
            <div>
              <p className='text-gray-600'>Title:</p>
              <p>{book?.title}</p>
            </div>
            <div>
              <p className='text-gray-600'>Author Address:</p>
              <p>{book?.authorAddress}</p>
            </div>
            <div>
              <p className='text-gray-600'>Description:</p>
              <p>{book?.description}</p>
            </div>
            <div>
              <p className='text-gray-600'>Price:</p>
              <p>
                {book?.price
                  ? `${book.price.toString()} wei / ${formatEther(book.price)} ETH`
                  : '0'}
              </p>
            </div>
          </div>
          <Button onClick={handlePurchaseBook} className='cursor-pointer'>
            Buy This Book
          </Button>
          {isAuthor && (
            <Button
              variant='destructive'
              className='ml-2 cursor-pointer'
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? 'Deleting...' : 'Delete Book'}
            </Button>
          )}
        </div>

        <div className='relative h-full w-full rounded-b-lg sm:rounded-r-lg sm:w-1/2 sm:rounded-bl-none'>
          <div className='bg-background bottom-0 absolute top-0 right-0 left-0 opacity-30'></div>
          <div className='pointer-events-none text-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-45deg] text-6xl font-bold uppercase text-gray-900 opacity-30 z-10'>
            Copyright Crypto Book
            <span className='block'>Alright reserved</span>
            <span className='block'>🤡🤡🤡</span>
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
