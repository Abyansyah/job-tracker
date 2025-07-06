'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Briefcase, CheckCircle, Facebook, Instagram, Linkedin, Target, Twitter } from 'lucide-react';
import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';

interface HomePageProps {
  isLoggedIn: boolean;
}

export default function HomePage({ isLoggedIn }: HomePageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: user, isLoading } = useSWR(isLoggedIn ? '/api/auth/me' : null, fetcher, {
    shouldRetryOnError: false,
  });

  const AuthButtons = () => {
    if (isLoggedIn && user) {
      return (
        <Link href="/dashboard">
          <Button className="bg-emerald-500 hover:bg-emerald-600">Masuk ke Dashboard</Button>
        </Link>
      );
    }

    return (
      <div className="flex items-center space-x-4">
        <Link href="/login">
          <Button variant="ghost" className="text-slate-600 hover:text-emerald-600">
            Login
          </Button>
        </Link>
        <Link href="/register">
          <Button className="bg-emerald-500 hover:bg-emerald-600">Sign Up</Button>
        </Link>
      </div>
    );
  };

  const MobileAuthButtons = () => {
    if (isLoggedIn && user) {
      return (
        <Link href="/dashboard">
          <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Masuk ke Dashboard</Button>
        </Link>
      );
    }

    return (
      <div className="flex flex-col space-y-2">
        <Link href="/login">
          <Button variant="ghost" className="w-full justify-start">
            Login
          </Button>
        </Link>
        <Link href="/register">
          <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Sign Up</Button>
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center cursor-pointer">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-slate-800">JobTracker</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-slate-600 hover:text-emerald-600 transition-colors">
                Features
              </Link>
              <Link href="#faq" className="text-slate-600 hover:text-emerald-600 transition-colors">
                FAQ
              </Link>
              <Link href="#about" className="text-slate-600 hover:text-emerald-600 transition-colors">
                About
              </Link>
            </div>

            <div className="hidden md:flex">
              <AuthButtons />
            </div>

            <Button variant="ghost" size="icon" className="md:hidden relative" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <div className="w-5 h-5 flex flex-col justify-center items-center">
                <span className={`block h-0.5 w-5 bg-slate-600 transform transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                <span className={`block h-0.5 w-5 bg-slate-600 transform transition-all duration-300 mt-1 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-5 bg-slate-600 transform transition-all duration-300 mt-1 ${mobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
              </div>
            </Button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200">
              <div className="flex flex-col space-y-4">
                <Link href="#features" className="text-slate-600 hover:text-emerald-600 transition-colors">
                  Features
                </Link>
                <Link href="#faq" className="text-slate-600 hover:text-emerald-600 transition-colors">
                  FAQ
                </Link>
                <Link href="#about" className="text-slate-600 hover:text-emerald-600 transition-colors">
                  About
                </Link>
                <div className="pt-4 border-t border-slate-200">
                  <MobileAuthButtons />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">✨ Kelola lamaran kerja dengan mudah</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight mb-6">
                Lacak Setiap Lamaran Kerjamu di <span className="text-emerald-600">Satu Tempat</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">Jangan biarkan lamaran kerjamu hilang begitu saja. Kelola, lacak, dan analisis progres pencarian kerjamu dengan dashboard yang powerful dan mudah digunakan.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-lg px-8 py-3">
                    Mulai Sekarang
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
                    Lihat Fitur
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-transform duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">JobTracker</h3>
                      <p className="text-xs text-slate-500">Dashboard</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-emerald-400 rounded-full"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-emerald-700">24</div>
                    <div className="text-xs text-emerald-600">Total Lamaran</div>
                    <div className="text-xs text-emerald-500 mt-1">+25% bulan ini</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-blue-700">5</div>
                    <div className="text-xs text-blue-600">Wawancara</div>
                    <div className="text-xs text-blue-500 mt-1">3 minggu ini</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-700">Aktivitas Bulanan</span>
                    <BarChart3 className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="flex items-end space-x-1 h-16">
                    {[8, 12, 6, 15, 9, 18, 14].map((height, index) => (
                      <div key={index} className="bg-emerald-400 rounded-t flex-1 transition-all duration-1000 hover:bg-emerald-500" style={{ height: `${height * 3}px` }} />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-700 mb-3">Lamaran Terbaru</div>
                  {[
                    { company: 'PT Tech Startup', status: 'Wawancara', color: 'bg-amber-400' },
                    { company: 'Digital Agency', status: 'Dilamar', color: 'bg-blue-400' },
                    { company: 'Software House', status: 'Tawaran', color: 'bg-emerald-400' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 ${item.color} rounded-full mr-3`}></div>
                        <div>
                          <div className="text-xs font-medium text-slate-700">{item.company}</div>
                          <div className="text-xs text-slate-500">{item.status}</div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-400">2d</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-200 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-blue-200 rounded-full opacity-40 animate-bounce"></div>

              <div className="absolute -top-8 left-4 bg-white rounded-lg shadow-lg p-3 transform rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                  <span className="text-xs font-medium text-slate-700">Lamaran Diterima!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Fitur Unggulan</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Semua yang kamu butuhkan untuk mengelola pencarian kerja dengan efektif</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white rounded-xl shadow-sm border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-slate-800">Dashboard Analitik</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Visualisasikan progres pencarian kerjamu dengan grafik dan metrik yang mudah dipahami. Lihat tren lamaran, tingkat respons, dan performa bulanan.</p>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-xl shadow-sm border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-slate-800">Manajemen Terpusat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Semua detail dari nama perusahaan, posisi, hingga catatan wawancara tersimpan rapi di satu tempat. Tidak ada lagi lamaran yang terlupakan.</p>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-xl shadow-sm border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-slate-800">Status Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Jangan pernah lupa status setiap lamaran. Dari "Dilamar", "Wawancara", hingga "Tawaran" - semua terlacak dengan jelas dan terorganisir.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">Mengapa JobTracker?</h2>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Pencarian kerja bisa menjadi proses yang melelahkan dan membingungkan. Seringkali kita kehilangan jejak lamaran yang sudah dikirim, lupa jadwal wawancara, atau tidak tahu seberapa efektif strategi pencarian kerja kita.
          </p>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            JobTracker hadir untuk menyelesaikan masalah tersebut. Dengan antarmuka yang intuitif dan fitur-fitur yang powerful, aplikasi ini membantu para pencari kerja untuk tetap terorganisir, produktif, dan fokus dalam mencapai tujuan
            karir mereka.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">1000+</div>
              <div className="text-slate-600">Pengguna Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">5000+</div>
              <div className="text-slate-600">Lamaran Terlacak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">95%</div>
              <div className="text-slate-600">Tingkat Kepuasan</div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Pertanyaan yang Sering Diajukan</h2>
            <p className="text-xl text-slate-600">Temukan jawaban untuk pertanyaan umum tentang JobTracker</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white rounded-lg border border-slate-200">
              <AccordionTrigger className="px-6 py-4 text-left font-semibold text-slate-800 hover:no-underline">Apakah JobTracker gratis untuk digunakan?</AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-slate-600">
                Ya, JobTracker menyediakan paket gratis dengan fitur dasar yang cukup untuk mengelola lamaran kerja Anda. Kami juga menyediakan paket premium dengan fitur tambahan seperti analitik lanjutan dan integrasi dengan platform
                lain.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white rounded-lg border border-slate-200">
              <AccordionTrigger className="px-6 py-4 text-left font-semibold text-slate-800 hover:no-underline">Bagaimana cara mengimpor data lamaran yang sudah ada?</AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-slate-600">
                Anda dapat mengimpor data lamaran dari file Excel atau CSV melalui fitur import di dashboard. Kami juga menyediakan template yang bisa Anda download untuk memudahkan proses import data.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white rounded-lg border border-slate-200">
              <AccordionTrigger className="px-6 py-4 text-left font-semibold text-slate-800 hover:no-underline">Apakah data saya aman di JobTracker?</AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-slate-600">
                Keamanan data adalah prioritas utama kami. Semua data dienkripsi dan disimpan dengan standar keamanan tinggi. Kami tidak akan membagikan informasi pribadi Anda kepada pihak ketiga tanpa persetujuan Anda.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white rounded-lg border border-slate-200">
              <AccordionTrigger className="px-6 py-4 text-left font-semibold text-slate-800 hover:no-underline">Bisakah saya mengakses JobTracker dari mobile?</AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-slate-600">
                Tentu saja! JobTracker dirancang responsif dan dapat diakses dengan sempurna dari smartphone, tablet, maupun desktop. Kami juga sedang mengembangkan aplikasi mobile native untuk pengalaman yang lebih optimal.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-white rounded-lg border border-slate-200">
              <AccordionTrigger className="px-6 py-4 text-left font-semibold text-slate-800 hover:no-underline">Bagaimana cara mendapatkan dukungan teknis?</AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-slate-600">
                Kami menyediakan berbagai channel dukungan termasuk email support, live chat, dan knowledge base yang komprehensif. Tim support kami siap membantu Anda 24/7 untuk menyelesaikan masalah teknis apapun.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold">JobTracker</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">Platform terdepan untuk mengelola dan melacak lamaran kerja. Bantu wujudkan karir impian Anda dengan tools yang tepat.</p>
              <div className="flex space-x-4">
                <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white">
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white">
                  <Linkedin className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="#features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 JobTracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
