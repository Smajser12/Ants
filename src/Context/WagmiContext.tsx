// Rainbowkit imports
import { 
  RainbowKitProvider,
  darkTheme,
  connectorsForWallets
} from '@rainbow-me/rainbowkit';

import {
  coinbaseWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets';

import '@rainbow-me/rainbowkit/styles.css';

// Wagmi imports 
import { createConfig, createStorage, http, WagmiProvider } from 'wagmi';

// Custom imports
import { base } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const appName = "Terminal";
const projectId = "4013679cc640932acdd98f99d5b2da4b";

const connectors = connectorsForWallets([
  {
    groupName: 'Popular',
    wallets: [
      rabbyWallet,
      metaMaskWallet,
      walletConnectWallet,
      rainbowWallet,
      coinbaseWallet
    ],
  }
],
{
  projectId,
  appName
});

const config = createConfig({
  connectors,
  chains: [base],
  transports: {
    [base.id]: http()
  },
  storage: createStorage({ storage: window.localStorage })
});

// const configLocalhost = createConfig({
//   connectors,
//   chains: [localhost],
//   transports: {
//     [localhost.id]: http()
//   },
// });

// Wagmi client

const queryClient = new QueryClient();

export function WagmiContext({ children }: { children: ReactNode }) {
  return(
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={darkTheme({borderRadius: 'small'})}>
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
  )
}
