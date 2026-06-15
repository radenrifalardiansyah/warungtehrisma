import type { Metadata } from 'next';
import AdminSplashScreen from '@/components/AdminSplashScreen';

export const metadata: Metadata = {
  title: 'Dashboard Admin — Cemilan Teh Risma',
  robots: { index: false, follow: false },
  manifest: '/admin-manifest.webmanifest',
  themeColor: '#92400E',
  appleWebApp: {
    capable: true,
    title: 'Admin Panel',
    statusBarStyle: 'black-translucent',
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminSplashScreen />
      {children}
    </>
  );
}
