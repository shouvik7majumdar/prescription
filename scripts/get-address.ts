import { resolveNetwork, getOrCreateSeed } from '../src/network.js';
import { createWallet, unshieldedToken } from '../src/wallet.js';

async function main() {
  const network = 'preprod';
  const { config: networkConfig } = resolveNetwork({ argv: ['node', 'script', '--network', 'preprod'] });
  const seed = getOrCreateSeed(network);
  console.log(`Preprod Seed: ${seed}`);
  
  console.log('Syncing wallet with Midnight Preprod...');
  const walletCtx = await createWallet({ network, networkConfig, seed });
  const address = walletCtx.unshieldedKeystore.getBech32Address().toString();
  console.log(`
DEPLOYER ADDRESS (PREPROD): ${address}
`);
  
  const state = await walletCtx.wallet.waitForSyncedState();
  const balance = state.unshielded.balances[unshieldedToken().raw] ?? 0n;
  console.log(`Balance: ${balance.toLocaleString()} tNight
`);
  
  await walletCtx.wallet.stop();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
