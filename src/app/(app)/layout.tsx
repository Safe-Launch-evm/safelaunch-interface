import SiteHeader from '@/components/layouts/site-header';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Readonly<AppLayoutProps>) {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[url('/images/blur_bg.svg')] bg-cover bg-center bg-no-repeat">
      <SiteHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
