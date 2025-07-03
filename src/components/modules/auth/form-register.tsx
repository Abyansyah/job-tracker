'use client';

import type React from 'react';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Briefcase, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function FormRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { push } = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const promise = fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fullName, email, password }),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Terjadi kesalahan');
      }
      return data;
    });

    toast.promise(promise, {
      loading: 'Sedang memproses registrasi...',
      success: (data) => {
        setFullName('');
        setEmail('');
        setPassword('');
        setAcceptTerms(false);
        push('/login');
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
            <Label htmlFor="fullName" className="text-slate-700 font-medium">
              Nama Lengkap
            </Label>
            <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" required className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-medium">
              Email
            </Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" required className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" />
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
                placeholder="Minimal 8 karakter"
                required
                className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 pr-10"
              />
              <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-11 w-11 text-slate-400 hover:text-slate-600" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="terms" checked={acceptTerms} onCheckedChange={() => setAcceptTerms(!acceptTerms)} />
            <Label htmlFor="terms" className="text-sm text-slate-600">
              Saya setuju dengan{' '}
              <Link href="/terms" className="text-emerald-600 hover:text-emerald-700 hover:underline">
                Syarat & Ketentuan
              </Link>{' '}
              dan{' '}
              <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 hover:underline">
                Kebijakan Privasi
              </Link>
            </Label>
          </div>

          <Button type="submit" className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-medium" disabled={isLoading || !acceptTerms}>
            {isLoading ? 'Membuat akun...' : 'Daftar Sekarang'}
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
              Sudah punya akun?{' '}
              <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline">
                Login di sini
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </>
  );
}
