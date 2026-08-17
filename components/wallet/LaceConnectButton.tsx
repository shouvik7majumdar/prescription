'use client';

import React from 'react';
import { useLaceWallet } from './LaceWalletContext';
import { Wallet, LogOut, Loader2 } from 'lucide-react';

export const LaceConnectButton: React.FC = () => {
  const { wallet, isConnecting, connect, disconnect } = useLaceWallet();

  if (wallet && wallet.isConnected) {
    const truncatedAddr = `${wallet.address.slice(0, 10)}...${wallet.address.slice(-6)}`;
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-mono">{truncatedAddr}</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[10px] text-emerald-300 uppercase tracking-wider">
            {wallet.network}
          </span>
        </div>

        <button
          onClick={disconnect}
          title="Disconnect Wallet"
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors border border-slate-700/50"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={isConnecting}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm shadow-lg shadow-blue-500/20 transition-all duration-200 active:scale-95 disabled:opacity-50"
    >
      {isConnecting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Connecting Lace...</span>
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4" />
          <span>Connect Lace Wallet</span>
        </>
      )}
    </button>
  );
};
