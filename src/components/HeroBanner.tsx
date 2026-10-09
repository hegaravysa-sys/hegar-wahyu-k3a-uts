import React from 'react';
import { Sparkles, Zap, Shield, Truck, CreditCard, ChevronRight } from 'lucide-react';
import { ProductCategory } from '../types/store';

interface HeroBannerProps {
  onSelectCategory: (cat: ProductCategory) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectCategory }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-xl mb-8 border border-slate-800">
      {/* Decorative gradient glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative px-6 py-8 sm:px-10 sm:py-12 max-w-5xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Official Storefront • 20+ Smartphone Pilihan Terbaik 2026</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white mb-4">
          Upgrade Smartphone Impianmu <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400">
            Garansi Resmi & Harga Terbaik
          </span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mb-6 leading-relaxed">
          Pilihan lengkap dari Flagship premium, Mid-Range bertenaga, hingga Entry-Level super hemat.
          Belanja aman dengan verifikasi pembayaran real-time dan update status pengiriman langsung.
        </p>

        {/* 3 Categories Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 mb-6">
          <button
            onClick={() => onSelectCategory('Flagship')}
            className="group text-left p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/50 transition-all cursor-pointer backdrop-blur-xs"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Kategori 1
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-amber-300 transition-all" />
            </div>
            <div className="text-base font-bold text-white group-hover:text-indigo-200">
              💎 Flagship Series
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Galaxy S24 Ultra, iPhone 15 Pro Max, ROG Phone 8 Pro.
            </div>
          </button>

          <button
            onClick={() => onSelectCategory('Mid-Range')}
            className="group text-left p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/50 transition-all cursor-pointer backdrop-blur-xs"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Kategori 2
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-cyan-300 transition-all" />
            </div>
            <div className="text-base font-bold text-white group-hover:text-indigo-200">
              ⚡ Mid-Range Series
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Galaxy A55, Redmi Note 13 Pro+, POCO X6 Pro.
            </div>
          </button>

          <button
            onClick={() => onSelectCategory('Entry-Level')}
            className="group text-left p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/50 transition-all cursor-pointer backdrop-blur-xs"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Kategori 3
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-300 transition-all" />
            </div>
            <div className="text-base font-bold text-white group-hover:text-indigo-200">
              🏷️ Entry-Level Series
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Redmi 13, Galaxy A05s, Infinix Note 40, Vivo Y28.
            </div>
          </button>
        </div>

        {/* Value props pills */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 border-t border-white/10 text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>Garansi Resmi 1 Tahun</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>Gratis Ongkir & Asuransi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>BCA • Mandiri • BRI • QRIS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Live Firestore Database</span>
          </div>
        </div>
      </div>
    </div>
  );
};
