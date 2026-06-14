import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Program Reseller',
  description: 'Bergabung jadi reseller Cemilan Teh Risma! Komisi menarik, produk halal laris manis, support penuh dari kami. Daftar sekarang via WhatsApp.',
  keywords: [
    'reseller cemilan bogor', 'reseller keripik kimpul', 'bisnis cemilan rumahan',
    'jual cemilan online', 'reseller snack halal', 'bisnis sampingan bogor',
  ],
  openGraph: {
    title: 'Program Reseller | Cemilan Teh Risma',
    description: 'Raih penghasilan tambahan dengan menjadi reseller Cemilan Teh Risma. Komisi menarik, produk halal!',
    url: 'https://warungtehrisma-one.vercel.app/reseller',
  },
  alternates: {
    canonical: 'https://warungtehrisma-one.vercel.app/reseller',
  },
};

export default function ResellerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
