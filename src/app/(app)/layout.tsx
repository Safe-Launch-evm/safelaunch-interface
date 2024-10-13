'use client';

import SiteHeader from '@/components/layouts/site-header';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Readonly<AppLayoutProps>) {
  return (
    <div className="relative flex min-h-screen w-full flex-col md:bg-[url('/background.png')] md:bg-cover md:bg-center md:bg-no-repeat">
      <SiteHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
