import TokenHeader from '@/components/layouts/token-header';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function TokenLayout({ children }: Readonly<AppLayoutProps>) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <TokenHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
