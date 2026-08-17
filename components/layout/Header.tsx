'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, FilePlus2, FileText, CheckCircle2, BarChart3, Pill } from 'lucide-react';
import { LaceConnectButton } from '../wallet/LaceConnectButton';

export const Header: React.FC = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Overview', icon: ShieldCheck },
    { href: '/prescribe', label: 'Doctor Portal', icon: FilePlus2 },
    { href: '/my-prescriptions', label: 'My Prescriptions', icon: FileText },
    { href: '/verify', label: 'Pharmacy Verification', icon: CheckCircle2 },
    { href: '/analytics', label: 'Ledger Analytics', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 group-hover:border-blue-500/40 transition-colors">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                RxVerify <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Midnight</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium">Zero-Knowledge Healthcare Credentials</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Lace Wallet Button */}
          <div className="flex items-center gap-3">
            <LaceConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};
