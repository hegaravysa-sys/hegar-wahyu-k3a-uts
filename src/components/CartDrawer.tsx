import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, Check, AlertCircle } from 'lucide-react';
import { CartItem } from '../types/store';
import { formatRupiah } from '../utils/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: (appliedDiscount: number, promoCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'DISKON500RB' || code === 'HEMAT500RB') {
      if (subtotal < 3000000) {
        setPromoError('Voucher ini berlaku minimal belanja Rp 3.000.000');
        return;
      }
      setAppliedPromo({ code, discount: 500000 });
    } else if (code === 'HEMAT200RB' || code === 'GADGET200') {
      if (subtotal < 1500000) {
        setPromoError('Voucher ini berlaku minimal belanja Rp 1.500.000');
        return;
      }
      setAppliedPromo({ code, discount: 200000 });
    } else if (code === 'GADGETBARU') {
      const disc = Math.round(subtotal * 0.05); // 5%
      setAppliedPromo({ code, discount: Math.min(disc, 1000000) });
    } else {
      setPromoError('Kode voucher tidak valid. Coba: DISKON500RB, HEMAT200RB, atau GADGETBARU');
    }
  };

  const discountAmount = appliedPromo ? appliedPromo.discount : 0;
  const shippingFee = 0; // Gratis ongkir
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Keranjang Belanja</h3>
                <p className="text-xs text-slate-500">
                  {cart.length === 0
                    ? 'Belum ada item'
                    : `${cart.reduce((a, b) => a + b.quantity, 0)} unit handphone dipilih`}
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

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h4 className="text-base font-bold text-slate-700 mb-1">
                  Keranjang Masih Kosong
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mb-6">
                  Pilih smartphone favorit Anda dari katalog Flagship, Mid-Range, atau Entry-Level kami.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
                >
                  Mulai Belanja Sekarang
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center text-xs text-slate-500 pb-1">
                  <span>Daftar Produk:</span>
                  <button
                    onClick={onClearCart}
                    className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Kosongkan
                  </button>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3.5 p-3 rounded-2xl border border-slate-200 bg-white hover:border-indigo-200 transition-all shadow-2xs"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-18 h-18 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                    />

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="text-xs font-bold text-slate-900 truncate" title={item.product.name}>
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-slate-400 hover:text-rose-600 p-0.5 transition-colors cursor-pointer"
                            title="Hapus dari keranjang"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {item.product.specs.ram} / {item.product.specs.storage}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs font-black text-indigo-600">
                          {formatRupiah(item.product.price)}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                            }
                            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-slate-800 w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(
                                item.product.id,
                                Math.min(item.product.stock, item.quantity + 1)
                              )
                            }
                            disabled={item.quantity >= item.product.stock}
                            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center disabled:opacity-40 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Promo Code Input */}
                <div className="pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                      <Tag className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Kupon Diskon Promo</span>
                    </div>

                    {appliedPromo ? (
                      <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                        <div className="flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="font-bold">{appliedPromo.code}</span>
                          <span>(-{formatRupiah(appliedPromo.discount)})</span>
                        </div>
                        <button
                          onClick={() => setAppliedPromo(null)}
                          className="text-xs text-rose-600 hover:underline cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Kode promo: DISKON500RB"
                          value={promoCodeInput}
                          onChange={(e) => setPromoCodeInput(e.target.value)}
                          className="flex-1 bg-white text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 uppercase font-semibold"
                        />
                        <button
                          onClick={handleApplyPromo}
                          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Pakai
                        </button>
                      </div>
                    )}

                    {promoError && (
                      <div className="flex items-center gap-1 text-[11px] text-rose-600 mt-2 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{promoError}</span>
                      </div>
                    )}

                    <div className="text-[10px] text-slate-500 mt-2">
                      Gunakan: <strong className="text-indigo-600">DISKON500RB</strong> (min. 3jt) atau <strong className="text-indigo-600">HEMAT200RB</strong>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer calculation & checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50/70 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal Produk</span>
                  <span className="font-semibold text-slate-800">{formatRupiah(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Diskon Voucher</span>
                    <span>-{formatRupiah(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    Ongkos Kirim <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 rounded-sm font-bold">PROMO</span>
                  </span>
                  <span className="font-semibold text-emerald-600">GRATIS</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Total Pembayaran</span>
                  <span className="text-lg font-black text-indigo-600">
                    {formatRupiah(totalAmount)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onProceedToCheckout(discountAmount, appliedPromo ? appliedPromo.code : '');
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <span>Lanjut ke Formulir Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
