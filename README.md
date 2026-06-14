# Warung Teh Risma

Website toko online Warung Teh Risma — menu teh, makanan ringan, dan paket hemat dengan checkout via WhatsApp.

## Tech Stack

- **Next.js 15** + React 19
- **Tailwind CSS 3** — styling
- **Framer Motion 12** — animasi
- **Zustand 5** — cart state (persisted ke localStorage)
- **lucide-react** — ikon
- **react-hot-toast** — notifikasi

## Fitur

- Halaman beranda dengan Hero, Kategori, dan Produk Unggulan
- Halaman menu dengan filter kategori & pencarian
- Cart drawer dengan update quantity dan hapus item
- Checkout 3 langkah: isi data diri → konfirmasi pesanan → kirim via WhatsApp
- Efek tilt 3D pada card produk

## Struktur

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── products/page.tsx     # Halaman menu
│   └── checkout/page.tsx     # Checkout
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── ProductCard.tsx       # Card dengan efek tilt 3D
│   ├── Cart.tsx              # Drawer cart
│   ├── FeaturedSection.tsx
│   ├── CategoriesSection.tsx
│   └── Footer.tsx
└── lib/
    ├── store.ts              # Zustand cart store
    ├── products.ts           # Data 17 produk
    └── whatsapp.ts           # Format pesan & nomor WA
```

## Setup

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Konfigurasi Nomor WhatsApp

Edit variabel `WHATSAPP_NUMBER` di [src/lib/whatsapp.ts](src/lib/whatsapp.ts):

```ts
const WHATSAPP_NUMBER = "628xxxxxxxxxx"; // ganti dengan nomor aktif
```

## Scripts

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Development server |
| `npm run build` | Build produksi |
| `npm run start` | Jalankan build produksi |
| `npm run lint` | Cek linting |
