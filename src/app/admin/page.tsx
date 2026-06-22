'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  LogOut, RefreshCw, MessageCircle, Eye, Smartphone, Monitor,
  TrendingUp, BarChart2, Home, ShoppingCart, Plus, Minus,
  ChevronLeft, FileDown, Send, CheckCircle2, Loader2, User, Phone,
  Trash2, Tag,
} from 'lucide-react';
import { products } from '@/lib/products';
import { formatCurrency, WHATSAPP_NUMBER } from '@/lib/whatsapp';

// ─── Analytics helpers ───────────────────────────────────────────────────────

const PAGE_LABELS: Record<string, string> = {
  '/':         'Beranda',
  '/products': 'Menu Produk',
  '/reseller': 'Reseller',
  '/panduan':  'Panduan',
  '/kontak':   'Kontak',
  '/checkout': 'Checkout',
};
function pageLabel(p: string) { return PAGE_LABELS[p] ?? p; }

type DailyRow = { date: string; views: number; visitors: number };

function MiniBarChart({ data }: { data: DailyRow[] }) {
  const maxVal = Math.max(...data.map(d => d.views), 1);
  const W = 36, GAP = 4, H = 64, LABEL_H = 14;
  const totalW = data.length * (W + GAP);
  return (
    <svg width="100%" viewBox={`0 0 ${totalW} ${H + LABEL_H}`} preserveAspectRatio="none">
      {data.map((d, i) => {
        const barH = Math.max((d.views / maxVal) * H, d.views > 0 ? 4 : 2);
        const x = i * (W + GAP);
        return (
          <g key={i}>
            <rect x={x} y={H - barH} width={W} height={barH} rx="4"
              fill={i === data.length - 1 ? '#D97706' : '#FDE68A'} />
            {d.views > 0 && (
              <text x={x + W / 2} y={H - barH - 3} textAnchor="middle" fontSize="8" fill="#92400E" fontWeight="600">
                {d.views}
              </text>
            )}
            <text x={x + W / 2} y={H + LABEL_H - 2} textAnchor="middle" fontSize="8" fill="#B45309">
              {d.date.slice(5)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function DonutChart({ mobile, desktop }: { mobile: number; desktop: number }) {
  const total = mobile + desktop;
  if (total === 0) return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="28" fill="none" stroke="#FDE68A" strokeWidth="12" />
      <text x="40" y="44" textAnchor="middle" fontSize="10" fill="#B45309">–</text>
    </svg>
  );
  const r = 28, cx = 40, cy = 40, circ = 2 * Math.PI * r;
  const mArc = (mobile / total) * circ;
  const mPct = Math.round((mobile / total) * 100);
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#FDE68A" strokeWidth="12" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#D97706" strokeWidth="12"
        strokeDasharray={`${mArc} ${circ - mArc}`} transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="butt" />
      <text x={cx} y={cy - 3} textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400E">{mPct}%</text>
      <text x={cx} y={cy + 9} textAnchor="middle" fontSize="7" fill="#B45309">mobile</text>
    </svg>
  );
}

// ─── POS / Invoice helpers ───────────────────────────────────────────────────

type CartEntry = { productId: string; qty: number };
type PosView   = 'products' | 'cart' | 'done';
type Category  = 'semua' | 'mie' | 'keripik' | 'paket';

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: 'semua',   label: 'Semua',   emoji: '🛍️' },
  { id: 'mie',     label: 'Mie',     emoji: '🍝' },
  { id: 'keripik', label: 'Keripik', emoji: '🥔' },
  { id: 'paket',   label: 'Paket',   emoji: '🎁' },
];

function normalizePhone(raw: string): string {
  const d = raw.replace(/\D/g, '');
  if (d.startsWith('62')) return d;
  if (d.startsWith('0'))  return '62' + d.slice(1);
  return '62' + d;
}

function formatWAMessage(
  custName: string,
  invoiceNo: string,
  total: number,
): string {
  const tel = WHATSAPP_NUMBER.replace(/^62/, '0').replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3');
  return `Halo *${custName}*! 👋\n\nBerikut invoice pesanan Anda dari *Cemilan Teh Risma* 🧾\n\nNo. Invoice : *${invoiceNo}*\nTotal Bayar : *${formatCurrency(total)}*\n\nDetail lengkap ada di file PDF invoice yang terlampir ya.\n\nTerima kasih sudah pesan! 🙏\n_Cemilan Teh Risma · 📞 ${tel}_`.trim();
}

// ─── POS Product Card ────────────────────────────────────────────────────────

function ProductCard({
  product, qty, onAdd, onMinus,
}: {
  product: (typeof products)[0];
  qty:     number;
  onAdd:   () => void;
  onMinus: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-amber-100 flex flex-col select-none">
      {/* Colored top */}
      <div
        className="relative flex items-center justify-center pt-4 pb-3"
        style={{ background: `linear-gradient(135deg, ${product.bgColor}ee, ${product.bgColor}aa)` }}
        onClick={onAdd}
      >
        <span className="text-4xl drop-shadow">{product.emoji}</span>
        {/* Qty badge */}
        {qty > 0 && (
          <div className="absolute top-1.5 right-1.5 min-w-[22px] h-[22px] rounded-full bg-white text-amber-700 text-xs font-black flex items-center justify-center px-1 shadow">
            {qty}
          </div>
        )}
        {/* "Tap to add" hint when qty = 0 */}
        {qty === 0 && (
          <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-white/30 border border-white/60 flex items-center justify-center">
            <Plus size={13} className="text-white" strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-2.5 pt-2 pb-2.5 flex flex-col flex-1">
        <p className="text-xs font-bold text-amber-900 leading-tight line-clamp-2 flex-1">{product.name}</p>
        <p className="text-[10px] text-amber-500/70 mt-0.5">{product.weight}</p>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs font-black text-amber-700">{formatCurrency(product.price)}</span>
          {qty > 0 ? (
            <div className="flex items-center gap-1">
              <button
                onClick={e => { e.stopPropagation(); onMinus(); }}
                className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center active:bg-amber-200">
                <Minus size={11} strokeWidth={2.5} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); onAdd(); }}
                className="w-6 h-6 rounded-full text-white flex items-center justify-center"
                style={{ background: '#D97706' }}>
                <Plus size={11} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <button
              onClick={onAdd}
              className="w-7 h-7 rounded-full text-white flex items-center justify-center shadow"
              style={{ background: 'linear-gradient(135deg,#D97706,#EA580C)' }}>
              <Plus size={13} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function AdminPage() {
  // Auth
  const [authed,   setAuthed]   = useState(false);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [creds,    setCreds]    = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [stats,    setStats]    = useState<Record<string, unknown> | null>(null);
  const [statsErr, setStatsErr] = useState('');

  // Tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pos'>('dashboard');

  // POS
  const [posView,    setPosView]    = useState<PosView>('products');
  const [activeCat,  setActiveCat]  = useState<Category>('semua');
  const [cart,       setCart]       = useState<CartEntry[]>(() => products.map(p => ({ productId: p.id, qty: 0 })));
  const [custName,      setCustName]      = useState('');
  const [custPhone,     setCustPhone]     = useState('');
  const [discountType,  setDiscountType]  = useState<'percent' | 'nominal'>('percent');
  const [discountRaw,   setDiscountRaw]   = useState('');
  const [pdfLoading,    setPdfLoading]    = useState(false);
  const [pdfDone,       setPdfDone]       = useState(false);
  const [pdfErr,        setPdfErr]        = useState('');
  const [invoiceNo,     setInvoiceNo]     = useState('');

  // Cart calculations
  const cartItems = cart.filter(i => i.qty > 0);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartSubtotal = cartItems.reduce((s, i) => {
    const p = products.find(pr => pr.id === i.productId);
    return s + (p?.price ?? 0) * i.qty;
  }, 0);

  // Discount
  const discountNum    = parseFloat(discountRaw) || 0;
  const discountAmount = discountType === 'percent'
    ? Math.min(Math.round(cartSubtotal * discountNum / 100), cartSubtotal)
    : Math.min(discountNum, cartSubtotal);
  const discountLabel  = discountType === 'percent'
    ? `${discountNum}%`
    : formatCurrency(discountAmount);
  const discountInfo   = discountAmount > 0
    ? { amount: discountAmount, label: discountLabel }
    : undefined;
  const cartTotal  = cartSubtotal - discountAmount;
  const hasCart = cartItems.length > 0;

  // POS actions
  const addToCart = (productId: string) => {
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, qty: i.qty + 1 } : i));
  };
  const removeFromCart = (productId: string) => {
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, qty: Math.max(0, i.qty - 1) } : i));
  };
  const clearCart = () => {
    setCart(products.map(p => ({ productId: p.id, qty: 0 })));
  };
  const resetPOS = () => {
    setPosView('products');
    setActiveCat('semua');
    clearCart();
    setCustName('');
    setCustPhone('');
    setDiscountType('percent');
    setDiscountRaw('');
    setPdfLoading(false);
    setPdfDone(false);
    setPdfErr('');
    setInvoiceNo('');
  };

  const downloadPdf = async () => {
    setPdfLoading(true);
    setPdfErr('');
    try {
      const now  = new Date();
      const pad  = (n: number) => n.toString().padStart(2, '0');
      const invNo = `INV-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
      const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

      const items = cartItems.map(i => {
        const p = products.find(pr => pr.id === i.productId)!;
        return { name: p.name, weight: p.weight, qty: i.qty, price: p.price, subtotal: p.price * i.qty };
      });

      const res = await fetch('/api/admin/invoice-pdf', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceNo: invNo, date: dateStr,
          customerName: custName, customerPhone: custPhone,
          items,
          subtotal: cartSubtotal,
          discount: discountInfo,
          total: cartTotal,
          logo: '', halalLogo: '',
        }),
      });
      if (!res.ok) throw new Error('server error');

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `Invoice-${invNo}-${custName.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setInvoiceNo(invNo);
      setPdfDone(true);
    } catch {
      setPdfErr('Gagal membuat PDF, coba lagi.');
    } finally {
      setPdfLoading(false);
    }
  };

  const openWA = () => {
    const phone = normalizePhone(custPhone);
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(formatWAMessage(custName, invoiceNo, cartTotal))}`, '_blank');
    setPosView('done');
  };

  // Analytics
  const fetchStats = useCallback(async (authHeader?: string) => {
    setLoading(true); setStatsErr('');
    try {
      const token = authHeader ?? creds;
      const res = await fetch('/api/admin/stats', {
        headers: token ? { 'x-admin-auth': token } : {},
      });
      if (res.ok) setStats(await res.json());
      else if (res.status === 500) setStatsErr('Gagal memuat data. Pastikan Firebase sudah dikonfigurasi.');
      else setStatsErr('Sesi habis. Silakan login ulang.');
    } catch { setStatsErr('Gagal memuat data.'); }
    setLoading(false);
  }, [creds]);

  useEffect(() => {
    fetch('/api/admin/stats').then(r => {
      if (r.ok) { setAuthed(true); r.json().then(setStats); }
      setChecking(false);
    }).catch(() => setChecking(false));
  }, []);

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoginErr('');
    const res = await fetch('/api/admin/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const h = `${username}:${password}`;
      setCreds(h); setAuthed(true); fetchStats(h);
    } else setLoginErr('Username atau password salah.');
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthed(false); setStats(null);
  };

  const sendWA = () => {
    const s = stats as Record<string, Record<string, unknown> | unknown[] | null> | null;
    const total     = (s?.stats as Record<string,unknown>)?.visitors ?? '–';
    const pageViews = (s?.stats as Record<string,unknown>)?.pageViews ?? '–';
    const devArr    = (s?.devices as unknown[]) ?? [];
    const mobile    = (devArr.find((d:unknown) => (d as Record<string,string>).type==='mobile')  as Record<string,number>|undefined)?.count ?? 0;
    const desktop   = (devArr.find((d:unknown) => (d as Record<string,string>).type==='desktop') as Record<string,number>|undefined)?.count ?? 0;
    const topPages  = ((s?.paths as unknown[]) ?? []).slice(0,3).map((p:unknown,i:number) => {
      const pg = p as Record<string,unknown>;
      return `${i+1}. ${pageLabel(pg.path as string)} — ${pg.visitors}x`;
    }).join('\n');
    const date = new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
    const msg = `*Rekap Cemilan Teh Risma*\n_${date}_\n\n*Pengunjung:* ${total}\n*Halaman Dibuka:* ${pageViews}\n*Mobile:* ${mobile}  |  *Desktop:* ${desktop}\n`+(topPages?`\n*Terpopuler:*\n${topPages}\n`:'')+`\n_Dashboard Cemilan Teh Risma_`;
    window.open(`https://wa.me/6281212132014?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (checking) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFFBF5' }}>
      <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // ── Login ──────────────────────────────────────────────────────────────────
  if (!authed) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#FFFBF5' }}>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-amber-100 p-8">
        <div className="flex flex-col items-center mb-6">
          <Image src="/icon-192.png" alt="Cemilan Teh Risma" width={64} height={64} className="rounded-2xl shadow mb-3" />
          <p className="font-bold text-amber-900 text-sm">Dashboard Admin</p>
          <p className="text-amber-600/60 text-xs">Cemilan Teh Risma</p>
        </div>
        <form onSubmit={login} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-amber-700 mb-1.5">Username</label>
            <input type="text" value={username} onChange={e=>setUsername(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-amber-200 text-sm text-amber-900 focus:outline-none focus:border-amber-400 bg-amber-50/50"
              placeholder="Username" autoComplete="username" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-700 mb-1.5">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-amber-200 text-sm text-amber-900 focus:outline-none focus:border-amber-400 bg-amber-50/50"
              placeholder="Password" autoComplete="current-password" />
          </div>
          {loginErr && <p className="text-red-500 text-xs">{loginErr}</p>}
          <button type="submit"
            className="w-full py-3 rounded-xl text-sm font-bold text-white shadow transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#D97706,#EA580C)' }}>
            Masuk
          </button>
        </form>
      </div>
    </div>
  );

  // ── Analytics data ─────────────────────────────────────────────────────────
  const s          = stats as Record<string,Record<string,unknown>|unknown[]|null>|null;
  const total      = (s?.stats as Record<string,unknown>)?.visitors  as number|undefined;
  const views      = (s?.stats as Record<string,unknown>)?.pageViews as number|undefined;
  const devArr     = (s?.devices as unknown[]) ?? [];
  const mobile     = (devArr.find((d:unknown)=>(d as Record<string,string>).type==='mobile')  as Record<string,number>|undefined)?.count ?? 0;
  const desktop    = (devArr.find((d:unknown)=>(d as Record<string,string>).type==='desktop') as Record<string,number>|undefined)?.count ?? 0;
  const topPages   = (s?.paths  as unknown[]) ?? [];
  const daily      = ((s?.daily as unknown[]) ?? []) as DailyRow[];
  const devTotal   = mobile + desktop;
  const mPct       = devTotal > 0 ? Math.round((mobile  /devTotal)*100) : 0;
  const dPct       = devTotal > 0 ? Math.round((desktop /devTotal)*100) : 0;
  const todayViews = daily.length > 0 ? daily[daily.length-1].views : 0;

  // ── POS: Product grid ──────────────────────────────────────────────────────
  const filteredProducts = activeCat === 'semua'
    ? products
    : products.filter(p => p.category === activeCat);

  const renderPOSProducts = () => (
    <div className="flex flex-col h-full">
      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 px-4 pt-4 no-scrollbar">
        {CATEGORIES.map(c => (
          <button key={c.id}
            onClick={() => setActiveCat(c.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCat === c.id
                ? 'text-white shadow'
                : 'text-amber-700 bg-white border border-amber-200 hover:bg-amber-50'
            }`}
            style={activeCat === c.id ? { background: 'linear-gradient(135deg,#D97706,#EA580C)' } : {}}>
            <span>{c.emoji}</span> {c.label}
            {c.id !== 'semua' && (
              <span className={`text-[10px] ml-0.5 ${activeCat === c.id ? 'text-white/70' : 'text-amber-400'}`}>
                ({products.filter(p => p.category === c.id).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-2 pt-3">
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map(p => {
            const entry = cart.find(i => i.productId === p.id)!;
            return (
              <ProductCard
                key={p.id}
                product={p}
                qty={entry.qty}
                onAdd={() => addToCart(p.id)}
                onMinus={() => removeFromCart(p.id)}
              />
            );
          })}
        </div>
      </div>

      {/* Cart bar — sticky bottom */}
      {hasCart && (
        <div className="px-4 pb-4 pt-2 bg-gradient-to-t from-[#FFFBF5] via-[#FFFBF5] to-transparent">
          <button
            onClick={() => setPosView('cart')}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-white font-bold shadow-xl"
            style={{ background: 'linear-gradient(135deg,#D97706,#EA580C)' }}>
            <div className="relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white text-amber-600 text-[10px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs text-white/70 leading-none">
                {cartItems.length} produk · {cartCount} pcs
              </p>
              <p className="text-base font-black leading-tight">{formatCurrency(cartTotal)}</p>
            </div>
            <div className="flex items-center gap-1 text-sm">
              Checkout <ChevronLeft size={16} className="rotate-180" />
            </div>
          </button>
        </div>
      )}
    </div>
  );

  // ── POS: Cart + Checkout ───────────────────────────────────────────────────
  const renderPOSCart = () => (
    <div className="flex flex-col h-full px-4 pb-4 pt-4 space-y-3 overflow-y-auto">

      {/* Order list */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-amber-50 flex items-center justify-between">
          <span className="text-sm font-bold text-amber-900">Pesanan ({cartCount} pcs)</span>
          <button onClick={clearCart}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-500 transition-colors">
            <Trash2 size={12} /> Kosongkan
          </button>
        </div>

        <div className="divide-y divide-amber-50">
          {cartItems.map(item => {
            const p = products.find(pr => pr.id === item.productId)!;
            return (
              <div key={item.productId} className="flex items-center gap-3 px-4 py-3">
                {/* Emoji + colored circle */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                  style={{ background: `${p.bgColor}22` }}>
                  {p.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-amber-900 leading-tight truncate">{p.name}</p>
                  <p className="text-xs text-amber-500">{p.weight} · {formatCurrency(p.price)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => removeFromCart(item.productId)}
                    className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center active:bg-amber-200">
                    <Minus size={12} strokeWidth={2.5} />
                  </button>
                  <span className="w-5 text-center text-sm font-black text-amber-900">{item.qty}</span>
                  <button onClick={() => addToCart(item.productId)}
                    className="w-7 h-7 rounded-full text-white flex items-center justify-center"
                    style={{ background: '#D97706' }}>
                    <Plus size={12} strokeWidth={2.5} />
                  </button>
                </div>
                <span className="text-sm font-bold text-amber-800 flex-shrink-0 w-16 text-right">
                  {formatCurrency(p.price * item.qty)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Subtotal / Discount / Total rows */}
        <div className="divide-y divide-amber-50">
          {discountAmount > 0 && (
            <div className="px-4 py-2.5 flex items-center justify-between bg-amber-50/30">
              <span className="text-xs text-amber-600">Subtotal</span>
              <span className="text-sm font-semibold text-amber-700">{formatCurrency(cartSubtotal)}</span>
            </div>
          )}
          {discountAmount > 0 && (
            <div className="px-4 py-2.5 flex items-center justify-between bg-green-50/60">
              <span className="text-xs text-green-700 font-semibold flex items-center gap-1.5">
                <Tag size={11} /> Diskon ({discountLabel})
              </span>
              <span className="text-sm font-bold text-green-600">− {formatCurrency(discountAmount)}</span>
            </div>
          )}
          <div className="px-4 py-3 bg-amber-50/70 flex items-center justify-between">
            <span className="text-sm font-bold text-amber-700">Total Bayar</span>
            <span className="text-lg font-black text-amber-900">{formatCurrency(cartTotal)}</span>
          </div>
        </div>
      </div>

      {/* Discount input */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wide flex items-center gap-1.5">
            <Tag size={12} /> Diskon
          </p>
          <span className="text-[10px] text-amber-400/70">Opsional</span>
        </div>
        <div className="flex gap-2">
          {/* Type toggle */}
          <div className="flex rounded-xl overflow-hidden border border-amber-200 flex-shrink-0">
            <button
              onClick={() => { setDiscountType('percent'); setDiscountRaw(''); }}
              className={`px-3 py-2 text-xs font-bold transition-all ${
                discountType === 'percent'
                  ? 'text-white'
                  : 'text-amber-600 bg-white hover:bg-amber-50'
              }`}
              style={discountType === 'percent' ? { background: 'linear-gradient(135deg,#D97706,#EA580C)' } : {}}>
              %
            </button>
            <button
              onClick={() => { setDiscountType('nominal'); setDiscountRaw(''); }}
              className={`px-3 py-2 text-xs font-bold transition-all ${
                discountType === 'nominal'
                  ? 'text-white'
                  : 'text-amber-600 bg-white hover:bg-amber-50'
              }`}
              style={discountType === 'nominal' ? { background: 'linear-gradient(135deg,#D97706,#EA580C)' } : {}}>
              Rp
            </button>
          </div>
          {/* Value input */}
          <div className="relative flex-1">
            <input
              type="number"
              min="0"
              max={discountType === 'percent' ? 100 : cartSubtotal}
              value={discountRaw}
              onChange={e => setDiscountRaw(e.target.value)}
              placeholder={discountType === 'percent' ? 'cth: 10' : 'cth: 5000'}
              className="w-full px-3 py-2 rounded-xl border border-amber-200 text-sm text-amber-900 focus:outline-none focus:border-amber-400 bg-amber-50/50"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-400 pointer-events-none">
              {discountType === 'percent' ? '%' : 'Rp'}
            </span>
          </div>
          {discountRaw && (
            <button
              onClick={() => setDiscountRaw('')}
              className="px-3 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition-colors text-xs font-bold border border-red-100">
              ✕
            </button>
          )}
        </div>
        {discountAmount > 0 && (
          <p className="text-xs text-green-600 mt-2 font-medium">
            Hemat {formatCurrency(discountAmount)} → bayar {formatCurrency(cartTotal)}
          </p>
        )}
      </div>

      {/* Customer info */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-4 space-y-3">
        <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Data Customer</p>
        <div className="relative">
          <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
          <input
            type="text" value={custName} onChange={e => setCustName(e.target.value)}
            placeholder="Nama customer"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-amber-200 text-sm text-amber-900 focus:outline-none focus:border-amber-400 bg-amber-50/50"
          />
        </div>
        <div className="relative">
          <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
          <input
            type="tel" value={custPhone} onChange={e => setCustPhone(e.target.value)}
            placeholder="Nomor WhatsApp (08xxx)"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-amber-200 text-sm text-amber-900 focus:outline-none focus:border-amber-400 bg-amber-50/50"
          />
        </div>
      </div>

      {pdfErr && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-xs text-red-600">
          {pdfErr}
        </div>
      )}

      {/* Action buttons */}
      <button
        onClick={downloadPdf}
        disabled={!custName.trim() || !custPhone.trim() || pdfLoading || pdfDone}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-white font-bold text-sm shadow-lg transition-opacity hover:opacity-90 disabled:opacity-40"
        style={{ background: 'linear-gradient(135deg,#D97706,#EA580C)' }}>
        {pdfLoading
          ? <><Loader2 size={18} className="animate-spin" /> Membuat PDF Invoice...</>
          : pdfDone
            ? <><CheckCircle2 size={18} /> PDF Berhasil Diunduh!</>
            : <><FileDown size={18} /> Download PDF Invoice</>
        }
      </button>

      {pdfDone && (
        <button
          onClick={openWA}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-white font-bold text-sm shadow-lg"
          style={{ background: 'linear-gradient(135deg,#16A34A,#22C55E)' }}>
          <Send size={18} /> Kirim WA ke {custPhone}
        </button>
      )}

      {!pdfDone && (
        <p className="text-center text-amber-400/60 text-xs">
          Isi nama &amp; nomor WA dulu, lalu download PDF invoice
        </p>
      )}
      {pdfDone && (
        <p className="text-center text-amber-400/60 text-xs">
          Lampirkan PDF di WhatsApp setelah dikirim
        </p>
      )}
    </div>
  );

  // ── POS: Done screen ───────────────────────────────────────────────────────
  const renderPOSDone = () => (
    <div className="flex flex-col items-center justify-center py-16 px-6 gap-5">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle2 size={44} className="text-green-500" />
      </div>
      <div className="text-center">
        <p className="text-lg font-black text-amber-900">Invoice Terkirim!</p>
        <p className="text-sm text-amber-600 mt-2">
          PDF sudah diunduh &amp; WhatsApp sudah dibuka<br />
          ke <span className="font-bold">{custName}</span> · {custPhone}
        </p>
      </div>
      <div className="bg-amber-50 rounded-2xl border border-amber-100 px-5 py-3.5 text-xs text-amber-700 text-center w-full">
        Lampirkan PDF invoice di WhatsApp lalu tap Send
      </div>
      <button
        onClick={resetPOS}
        className="mt-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white shadow-lg"
        style={{ background: 'linear-gradient(135deg,#D97706,#EA580C)' }}>
        Transaksi Baru
      </button>
    </div>
  );

  // ── Full page render ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FFFBF5' }}>

      {/* ── Sticky header ────────────────────────────────────────────────── */}
      <div className="border-b border-amber-100 bg-white/90 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/icon-192.png" alt="Cemilan Teh Risma" width={28} height={28} className="rounded-lg" />
            <span className="font-bold text-amber-900 text-sm">Dashboard Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 hover:bg-amber-100 transition-colors">
              <Home size={15} />
            </a>
            <button onClick={() => fetchStats()} disabled={loading}
              className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 hover:bg-amber-100 transition-colors disabled:opacity-50">
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={logout}
              className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 hover:bg-amber-100 transition-colors">
              <LogOut size={15} />
            </button>
          </div>
        </div>

        {/* Tab nav */}
        <div className="max-w-2xl mx-auto px-4 pb-3 flex gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'text-white shadow'
                : 'text-amber-600 bg-amber-50 border border-amber-200 hover:bg-amber-100'
            }`}
            style={activeTab === 'dashboard' ? { background: 'linear-gradient(135deg,#D97706,#EA580C)' } : {}}>
            <BarChart2 size={13} /> Analitik
          </button>
          <button
            onClick={() => { setActiveTab('pos'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pos'
                ? 'text-white shadow'
                : 'text-amber-600 bg-amber-50 border border-amber-200 hover:bg-amber-100'
            }`}
            style={activeTab === 'pos' ? { background: 'linear-gradient(135deg,#D97706,#EA580C)' } : {}}>
            <ShoppingCart size={13} /> Kasir / Invoice
            {hasCart && activeTab !== 'pos' && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Tab: Analytics ──────────────────────────────────────────────────── */}
      {activeTab === 'dashboard' && (
        <div className="max-w-2xl mx-auto w-full px-4 py-6 pb-10 space-y-4">
          {statsErr && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm">{statsErr}</div>
          )}
          <p className="text-amber-600/60 text-xs text-center">Data 30 hari terakhir</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1"><Eye size={14} className="text-amber-500" /><span className="text-xs text-amber-600/70 font-semibold">Pengunjung Unik</span></div>
              <p className="text-2xl font-bold text-amber-900">{total?.toLocaleString('id') ?? '–'}</p>
              <p className="text-xs text-amber-400/70 mt-0.5">sesi berbeda</p>
            </div>
            <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1"><TrendingUp size={14} className="text-amber-500" /><span className="text-xs text-amber-600/70 font-semibold">Halaman Dibuka</span></div>
              <p className="text-2xl font-bold text-amber-900">{views?.toLocaleString('id') ?? '–'}</p>
              <p className="text-xs text-amber-400/70 mt-0.5">total pageview</p>
            </div>
          </div>

          {daily.length > 0 && (
            <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><BarChart2 size={14} className="text-amber-500" /><span className="text-sm font-bold text-amber-900">Tren 7 Hari Terakhir</span></div>
                <span className="text-xs text-amber-600/60">Hari ini: <strong className="text-amber-800">{todayViews}</strong></span>
              </div>
              <MiniBarChart data={daily} />
              <p className="text-xs text-amber-400/60 text-center mt-2">pageview per hari</p>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3"><Smartphone size={14} className="text-amber-500" /><span className="text-sm font-bold text-amber-900">Perangkat Pengunjung</span></div>
            <div className="flex items-center gap-5">
              <DonutChart mobile={mobile} desktop={desktop} />
              <div className="flex-1 space-y-3">
                {[{label:'Mobile',pct:mPct,cnt:mobile,c:'bg-amber-500'},{label:'Desktop',pct:dPct,cnt:desktop,c:'bg-amber-200'}].map(d=>(
                  <div key={d.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-sm ${d.c}`} />{d.label}
                      </span>
                      <span className="text-xs font-bold text-amber-900">{d.cnt} <span className="text-amber-500 font-normal">({d.pct}%)</span></span>
                    </div>
                    <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                      <div className={`h-full ${d.c} rounded-full transition-all`} style={{width:`${d.pct}%`}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {topPages.length > 0 && (
            <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-amber-50 flex items-center gap-2">
                <span className="text-sm">🔥</span><p className="text-sm font-bold text-amber-900">Halaman Terpopuler</p>
              </div>
              {topPages.slice(0,5).map((p:unknown,i:number)=>{
                const pg=p as Record<string,unknown>, cnt=pg.visitors as number;
                const maxCnt=(topPages[0] as Record<string,unknown>).visitors as number;
                const pct=maxCnt>0?Math.round((cnt/maxCnt)*100):0;
                return (
                  <div key={i} className="px-4 py-3 flex items-center justify-between border-b border-amber-50 last:border-0">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xs font-bold text-amber-400 w-4 flex-shrink-0">{i+1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-amber-800 truncate">{pageLabel(pg.path as string)}</p>
                        <div className="h-1 bg-amber-100 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{width:`${pct}%`}} />
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-700 ml-3 flex-shrink-0">{cnt.toLocaleString('id')}</span>
                  </div>
                );
              })}
            </div>
          )}

          {(total??0)>0 && (views??0)>0 && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm text-center">
                <p className="text-xs text-amber-600/70 font-semibold mb-1">Halaman / Pengunjung</p>
                <p className="text-2xl font-bold text-amber-900">{((views??0)/(total??1)).toFixed(1)}</p>
                <p className="text-xs text-amber-400/70">rata-rata</p>
              </div>
              <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm text-center">
                <p className="text-xs text-amber-600/70 font-semibold mb-1">Hari Ini</p>
                <p className="text-2xl font-bold text-amber-900">{todayViews}</p>
                <p className="text-xs text-amber-400/70">pageview</p>
              </div>
            </div>
          )}

          <button onClick={sendWA}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-white font-bold text-sm shadow-lg transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#16A34A,#22C55E)' }}>
            <MessageCircle size={18} /> Kirim Rekap ke WhatsApp
          </button>
          <p className="text-center text-amber-400/60 text-xs">Data akan terbuka di WhatsApp — tap Send untuk kirim ke nomor sendiri</p>

          <p className="text-amber-400/50 text-xs text-center pt-2 border-t border-amber-100">
            Dikembangkan oleh{' '}
            <a href="https://eleven-digital.id/" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-700 transition-colors">PT. Eleven Digital Indonesia</a>
            {' · '}didukung oleh <span className="text-amber-500">PT. RMedia Production</span>
          </p>
        </div>
      )}

      {/* ── Tab: POS / Kasir ──────────────────────────────────────────────── */}
      {activeTab === 'pos' && (
        <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full overflow-hidden">

          {/* POS sub-header */}
          {posView !== 'done' && (
            <div className="px-4 pt-4 pb-2 flex items-center gap-3">
              {posView === 'cart' && (
                <button onClick={() => { setPosView('products'); setPdfDone(false); setPdfErr(''); }}
                  className="p-2 rounded-xl bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors flex-shrink-0">
                  <ChevronLeft size={18} />
                </button>
              )}
              <div className="flex-1">
                <p className="text-sm font-black text-amber-900">
                  {posView === 'products' ? 'Pilih Produk' : 'Checkout'}
                </p>
                <p className="text-xs text-amber-500/70">
                  {posView === 'products'
                    ? `${filteredProducts.length} produk tersedia`
                    : `${cartItems.length} produk · ${cartCount} pcs`}
                </p>
              </div>
              {posView === 'products' && hasCart && (
                <button onClick={() => setPosView('cart')}
                  className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 transition-colors">
                  <ShoppingCart size={14} />
                  Keranjang
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center">
                    {cartCount}
                  </span>
                </button>
              )}
            </div>
          )}

          {/* POS content */}
          <div className="flex-1 overflow-hidden">
            {posView === 'products' && renderPOSProducts()}
            {posView === 'cart'     && renderPOSCart()}
            {posView === 'done'     && renderPOSDone()}
          </div>
        </div>
      )}
    </div>
  );
}
