'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Briefcase, Calendar, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { DashboardSkeleton } from './dashboard-loading';

export default function DashboardContent() {
  const { stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const statusBreakdown = stats?.statusBreakdown.map((item: any) => ({ ...item, value: Number(item.value) }));

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white rounded-xl shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Lamaran</CardTitle>
            <Briefcase className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{stats?.totalApplications}</div>
            <div className="flex items-center text-xs text-emerald-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +25% vs bulan lalu
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Jadwal Wawancara</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{stats?.interviews}</div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Tawaran Kerja</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{stats?.offers}</div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Ditolak</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{stats?.rejections}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white rounded-xl shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Aktivitas Lamaran</CardTitle>
            <p className="text-sm text-slate-500">Jumlah lamaran yang dikirim per bulan</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.monthlyApplications}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="applications" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Status Lamaran</CardTitle>
            <p className="text-sm text-slate-500">Breakdown status saat ini</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2} dataKey="value" nameKey="name">
                  {statusBreakdown.map((entry: any, index: any) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {statusBreakdown.map((item: any, index: any) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-800">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 bg-white rounded-xl shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Aktivitas Terbaru</CardTitle>
          <p className="text-sm text-slate-500">Lamaran terakhir yang ditambahkan</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentApplications.map((app: any, index: any) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{app.company}</p>
                    <p className="text-sm text-slate-500">{app.position}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge style={{ backgroundColor: app.statusColor, color: '#fff' }}>{app.status}</Badge>
                  <p className="text-xs text-slate-400 mt-1">{formatDistanceToNow(new Date(app.date), { addSuffix: true, locale: id })}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
