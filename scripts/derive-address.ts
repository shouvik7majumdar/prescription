import { resolveNetwork, getOrCreateSeed } from '../src/network.js';
import { Buffer } from 'buffer';
import * as ledger from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { HDWallet, Roles, createKeystore } from '@midnight-ntwrk/wallet-sdk';

function deriveKeys(seed: string) {
  const hdWallet = HDWallet.fromSeed(Buffer.from(seed, 'hex'));
  if (hdWallet.type !== 'seedOk') throw new Error('Invalid seed');
  const result = hdWallet.hdWallet
    .selectAccount(0)
    .selectRoles([Roles.Zswap, Roles.NightExternal, Roles.Dust])
    .deriveKeysAt(0);
  if (result.type !== 'keysDerived') throw new Error('Key derivation failed');
  hdWallet.hdWallet.clear();
  return result.keys;
}

async function main() {
  const network = 'preprod';
  const { config: networkConfig } = resolveNetwork({ argv: ['node', 'script', '--network', 'preprod'] });
  setNetworkId(networkConfig.networkId);
  const seed = getOrCreateSeed(network);
  const keys = deriveKeys(seed);
  const keystore = createKeystore(keys[Roles.NightExternal], networkConfig.networkId);
  const address = keystore.getBech32Address().toString();
  
  console.log('\n=============================================================');
  console.log('MIDNIGHT PREPROD DEPLOYER ADDRESS:');
  console.log(address);
  console.log('SEED:', seed);
  console.log('FAUCET URL: https://midnight-tmnight-preprod.nethermind.dev');
  console.log('=============================================================\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
