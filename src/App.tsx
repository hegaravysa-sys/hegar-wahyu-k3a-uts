/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Product, CartItem, Order, Customer, ProductCategory } from './types/store';
import {
  subscribeProducts,
  subscribeOrders,
  subscribeCustomers,
  seedInitialProductsIfNeeded,
} from './services/storeService';
import { testConnection, logoutUser } from './lib/firebase';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle2,
  Filter,
  ArrowUpDown,
  Smartphone,
} from 'lucide-react';

export default function App() {
  // Database States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Cart State (stored in localStorage for persistence)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('gadgetverse_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('gadgetverse_cart', JSON.stringify(cart));
  }, [cart]);

  // Catalog Filtering & Searching
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'Semua'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'populer' | 'termurah' | 'termahal' | 'rating'>('populer');

  // Modal States
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutPromoCode, setCheckoutPromoCode] = useState('');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);

  // Admin Auth & Portal State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUserEmail, setAdminUserEmail] = useState<string | null>(null);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Database Initialization & Listeners
  useEffect(() => {
    // 1. Test connection on boot per Firebase guidelines
    testConnection();

    // 2. Seed 12 initial products if database is empty
    seedInitialProductsIfNeeded();

    // 3. Real-time subscriptions
    const unsubProducts = subscribeProducts(
      (data) => {
        setProducts(data);
        setIsLoadingProducts(false);
      },
      (err) => {
        console.error('Products listener error:', err);
        setIsLoadingProducts(false);
      }
    );

    const unsubOrders = subscribeOrders((data) => {
      setOrders(data);
    });

    const unsubCustomers = subscribeCustomers((data) => {
      setCustomers(data);
    });

    return () => {
      unsubProducts();
      unsubOrders();
      unsubCustomers();
    };
  }, []);

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stock, existing.quantity + quantity);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleDirectCheckout = (product: Product, quantity: number) => {
    setCart([{ product, quantity }]);
    setCheckoutDiscount(0);
    setCheckoutPromoCode('');
    setIsCheckoutOpen(true);
  };

  const handleProceedToCheckout = (discount: number, promoCode: string) => {
    setCheckoutDiscount(discount);
    setCheckoutPromoCode(promoCode);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderCreated = (order: Order) => {
    setCart([]);
    setCreatedOrder(order);
  };

  // Admin Portal Handlers
  const handleOpenAdmin = () => {
    if (isAdminLoggedIn) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  const handleAdminLoginSuccess = (email: string) => {
    setIsAdminLoggedIn(true);
    setAdminUserEmail(email);
    setIsAdminDashboardOpen(true);
  };

  const handleAdminLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore
    }
    setIsAdminLoggedIn(false);
    setAdminUserEmail(null);
    setIsAdminDashboardOpen(false);
  };

  // Filtered & Sorted Products
  const filteredProducts = products
    .filter((prod) => {
      const matchCat =
        selectedCategory === 'Semua' || prod.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        prod.name.toLowerCase().includes(query) ||
        prod.brand.toLowerCase().includes(query) ||
        prod.specs.chipset.toLowerCase().includes(query) ||
        prod.description.toLowerCase().includes(query);
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'termurah') return a.price - b.price;
      if (sortBy === 'termahal') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviewsCount - a.reviewsCount; // populer
    });

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const pendingApprovalsCount = orders.filter((o) => o.status === 'menunggu_approval').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        cartCount={cartTotalItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        adminUserEmail={adminUserEmail}
        onLogoutAdmin={handleAdminLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        pendingApprovalCount={pendingApprovalsCount}
      />

      {/* Main Storefront Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero Section */}
        <HeroBanner onSelectCategory={(cat) => setSelectedCategory(cat)} />

        {/* Catalog Control Bar */}
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {selectedCategory === 'Semua' ? 'Semua Smartphone' : `Kategori: ${selectedCategory}`}
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  {filteredProducts.length} Produk
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedCategory === 'Flagship' && 'Pilihan smartphone tercanggih dengan performa monster dan kamera profesional.'}
                {selectedCategory === 'Mid-Range' && 'Keseimbangan terbaik antara spesifikasi tinggi dan harga rasional.'}
                {selectedCategory === 'Entry-Level' && 'Smartphone berkualitas tinggi dengan harga super ramah di kantong.'}
                {selectedCategory === 'Semua' && '20+ smartphone resmi pilihan terbaik 2026 siap dikirim ke alamat Anda.'}
              </p>
            </div>

            {/* Sorting & Filter */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-slate-500 font-semibold hidden sm:inline flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" /> Urutkan:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-hidden focus:border-indigo-500 shadow-2xs cursor-pointer"
              >
                <option value="populer">Paling Populer & Terlaris</option>
                <option value="termurah">Harga: Termurah</option>
                <option value="termahal">Harga: Tertinggi</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        {isLoadingProducts ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-600">
              Memuat katalog smartphone dari real database Firestore...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto shadow-2xs">
            <Smartphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Tidak ada produk ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Coba gunakan kata kunci pencarian yang berbeda atau pilih kategori lain.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Semua');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Reset Filter Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(prod) => handleAddToCart(prod, 1)}
                onViewDetails={(prod) => setSelectedProductDetail(prod)}
              />
            ))}
          </div>
        )}

        {/* Trust Badges Footer Section */}
        <section className="mt-16 pt-12 border-t border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">100% Produk Original</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Garansi resmi distributor Indonesia & IMEI terdaftar di Kemenperin.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Bebas Ongkir & Asuransi</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pengiriman aman dengan packing kayu dan asuransi proteksi pengiriman.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Jaminan Tukar Unit</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Garansi retur 7 hari jika ditemukan kerusakan cacat bawaan pabrik.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Layanan CS Responsif</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dukungan verifikasi bukti pembayaran dan bantuan teknis setiap hari.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-white mt-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base">GadgetVerse</span>
              <span>— Marketplace Smartphone Resmi Indonesia</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsTrackOrderOpen(true)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Lacak Status Pesanan
              </button>
              <span>•</span>
              <button
                onClick={handleOpenAdmin}
                className="hover:text-white transition-colors cursor-pointer text-indigo-400"
              >
                Panel Kelola Admin
              </button>
            </div>
          </div>
          <div className="text-center sm:text-left text-[11px] text-slate-600 mt-4">
            Didukung oleh Google Cloud Firestore & Firebase Auth • Real-Time Database Single Source of Truth
          </div>
        </div>
      </footer>

      {/* ================= MODALS & DRAWERS ================= */}

      {/* 1. Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={handleAddToCart}
        onDirectCheckout={handleDirectCheckout}
      />

      {/* 2. Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* 3. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        discount={checkoutDiscount}
        promoCode={checkoutPromoCode}
        onOrderCreated={handleOrderCreated}
      />

      {/* 4. Order Confirmation & Payment Proof Upload Modal */}
      <OrderSuccessModal
        order={createdOrder}
        onClose={() => setCreatedOrder(null)}
        onProofUploaded={(updated) => setCreatedOrder(updated)}
      />

      {/* 5. Track Order Modal */}
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
        orders={orders}
      />

      {/* 6. Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* 7. Comprehensive Admin Dashboard */}
      {isAdminDashboardOpen && (
        <AdminDashboard
          products={products}
          orders={orders}
          customers={customers}
          adminEmail={adminUserEmail || 'Admin'}
          onClose={() => setIsAdminDashboardOpen(false)}
        />
      )}
    </div>
  );
}
