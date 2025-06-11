import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

// Define custom localhost chain
const customLocalhost = {
  id: 31337, // Use the chain ID reported by your local node
  name: 'Localhost',
  network: 'localhost',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['http://localhost:8545'] },
    public: { http: ['http://localhost:8545'] },
  },
  testnet: true,
};

export const config = getDefaultConfig({
  appName: 'Crypto Book Marketplace',
  projectId: 'YOUR_PROJECT_ID', // Replace with your actual WalletConnect project ID
  chains: [mainnet, sepolia, customLocalhost],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [customLocalhost.id]: http('http://localhost:8545'),
  },
  ssr: true,
});
