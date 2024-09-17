'use client';

// 1. Import modules
import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, State } from 'wagmi';
import { getConfig } from '@/lib/wagmi-config';
import WalletProvider from '@/context/wallet-context';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_SAFELAUNCH_GRAPQL_URL,
  cache: new InMemoryCache()
});

// 2. Define your Wagmi config
const config = getConfig();

// 3. Initialize your new QueryClient
const queryClient = new QueryClient();

// 4. Create your Wagmi provider
export function Web3Provider(props: {
  initialState: State | undefined;
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <ApolloProvider client={client}>
        <QueryClientProvider client={queryClient}>
          <WalletProvider>{props.children}</WalletProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </WagmiProvider>
  );
}
