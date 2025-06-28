'use client';

import { useState } from 'react';
import { UploadFile } from '@/components/upload-file';
import { parseEther } from 'viem';
import { toast } from 'sonner';
import { ABI_BOOK_MARKETPLACE } from '@/lib/constants';

import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from 'wagmi';

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Replace with your deployed contract address

export default function Publish() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [authorAddress, setAuthorAddress] = useState('');
  const [cid, setCid] = useState('something');

  const { address, isConnected } = useAccount();
  console.log('current address', address);

  const {
    data: hash,
    writeContract,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();
  console.log('ispending', isWritePending);

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const handlePublish = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet.');
      return;
    }
    if (!title || !description || !price || !authorAddress || !cid) {
      toast.error('Please fill in all fields and upload a file.');
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: ABI_BOOK_MARKETPLACE,
        functionName: 'addBook',
        args: [title, description, cid, parseEther(price), authorAddress],
      });
    } catch (e) {
      console.error('Error preparing transaction:', e);
      toast.error('Error preparing transaction.');
    }
  };

  return (
    <main className='h-screen flex flex-col items-center justify-center'>
      <div className='text-lg font-bold mb-4'>
        <h1>Publish your crypto book here!</h1>
      </div>
      <div className='flex flex-col space-y-4 w-96'>
        <input
          type='text'
          placeholder='Book Title'
          className='border p-2 rounded'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder='Book Description'
          className='border p-2 rounded'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type='number'
          placeholder='Price (in ETH)'
          className='border p-2 rounded'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type='text'
          placeholder='Author Address'
          className='border p-2 rounded'
          value={authorAddress}
          onChange={(e) => setAuthorAddress(e.target.value)}
        />
        <UploadFile onUploadSuccess={setCid} />
        {cid && <p className='text-sm text-gray-600'>Uploaded CID: {cid}</p>}
        <button
          className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md cursor-pointer'
          onClick={handlePublish}
          // disabled={!title || !description || !price || !authorAddress || !cid || isWritePending || isConfirming}
        >
          {isWritePending || isConfirming ? 'Publishing...' : 'Publish Book'}
        </button>
      </div>
    </main>
  );
}
