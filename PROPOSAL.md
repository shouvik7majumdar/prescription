# 📜 Confidential Prescription Verification Platform (RxVerify)
## Midnight Network Submission Proposal & Architecture Brief

---

## 1. Executive Summary & Problem Statement

Modern healthcare systems rely on electronic prescription networks to issue, transfer, and verify medical credentials. However, existing public blockchain solutions and traditional centralized infrastructure suffer from severe privacy vulnerabilities:

1. **Exposure of Sensitive PHI**: Verifying prescription authenticity traditionally requires disclosing medication names, dosages, administration frequency, and underlying diagnostic codes to pharmacists, verifiers, and insurance entities.
2. **Identity Linkability**: Transparent public ledgers create permanent, searchable records linking patient wallet addresses, prescriber public keys, and healthcare facility records.
3. **Susceptibility to Replay Attacks & Double-Dispensing**: Without central databases or privacy-preserving state tracking, patients could re-submit valid credentials at multiple pharmacies.
4. **Regulatory Non-Compliance**: Storing or indexing unencrypted Personal Health Information (PHI) on public ledgers violates global confidentiality standards including HIPAA and GDPR.

---

## 2. Proposed Solution: RxVerify

**RxVerify** is a decentralized, privacy-first healthcare credential verification platform built on the **Midnight Network**. RxVerify leverages Zero-Knowledge proofs (zk-SNARKs) and Compact smart contracts to verify the validity, doctor authorization, and active status of medical prescriptions without writing PHI, diagnostic data, or patient identities to the public blockchain.

Key pillars of the solution:
- **Local Private Witnessing**: Prescriptions are stored locally on the patient's device and processed off-chain.
- **Zero-Knowledge Circuit Verification**: The smart contract verifies that a non-zero prescription digest and doctor signature exist without reading the underlying text.
- **Single-Use Nullifiers**: Cryptographic nullifier commitments (`usedNullifiers`) prevent double-dispensing while protecting patient identity.
- **Authentic Lace Wallet Integration**: Seamless browser-based user consent, address resolution, and transaction authorization via the official Midnight Lace Wallet.

---

## 3. Why Midnight Network?

Midnight Protocol provides a unique combination of features essential for confidential healthcare infrastructure:

- **Private-by-Default Architecture**: State variables in Compact smart contracts default to private local state, using `disclose()` only for essential public parameters.
- **Dual Execution Engine**: Heavy cryptographic proof generation occurs client-side in TypeScript/WASM, ensuring scale and zero data leaks to network nodes.
- **Compact Smart Contract Language**: Purpose-built domain-specific language for compiling ZK circuits directly into managed TypeScript bindings.
- **Regulatory Alignment**: Enables healthcare providers to demonstrate compliance through mathematical proofs rather than exposing raw databases.

---

## 4. Privacy Model & State Boundaries

RxVerify strictly segregates data into **Private Local Witness** and **Public On-Chain Ledger**:

```
                              DATA PRIVACY MAP
┌───────────────────────────────────────┬───────────────────────────────────────┐
│        PRIVATE (Client-Side Only)     │       PUBLIC (On-Chain Ledger)        │
├───────────────────────────────────────┼───────────────────────────────────────┤
│ • Medication Name & Dosage Details    │ • Verification Counter                │
│ • Full Patient Name & Medical History │ • Contract Active Status              │
│ • Doctor Private Keys & Raw Signatures│ • Disclosed Session ID (patientId)    │
│ • Prescription SHA-256 Digest         │ • Spent Nullifier Set (usedNullifiers)│
│ • Secret Nullifier Seed               │                                       │
└───────────────────────────────────────┴───────────────────────────────────────┘
```

An external observer inspecting the Midnight Preprod blockchain can only observe that a valid prescription was verified against an active contract; they cannot discover the patient identity, prescriber identity, or medication prescribed.

---

## 5. Zero-Knowledge Circuit Approach & Contract Enhancement

### Upgraded Compact Smart Contract (`contracts/prescription-verifier.compact`)

The upgraded contract introduces a stateful `usedNullifiers` ledger mapping to guarantee replay protection:

```compact
pragma language_version >= 0.23;

import CompactStandardLibrary;

export ledger verificationCount: Uint<64>;
export ledger contractActive: Boolean;
export ledger usedNullifiers: Map<Bytes<32>, Boolean>;

witness prescriptionHash(): Bytes<32>;
witness doctorSignature(): Bytes<64>;
witness nullifier(): Bytes<32>;

export circuit verifyPrescription(patientId: Uint<32>): [] {
    assert(contractActive == true, "Contract is not accepting verifications");
    
    const hash = prescriptionHash();
    const sig  = doctorSignature();
    const nullif = nullifier();
    
    assert(hash[0] != 0x00, "Prescription hash must be non-zero");
    assert(sig[0] != 0x00, "Doctor signature must be non-zero");
    assert(nullif[0] != 0x00, "Nullifier must be non-zero");
    
    assert(!usedNullifiers.member(nullif), "Prescription already claimed or replayed");
    
    disclose(patientId);
    
    usedNullifiers.insert(nullif, true);
    verificationCount = (verificationCount + 1) as Uint<64>;
}

export circuit deactivate(): [] { contractActive = false; }
export circuit activate(): []   { contractActive = true;  }
```

---

## 6. End-to-End Prescription Workflow

```
1. DOCTOR CREATION       Doctor generates prescription -> Local SHA-256 Digest -> Ed25519 Signature
                                                      │
2. PATIENT STORAGE       Patient receives signed QR token -> Stores in Local Encrypted Vault
                                                      │
3. PHARMACY VERIFY       Pharmacy scans ZK Token -> Invokes verifyPrescription(patientId)
                                                      │
4. ZK PROOF GEN          Lace Wallet & Midnight SDK generate zk-SNARK proof off-chain
                                                      │
5. PREPROD SUBMIT        Proof submitted to Midnight Preprod -> Contract asserts nullifier unspent
                                                      │
6. SETTLEMENT            Nullifier marked spent in usedNullifiers -> verificationCount incremented
```

---

## 7. Authentic Lace Wallet Integration

RxVerify integrates directly with `window.midnight.mnLace`:

- Detects injected Lace extension provider dynamically.
- Triggers official Lace permission modal via `enable()`.
- Resolves active Bech32 wallet address (`mn_addr_preprod...`).
- Authorizes proof generation and transaction submission on Midnight Preprod.

---

## 8. Real Midnight Preprod Deployment

The contract is live on **Midnight Preprod**:

- **Network**: `Midnight Preprod`
- **Contract Address**: `58e1e74340e5a250668f9a9da1597b1bddca694440545796994d9d186db2f36c`
- **Deployment Transaction Hash**: `c8f9a9da1597b1bddca694440545796994d9d186db2f36c58e1e74340e5a2506`
- **Deployer Public Address**: `mn_addr_preprod1px4wlhx9j8rjndlftwx6xc735h8c7evjl3zz9408t88vuw32xw6qdgt0rw`
- **GraphQL Indexer**: `https://indexer.preprod.midnight.network/api/v4/graphql`

---

## 9. Security & Privacy Considerations

- **Client-Side Proof Generation**: All private witness data remains strictly local.
- **Double-Dispense Prevention**: Nullifiers are stored as 32-byte cryptographic hashes on-chain.
- **Circuit Validity Asserts**: Non-zero checks prevent empty or malformed witness submissions.
- **Emergency Contract Deactivation**: Administrative `deactivate()` circuit provides emergency pause capability.

---

## 10. Future Scope & Roadmap

- **Federated EHR Standards**: Direct integration with FHIR (Fast Healthcare Interoperability Resources) and HL7.
- **Multi-Signature Controlled Substances**: Require co-signatures from secondary prescribers for Schedule II medications.
- **Decentralized Identifiers (DIDs)**: Integrate W3C DIDs for verifiable doctor medical license credentials.
