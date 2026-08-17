'use client';

import React from 'react';
import { Wallet, FilePlus, Key, Cpu, ShieldCheck, CheckCircle } from 'lucide-react';

interface Step {
  num: number;
  title: string;
  desc: string;
  icon: React.ElementType;
}

const steps: Step[] = [
  { num: 1, title: 'Connect Lace', desc: 'Authenticate with authentic Midnight Lace wallet', icon: Wallet },
  { num: 2, title: 'Issue Credential', desc: 'Certified doctor signs prescription hash off-chain', icon: FilePlus },
  { num: 3, title: 'Private Data Store', desc: 'PHI remains 100% confidential in encrypted state', icon: Key },
  { num: 4, title: 'Generate ZK Proof', desc: 'Client-side zk-SNARK proof execution', icon: Cpu },
  { num: 5, title: 'On-Chain Verify', desc: 'Validate signature & register single-use nullifier', icon: ShieldCheck },
  { num: 6, title: 'Fulfillment Receipt', desc: 'Instant pharmacy verification receipt', icon: CheckCircle },
];

export const WorkflowStepper: React.FC = () => {
  return (
    <div className="w-full py-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="relative p-3.5 rounded-xl glass-card border border-slate-800 hover:border-blue-500/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 font-semibold text-xs flex items-center justify-center border border-blue-500/20">
                  {step.num}
                </span>
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
              </div>
              <h4 className="font-semibold text-xs text-slate-200 mb-1">{step.title}</h4>
              <p className="text-[10px] text-slate-400 leading-normal">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
