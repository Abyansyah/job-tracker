'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Briefcase, LogOut, Plus, User } from 'lucide-react';
import { toast } from 'sonner';

export const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Lamaran', href: '/jobs', icon: Briefcase },
];

export const bottomNavigation = [{ name: 'Profile', href: '/profile', icon: User }];

export function Sidebar() {
  const pathname = usePathname();

  const router = useRouter();

  const handleLogout = async () => {
    const promise = fetch('/api/auth/logout', { method: 'POST' }).then((res) => {
      if (!res.ok) throw new Error('Logout gagal');
      return res.json();
    });

    toast.promise(promise, {
      loading: 'Logging out...',
      success: () => {
        router.push('/login');
        return 'Logout berhasil!';
      },
      error: (err) => err.message,
    });
  };

  return (
    <div className="flex flex-col w-64 bg-white border-r border-slate-200 h-full">
      <div className="flex items-center px-6 py-4 border-b border-slate-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-bold text-slate-800">JobTracker</h1>
            <p className="text-xs text-slate-500">Lacak lamaran kerjamu</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <Button variant={isActive ? 'secondary' : 'ghost'} className={cn('w-full justify-start', isActive && 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50')}>
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}

        <div className="pt-4">
          <Link href={'/jobs'}>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Lamaran
            </Button>
          </Link>
        </div>
      </nav>

      <div className="px-4 py-4 border-t border-slate-200 space-y-2">
        {bottomNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <Button variant={isActive ? 'secondary' : 'ghost'} className={cn('w-full justify-start', isActive && 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50')}>
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
        <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
