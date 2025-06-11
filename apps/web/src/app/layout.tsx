import type { Metadata } from 'next';
import { PT_Mono } from 'next/font/google';
import '../index.css';
import Providers from '@/components/providers';
import Header from '@/components/header';

const inc = PT_Mono({
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'crypto-book-marketplace',
  description: 'crypto-book-marketplace',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inc.className} antialiased`}>
        <Providers>
          <div className='grid grid-rows-[auto_1fr] h-svh'>
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
