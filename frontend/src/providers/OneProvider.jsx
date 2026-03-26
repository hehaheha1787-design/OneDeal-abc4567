"use client";
import { SuiClientProvider, WalletProvider } from "@onelabs/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@onelabs/dapp-kit/dist/index.css";

const queryClient = new QueryClient();

const networks = {
  testnet: { url: "https://rpc-testnet.onelabs.cc:443" },
};

export function OneProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default OneProvider;
