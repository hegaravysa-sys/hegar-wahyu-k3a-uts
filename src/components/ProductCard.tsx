import React from 'react';
import { ShoppingCart, Star, Cpu, Battery, Eye, CheckCircle2, AlertCircle, Palette } from 'lucide-react';
import { Product } from '../types/store';
import { formatRupiah } from '../utils/format';
import { getPhoneVisualMeta, getPhoneSvgDataUrl } from '../utils/phoneRenders';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
}) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const discountPercent =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const visualMeta = getPhoneVisualMeta(product.name);

  const getCategoryBadge = (cat: Product['category']) => {
    switch (cat) {
      case 'Flagship':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Mid-Range':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Entry-Level':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const currentImageUrl = product.imageUrl && !product.imageUrl.startsWith('data:image/svg')
    ? product.imageUrl
    : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all duration-300 overflow-hidden">
      {/* Product Image Header */}
      <div
        className="relative aspect-4/3 w-full bg-gradient-to-b from-slate-100 to-white overflow-hidden cursor-pointer flex items-center justify-center p-3"
        onClick={() => onViewDetails(product)}
      >
        <img
          src={currentImageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Category & Brand Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-xs backdrop-blur-md ${getCategoryBadge(
              product.category
            )}`}
          >
            {product.category}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-md">
            {product.brand}
          </span>
        </div>

        {/* Official Color Pill */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-[10px] font-semibold text-slate-700 shadow-2xs">
          <Palette className="w-2.5 h-2.5 text-indigo-600" />
          <span>{visualMeta.officialColorName}</span>
        </div>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-rose-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm">
            Hemat {discountPercent}%
          </div>
        )}

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-slate-900 text-xs font-bold shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" /> Lihat Detail Spek
          </span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Reviews */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
            </div>
            {/* Stock indicator */}
            <div className="flex items-center gap-1">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-[11px]">
                  <AlertCircle className="w-3 h-3" /> Stok Habis
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-[11px]">
                  <AlertCircle className="w-3 h-3" /> Sisa {product.stock} unit
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-[11px]">
                  <CheckCircle2 className="w-3 h-3" /> Stok: {product.stock}
                </span>
              )}
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onViewDetails(product)}
            className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1 mb-1"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Signature Physical Design Feature */}
          <div className="text-[11px] font-semibold text-indigo-700 bg-indigo-50/70 border border-indigo-100 rounded-lg px-2 py-1 mb-2.5 line-clamp-1">
            ✨ {visualMeta.designHighlight}
          </div>

          {/* Key Specs Pills */}
          <div className="grid grid-cols-2 gap-1.5 mb-3 text-[11px] text-slate-600">
            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 truncate">
              <Cpu className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{product.specs.ram} / {product.specs.storage}</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 truncate">
              <Battery className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{product.specs.battery.split(',')[0]}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-black text-slate-900">
              {formatRupiah(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                {formatRupiah(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onViewDetails(product)}
              className="w-full py-2 px-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-center cursor-pointer"
            >
              Spek Lengkap
            </button>
            <button
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock}
              className={`w-full py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-xs hover:shadow-indigo-500/20'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{isOutOfStock ? 'Habis' : '+ Keranjang'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
