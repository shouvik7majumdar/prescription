import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LaceWalletProvider } from '@/components/wallet/LaceWalletContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RxVerify — Confidential Prescription Verification on Midnight Protocol',
  description: 'Production-grade Zero-Knowledge healthcare credential verification platform built on Midnight Network using Compact smart contracts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <LaceWalletProvider>
          <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
            <Header />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" theme="dark" richColors />
        </LaceWalletProvider>
      </body>
    </html>
  );
}
