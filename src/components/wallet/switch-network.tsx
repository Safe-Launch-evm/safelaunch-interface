import { WalletContext } from '@/context/wallet-context';
import {
  WalletModalBody,
  WalletModalDescription,
  WalletModalFooter,
  WalletModalHeader,
  WalletModalTitle
} from './wallet-modal';
import { useSwitchChain } from 'wagmi';
import { useContext } from 'react';
import { Button } from '../ui/button';
import { siteConfig } from '@/config/site-config';

export function SwitchNetwork() {
  const { setSwitchChainDialog } = useContext(WalletContext);

  const { isSuccess, isError, isPending, switchChain } = useSwitchChain();

  const onClick = () => {
    switchChain({ chainId: siteConfig.chains.asset_chain });
    if (isSuccess) setSwitchChainDialog(false);
  };

  return (
    <>
      <WalletModalHeader>
        <WalletModalTitle>Switch Network</WalletModalTitle>
        <WalletModalDescription className="sr-only">Switch Network</WalletModalDescription>
      </WalletModalHeader>
      <WalletModalBody>
        <div className="flex w-full flex-col items-center justify-center gap-9 md:pt-5">
          <div className="relative flex size-[116px] items-center justify-center rounded-2xl border p-3">
            <img
              className="size-full overflow-hidden rounded-2xl"
              src={`/icons/a-chain.png`}
              alt="asset chain logo"
            />
            <img />
          </div>

          <div className="space-y-3.5 px-3.5 text-center sm:px-0">
            <h1 className="text-xl font-semibold">
              {isError ? 'Request Error' : isPending ? 'Approve in wallet' : ''}
            </h1>
            <Button variant={'secondary'} onClick={onClick}>
              Asset Chain Testnet
            </Button>
            <p className="text-balance text-sm text-muted-foreground">
              {isPending
                ? 'Accept connection request in your wallet'
                : 'This app doesn’t support your current network. Switch to an available option following to continue.'}
            </p>
          </div>
        </div>
      </WalletModalBody>
      <WalletModalFooter>
        <div className="h-0" />
      </WalletModalFooter>
    </>
  );
}
