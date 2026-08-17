// tests/privacy.test.ts
// Tests verifying the privacy model: private witnesses must never be disclosed without strict requirement.
import { describe, it, expect } from 'vitest';
import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Helper to hash prescription text (mirrors cli.ts logic)
function hashPrescription(text: string): Uint8Array {
  return new Uint8Array(createHash('sha256').update(text).digest());
}

// Helper to calculate nullifier hash for replay prevention
function calculateNullifier(hash: Uint8Array, secret: string): Uint8Array {
  return new Uint8Array(createHash('sha256').update(Buffer.concat([hash, Buffer.from(secret)])).digest());
}

// Helper to create a deterministic mock doctor signature
function mockDoctorSignature(hash: Uint8Array): Uint8Array {
  const sig = new Uint8Array(64);
  const half = createHash('sha256').update(Buffer.concat([Buffer.from('doctor-sig-v1:'), hash])).digest();
  sig.set(half, 0);
  sig.set(half, 32);
  return sig;
}

describe('Privacy Model & Nullifier Replay Protection', () => {
  it('prescription hash must be exactly 32 bytes (SHA-256)', () => {
    const hash = hashPrescription('Amoxicillin 500mg twice daily — Dr. Smith');
    expect(hash.length).toBe(32);
  });

  it('different prescriptions must produce different hashes', () => {
    const h1 = hashPrescription('Amoxicillin 500mg');
    const h2 = hashPrescription('Ibuprofen 200mg');
    expect(Buffer.from(h1).toString('hex')).not.toBe(Buffer.from(h2).toString('hex'));
  });

  it('nullifier must be 32 bytes derived from prescription hash and secret', () => {
    const hash = hashPrescription('Metformin 850mg');
    const nullifier = calculateNullifier(hash, 'patient-secret-123');
    expect(nullifier.length).toBe(32);
  });

  it('different secrets for same prescription must produce different nullifiers', () => {
    const hash = hashPrescription('Lipitor 20mg');
    const n1 = calculateNullifier(hash, 'secret-A');
    const n2 = calculateNullifier(hash, 'secret-B');
    expect(Buffer.from(n1).toString('hex')).not.toBe(Buffer.from(n2).toString('hex'));
  });

  it('doctor signature must be 64 bytes', () => {
    const hash = hashPrescription('Test prescription');
    const sig = mockDoctorSignature(hash);
    expect(sig.length).toBe(64);
  });

  it('doctor signature must be deterministic for same hash', () => {
    const hash = hashPrescription('Reproducible test');
    const sig1 = mockDoctorSignature(hash);
    const sig2 = mockDoctorSignature(hash);
    expect(Buffer.from(sig1).toString('hex')).toBe(Buffer.from(sig2).toString('hex'));
  });

  it('contract source must NOT contain disclose() on private prescription or signature fields', () => {
    const contractPath = path.resolve(__dirname, '../contracts/prescription-verifier.compact');
    const source = readFileSync(contractPath, 'utf-8');

    // prescriptionHash and doctorSignature must not be arguments to disclose()
    expect(source).not.toMatch(/disclose\(prescriptionHash/);
    expect(source).not.toMatch(/disclose\(doctorSignature/);
    expect(source).not.toMatch(/disclose\(hash\)/);
    expect(source).not.toMatch(/disclose\(sig\)/);
  });

  it('contract source discloses nullifier for on-chain replay protection', () => {
    const contractPath = path.resolve(__dirname, '../contracts/prescription-verifier.compact');
    const source = readFileSync(contractPath, 'utf-8');

    // nullifier should be explicitly disclosed to register on usedNullifiers Map
    expect(source).toMatch(/disclose\(nullifier\(\)\)/);
  });

  it('contract source must disclose patientId and nullifier', () => {
    const contractPath = path.resolve(__dirname, '../contracts/prescription-verifier.compact');
    const source = readFileSync(contractPath, 'utf-8');

    expect(source).toMatch(/disclose\(patientId\)/);
    const discloseCount = (source.match(/disclose\(/g) || []).length;
    expect(discloseCount).toBe(2);
  });

  it('verificationCount, contractActive, and usedNullifiers form the public ledger state', () => {
    const contractPath = path.resolve(__dirname, '../contracts/prescription-verifier.compact');
    const source = readFileSync(contractPath, 'utf-8');

    const ledgerExports = (source.match(/export ledger \w+:/g) || []);
    expect(ledgerExports).toHaveLength(3);
    expect(ledgerExports.some(l => l.includes('verificationCount'))).toBe(true);
    expect(ledgerExports.some(l => l.includes('contractActive'))).toBe(true);
    expect(ledgerExports.some(l => l.includes('usedNullifiers'))).toBe(true);
  });
});
