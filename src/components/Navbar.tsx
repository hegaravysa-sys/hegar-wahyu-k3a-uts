import React from 'react';
import { ShoppingBag, Smartphone, ShieldCheck, Search, SearchCheck, UserCheck, LogOut } from 'lucide-react';
import { ProductCategory } from '../types/store';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenTrackOrder: () => void;
  isAdminLoggedIn: boolean;
  adminUserEmail?: string | null;
  onLogoutAdmin: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: ProductCategory | 'Semua';
  setSelectedCategory: (cat: ProductCategory | 'Semua') => void;
  pendingApprovalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenAdmin,
  onOpenTrackOrder,
  isAdminLoggedIn,
  adminUserEmail,
  onLogoutAdmin,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  pendingApprovalCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner announcement */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 text-center flex items-center justify-between font-medium">
        <div className="hidden sm:flex items-center gap-2 text-slate-300">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Garansi Resmi 100% Original & IMEI Terdaftar Kemenperin</span>
        </div>
        <div className="w-full sm:w-auto flex items-center justify-center sm:justify-end gap-4 text-[11px] sm:text-xs">
          <span>Gratis Ongkir se-Indonesia</span>
          <span className="text-slate-600">|</span>
          <button
            onClick={onOpenTrackOrder}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold cursor-pointer underline underline-offset-2"
          >
            <SearchCheck className="w-3.5 h-3.5" />
            Lacak Pesanan Saya
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          {/* Logo */}
          <div
            onClick={() => {
              setSelectedCategory('Semua');
              setSearchQuery('');
            }}
            className="flex items-center gap-2.5 cursor-pointer shrink-0 group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  Gadget<span className="text-indigo-600">Verse</span>
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-blue-50 text-blue-700 border border-blue-200">
                  ID
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block">
                Marketplace Smartphone & Gadget Resmi
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari iPhone, Samsung, RAM 12GB, Snapdragon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-800 placeholder-slate-400 text-sm pl-10 pr-4 py-2.5 rounded-full border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Lacak Pesanan (Mobile & Desktop) */}
            <button
              onClick={onOpenTrackOrder}
              className="sm:hidden p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"
              title="Lacak Pesanan"
            >
              <SearchCheck className="w-5 h-5" />
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-indigo-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs sm:text-sm font-semibold hidden sm:inline">
                Keranjang
              </span>
              {cartCount > 0 && (
                <span className="text-xs font-bold text-amber-300 hidden md:inline">
                  ({cartCount})
                </span>
              )}
            </button>

            {/* Admin Panel Button */}
            <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200">
              <button
                onClick={onOpenAdmin}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border cursor-pointer ${
                  isAdminLoggedIn
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
                title="Kelola Data & Approval Pesanan"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">
                  {isAdminLoggedIn ? 'Panel Admin' : 'Admin Login'}
                </span>
                {pendingApprovalCount > 0 && (
                  <span
                    className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-xs"
                    title={`${pendingApprovalCount} bukti bayar menunggu approval`}
                  >
                    {pendingApprovalCount}
                  </span>
                )}
              </button>

              {isAdminLoggedIn && (
                <button
                  onClick={onLogoutAdmin}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title={`Logout admin (${adminUserEmail || 'Admin'})`}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari handphone, brand, spek..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-slate-800 placeholder-slate-400 text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* 3 Kategori Tabs Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2.5 scrollbar-none border-t border-slate-100 pt-2">
          {(['Semua', 'Flagship', 'Mid-Range', 'Entry-Level'] as const).map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat === 'Semua' ? '🔥 Semua Smartphone' : cat}
                {cat === 'Flagship' && ' 💎'}
                {cat === 'Mid-Range' && ' ⚡'}
                {cat === 'Entry-Level' && ' 🏷️'}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
