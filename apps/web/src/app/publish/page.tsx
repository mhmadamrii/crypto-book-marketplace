'use client';

import { config } from '@/lib/wagmi/config';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Loader } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { UploadFile } from '@/components/upload-file';
import { parseEther, parseUnits } from 'viem';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { waitForTransactionReceipt } from '@wagmi/core';
import { ABI_BOOK_MARKETPLACE } from '@/lib/constants';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from 'wagmi';

const FormSchema = z
  .object({
    title: z.string().min(2, {
      message: 'Title must be at least 2 characters.',
    }),
    desc: z
      .string()
      .min(2, {
        message: 'Description must be at least 2 characters.',
      })
      .max(50, {
        message: 'Description must be at most 50 characters.',
      }),
    price: z.coerce.number(),
    priceUnit: z.enum(['wei', 'ether']),
    authorAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
      message: 'Author address must be a valid Ethereum address (e.g., 0x...).',
    }),
  })
  .refine(
    ({ price, priceUnit }) => {
      try {
        const wei = priceUnit === 'ether' ? BigInt(parseEther(price.toString()).toString()) : BigInt(Math.floor(price)); // prettier-ignore

        return wei >= BigInt(5);
      } catch (e) {
        return false;
      }
    },
    {
      message: 'Price must be at least 5 wei.',
      path: ['price'],
    },
  );

export default function Publish() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [ipfsUrl, setIpfsUrl] = useState('');

  const {
    data: hash,
    writeContract,
    isSuccess,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      desc: '',
      price: 0,
      priceUnit: 'ether',
      authorAddress: '',
    },
  });

  const handleTransactionSubmitted = async (txHash: string) => {
    const transactionReceipt = await waitForTransactionReceipt(config, {
      hash: txHash as `0x${string}`,
    });
    console.log('transactionReceipt', transactionReceipt);

    if (transactionReceipt.status === 'success') {
      toast.success('Transaction successful!');
      router.push('/');
    }
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!ipfsUrl) {
      toast.error('Please upload a PDF file.');
      return;
    }
    try {
      const priceInWei = data.priceUnit === 'ether' ? parseEther(data.price.toString()) : parseUnits(data.price.toString(), 0); // prettier-ignore

      writeContract(
        {
          address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as '0x',
          abi: ABI_BOOK_MARKETPLACE,
          functionName: 'addBook',
          args: [
            data.title,
            data.desc,
            ipfsUrl,
            priceInWei,
            data.authorAddress as '0x',
          ],
        },
        {
          onSuccess: handleTransactionSubmitted,
        },
      );
    } catch (e) {
      console.error('Error preparing transaction:', e);
      toast.error('Error preparing transaction.');
    }
  }

  console.log('current address', address);

  return (
    <main className='container mx-auto max-w-5xl flex justify-center flex-col items-center px-4 py-8'>
      <div className='text-lg font-bold mb-4'>
        <h1>Publish your crypto book here!</h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full sm:max-w-xl space-y-6 font-semibold'
        >
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Book Title</FormLabel>
                <FormControl>
                  <Input
                    disabled={isConfirming}
                    placeholder='Crypto Beginner Guide'
                    {...field}
                  />
                </FormControl>
                <FormDescription>Your book title</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='desc'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='A crypto book that you need to read'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Give a brief description of your book.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex gap-4'>
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder='400' {...field} />
                  </FormControl>
                  <FormDescription>Your book price</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='priceUnit'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Unit</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a unit' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='ether'>Ether</SelectItem>
                      <SelectItem value='wei'>Wei</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Your price unit</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name='authorAddress'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author Address</FormLabel>
                <FormControl>
                  <Input placeholder='0x...' {...field} />
                </FormControl>
                <FormDescription>
                  Author address of this book ex: 0x...
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex flex-col space-y-4 w-full'>
            <UploadFile onUploadSuccess={setIpfsUrl} />
            {ipfsUrl && (
              <p className='text-sm text-gray-600'>Uploaded Url: {ipfsUrl}</p>
            )}
            <Button
              type='submit'
              className='bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-md cursor-pointer'
              disabled={!isConnected || isConfirming}
            >
              {isWritePending || isConfirming ? (
                <Loader className='animate-spin' />
              ) : (
                'Publish Book'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
