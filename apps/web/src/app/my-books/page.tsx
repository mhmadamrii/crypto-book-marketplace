'use client';

import { ABI_BOOK_MARKETPLACE } from '@/lib/constants';
import { useReadContract } from 'wagmi';

export default function Collections() {
  console.log('contract address', process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
  const { data } = useReadContract({
    abi: ABI_BOOK_MARKETPLACE,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as '0x',
    functionName: 'userPurchases',
    args: ['0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc', BigInt(1)],
  });

  console.log('my books', data);
  return <div>Collections</div>;
}
