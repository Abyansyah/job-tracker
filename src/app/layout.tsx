import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Job Tracker',
    template: '%s | Job Tracker',
  },
  description: 'A simple job tracking application to help you manage your job applications and interviews.',
  keywords: [
    'job tracker',
    'job application',
    'job interview',
    'job management',
    'job search',
    'job tracking',
    'job application tracker',
    'job interview tracker',
    'job management app',
    'job search app',
    'job application management',
    'job interview management',
    'job search management',
    'job application organizer',
    'job interview organizer',
  ],
  authors: [
    {
      name: 'Ahmad Abyansyah',
      url: 'https://github.com/Abyansyah',
    },
  ],
  creator: 'Ahmad Abyansyah',
  openGraph: {
    title: 'Job Tracker',
    description: 'A simple job tracking application to help you manage your job applications and interviews.',
    url: 'https://job-tracker-ahmadabyan.vercel.app/',
    siteName: 'Job Tracker',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Job Tracker',
    description: 'A simple job tracking application to help you manage your job applications and interviews.',
    creator: '@abyansyah',
    site: '@job_tracker',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
