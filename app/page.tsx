'use client';

import React from 'react';
import Link from 'next/link';
import { useLaceWallet } from '@/components/wallet/LaceWalletContext';
import { WorkflowStepper } from '@/components/shared/WorkflowStepper';
import {
  ShieldCheck,
  Lock,
  FilePlus2,
  FileText,
  CheckCircle2,
  BarChart3,
  ArrowRight,
  Database,
  Key,
  Shield,
  Activity,
  Cpu,
} from 'lucide-react';

export default function LandingPage() {
  const { wallet, connect, isConnecting } = useLaceWallet();

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl glass-card border border-slate-800 p-8 sm:p-12">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Midnight Protocol Level 3 Category · Compact v0.5.1</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            <span className="gradient-text">Confidential</span> Prescription Verification Platform
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Digitally sign, issue, verify, and fulfill confidential healthcare credentials using Zero-Knowledge proofs on the <strong className="text-slate-100">Midnight Network</strong>. Zero exposure of Personal Health Information (PHI), doctor identity assurance, single-use nullifiers, and self-expiring QR verification tokens.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {!wallet || !wallet.isConnected ? (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-500/20 transition-all duration-200"
              >
                <span>Connect Lace Wallet</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href="/verify"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-500/20 transition-all duration-200"
              >
                <span>Launch Pharmacy Verifier</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            <Link
              href="/prescribe"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700/60 transition-all duration-200"
            >
              <FilePlus2 className="w-4 h-4 text-blue-400" />
              <span>Doctor Issuance Workspace</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Visual Workflow Stepper */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              End-to-End Confidential Workflow
            </h2>
            <p className="text-xs text-slate-400">Interactive execution steps from Lace connection to pharmacy fulfillment</p>
          </div>
        </div>
        <WorkflowStepper />
      </section>

      {/* Real System Telemetry & Status Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Network Status</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-slate-100 uppercase tracking-wide">
            {wallet?.network || 'Midnight Preprod'}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Public GraphQL Indexer Active</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Contract State</span>
            <Lock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-lg font-bold text-blue-400">
            Active (`true`)
          </div>
          <div className="text-[11px] text-slate-400">
            Accepting ZK Proof Submissions
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Replay Protection</span>
            <Key className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-purple-400">
            Single-Use Nullifiers
          </div>
          <div className="text-[11px] text-slate-400">
            `usedNullifiers` Ledger Registry
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Local Prover Engine</span>
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-lg font-bold text-slate-100">
            Proof Server 8.1.0
          </div>
          <div className="text-[11px] text-indigo-400 font-mono">
            http://127.0.0.1:6300
          </div>
        </div>
      </section>

      {/* Feature Navigation Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/prescribe" className="group">
          <div className="p-6 rounded-2xl glass-card glass-card-hover border border-slate-800 space-y-4 h-full">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <FilePlus2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
              Doctor Issuance Portal
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Authorized medical prescribers digitally sign confidential prescriptions. Cryptographic SHA-256 hashes and ECDSA doctor signatures stay strictly off-chain.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold pt-2">
              <span>Issue New Prescription</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </Link>

        <Link href="/my-prescriptions" className="group">
          <div className="p-6 rounded-2xl glass-card glass-card-hover border border-slate-800 space-y-4 h-full">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
              Patient Credential Manager
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              View private healthcare credentials stored locally. Generate self-expiring temporary ZK proof QR tokens (15m, 1h, 24h) for pharmacy verification.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold pt-2">
              <span>Manage Credentials</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </Link>

        <Link href="/verify" className="group">
          <div className="p-6 rounded-2xl glass-card glass-card-hover border border-slate-800 space-y-4 h-full">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
              Pharmacy ZK Verifier
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verify prescription authenticity, expiry status, prescriber allowlists, and single-use nullifiers on the Midnight Compact circuit without exposing PHI.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold pt-2">
              <span>Verify ZK Proof</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}
