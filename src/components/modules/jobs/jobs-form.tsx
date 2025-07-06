'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CategoryManager } from './category-manager';
import { Bell, CalendarIcon, Send } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn, fetcher } from '@/lib/utils';
import { useCategories } from '@/hooks/use-categories';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import useSWR from 'swr';

interface JobFormProps {
  initialData?: any;
  onClose: () => void;
  mutate: () => void;
}

export function JobForm({ initialData, onClose, mutate }: JobFormProps) {
  const { data: user } = useSWR('/api/profile', fetcher);
  const [formData, setFormData] = useState({
    company_name: initialData?.company || '',
    position_applied: initialData?.position || '',
    url: initialData?.url || '',
    application_date: initialData?.applicationDate ? new Date(initialData.applicationDate) : undefined,
    interview_date: initialData?.interviewDate ? new Date(initialData.interviewDate) : undefined,
    notes: initialData?.notes || '',
    locationId: initialData?.locationId || null,
    statusId: initialData?.statusId || null,
    sourceId: initialData?.sourceId || null,
    is_notification_enabled: initialData?.is_notification_enabled || false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const { data: locations } = useCategories('locations');
  const { data: statuses } = useCategories('statuses');
  const { data: sources } = useCategories('sources');

  const interviewStatusId = 3;
  const isInterviewDateDisabled = formData.statusId !== interviewStatusId;
  const showNotificationToggle = formData.statusId === interviewStatusId && formData.interview_date;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      ...formData,
      is_notification_enabled: showNotificationToggle ? formData.is_notification_enabled : false,
    };

    if (payload.application_date) {
      const date = payload.application_date;
      payload.application_date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    }
    if (payload.interview_date) {
      const date = payload.interview_date;
      payload.interview_date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    }

    const url = initialData ? `/api/jobs/${initialData.id}` : '/api/jobs';
    const method = initialData ? 'PUT' : 'POST';

    const promise = fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
      return res.json();
    });

    toast.promise(promise, {
      loading: 'Saving job application...',
      success: () => {
        mutate();
        onClose();
        return 'Job application saved successfully!';
      },
      error: (err) => err.message,
      finally: () => setIsLoading(false),
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (value: string | null) => {
    const newStatusId = value ? parseInt(value) : null;
    if (newStatusId !== interviewStatusId) {
      setFormData((prev) => ({
        ...prev,
        statusId: newStatusId,
        interview_date: undefined,
        is_notification_enabled: false,
      }));
    } else {
      setFormData((prev) => ({ ...prev, statusId: newStatusId }));
    }
  };

  return (
    <div className="mobile-drawer-scroll custom-scrollbar">
      <form onSubmit={handleSubmit} className="space-y-6 pb-6">
        <div className="space-y-2">
          <Label htmlFor="company_name" className="text-slate-700 font-medium">
            Nama Perusahaan *
          </Label>
          <Input id="company_name" value={formData.company_name} onChange={(e) => handleInputChange('company_name', e.target.value)} placeholder="PT Teknologi Maju" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position_applied" className="text-slate-700 font-medium">
            Posisi yang Dilamar *
          </Label>
          <Input id="position_applied" value={formData.position_applied} onChange={(e) => handleInputChange('position_applied', e.target.value)} placeholder="Frontend Developer" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="url" className="text-slate-700 font-medium">
            URL Lowongan
          </Label>
          <Input id="url" type="url" value={formData.url} onChange={(e) => handleInputChange('url', e.target.value)} placeholder="https://linkedin.com/jobs/123456" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Tanggal Melamar *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !formData.application_date && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.application_date ? format(formData.application_date, 'dd MMM yyyy', { locale: id }) : <span>Pilih tanggal</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={formData.application_date} onSelect={(date) => handleInputChange('application_date', date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Tanggal Wawancara</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button disabled={isInterviewDateDisabled} variant="outline" className={cn('w-full justify-start text-left font-normal', !formData.interview_date && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.interview_date ? format(formData.interview_date, 'dd MMM yyyy', { locale: id }) : <span>Pilih tanggal</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={formData.interview_date} onSelect={(date) => handleInputChange('interview_date', date)} initialFocus disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-slate-700 font-medium">Lokasi</Label>
              <CategoryManager type="locations" />
            </div>
            <Select value={String(formData.locationId)} onValueChange={(value) => handleInputChange('locationId', parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih lokasi" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location: any) => (
                  <SelectItem key={location.id} value={String(location.id)}>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: location.color }} />
                      {location.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-slate-700 font-medium">Status</Label>
              <CategoryManager type="statuses" />
            </div>
            <Select value={String(formData.statusId)} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status: any) => (
                  <SelectItem key={status.id} value={String(status.id)}>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: status.color }} />
                      {status.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-slate-700 font-medium">Sumber</Label>
              <CategoryManager type="sources" />
            </div>
            <Select value={String(formData.sourceId)} onValueChange={(value) => handleInputChange('sourceId', parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih sumber" />
              </SelectTrigger>
              <SelectContent>
                {sources.map((source: any) => (
                  <SelectItem key={source.id} value={String(source.id)}>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: source.color }} />
                      {source.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {showNotificationToggle && (
          <>
            {user?.telegram_chat_id ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notification-switch" className="flex items-center font-medium text-emerald-800">
                    <Bell className="w-4 h-4 mr-2" />
                    Ingatkan Saya via Telegram
                  </Label>
                  <Switch id="notification-switch" checked={formData.is_notification_enabled} onCheckedChange={(checked) => handleInputChange('is_notification_enabled', checked)} className="data-[state=checked]:bg-emerald-600" />
                </div>
                <p className="text-xs text-emerald-700">Anda akan menerima notifikasi H-2 dan H-1 sebelum tanggal wawancara.</p>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
                <Send className="w-8 h-8 mx-auto text-amber-500 mb-2" />
                <h4 className="font-semibold text-amber-900">Hubungkan Telegram Terlebih Dahulu</h4>
                <p className="text-xs text-amber-800 mt-1 mb-3">Anda harus menghubungkan akun Telegram Anda di halaman profil untuk bisa mengaktifkan pengingat.</p>
                <Link href="/profile">
                  <Button variant="outline" className="bg-white border-amber-300 text-amber-800 hover:bg-white/80">
                    Pergi ke Halaman Profil
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-slate-700 font-medium">
            Catatan
          </Label>
          <Textarea id="notes" value={formData.notes} onChange={(e) => handleInputChange('notes', e.target.value)} placeholder="Tambahkan catatan tentang lamaran ini..." rows={4} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button type="submit" className="flex-1 bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : initialData ? 'Update Lamaran' : 'Simpan Lamaran'}
          </Button>
          <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
}
