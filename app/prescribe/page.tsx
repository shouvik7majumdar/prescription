'use client';

import React, { useState } from 'react';
import { useLaceWallet } from '@/components/wallet/LaceWalletContext';
import { AUTHORIZED_DOCTORS, AUTHORIZED_HOSPITALS, calculatePrescriptionHash, generateDoctorSignature, calculateNullifier } from '@/src/healthcare-services';
import { FilePlus2, ShieldCheck, Lock, CheckCircle2, Key, Info, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function PrescribePage() {
  const { wallet } = useLaceWallet();

  const [patientId, setPatientId] = useState<number>(101);
  const [patientName, setPatientName] = useState<string>('Alex Rivera');
  const [medicationName, setMedicationName] = useState<string>('Amoxicillin 500mg');
  const [dosage, setDosage] = useState<string>('1 capsule 3x daily with food');
  const [instructions, setInstructions] = useState<string>('Complete full 10-day course');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('doc-101');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('hosp-001');
  const [expiryDays, setExpiryDays] = useState<number>(30);
  const [isIssuing, setIsIssuing] = useState<boolean>(false);
  const [issuedRx, setIssuedRx] = useState<any | null>(null);

  const selectedDoctor = AUTHORIZED_DOCTORS.find((d) => d.id === selectedDoctorId) || AUTHORIZED_DOCTORS[0];
  const selectedHospital = AUTHORIZED_HOSPITALS.find((h) => h.id === selectedHospitalId) || AUTHORIZED_HOSPITALS[0];

  const issueDateStr = new Date().toISOString().split('T')[0];
  const expiryDateObj = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);
  const expiryDateStr = expiryDateObj.toISOString().split('T')[0];

  const handleIssuePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    setIsIssuing(true);

    try {
      // Calculate 32-byte SHA-256 prescription hash
      const hashHex = calculatePrescriptionHash({
        patientId,
        medicationName,
        dosage,
        doctorId: selectedDoctor.id,
        issueDate: issueDateStr,
        expiryDate: expiryDateStr,
      });
      const hashBytes = new Uint8Array(Buffer.from(hashHex, 'hex'));

      // Generate doctor digital signature (64 bytes hex pair)
      const doctorSig = generateDoctorSignature(hashHex, selectedDoctor.publicKey);

      // Generate single-use nullifier hash (32 bytes)
      const nullifierBytes = calculateNullifier(hashBytes, `patient-secret-${patientId}`);
      const nullifierHex = Buffer.from(nullifierBytes).toString('hex');

      const newRx = {
        id: `rx-${Date.now().toString().slice(-6)}`,
        patientId,
        patientName,
        medicationName,
        dosage,
        instructions,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        doctorLicense: selectedDoctor.licenseNumber,
        hospitalId: selectedHospital.id,
        hospitalName: selectedHospital.name,
        issueDate: issueDateStr,
        expiryDate: expiryDateStr,
        prescriptionHash: hashHex,
        doctorSignature: doctorSig,
        nullifier: nullifierHex,
        status: 'Valid',
        createdAt: Date.now(),
      };

      // Save to local storage for patient/pharmacy access
      const existing = JSON.parse(localStorage.getItem('rx_verify_prescriptions') || '[]');
      localStorage.setItem('rx_verify_prescriptions', JSON.stringify([newRx, ...existing]));

      setIssuedRx(newRx);
      toast.success(`Prescription #${newRx.id} issued & digitally signed!`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to issue prescription');
    } finally {
      setIsIssuing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <FilePlus2 className="w-6 h-6 text-blue-400" />
            Certified Prescriber Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Issue digitally signed, privacy-preserving prescriptions. PHI stays strictly off-chain.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Active Prescriber Allowlist</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleIssuePrescription} className="p-6 rounded-2xl glass-card border border-slate-800 space-y-5">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
                1. Patient & Medication Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Patient Name</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Patient Session Slot ID (1-9999)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={9999}
                    value={patientId}
                    onChange={(e) => setPatientId(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Medication Name & Strength</label>
                <input
                  type="text"
                  required
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g. Amoxicillin 500mg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Dosage & Administration</label>
                  <input
                    type="text"
                    required
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Validity Duration</label>
                  <select
                    value={expiryDays}
                    onChange={(e) => setExpiryDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value={7}>7 Days (Short Course)</option>
                    <option value={30}>30 Days (Standard 1-Month)</option>
                    <option value={90}>90 Days (3-Month Maintenance)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Instructions / Notes</label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
                2. Certified Prescriber Identity
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Select Prescribing Physician</label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    {AUTHORIZED_DOCTORS.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} ({doc.licenseNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hospital / Medical Network</label>
                  <select
                    value={selectedHospitalId}
                    onChange={(e) => setSelectedHospitalId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    {AUTHORIZED_HOSPITALS.map((hosp) => (
                      <option key={hosp.id} value={hosp.id}>
                        {hosp.name} ({hosp.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isIssuing}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Sign & Issue Confidential Prescription</span>
            </button>
          </form>
        </div>

        {/* Live Cryptographic Preview Sidebar */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>Cryptographic Output Preview</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Prescription Digest (SHA-256):</span>
                <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-[10px] text-blue-400 break-all border border-slate-800">
                  {calculatePrescriptionHash({
                    patientId,
                    medicationName,
                    dosage,
                    doctorId: selectedDoctor.id,
                    issueDate: issueDateStr,
                    expiryDate: expiryDateStr,
                  })}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Doctor Signature (64 Bytes):</span>
                <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-[10px] text-indigo-400 break-all border border-slate-800">
                  {generateDoctorSignature(
                    calculatePrescriptionHash({
                      patientId,
                      medicationName,
                      dosage,
                      doctorId: selectedDoctor.id,
                      issueDate: issueDateStr,
                      expiryDate: expiryDateStr,
                    }),
                    selectedDoctor.publicKey
                  ).slice(0, 64)}...
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Single-Use Nullifier (32 Bytes):</span>
                <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-[10px] text-purple-400 break-all border border-slate-800">
                  {Buffer.from(
                    calculateNullifier(
                      new Uint8Array(
                        Buffer.from(
                          calculatePrescriptionHash({
                            patientId,
                            medicationName,
                            dosage,
                            doctorId: selectedDoctor.id,
                            issueDate: issueDateStr,
                            expiryDate: expiryDateStr,
                          }),
                          'hex'
                        )
                      ),
                      `patient-secret-${patientId}`
                    )
                  ).toString('hex')}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                These cryptographic digests guarantee that medical information remains strictly off-chain while enabling 100% verifiable Zero-Knowledge proofs.
              </span>
            </div>
          </div>

          {issuedRx && (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 animate-in zoom-in-95">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Prescription Issued Successfully!</span>
              </div>
              <p className="text-[11px] text-emerald-200">
                Prescription ID: <strong>#{issuedRx.id}</strong>
              </p>
              <p className="text-[10px] text-slate-300">
                Available in Patient Credential Manager and Pharmacy Verifier.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
