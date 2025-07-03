import FormRegister from '@/components/modules/auth/form-register';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import React from 'react';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white rounded-xl shadow-lg border-slate-200">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">Buat Akun Baru</CardTitle>
          <p className="text-slate-600 mt-2">Mulai lacak lamaran kerja Anda hari ini</p>
        </CardHeader>
        <FormRegister />
      </Card>
    </div>
  );
};

export default RegisterPage;
