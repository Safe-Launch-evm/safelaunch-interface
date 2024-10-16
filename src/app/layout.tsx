import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';
import { getConfig } from '@/lib/wagmi-config';
import { Bricolage_Grotesque, Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';
import { Web3Provider } from '@/components/web3-provider';

const bricolage = Bricolage_Grotesque({
  style: 'normal',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-bricolage'
});

const inter = Inter({
  style: 'normal',
  subsets: ['latin'],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'Safelaunch',
  description: 'Safelaunch ia a platform for launching fair and safe tokens'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(getConfig(), headers().get('cookie'));

  return (
    <Web3Provider initialState={initialState}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`min-h-screen bg-background font-bricolage text-foreground antialiased ${bricolage.variable} ${inter.variable}`}
        >
          <div vaul-drawer-wrapper="" className="bg-background">
            {children}
            <Toaster position="top-right" richColors />
          </div>
        </body>
      </html>
    </Web3Provider>
  );
}
