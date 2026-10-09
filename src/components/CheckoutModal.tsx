import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Building2, QrCode, CreditCard, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Order } from '../types/store';
import { formatRupiah } from '../utils/format';
import { createOrder } from '../services/storeService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  discount: number;
  promoCode: string;
  onOrderCreated: (order: Order) => void;
}

const PAYMENT_METHODS = [
  {
    id: 'bca',
    name: 'Transfer Bank BCA',
    bank: 'BCA',
    accountNumber: '827-091-2345',
    accountName: 'PT GADGETVERSE NUSANTARA',
    icon: Building2,
    badge: 'Verifikasi Otomatis',
  },
  {
    id: 'mandiri',
    name: 'Transfer Bank Mandiri',
    bank: 'Mandiri',
    accountNumber: '137-00-987654-3',
    accountName: 'PT GADGETVERSE NUSANTARA',
    icon: Building2,
    badge: 'Bebas Biaya Admin',
  },
  {
    id: 'bri',
    name: 'Transfer Bank BRI',
    bank: 'BRI',
    accountNumber: '0123-01-001234-56-7',
    accountName: 'PT GADGETVERSE NUSANTARA',
    icon: Building2,
    badge: 'Jaringan Luas',
  },
  {
    id: 'qris',
    name: 'QRIS Instant (Semua E-Wallet / Mobile Banking)',
    bank: 'QRIS',
    accountNumber: 'NMID: ID1020304050601',
    accountName: 'GADGETVERSE OFFICIAL',
    icon: QrCode,
    badge: 'Scan & Bayar',
  },
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  discount,
  promoCode,
  onOrderCreated,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0].name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = 0;
  const totalAmount = Math.max(0, subtotal - discount + shippingFee);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      setErrorMessage('Mohon lengkapi semua data formulir pengiriman.');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl,
        category: item.product.category,
      }));

      const newOrder = await createOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        items: orderItems,
        subtotal,
        shippingFee,
        discount,
        totalAmount,
        paymentMethod: selectedPayment,
        notes: notes.trim() + (promoCode ? ` (Voucher: ${promoCode})` : ''),
      });

      // Confetti firework
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      onOrderCreated(newOrder);
      onClose();
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage('Terjadi kesalahan saat memproses pesanan ke database: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Formulir Checkout & Pembayaran</h3>
              <p className="text-xs text-slate-500">
                Lengkapi alamat pengiriman dan pilih metode pembayaran resmi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Customer Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <span>1. Data Penerima & Alamat Pengiriman</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Penerima *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Aktif *
                </label>
                <input
                  type="email"
                  required
                  placeholder="budi@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor WhatsApp / HP *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="081234567890"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilihan Warna / Catatan Tambahan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Warna Titanium Gray / Titip Satpam"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Pengiriman *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Jl. Sudirman No. 45 RT 02/05, Kel. Menteng, Kec. Menteng, Jakarta Pusat, 10310"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              2. Pilih Metode Pembayaran
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((pm) => {
                const isSelected = selectedPayment === pm.name;
                const Icon = pm.icon;
                return (
                  <div
                    key={pm.id}
                    onClick={() => setSelectedPayment(pm.name)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{pm.bank}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-semibold bg-slate-100 text-slate-600">
                          {pm.badge}
                        </span>
                      </div>
                      <div className="text-xs text-slate-700 font-medium truncate mt-0.5">
                        {pm.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-1">
                        {pm.accountNumber}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Ringkasan Belanja */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Ringkasan Pesanan ({cart.length} Jenis Produk):
            </h4>
            <div className="space-y-1.5 max-h-36 overflow-y-auto mb-3 pr-1 text-xs text-slate-600">
              {cart.map((c) => (
                <div key={c.product.id} className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="truncate pr-2 font-medium">
                    {c.quantity}x {c.product.name}
                  </span>
                  <span className="font-semibold text-slate-800 shrink-0">
                    {formatRupiah(c.product.price * c.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-xs border-t border-slate-200 pt-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Diskon Promo</span>
                  <span>-{formatRupiah(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Ongkir (Asuransi Pengiriman)</span>
                <span className="text-emerald-600 font-semibold">GRATIS</span>
              </div>
              <div className="pt-2 border-t border-slate-300 flex justify-between items-baseline font-bold text-slate-900 text-sm">
                <span>Total Tagihan:</span>
                <span className="text-lg font-black text-indigo-600">
                  {formatRupiah(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-blue-50 p-3 rounded-xl border border-blue-100">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <span>
              Pesanan Anda akan tersimpan di <strong>real database Firestore</strong>. Setelah konfirmasi, Anda dapat langsung mengunggah foto bukti pembayaran untuk diverifikasi oleh Admin.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-1/3 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Menyimpan Pesanan...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Konfirmasi & Buat Pesanan ({formatRupiah(totalAmount)})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
