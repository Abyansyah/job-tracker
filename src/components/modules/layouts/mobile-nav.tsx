'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Sidebar } from './sidebar';

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold text-sm">JT</span>
        </div>
        <h1 className="text-lg font-bold text-slate-800">JobTracker</h1>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>
    </div>
  );
}
