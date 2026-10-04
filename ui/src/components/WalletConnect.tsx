import React, { useState } from 'react';
import type { WalletState } from '../types';

interface WalletConnectProps {
  wallet: WalletState | null;
  onConnect: (wallet: WalletState) => void;
  onDisconnect: () => void;
  onError: (msg: string) => void;
}

// Prefer Lace, otherwise use any wallet that implements the Midnight DApp Connector v4 API
function findMidnightWallet(): any {
  const midnight = (window as any).midnight;
  if (!midnight) return undefined;
  if (midnight.mnLace) return midnight.mnLace;
  return Object.values(midnight).find(
    (w: any) => typeof w?.apiVersion === 'string' && w.apiVersion.startsWith('4') && typeof w.connect === 'function'
  );
}

export function WalletConnect({ wallet, onConnect, onDisconnect, onError }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = async () => {
    setIsConnecting(true);
    try {
      // Attempt to connect to Lace or another Midnight wallet extension
      const midnightWallet = typeof window !== 'undefined' ? findMidnightWallet() : undefined;
      if (midnightWallet) {
        let address: any;
        let coinPublicKey: any;
        let networkId: string;
        if (typeof midnightWallet.connect === 'function' && String(midnightWallet.apiVersion).startsWith('4')) {
          // Midnight DApp Connector v4 API
          const api = await midnightWallet.connect(import.meta.env.VITE_NETWORK || 'undeployed');
          const addresses = await api.getShieldedAddresses();
          address = addresses.shieldedAddress;
          coinPublicKey = addresses.shieldedCoinPublicKey;
          networkId = (await api.getConfiguration()).networkId || import.meta.env.VITE_NETWORK || 'undeployed';
        } else {
          const enabled = await midnightWallet.enable();
          address = await enabled.getAddress?.() || 'mn_addr_...';
          coinPublicKey = await enabled.coinPublicKey?.() || 'cpk_...';
          networkId = await enabled.getNetworkId?.() || import.meta.env.VITE_NETWORK || 'undeployed';
        }

        onConnect({
          address,
          coinPublicKey: typeof coinPublicKey === 'string' ? coinPublicKey : JSON.stringify(coinPublicKey),
          network: networkId,
          isConnected: true,
        });
      } else {
        // Simulate connection for local devnet testing
        const simulated: WalletState = {
          address: 'mn_addr_undeployed1h3ssm5ru2t6eqy4g3she78zlxn96e36ms6pq996aduvmateh9p9sk96u7s',
          coinPublicKey: '0x' + Array(64).fill(0).map((_, i) => i.toString(16).padStart(2, '0')).join(''),
          network: import.meta.env.VITE_NETWORK || 'undeployed',
          isConnected: true,
        };
        onConnect(simulated);
        // Show info about Lace
        onError('Lace wallet not detected. Using simulated wallet for local testing. Install Midnight Lace for production.');
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  if (!wallet) {
    return (
      <div className="card animate-slide-up">
        <div className="card-title">
          <span className="card-title-icon">👛</span>
          Connect Wallet
        </div>

        <div className="alert alert-info mb-4" style={{ marginBottom: '20px' }}>
          <span className="alert-icon">ℹ️</span>
          <div>
            Connect your <strong>Lace wallet</strong> to submit prescriptions.
            Your private data never leaves your browser.
          </div>
        </div>

        <button
          id="wallet-connect-btn"
          className="btn btn-primary btn-lg w-full"
          onClick={connect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <><span className="spinner" style={{ borderTopColor: 'white' }} /> Connecting...</>
          ) : (
            <><span>💊</span> Connect Lace Wallet</>
          )}
        </button>

        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
          <a
            href="https://www.lace.io/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}
          >
            Get Lace Wallet →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in">
      <div className="card-title">
        <span className="card-title-icon">✅</span>
        Wallet Connected
      </div>

      <div className="wallet-section">
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Address</div>
          <div className="wallet-addr" id="wallet-address-display">{wallet.address}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Network</div>
            <div style={{ fontWeight: 600, color: 'var(--accent-teal)' }}>{wallet.network}</div>
          </div>
          <div className="tag tag-green">Connected</div>
        </div>

        <button
          id="wallet-disconnect-btn-card"
          className="btn btn-danger w-full"
          onClick={onDisconnect}
        >
          Disconnect Wallet
        </button>
      </div>
    </div>
  );
}