import { MobileNav } from '@/components/modules/layouts/mobile-nav';
import { Sidebar } from '@/components/modules/layouts/sidebar';
import { TopBar } from '@/components/modules/layouts/top-bar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="lg:hidden">
          <MobileNav />
        </div>

        <TopBar />

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
