'use client';

import { useBalance, useAccount } from 'wagmi';

export default function BooksPage() {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  console.log('my balance', balance + ' for ' + address);
  return <div>Books Page</div>;
}
