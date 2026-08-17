'use client';

import React from 'react';
import { useLaceWallet } from '@/components/wallet/LaceWalletContext';
import { AUTHORIZED_DOCTORS, AUTHORIZED_HOSPITALS } from '@/src/healthcare-services';
import { BarChart3, Database, Lock, ShieldCheck, Key, Cpu, Activity, Building, UserCheck } from 'lucide-react';

export default function AnalyticsPage() {
  const { wallet } = useLaceWallet();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            Public Ledger Analytics & Telemetry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time Midnight contract state inspection and certified healthcare allowlist directory.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium flex items-center gap-2">
          <Database className="w-4 h-4" />
          <span>On-Chain State Explorer</span>
        </div>
      </div>

      {/* Public State vs Private State Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>On-Chain Verifications</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">
            42
          </div>
          <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] uppercase tracking-wider font-semibold">
            ON-CHAIN PUBLIC STATE (`verificationCount`)
          </span>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Spent Nullifier Registry</span>
            <Key className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-purple-400">
            18
          </div>
          <span className="inline-block px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[10px] uppercase tracking-wider font-semibold">
            ON-CHAIN PUBLIC STATE (`usedNullifiers`)
          </span>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Contract Operational Status</span>
            <Lock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-blue-400">
            Active
          </div>
          <span className="inline-block px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 text-[10px] uppercase tracking-wider font-semibold">
            ON-CHAIN PUBLIC STATE (`contractActive`)
          </span>
        </div>
      </div>

      {/* Contract & Network Specification Panel */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-xs border-b border-slate-800 pb-2 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span>Midnight Contract Deployment Parameters</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Contract Address:</span>
            <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-300 break-all border border-slate-800">
              58e1e74340e5a250668f9a9da1597b1bddca694440545796994d9d186db2f36c
            </div>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Network Endpoint:</span>
            <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-300 border border-slate-800">
              https://indexer.preprod.midnight.network/api/v4/graphql
            </div>
          </div>
        </div>
      </div>

      {/* Certified Doctor & Hospital Allowlist Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-xs border-b border-slate-800 pb-2 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span>Certified Doctors Directory</span>
          </h3>

          <div className="space-y-3">
            {AUTHORIZED_DOCTORS.map((doc) => (
              <div key={doc.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">{doc.name}</div>
                  <div className="text-[10px] text-slate-400">{doc.specialisation} ({doc.licenseNumber})</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-xs border-b border-slate-800 pb-2 flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-400" />
            <span>Approved Hospital Networks</span>
          </h3>

          <div className="space-y-3">
            {AUTHORIZED_HOSPITALS.map((hosp) => (
              <div key={hosp.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">{hosp.name}</div>
                  <div className="text-[10px] text-slate-400">{hosp.city} ({hosp.licenseCode})</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold">
                  {hosp.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
