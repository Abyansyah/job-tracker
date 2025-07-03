'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Lock, Save, Eye, EyeOff } from 'lucide-react';
import useSWR from 'swr';
import { toast } from 'sonner';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProfileContent() {
  const { data: user, error, mutate } = useSWR('/api/profile', fetcher);

  const [profileData, setProfileData] = useState({ name: '', email: '', no_telephone: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        no_telephone: user.no_telephone || '',
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingProfile(true);

    const promise = fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    }).then(async (res) => {
      if (!res.ok) throw new Error((await res.json()).message);
      return res.json();
    });

    toast.promise(promise, {
      loading: 'Menyimpan profil...',
      success: (updatedUser) => {
        mutate(updatedUser, false); // Update SWR cache tanpa re-fetch
        return 'Profil berhasil diperbarui!';
      },
      error: (err) => err.message,
      finally: () => setIsLoadingProfile(false),
    });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Password baru dan konfirmasi password tidak cocok!');
      return;
    }
    setIsLoadingPassword(true);

    const promise = fetch('/api/profile/change-password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }),
    }).then(async (res) => {
      if (!res.ok) throw new Error((await res.json()).message);
      return res.json();
    });

    toast.promise(promise, {
      loading: 'Mengubah password...',
      success: (data) => {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        return data.message;
      },
      error: (err) => err.message,
      finally: () => setIsLoadingPassword(false),
    });
  };

  if (error) return <div>Gagal memuat profil. Silakan coba lagi.</div>;
  if (!user) return <div>Memuat...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-white rounded-xl shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-800">
            <User className="w-5 h-5 mr-2" />
            Informasi Profil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="flex items-center space-x-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${profileData.name}&background=ecfdf5&color=047857`} />
                <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold text-slate-800">{profileData.name}</h3>
                <p className="text-slate-500">{profileData.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-slate-700 font-medium">
                  Nama Lengkap
                </Label>
                <Input id="fullName" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Email
                </Label>
                <Input id="email" type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="phone" className="text-slate-700 font-medium">
                  Nomor Telepon
                </Label>
                <Input id="phone" type="tel" value={profileData.no_telephone} onChange={(e) => setProfileData({ ...profileData, no_telephone: e.target.value })} />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600" disabled={isLoadingProfile}>
                <Save className="w-4 h-4 mr-2" />
                {isLoadingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white rounded-xl shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-800">
            <Lock className="w-5 h-5 mr-2" />
            Ubah Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Password Saat Ini</Label>
              <div className="relative">
                <Input id="currentPassword" type={showCurrentPassword ? 'text' : 'password'} value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required />
                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full w-10" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Password Baru</Label>
              <div className="relative">
                <Input id="newPassword" type={showNewPassword ? 'text' : 'password'} value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required />
                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full w-10" onClick={() => setShowNewPassword(!showNewPassword)}>
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
              <div className="relative">
                <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required />
                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full w-10" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600" disabled={isLoadingPassword}>
                <Lock className="w-4 h-4 mr-2" />
                {isLoadingPassword ? 'Mengubah...' : 'Ubah Password'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
