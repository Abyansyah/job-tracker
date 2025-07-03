'use client';

import type React from 'react';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function FormLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const promise = fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Terjadi kesalahan');
      }
      router.push('/');
      router.refresh();
      return data;
    });

    toast.promise(promise, {
      loading: 'Sedang memproses login...',
      success: (data) => {
        return data.message;
      },
      error: (err) => {
        return err.message;
      },
      finally: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-medium">
              Email atau Username
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="nama@email.com"
              required
              className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Masukkan password"
                required
                className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 pr-10"
              />
              <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-11 w-11 hover:bg-transparent " onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline">
              Lupa password?
            </Link>
          </div> */}

          <Button type="submit" className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-medium" disabled={isLoading}>
            {isLoading ? 'Masuk...' : 'Login'}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">atau</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-slate-600">
              Belum punya akun?{' '}
              <Link href="/register" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline">
                Daftar di sini
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </>
  );
}
