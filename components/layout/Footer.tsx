'use client';

import React from 'react';
import { Activity, Shield, Server, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>Built on <strong className="text-slate-200">Midnight Network</strong> · Compact v0.5.1 · Level 3 Confidential Credentials</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center font-mono text-[11px]">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300">Preprod Indexer:</span>
              <span className="text-emerald-400">Active</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
              <Server className="w-3 h-3 text-indigo-400" />
              <span className="text-slate-300">Proof Server:</span>
              <span className="text-indigo-400">127.0.0.1:6300</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
              <Lock className="w-3 h-3 text-cyan-400" />
              <span className="text-slate-300">Nullifier Registry:</span>
              <span className="text-cyan-400">Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
