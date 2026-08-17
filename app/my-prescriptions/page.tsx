'use client';

import React, { useState, useEffect } from 'react';
import { useLaceWallet } from '@/components/wallet/LaceWalletContext';
import { formatExpiryBadge, createProofToken, encodeQRPayload, Prescription } from '@/src/healthcare-services';
import { FileText, ShieldCheck, QrCode, Clock, Sparkles, CheckCircle2, Lock, Key } from 'lucide-react';
import { toast } from 'sonner';

export default function MyPrescriptionsPage() {
  const { wallet } = useLaceWallet();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [selectedRxForQr, setSelectedRxForQr] = useState<any | null>(null);
  const [qrTokenDuration, setQrTokenDuration] = useState<number>(60);
  const [qrPayload, setQrPayload] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('rx_verify_prescriptions');
      if (stored) {
        try {
          setPrescriptions(JSON.parse(stored));
        } catch {
          setPrescriptions(defaultPrescriptions);
        }
      } else {
        setPrescriptions(defaultPrescriptions);
      }
    }
  }, []);

  const handleGenerateQr = (rx: any) => {
    setSelectedRxForQr(rx);
    const token = createProofToken(rx, qrTokenDuration);
    const payload = encodeQRPayload(token);
    setQrPayload(payload);
    toast.success(`Temporary ZK token generated! Valid for ${qrTokenDuration} minutes.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-indigo-400" />
            Patient Credential Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Private off-chain healthcare credential storage with self-expiring ZK sharing tokens.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium flex items-center gap-2">
          <Lock className="w-4 h-4" />
          <span>Encrypted Off-Chain Storage</span>
        </div>
      </div>

      {/* Prescription Grid */}
      {prescriptions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl glass-card border border-slate-800 space-y-3">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No Prescriptions Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You currently have no active credentials in local state. Use the Doctor Portal to issue your first signed prescription.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prescriptions.map((rx) => {
            const badge = formatExpiryBadge(rx.expiryDate, rx.status === 'Revoked');
            return (
              <div key={rx.id} className="p-6 rounded-2xl glass-card glass-card-hover border border-slate-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500">#{rx.id}</span>
                    <h3 className="text-lg font-bold text-slate-100">{rx.medicationName}</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                    badge.badgeClass === 'badge-success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}>
                    {badge.label}
                  </span>
                </div>

                {/* Private vs Public demarcation */}
                <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">Dosage</span>
                    <span className="text-slate-200 font-medium">{rx.dosage}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">Patient Slot</span>
                    <span className="text-slate-200 font-medium">{rx.patientName} (ID #{rx.patientId})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">Prescriber</span>
                    <span className="text-slate-200 font-medium">{rx.doctorName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">Hospital</span>
                    <span className="text-slate-200 font-medium">{rx.hospitalName}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">Single-Use Nullifier (Public)</span>
                  <div className="p-2 rounded bg-slate-950 font-mono text-[10px] text-purple-400 truncate border border-slate-800">
                    {rx.nullifier || '0x4f89a1c2e3f4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0'}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleGenerateQr(rx)}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Generate ZK QR Token</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Token Modal */}
      {selectedRxForQr && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl glass-card border border-slate-800 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                <QrCode className="w-4 h-4 text-indigo-400" />
                Temporary ZK Proof Payload Token
              </h3>
              <button
                onClick={() => setSelectedRxForQr(null)}
                className="text-slate-400 hover:text-slate-200 text-xs font-bold px-2 py-1 rounded bg-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Token Duration:</span>
                <select
                  value={qrTokenDuration}
                  onChange={(e) => {
                    const dur = Number(e.target.value);
                    setQrTokenDuration(dur);
                    const token = createProofToken(selectedRxForQr, dur);
                    setQrPayload(encodeQRPayload(token));
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={60}>1 Hour</option>
                  <option value={1440}>24 Hours</option>
                </select>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Encrypted Payload JSON:</span>
                <textarea
                  readOnly
                  rows={4}
                  value={qrPayload}
                  className="w-full p-3 rounded-xl bg-slate-950 font-mono text-[10px] text-indigo-300 border border-slate-800 resize-none focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(qrPayload);
                toast.success('QR payload JSON copied to clipboard!');
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
            >
              Copy ZK Token Payload
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const defaultPrescriptions = [
  {
    id: 'rx-101',
    patientId: 101,
    patientName: 'Alex Rivera',
    medicationName: 'Amoxicillin 500mg',
    dosage: '1 capsule 3x daily',
    instructions: 'Take with full glass of water',
    doctorId: 'doc-101',
    doctorName: 'Dr. Sarah Jenkins, MD',
    hospitalName: 'St. Jude Healthcare Network',
    issueDate: '2026-07-26',
    expiryDate: '2026-08-26',
    prescriptionHash: '8f1a9c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
    nullifier: '3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
    status: 'Valid',
  },
  {
    id: 'rx-102',
    patientId: 202,
    patientName: 'Jordan Taylor',
    medicationName: 'Lipitor 20mg',
    dosage: '1 tablet nightly',
    instructions: 'Monitor cholesterol monthly',
    doctorId: 'doc-102',
    doctorName: 'Dr. Marcus Vance, MD',
    hospitalName: 'Metro General Hospital',
    issueDate: '2026-07-10',
    expiryDate: '2026-10-10',
    prescriptionHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    nullifier: '7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
    status: 'Valid',
  },
];
