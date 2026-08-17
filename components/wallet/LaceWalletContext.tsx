'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface WalletState {
  address: string;
  coinPublicKey: string;
  network: string;
  isConnected: boolean;
  isSimulated?: boolean;
}

interface LaceWalletContextType {
  wallet: WalletState | null;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isLaceAvailable: boolean;
}

const LaceWalletContext = createContext<LaceWalletContextType>({
  wallet: null,
  isConnecting: false,
  error: null,
  connect: async () => {},
  disconnect: () => {},
  isLaceAvailable: false,
});

export const LaceWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLaceAvailable, setIsLaceAvailable] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasLace = !!(window as any).midnight?.mnLace;
      setIsLaceAvailable(hasLace);

      // Check local storage for persistent connection state
      const savedWallet = localStorage.getItem('rx_verify_lace_wallet');
      if (savedWallet) {
        try {
          setWallet(JSON.parse(savedWallet));
        } catch {
          localStorage.removeItem('rx_verify_lace_wallet');
        }
      }
    }
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      if (typeof window !== 'undefined' && (window as any).midnight?.mnLace) {
        // Authentic Midnight Lace Wallet API call
        const lace = (window as any).midnight.mnLace;
        const enabled = await lace.enable(); // Triggers authentic Lace popup
        const address = (await enabled.getAddress?.()) || 'mn_addr_preprod1...';
        const cpk = await enabled.coinPublicKey?.();
        const coinPublicKey = typeof cpk === 'string' ? cpk : JSON.stringify(cpk || {});
        const networkId = (await enabled.getNetworkId?.()) || 'preprod';

        const state: WalletState = {
          address,
          coinPublicKey,
          network: networkId,
          isConnected: true,
          isSimulated: false,
        };

        setWallet(state);
        localStorage.setItem('rx_verify_lace_wallet', JSON.stringify(state));
      } else {
        // Fallback for local testing when Lace extension is not installed
        const simulated: WalletState = {
          address: 'mn_addr_preprod1h3ssm5ru2t6eqy4g3she78zlxn96e36ms6pq996aduvm',
          coinPublicKey: '0x' + Array(64).fill('a').join(''),
          network: 'preprod',
          isConnected: true,
          isSimulated: true,
        };
        setWallet(simulated);
        localStorage.setItem('rx_verify_lace_wallet', JSON.stringify(simulated));
        setError('Lace extension not detected. Running simulated wallet session for preview.');
      }
    } catch (err: any) {
      const msg = err?.message || 'Failed to connect to Midnight Lace Wallet';
      setError(msg);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet(null);
    setError(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rx_verify_lace_wallet');
    }
  }, []);

  return (
    <LaceWalletContext.Provider
      value={{
        wallet,
        isConnecting,
        error,
        connect,
        disconnect,
        isLaceAvailable,
      }}
    >
      {children}
    </LaceWalletContext.Provider>
  );
};

export const useLaceWallet = () => useContext(LaceWalletContext);
