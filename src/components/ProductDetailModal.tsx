import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  ShoppingCart,
  Check,
  Shield,
  Truck,
  RefreshCw,
  Cpu,
  Layers,
  Monitor,
  Camera,
  Battery,
  Star,
  Palette,
  Sparkles,
} from 'lucide-react';
import { Product } from '../types/store';
import { formatRupiah } from '../utils/format';
import { getPhoneVisualMeta, getPhoneSvgDataUrl } from '../utils/phoneRenders';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onDirectCheckout: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onDirectCheckout,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [addedEffect, setAddedEffect] = useState(false);

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const maxAvailable = Math.min(product.stock, 10);
  const visualMeta = getPhoneVisualMeta(product.name);
  const displayImage =
    product.imageUrl && !product.imageUrl.startsWith('data:image/svg')
      ? product.imageUrl
      : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAddedEffect(true);
    setTimeout(() => setAddedEffect(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
            {/* Image Column */}
            <div>
              <div className="relative aspect-square w-full rounded-2xl bg-gradient-to-b from-slate-100 to-white overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center p-6">
                <img
                  src={displayImage}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain drop-shadow-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900 text-white shadow-xs">
                  {product.category}
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white">
                  {product.brand}
                </span>

                {/* Color Tag Badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-xs font-bold text-slate-800 shadow-sm">
                  <Palette className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Warna: {visualMeta.officialColorName}</span>
                </div>
              </div>

              {/* Distinctive Hardware Layout Highlights Box */}
              <div className="mt-4 p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs">
                <div className="flex items-center gap-1.5 text-indigo-950 font-bold mb-1">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Karakteristik Fisik & Desain Khas:</span>
                </div>
                <div className="text-slate-700 space-y-1">
                  <p>• <strong>Bodi:</strong> {visualMeta.designHighlight}</p>
                  <p>• <strong>Kamera:</strong> {visualMeta.cameraLayoutDesc}</p>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Shield className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-slate-800">100% Original</div>
                  <div className="text-[10px] text-slate-500">Garansi Resmi</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Truck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-slate-800">Gratis Ongkir</div>
                  <div className="text-[10px] text-slate-500">Asuransi Penuh</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <RefreshCw className="w-4 h-4 text-cyan-600 mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-slate-800">Tukar Unit</div>
                  <div className="text-[10px] text-slate-500">7 Hari Garansi</div>
                </div>
              </div>
            </div>

            {/* Product Info Column */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-500">{product.reviewsCount} Ulasan Pembeli</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-indigo-600 font-bold">{visualMeta.badge}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight">
                  {product.name}
                </h2>

                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-black text-indigo-600">
                    {formatRupiah(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatRupiah(product.originalPrice)}
                    </span>
                  )}
                  {product.stock > 0 ? (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      Tersedia: {product.stock} unit
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800">
                      Stok Habis
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  {product.description}
                </p>

                {/* Technical Specifications Sheet */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Spesifikasi Teknis Lengkap
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <Cpu className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Chipset</div>
                        <div className="font-semibold text-slate-800">{product.specs.chipset}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <Layers className="w-4 h-4 text-cyan-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">RAM & ROM</div>
                        <div className="font-semibold text-slate-800">{product.specs.ram} / {product.specs.storage}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <Monitor className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Layar</div>
                        <div className="font-semibold text-slate-800">{product.specs.screen}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <Camera className="w-4 h-4 text-pink-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Kamera</div>
                        <div className="font-semibold text-slate-800">{product.specs.camera}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 col-span-1 sm:col-span-2">
                      <Battery className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Baterai & Pengisian</div>
                        <div className="font-semibold text-slate-800">{product.specs.battery}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Action Panel */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-700">Jumlah Pembelian:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center disabled:opacity-40 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-slate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(maxAvailable, q + 1))}
                      disabled={quantity >= maxAvailable || isOutOfStock}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center disabled:opacity-40 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAdd}
                    disabled={isOutOfStock}
                    className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border cursor-pointer transition-all ${
                      addedEffect
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : isOutOfStock
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                        : 'bg-white hover:bg-slate-50 text-indigo-600 border-indigo-300'
                    }`}
                  >
                    {addedEffect ? (
                      <>
                        <Check className="w-4 h-4" /> Berhasil Ditambah!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" /> + Keranjang
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      onDirectCheckout(product, quantity);
                      onClose();
                    }}
                    disabled={isOutOfStock}
                    className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isOutOfStock
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md active:scale-95'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" /> Beli Sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
