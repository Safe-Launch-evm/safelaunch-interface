/* eslint-disable @next/next/no-img-element */
'use client';

import * as React from 'react';

import {
  WalletModalBody,
  WalletModalDescription,
  WalletModalFooter,
  WalletModalHeader,
  WalletModalTitle
} from '@/components/wallet/wallet-modal';
import { Button } from '@/components/ui/button';
import {
  type Connector,
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useBalance,
  useSignMessage
} from 'wagmi';
import { formatEther } from 'viem';
import {
  Check,
  ChevronLeft,
  CircleCheck,
  CircleX,
  Copy,
  Delete,
  ImagePlus,
  LoaderCircle,
  RotateCcw
} from 'lucide-react';
import { WalletContext } from '@/context/wallet-context';
import { Icon } from '../icons';
import { getNonce, getUser, registerUser, verifyNonce } from '@/lib/actions/user';
import { STATE_STATUS } from '@/types';
import Form, { useZodForm } from '../ui/form';
import { ProfileInput, profileSchema } from '@/lib/validations/profile-schema';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import Image from 'next/image';
import { uploadLogo } from '@/lib/actions/token';
import { truncate } from '@/lib/utils';
import { toast } from 'sonner';
import RegisterUserForm from './register-user-form';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const MODAL_CLOSE_DURATION = 320;

function ConnectWalletButton() {
  const simplekit = useWallet();
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  return (
    <Button
      onClick={simplekit.toggleModal}
      variant={simplekit.isConnected ? 'ghost' : 'default'}
      className={`${simplekit.isConnected ? 'font-light' : ''}`}
    >
      {simplekit.isConnected ? (
        <>
          {ensAvatar ? (
            <img src={ensAvatar} alt="ENS Avatar" />
          ) : (
            <img
              src={`https://avatar.vercel.sh/${address}?size=150`}
              alt="User gradient avatar"
              className="size-6 rounded-full"
            />
          )}
          {address && <span>{ensName ? `${ensName}` : simplekit.formattedAddress}</span>}
        </>
      ) : (
        'Connect Wallet'
      )}
    </Button>
  );
}

function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: userBalance } = useBalance({ address });
  const context = React.useContext(WalletContext);
  const formattedAddress = address?.slice(0, 6) + '•••' + address?.slice(-4);
  const formattedUserBalace = userBalance?.value
    ? parseFloat(formatEther(userBalance.value)).toFixed(4)
    : undefined;

  function handleDisconnect() {
    context.setOpen(false);
    setTimeout(() => {
      disconnect();
    }, MODAL_CLOSE_DURATION);
  }

  return (
    <>
      <WalletModalHeader>
        <WalletModalTitle>Connected</WalletModalTitle>
        <WalletModalDescription className="sr-only">
          Account modal for your connected Web3 wallet.
        </WalletModalDescription>
      </WalletModalHeader>
      <WalletModalBody className="h-[280px]">
        <div className="flex w-full flex-col items-center justify-center gap-8 md:pt-5">
          <div className="flex size-24 items-center justify-center">
            <img
              className="rounded-full"
              src={`https://avatar.vercel.sh/${address}?size=150`}
              alt="User gradient avatar"
            />
          </div>

          <div className="space-y-1 px-3.5 text-center sm:px-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-semibold">
                <div>{ensName ? `${ensName}` : formattedAddress}</div>
              </h1>
              <CopyAddressButton />
            </div>
            <p className="text-balance text-sm text-muted-foreground">
              {`${formattedUserBalace ?? '0.00'} RWA`}
            </p>
          </div>

          <Button
            className="w-full rounded-xl"
            variant={'destructive'}
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
        </div>
      </WalletModalBody>
    </>
  );
}

function WalletConnectors() {
  const context = React.useContext(WalletContext);

  return (
    <>
      <WalletModalHeader>
        <BackChevron />
        <WalletModalTitle>
          {context.pendingConnector?.name ?? 'Connect Wallet'}
        </WalletModalTitle>
        <WalletModalDescription className="sr-only">
          Connect your Web3 wallet or create a new one.
        </WalletModalDescription>
      </WalletModalHeader>
      <WalletModalBody className="h-[492px] md:h-auto">
        {context.pendingConnector ? <WalletConnecting /> : <WalletOptions />}
      </WalletModalBody>
      <WalletModalFooter>
        <div className="flex items-end justify-end">
          <Button>Close</Button>
        </div>
      </WalletModalFooter>
    </>
  );
}

function WalletConnecting() {
  const context = React.useContext(WalletContext);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-9 md:pt-5">
      {context.pendingConnector?.icon && (
        <div className="relative flex size-[116px] items-center justify-center rounded-2xl border p-3">
          <img
            src={context.pendingConnector?.icon}
            alt={context.pendingConnector?.name}
            className="size-full overflow-hidden rounded-2xl"
          />
          <img />
          {context.isConnectorError ? <RetryConnectorButton /> : null}
        </div>
      )}

      <div className="space-y-3.5 px-3.5 text-center sm:px-0">
        <h1 className="text-xl font-semibold">
          {context.isConnectorError ? 'Request Error' : 'Requesting Connection'}
        </h1>
        <p className="text-balance text-sm text-muted-foreground">
          {context.isConnectorError
            ? 'There was an error with the request. Click above to try again.'
            : `Open the ${context.pendingConnector?.name} browser extension to connect your wallet.`}
        </p>
      </div>
    </div>
  );
}

function WalletOptions() {
  const context = React.useContext(WalletContext);
  const { connectors, connect } = useConnectors();

  return (
    <div className="flex flex-col gap-3.5">
      {connectors.map(connector => (
        <WalletOption
          key={connector.uid}
          connector={connector}
          onClick={() => {
            context.setIsConnectorError(false);
            context.setPendingConnector(connector);
            connect({ connector });
          }}
        />
      ))}
    </div>
  );
}

function WalletOption(props: { connector: Connector; onClick: () => void }) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    async function checkReady() {
      const provider = await props.connector.getProvider();
      setReady(!!provider);
    }
    checkReady()
      .then(() => null)
      .catch(() => null);
  }, [props.connector]);

  return (
    <button
      disabled={!ready}
      onClick={props.onClick}
      className="group flex items-center justify-between rounded-lg border bg-[#242424] px-6 py-3 transition-colors duration-200 ease-linear hover:bg-card hover:shadow-dip disabled:pointer-events-none disabled:opacity-50"
    >
      <div className="flex items-center gap-6">
        {props.connector.icon && (
          <img
            src={props.connector.icon}
            alt={props.connector.name}
            className="size-8 overflow-hidden rounded-[6px]"
          />
        )}
        <p className="text-[1rem]/[1rem] font-medium text-muted group-hover:font-bold group-hover:text-foreground">
          {props.connector.name}
        </p>
      </div>
      {ready ? <ChevronRightIcon className="size-6" /> : null}
    </button>
  );
}

interface ISection {
  [key: string]: React.ReactNode;
}

function AuthSignMessage() {
  const { address } = useAccount();
  const context = React.useContext(WalletContext);
  const [status, setStatus] = React.useState<STATE_STATUS>(STATE_STATUS.IDLE);
  const [component, setComponent] = React.useState<number>(0);
  const { data, isError, isSuccess, signMessage } = useSignMessage();

  async function fetchNonce({ address }: { address: string }) {
    setStatus(STATE_STATUS.LOADING);

    const nonce: any = await getNonce({ address });
    // console.log('before', address);

    if (nonce.code !== 200) setStatus(STATE_STATUS.ERROR);

    // console.log('after', nonce);

    signMessage({
      message: `Signing into SafeLaunch: ${nonce.result}`
    });

    setStatus(STATE_STATUS.SUCCESS);
  }

  // async function verify({ address, data }: { address: string; data: any }) {
  //   setStatus(STATE_STATUS.LOADING);
  //   const token = await verifyNonce({ address, sig: data });
  //   if (!token) {
  //     setStatus(STATE_STATUS.ERROR);
  //     return;
  //   }
  //   setStatus(STATE_STATUS.SUCCESS);
  //   context.setOpenAuthDialog(false);
  //   return;
  // }

  async function verify({ address, data }: { address: string; data: any }) {
    setStatus(STATE_STATUS.LOADING);
    const token = await verifyNonce({ address, sig: data });
    if (!token) {
      setStatus(STATE_STATUS.ERROR);
      return;
    }

    const user = await getUser({ address });

    if (!user) {
      setStatus(STATE_STATUS.ERROR);
      return;
    }

    if (user.username === null) {
      setComponent(1);
      setStatus(STATE_STATUS.SUCCESS);
    } else {
      setStatus(STATE_STATUS.SUCCESS);
      context.setOpenAuthDialog(false);
    }
  }

  const onHandleClick = async () => {
    if (address) {
      await fetchNonce({ address });
    }
  };

  React.useEffect(() => {
    if (address && isSuccess) {
      verify({ address, data });
    }
  }, [address, isSuccess]);

  React.useEffect(() => {
    if (address) fetchNonce({ address });
  }, [address]);

  function RetrySignInButton() {
    return (
      <Button
        size="icon"
        variant="secondary"
        className="group absolute -bottom-2 -right-2 rounded-full bg-muted p-1.5 shadow"
        onClick={onHandleClick}
      >
        <RotateCcw className="size-4 transition-transform group-hover:-rotate-45" />
      </Button>
    );
  }

  function SignMessagePending() {
    return (
      <>
        <WalletModalHeader>
          <BackChevron />
          <WalletModalTitle>Sign in to SafeLaunch</WalletModalTitle>
          <WalletModalDescription className="sr-only">
            Sign your account.
          </WalletModalDescription>
        </WalletModalHeader>
        <WalletModalBody>
          <div className="flex w-full flex-col items-center justify-center gap-9 md:pt-5">
            <div className="relative flex size-[116px] items-center justify-center rounded-2xl border p-3">
              <img
                className="size-full overflow-hidden rounded-2xl"
                src={`https://avatar.vercel.sh/${address}?size=150`}
                alt="User gradient avatar"
              />
              <img />
              {isError ? (
                <RetrySignInButton />
              ) : status === STATE_STATUS.ERROR ? (
                <RetrySignInButton />
              ) : null}
            </div>

            <div className="space-y-3.5 px-3.5 text-center sm:px-0">
              <h1 className="text-xl font-semibold">
                {isError ? 'Request Error' : 'Requesting signing'}
              </h1>
              <p className="text-balance text-sm text-muted-foreground">
                {isError
                  ? 'There was an error with the request. Click above to try again.'
                  : `Sign the request to confirm your wallet.`}
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

  const components: ISection = {
    0: <SignMessagePending />,
    1: <RegisterUserForm />
  };

  return <>{components[component]}</>;
}

// type ImageProps = {
//   url: string;
//   image: string;
// };

// function RegisterUserForm() {
//   const { address } = useAccount();
//   const context = React.useContext(WalletContext);
//   const [status, setStatus] = React.useState<STATE_STATUS>(STATE_STATUS.IDLE);
//   const [uploadStatus, setUploadStatus] = React.useState(STATE_STATUS.IDLE);
//   const [imageSrc, setImageSrc] = React.useState<ImageProps | null>(null);

//   const form = useZodForm({
//     schema: profileSchema,
//     defaultValues: {
//       walletAddress: address,
//       profileImage: `https://avatar.vercel.sh/${address}?size=150`
//     }
//   });

//   const { setValue } = form;

//   React.useEffect(() => {
//     if (imageSrc) {
//       setValue('profileImage', imageSrc.url);
//     }
//   }, [imageSrc, setValue]);

//   async function onUpload(formData: any) {
//     setUploadStatus(STATE_STATUS.LOADING);
//     try {
//       const uploaded = await uploadLogo(formData);
//       if (uploaded.status !== 201) {
//         setImageSrc(null);
//         setUploadStatus(STATE_STATUS.ERROR);
//       }
//       setImageSrc(uploaded.result);
//       setUploadStatus(STATE_STATUS.SUCCESS);
//     } catch (error) {
//       setImageSrc(null);
//       setUploadStatus(STATE_STATUS.ERROR);
//     }
//   }

//   async function onSubmit(data: ProfileInput) {
//     setStatus(STATE_STATUS.LOADING);
//     try {
//       const result = await registerUser(data);
//       if (!result) {
//         setStatus(STATE_STATUS.ERROR);
//         toast.error('Opps!', { description: 'An error occurred' });
//         return;
//       }
//       toast.error('Success', { description: 'User profile updated' });
//       setStatus(STATE_STATUS.SUCCESS);
//       context.setOpenAuthDialog(false);
//     } catch (error) {
//       setStatus(STATE_STATUS.ERROR);
//       toast.error('Opps!', { description: 'An error occurred' });
//       return;
//     }
//   }

//   return (
//     <>
//       <WalletModalHeader>
//         <BackChevron />
//         <WalletModalTitle className="text-left">Setup profile</WalletModalTitle>
//         <WalletModalDescription className="sr-only">
//           {' '}
//           Profile modal to edit profile.
//         </WalletModalDescription>
//       </WalletModalHeader>
//       <WalletModalBody className="h-[400px] max-h-[500px]">
//         <Form form={form} onSubmit={form.handleSubmit(onSubmit)} className="w-full px-4">
//           <div className="flex flex-col gap-2 px-4 pt-6 text-[1.125rem]/[1.125rem]">
//             <span>Image</span>

//             <div className="flex items-center justify-center gap-4 pr-4">
//               <label
//                 htmlFor="file-upload"
//                 className="relative flex size-[64px] cursor-pointer items-center justify-center rounded-lg border disabled:cursor-not-allowed"
//               >
//                 {imageSrc ? (
//                   <Image
//                     src={imageSrc.url}
//                     alt="pre image uplod"
//                     width={64}
//                     height={64}
//                     className="size-[64px] rounded-lg bg-cover bg-center bg-no-repeat"
//                   />
//                 ) : (
//                   <>
//                     {uploadStatus === STATE_STATUS.LOADING ? (
//                       <LoaderCircle size={35} className="animate-spin" />
//                     ) : uploadStatus === STATE_STATUS.ERROR ? (
//                       <CircleX size={35} />
//                     ) : (
//                       <ImagePlus size={35} />
//                     )}
//                   </>
//                 )}
//                 <Input
//                   id="file-upload"
//                   type="file"
//                   className="sr-only"
//                   disabled={uploadStatus === STATE_STATUS.LOADING}
//                   {...form.register('image')}
//                   onChange={(e: any) => {
//                     const file = e.target.files[0];
//                     if (file) {
//                       const formData = new FormData();
//                       formData.append('image', file);
//                       formData.append('folder', 'avatar');
//                       onUpload(formData);
//                     }
//                   }}
//                 />
//                 {imageSrc ? (
//                   <Button
//                     size="icon"
//                     variant="secondary"
//                     className="group absolute -bottom-2 -right-2 rounded-full bg-muted p-1.5 shadow"
//                     // onClick={onDeleteImage}
//                   >
//                     <Delete className="size-4 transition-transform" />
//                   </Button>
//                 ) : null}
//               </label>
//               <div className="flex flex-col gap-1 text-[1.125rem]">
//                 <span> {imageSrc ? truncate(imageSrc.image, 32) : 'PNG, JPEG, max 5MB'}</span>
//               </div>
//             </div>
//           </div>

//           <div className="flex w-full flex-col gap-6">
//             <Input label="Username" placeholder="E.g: GG" {...form.register('username')} />
//             <Textarea placeholder="Enter text" label="Bio" {...form.register('bio')} />
//             <div className="flex items-center justify-end gap-4">
//               <Button
//                 type="button"
//                 variant={'ghost'}
//                 size={'sm'}
//                 className="text-foreground"
//                 onClick={() => context.setOpenAuthDialog(false)}
//               >
//                 Skip
//               </Button>
//               <Button type={'submit'} size={'sm'} disabled={status === STATE_STATUS.LOADING}>
//                 {status === STATE_STATUS.LOADING ? <LoaderCircle size={20} /> : null}
//                 Save
//               </Button>
//             </div>
//           </div>
//         </Form>
//       </WalletModalBody>
//     </>
//   );
// }
function CopyAddressButton() {
  const { address } = useAccount();
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (copied) setCopied(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [copied, setCopied]);

  async function handleCopy() {
    setCopied(true);
    await navigator.clipboard.writeText(address!);
  }

  return (
    <button onClick={handleCopy}>
      {copied ? (
        <CircleCheck className="size-4 text-primary" strokeWidth={4} />
      ) : (
        <Copy className="size-4" strokeWidth={4} />
      )}
    </button>
  );
}

export function BackChevron() {
  const context = React.useContext(WalletContext);

  if (!context.pendingConnector) {
    return null;
  }

  function handleClick() {
    context.setIsConnectorError(false);
    context.setPendingConnector(null);
  }

  return (
    <button
      className="absolute left-[26px] top-[42px] z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground md:top-[26px]"
      onClick={handleClick}
    >
      <ChevronLeft className="size-4" />
      <span className="sr-only">Cancel connection</span>
    </button>
  );
}

function RetryConnectorButton() {
  const context = React.useContext(WalletContext);
  const { connect } = useConnect({
    mutation: {
      onError: () => context.setIsConnectorError(true)
    }
  });

  function handleClick() {
    if (context.pendingConnector) {
      context.setIsConnectorError(false);
      connect({ connector: context.pendingConnector });
    }
  }

  return (
    <Button
      size="icon"
      variant="secondary"
      className="group absolute -bottom-2 -right-2 rounded-full bg-muted p-1.5 shadow"
      onClick={handleClick}
    >
      <RotateCcw className="size-4 transition-transform group-hover:-rotate-45" />
    </Button>
  );
}

function useConnectors() {
  const context = React.useContext(WalletContext);
  const { connect, connectors } = useConnect({
    mutation: {
      onError: () => context.setIsConnectorError(true)
    }
  });

  const sortedConnectors = React.useMemo(() => {
    let metaMaskConnector: Connector | undefined;
    let injectedConnector: Connector | undefined;

    const formattedConnectors = connectors.reduce((acc: Array<Connector>, curr) => {
      console.log(curr.id);
      switch (curr.id) {
        case 'metaMaskSDK':
          metaMaskConnector = {
            ...curr,
            icon: 'https://utfs.io/f/be0bd88f-ce87-4cbc-b2e5-c578fa866173-sq4a0b.png'
          };
          return acc;
        case 'metaMask':
          injectedConnector = {
            ...curr,
            icon: 'https://utfs.io/f/be0bd88f-ce87-4cbc-b2e5-c578fa866173-sq4a0b.png'
          };
          return acc;
        case 'safe':
          acc.push({
            ...curr,
            icon: 'https://utfs.io/f/164ea200-3e15-4a9b-9ce5-a397894c442a-awpd29.png'
          });
          return acc;
        case 'coinbaseWalletSDK':
          acc.push({
            ...curr,
            icon: 'https://utfs.io/f/53e47f86-5f12-404f-a98b-19dc7b760333-chngxw.png'
          });
          return acc;
        case 'walletConnect':
          acc.push({
            ...curr,
            icon: 'https://utfs.io/f/5bfaa4d1-b872-48a7-9d37-c2517d4fc07a-utlf4g.png'
          });
          return acc;
        default:
          acc.unshift(curr);
          return acc;
      }
    }, []);

    if (
      metaMaskConnector &&
      !formattedConnectors.find(
        ({ id }) => id === 'io.metamask' || id === 'io.metamask.mobile' || id === 'injected'
      )
    ) {
      return [metaMaskConnector, ...formattedConnectors];
    }

    if (injectedConnector) {
      const nonMetaMaskConnectors = formattedConnectors.filter(
        ({ id }) => id !== 'io.metamask' && id !== 'io.metamask.mobile'
      );
      return [injectedConnector, ...nonMetaMaskConnectors];
    }
    return formattedConnectors;
  }, [connectors]);

  return { connectors: sortedConnectors, connect };
}

/*
 * This hook can be moved to a separate file
 * if desired (src/hooks/use-simple-kit.tsx).
 */
function useWallet() {
  const { address } = useAccount();
  const context = React.useContext(WalletContext);

  const isModalOpen = context.open;
  const isConnected = address && !context.pendingConnector;
  const formattedAddress = address?.slice(0, 6) + '•••' + address?.slice(-4);

  function open() {
    context.setOpen(true);
  }

  function close() {
    context.setOpen(false);
  }

  function toggleModal() {
    context.setOpen(prevState => !prevState);
  }

  return {
    isModalOpen,
    isConnected,
    formattedAddress,
    open,
    close,
    toggleModal
  };
}

export { ConnectWalletButton, useWallet, WalletConnectors, Account, AuthSignMessage };
