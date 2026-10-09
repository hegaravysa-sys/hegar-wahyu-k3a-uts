import React, { useState } from 'react';
import {
  Package,
  ShoppingCart,
  Users,
  CheckSquare,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Eye,
  ExternalLink,
  ChevronDown,
  Search,
  Truck,
  Filter,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Shield,
  X,
} from 'lucide-react';
import { Customer, Order, OrderStatus, Product, ProductCategory } from '../../types/store';
import { formatRupiah, formatDate, getOrderStatusMeta } from '../../utils/format';
import {
  addProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  approvePayment,
  rejectPayment,
  updateOrderStatus,
  resetCatalogToDefault,
} from '../../services/storeService';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  adminEmail: string;
  onClose: () => void;
}

type TabType = 'laporan' | 'approval' | 'produk' | 'pesanan' | 'pelanggan';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  customers,
  adminEmail,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('approval');

  // Search & Filters
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState<string>('Semua');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('Semua');
  const [customerSearch, setCustomerSearch] = useState('');

  // Modals inside Admin
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [inspectProofOrder, setInspectProofOrder] = useState<Order | null>(null);
  const [rejectionModalOrder, setRejectionModalOrder] = useState<Order | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [trackingModalOrder, setTrackingModalOrder] = useState<Order | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Approval Pending Count
  const pendingApprovals = orders.filter((o) => o.status === 'menunggu_approval');

  // =================== SALES ANALYTICS ===================
  const paidOrders = orders.filter((o) => o.status !== 'ditolak' && o.status !== 'menunggu_pembayaran');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCompletedOrders = orders.filter((o) => o.status === 'selesai').length;
  const averageOrderValue = paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;

  // Breakdown by Category
  const categoryStats = {
    Flagship: { revenue: 0, count: 0 },
    'Mid-Range': { revenue: 0, count: 0 },
    'Entry-Level': { revenue: 0, count: 0 },
  };

  paidOrders.forEach((o) => {
    o.items.forEach((item) => {
      const cat = (item.category as ProductCategory) || 'Mid-Range';
      if (categoryStats[cat]) {
        categoryStats[cat].revenue += item.price * item.quantity;
        categoryStats[cat].count += item.quantity;
      }
    });
  });

  // Top Selling Products
  const productSalesMap: Record<string, { product: string; count: number; revenue: number }> = {};
  paidOrders.forEach((o) => {
    o.items.forEach((item) => {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = {
          product: item.productName,
          count: 0,
          revenue: 0,
        };
      }
      productSalesMap[item.productId].count += item.quantity;
      productSalesMap[item.productId].revenue += item.price * item.quantity;
    });
  });
  const topSellingProducts = Object.values(productSalesMap).sort((a, b) => b.count - a.count);

  // =================== HANDLERS ===================
  const handleApprove = async (orderId: string) => {
    try {
      setIsActionLoading(true);
      await approvePayment(orderId);
      showToast(`Bukti pembayaran pesanan #${orderId} BERHASIL DISETUJUI! Status beralih ke Diproses.`);
      setInspectProofOrder(null);
    } catch (err: any) {
      alert('Gagal menyetujui: ' + err.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectionModalOrder) return;
    try {
      setIsActionLoading(true);
      await rejectPayment(rejectionModalOrder.id, rejectionReason || 'Bukti transfer tidak valid atau tidak sesuai nominal.');
      showToast(`Pesanan #${rejectionModalOrder.id} ditolak.`);
      setRejectionModalOrder(null);
      setInspectProofOrder(null);
      setRejectionReason('');
    } catch (err: any) {
      alert('Gagal menolak: ' + err.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleShipOrder = async () => {
    if (!trackingModalOrder) return;
    try {
      setIsActionLoading(true);
      await updateOrderStatus(trackingModalOrder.id, 'dikirim', trackingNumberInput || 'JNT' + Math.floor(1000000000 + Math.random() * 9000000000));
      showToast(`Pesanan #${trackingModalOrder.id} diperbarui menjadi DIKIRIM.`);
      setTrackingModalOrder(null);
      setTrackingNumberInput('');
    } catch (err: any) {
      alert('Gagal update pengiriman: ' + err.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleQuickStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
      showToast(`Status pesanan #${orderId} diubah ke ${status}.`);
    } catch (err: any) {
      alert('Gagal ubah status: ' + err.message);
    }
  };

  const handleDeleteProduct = async (prodId: string, name: string) => {
    if (confirm(`Yakin ingin menghapus produk "${name}" dari database?`)) {
      try {
        await deleteProduct(prodId);
        showToast(`Produk ${name} berhasil dihapus.`);
      } catch (err: any) {
        alert('Gagal menghapus produk: ' + err.message);
      }
    }
  };

  const handleResetCatalog = async () => {
    if (confirm('Pulihkan & sinkronkan katalog ke 20 smartphone lengkap foto asli (Flagship, Mid-Range, Entry-Level)?')) {
      try {
        await resetCatalogToDefault();
        showToast('Katalog berhasil diperbarui ke 20 smartphone foto asli!');
      } catch (err: any) {
        alert('Gagal reset: ' + err.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-60 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Navigation */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-xs">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black tracking-tight">
                GadgetVerse Admin Center
              </h2>
              <span className="text-[10px] bg-indigo-500/30 text-indigo-300 border border-indigo-500/50 px-2 py-0.5 rounded-full font-bold">
                Live Firestore
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Login: {adminEmail}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer border border-slate-700"
          >
            <X className="w-4 h-4" />
            <span>Tutup & Kembali ke Toko</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-100">
        {/* Sidebar / Tabs */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-3 sm:p-4 shrink-0 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto">
          <button
            onClick={() => setActiveTab('approval')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'approval'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckSquare className="w-4 h-4" />
              <span>Approval Bukti Bayar</span>
            </div>
            {pendingApprovals.length > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  activeTab === 'approval'
                    ? 'bg-white text-indigo-700'
                    : 'bg-amber-500 text-white'
                }`}
              >
                {pendingApprovals.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('produk')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'produk'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>Data Produk & Stok</span>
            </div>
            <span className="text-[10px] opacity-75 font-mono">({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pesanan')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'pesanan'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-4 h-4" />
              <span>Data Order & Riwayat</span>
            </div>
            <span className="text-[10px] opacity-75 font-mono">({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pelanggan')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'pelanggan'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>Data Pelanggan</span>
            </div>
            <span className="text-[10px] opacity-75 font-mono">({customers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('laporan')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'laporan'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-4 h-4" />
              <span>Laporan Sales</span>
            </div>
          </button>

          <div className="hidden md:block mt-auto pt-4 border-t border-slate-200">
            <button
              onClick={handleResetCatalog}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
              title="Perbarui & sinkronkan katalog ke 20 smartphone lengkap foto asli"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sinkronkan 20 Produk Foto Asli</span>
            </button>
          </div>
        </aside>

        {/* Tab Content Panel */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* ================= TAB 1: APPROVAL BUKTI BAYAR ================= */}
          {activeTab === 'approval' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Approval Bukti Pembayaran Pelanggan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verifikasi struk/mutasi bank yang diunggah pembeli untuk melanjutkan proses pesanan
                  </p>
                </div>
                <div className="text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                  Antrian Menunggu Approval: <strong className="text-amber-600">{pendingApprovals.length} pesanan</strong>
                </div>
              </div>

              {pendingApprovals.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-2xs">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-slate-800">Semua Pembayaran Telah Di-approve!</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                    Tidak ada antrian bukti pembayaran yang menunggu verifikasi saat ini. Anda dapat menguji dengan membuat pesanan di toko lalu unggah bukti transfer.
                  </p>
                  <button
                    onClick={() => setActiveTab('pesanan')}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    Lihat Semua Riwayat Pesanan
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingApprovals.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border-2 border-indigo-200 shadow-md p-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-mono text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                              {order.id}
                            </span>
                            <div className="text-xs font-bold text-slate-900 mt-1">
                              {order.customerName}
                            </div>
                            <div className="text-[11px] text-slate-500">{order.customerEmail}</div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse border border-amber-300">
                            Perlu Verifikasi
                          </span>
                        </div>

                        {/* Nominal & Method */}
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 my-3">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Total Nominal</div>
                          <div className="text-base font-black text-slate-900">
                            {formatRupiah(order.totalAmount)}
                          </div>
                          <div className="text-xs text-indigo-600 font-semibold mt-0.5">
                            {order.paymentMethod}
                          </div>
                        </div>

                        {/* Thumbnail Bukti Bayar */}
                        <div className="mb-3">
                          <div className="text-[11px] font-semibold text-slate-500 mb-1">
                            Foto Bukti Transfer:
                          </div>
                          {order.paymentProofUrl ? (
                            <div
                              onClick={() => setInspectProofOrder(order)}
                              className="relative h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer group"
                            >
                              <img
                                src={order.paymentProofUrl}
                                alt="Struk"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                                <Eye className="w-4 h-4" /> Perbesar & Cek Bukti
                              </div>
                            </div>
                          ) : (
                            <div className="h-20 rounded-xl bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400">
                              Belum ada file diunggah
                            </div>
                          )}
                        </div>

                        {/* Order Items */}
                        <div className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                          Item: {order.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                        </div>
                      </div>

                      {/* Approval CTA */}
                      <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setRejectionModalOrder(order)}
                          className="py-2 px-3 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Tolak
                        </button>
                        <button
                          onClick={() => handleApprove(order.id)}
                          disabled={isActionLoading}
                          className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all shadow-xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Setujui
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: DATA PRODUK & STOK ================= */}
          {activeTab === 'produk' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Kelola Data Produk & Stok Smartphone
                  </h3>
                  <p className="text-xs text-slate-500">
                    Total {products.length} smartphone terdaftar di database Firestore
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddProductOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Tambah Smartphone Baru
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Cari nama hp, brand..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-slate-500 font-medium">Kategori:</span>
                  {(['Semua', 'Flagship', 'Mid-Range', 'Entry-Level'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setProductCatFilter(cat)}
                      className={`text-xs px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                        productCatFilter === cat
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Smartphone</th>
                        <th className="py-3 px-3">Kategori</th>
                        <th className="py-3 px-3">Harga</th>
                        <th className="py-3 px-3 text-center">Stok Unit</th>
                        <th className="py-3 px-3">Spek Inti</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {products
                        .filter((p) => {
                          const matchQuery =
                            p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                            p.brand.toLowerCase().includes(productSearch.toLowerCase());
                          const matchCat =
                            productCatFilter === 'Semua' || p.category === productCatFilter;
                          return matchQuery && matchCat;
                        })
                        .map((prod) => {
                          const isLowStock = prod.stock > 0 && prod.stock <= 5;
                          const isOut = prod.stock <= 0;
                          return (
                            <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={prod.imageUrl}
                                    alt={prod.name}
                                    className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                                  />
                                  <div>
                                    <div className="font-bold text-slate-900">{prod.name}</div>
                                    <div className="text-[10px] text-slate-400 font-mono">
                                      Brand: {prod.brand}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-3">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    prod.category === 'Flagship'
                                      ? 'bg-amber-100 text-amber-800'
                                      : prod.category === 'Mid-Range'
                                      ? 'bg-cyan-100 text-cyan-800'
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}
                                >
                                  {prod.category}
                                </span>
                              </td>

                              <td className="py-3 px-3 font-bold text-slate-900">
                                {formatRupiah(prod.price)}
                              </td>

                              <td className="py-3 px-3">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => updateProductStock(prod.id, prod.stock - 1)}
                                    className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
                                    title="Kurangi stok"
                                  >
                                    -
                                  </button>
                                  <span
                                    className={`font-bold font-mono px-2 py-0.5 rounded-md min-w-8 text-center ${
                                      isOut
                                        ? 'bg-rose-100 text-rose-700'
                                        : isLowStock
                                        ? 'bg-amber-100 text-amber-700 font-black'
                                        : 'bg-slate-100 text-slate-800'
                                    }`}
                                  >
                                    {prod.stock}
                                  </span>
                                  <button
                                    onClick={() => updateProductStock(prod.id, prod.stock + 1)}
                                    className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
                                    title="Tambah stok"
                                  >
                                    +
                                  </button>
                                </div>
                                {isLowStock && (
                                  <span className="block text-[9px] text-amber-600 font-bold text-center mt-0.5">
                                    Stok Tipis!
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-3 text-slate-500 max-w-xs truncate">
                                <span>{prod.specs.chipset}</span> • <span>{prod.specs.ram}</span>
                              </td>

                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setEditingProduct(prod)}
                                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                                    title="Edit Produk & Stok"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                    title="Hapus Produk"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: DATA ORDER & RIWAYAT ================= */}
          {activeTab === 'pesanan' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Data Pesanan & Riwayat Transaksi
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pantau seluruh pesanan pelanggan, ubah status, dan input nomor resi pengiriman
                  </p>
                </div>
              </div>

              {/* Order Filters */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Cari ID pesanan, email, nama..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {(
                    [
                      'Semua',
                      'menunggu_pembayaran',
                      'menunggu_approval',
                      'diproses',
                      'dikirim',
                      'selesai',
                      'ditolak',
                    ] as const
                  ).map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        orderStatusFilter === st
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st === 'Semua' ? 'Semua Status' : getOrderStatusMeta(st as OrderStatus).label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">No. Order & Waktu</th>
                        <th className="py-3 px-3">Pelanggan</th>
                        <th className="py-3 px-3">Item Pesanan</th>
                        <th className="py-3 px-3">Total Nominal</th>
                        <th className="py-3 px-3">Status Saat Ini</th>
                        <th className="py-3 px-4 text-right">Kelola Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {orders
                        .filter((o) => {
                          const matchSearch =
                            o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                            o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                            o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());
                          const matchStatus =
                            orderStatusFilter === 'Semua' || o.status === orderStatusFilter;
                          return matchSearch && matchStatus;
                        })
                        .map((order) => {
                          const meta = getOrderStatusMeta(order.status);
                          return (
                            <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-4">
                                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                                  {order.id}
                                </span>
                                <div className="text-[10px] text-slate-400 mt-1">
                                  {formatDate(order.createdAt)}
                                </div>
                              </td>

                              <td className="py-3 px-3">
                                <div className="font-bold text-slate-900">{order.customerName}</div>
                                <div className="text-[10px] text-slate-500 font-mono">{order.customerPhone}</div>
                                <div className="text-[10px] text-slate-400 truncate max-w-48">{order.customerAddress}</div>
                              </td>

                              <td className="py-3 px-3">
                                <div className="space-y-0.5">
                                  {order.items.map((it, idx) => (
                                    <div key={idx} className="text-slate-800 font-medium truncate max-w-48">
                                      {it.quantity}x {it.productName}
                                    </div>
                                  ))}
                                </div>
                              </td>

                              <td className="py-3 px-3">
                                <div className="font-black text-slate-900">{formatRupiah(order.totalAmount)}</div>
                                <div className="text-[10px] text-slate-400">{order.paymentMethod}</div>
                              </td>

                              <td className="py-3 px-3">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${meta.badgeClass}`}>
                                  {meta.label}
                                </span>
                                {order.trackingNumber && (
                                  <div className="text-[10px] text-purple-700 font-mono mt-1">
                                    Resi: {order.trackingNumber}
                                  </div>
                                )}
                              </td>

                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {order.paymentProofUrl && (
                                    <button
                                      onClick={() => setInspectProofOrder(order)}
                                      className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-[11px] transition-colors cursor-pointer"
                                      title="Lihat Bukti Bayar"
                                    >
                                      Struk
                                    </button>
                                  )}

                                  {order.status === 'diproses' && (
                                    <button
                                      onClick={() => {
                                        setTrackingModalOrder(order);
                                        setTrackingNumberInput('JNT' + Math.floor(1000000000 + Math.random() * 9000000000));
                                      }}
                                      className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                                    >
                                      <Truck className="w-3 h-3" /> Kirim
                                    </button>
                                  )}

                                  {order.status === 'dikirim' && (
                                    <button
                                      onClick={() => handleQuickStatusChange(order.id, 'selesai')}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all cursor-pointer"
                                    >
                                      Selesaikan
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: DATA PELANGGAN ================= */}
          {activeTab === 'pelanggan' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Data Pelanggan (Customer Relationship)
                </h3>
                <p className="text-xs text-slate-500">
                  Daftar pembeli yang telah bertransaksi di GadgetVerse beserta kontak dan total belanja
                </p>
              </div>

              {/* Customer Search */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    placeholder="Cari pelanggan berdasarkan nama, email, hp..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
                <div className="text-xs text-slate-500 font-semibold">
                  Total Terdaftar: <strong className="text-indigo-600">{customers.length}</strong>
                </div>
              </div>

              {/* Customer Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Nama Pelanggan</th>
                        <th className="py-3 px-3">Kontak & WhatsApp</th>
                        <th className="py-3 px-3">Alamat Domisili</th>
                        <th className="py-3 px-3 text-center">Total Order</th>
                        <th className="py-3 px-3 text-right">Total Belanja (LTV)</th>
                        <th className="py-3 px-4 text-right">Order Terakhir</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {customers
                        .filter(
                          (c) =>
                            c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                            c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
                            c.phone.includes(customerSearch)
                        )
                        .map((cust) => (
                          <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{cust.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{cust.email}</div>
                            </td>

                            <td className="py-3 px-3">
                              <a
                                href={`https://wa.me/${cust.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
                              >
                                {cust.phone} <ExternalLink className="w-3 h-3" />
                              </a>
                            </td>

                            <td className="py-3 px-3 text-slate-500 max-w-xs truncate">
                              {cust.address}
                            </td>

                            <td className="py-3 px-3 text-center font-bold font-mono">
                              {cust.totalOrders}x
                            </td>

                            <td className="py-3 px-3 text-right font-black text-slate-900">
                              {formatRupiah(cust.totalSpent)}
                            </td>

                            <td className="py-3 px-4 text-right text-slate-400">
                              {formatDate(cust.lastOrderAt)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 5: LAPORAN SALES ================= */}
          {activeTab === 'laporan' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Laporan Sales & Analisis Penjualan
                </h3>
                <p className="text-xs text-slate-500">
                  Ringkasan omset penjualan smartphone berdasarkan data transaksi riil dari Firestore
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Total Omset Penjualan</span>
                    <DollarSign className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-xl font-black text-slate-900">
                    {formatRupiah(totalRevenue)}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Transaksi Terverifikasi
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Total Pesanan Sukses</span>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-xl font-black text-slate-900">
                    {paidOrders.length} Pesanan
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Selesai & Diproses
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Rata-Rata Order (AOV)</span>
                    <BarChart3 className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div className="text-xl font-black text-slate-900">
                    {formatRupiah(averageOrderValue)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Per Keranjang Belanja</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Total Pelanggan Aktif</span>
                    <Users className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-xl font-black text-slate-900">
                    {customers.length} Akun
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Database CRM</div>
                </div>
              </div>

              {/* Category Sales Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">
                    Distribusi Penjualan Berdasarkan Kategori
                  </h4>
                  <div className="space-y-4">
                    {(['Flagship', 'Mid-Range', 'Entry-Level'] as const).map((cat) => {
                      const stats = categoryStats[cat];
                      const percent =
                        totalRevenue > 0
                          ? Math.round((stats.revenue / totalRevenue) * 100)
                          : 0;
                      return (
                        <div key={cat}>
                          <div className="flex justify-between items-baseline text-xs mb-1">
                            <span className="font-bold text-slate-800">
                              {cat === 'Flagship' && '💎 '}
                              {cat === 'Mid-Range' && '⚡ '}
                              {cat === 'Entry-Level' && '🏷️ '}
                              {cat} ({stats.count} unit)
                            </span>
                            <span className="font-mono font-bold text-slate-900">
                              {formatRupiah(stats.revenue)} ({percent}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                cat === 'Flagship'
                                  ? 'bg-amber-500'
                                  : cat === 'Mid-Range'
                                  ? 'bg-cyan-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Selling Models */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                    Top Smartphone Terlaris
                  </h4>
                  {topSellingProducts.length === 0 ? (
                    <div className="text-xs text-slate-400 py-6 text-center">
                      Belum ada penjualan selesai untuk dianalisis.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 text-xs">
                      {topSellingProducts.slice(0, 5).map((top, idx) => (
                        <div key={idx} className="py-2.5 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-slate-800">{top.product}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-black text-slate-900">{top.count} Unit</div>
                            <div className="text-[10px] text-slate-400">{formatRupiah(top.revenue)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= MODAL: INSPECT PROOF ================= */}
      {inspectProofOrder && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Verifikasi Struk Pembayaran ({inspectProofOrder.id})
                </h4>
                <div className="text-[11px] text-slate-500">
                  Pembeli: {inspectProofOrder.customerName} • {formatRupiah(inspectProofOrder.totalAmount)}
                </div>
              </div>
              <button
                onClick={() => setInspectProofOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto flex items-center justify-center bg-slate-100">
              <img
                src={inspectProofOrder.paymentProofUrl}
                alt="Struk Transfer"
                className="max-h-[55vh] object-contain rounded-xl shadow-sm"
              />
            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-2">
              <button
                onClick={() => {
                  setRejectionModalOrder(inspectProofOrder);
                  setInspectProofOrder(null);
                }}
                className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-bold"
              >
                Tolak Bukti Bayar
              </button>
              <button
                onClick={() => handleApprove(inspectProofOrder.id)}
                disabled={isActionLoading}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                Setujui & Proses Pesanan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: REJECT ORDER ================= */}
      {rejectionModalOrder && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h4 className="text-base font-bold text-slate-900 mb-2">
              Tolak Bukti Pembayaran (#{rejectionModalOrder.id})
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Berikan alasan penolakan agar pembeli dapat memperbaiki atau mengunggah ulang bukti transfer yang benar.
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Contoh: Nominal transfer kurang Rp 50.000 atau foto buram/tidak terbaca."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:border-rose-500 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectionModalOrder(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={isActionLoading}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: TRACKING NUMBER INPUT ================= */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h4 className="text-base font-bold text-slate-900 mb-2">
              Kirim Pesanan #{trackingModalOrder.id}
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Masukkan nomor resi pengiriman kurir (J&T / SiCepat / JNE) untuk pelanggan:
            </p>
            <input
              type="text"
              value={trackingNumberInput}
              onChange={(e) => setTrackingNumberInput(e.target.value)}
              placeholder="Nomor Resi (Contoh: JNT8291048102)"
              className="w-full text-xs p-3 rounded-xl border border-slate-300 font-mono mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleShipOrder}
                disabled={isActionLoading}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
              >
                Kirim & Beri No. Resi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT PRODUCT ================= */}
      {(isAddProductOpen || editingProduct) && (
        <ProductFormModal
          isOpen={isAddProductOpen || !!editingProduct}
          initialProduct={editingProduct}
          onClose={() => {
            setIsAddProductOpen(false);
            setEditingProduct(null);
          }}
          onSave={async (prodData) => {
            try {
              if (editingProduct) {
                await updateProduct(editingProduct.id, prodData);
                showToast(`Produk ${prodData.name} berhasil diperbarui!`);
              } else {
                await addProduct(prodData);
                showToast(`Produk baru ${prodData.name} berhasil ditambahkan!`);
              }
              setIsAddProductOpen(false);
              setEditingProduct(null);
            } catch (err: any) {
              alert('Gagal simpan produk: ' + err.message);
            }
          }}
        />
      )}
    </div>
  );
};

// ================= SUBCOMPONENT: PRODUCT FORM MODAL =================
interface ProductFormModalProps {
  isOpen: boolean;
  initialProduct: Product | null;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id'>) => Promise<void>;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  initialProduct,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(initialProduct?.name || '');
  const [brand, setBrand] = useState(initialProduct?.brand || 'Samsung');
  const [category, setCategory] = useState<ProductCategory>(initialProduct?.category || 'Mid-Range');
  const [price, setPrice] = useState(initialProduct?.price || 4999000);
  const [originalPrice, setOriginalPrice] = useState(initialProduct?.originalPrice || 5499000);
  const [stock, setStock] = useState(initialProduct?.stock || 15);
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [imageUrl, setImageUrl] = useState(
    initialProduct?.imageUrl ||
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
  );
  const [chipset, setChipset] = useState(initialProduct?.specs.chipset || 'Snapdragon 7s Gen 2');
  const [ram, setRam] = useState(initialProduct?.specs.ram || '8 GB');
  const [storage, setStorage] = useState(initialProduct?.specs.storage || '256 GB');
  const [screen, setScreen] = useState(initialProduct?.specs.screen || '6.67" AMOLED 120Hz');
  const [camera, setCamera] = useState(initialProduct?.specs.camera || '50MP OIS + 8MP Ultra-wide');
  const [battery, setBattery] = useState(initialProduct?.specs.battery || '5000 mAh, 67W Turbo Charge');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSave({
        name,
        brand,
        category,
        price: Number(price),
        originalPrice: Number(originalPrice),
        stock: Number(stock),
        description,
        imageUrl,
        rating: initialProduct?.rating || 4.8,
        reviewsCount: initialProduct?.reviewsCount || 10,
        isFeatured: initialProduct?.isFeatured || false,
        specs: {
          chipset,
          ram,
          storage,
          screen,
          camera,
          battery,
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h4 className="text-base font-bold text-slate-900">
            {initialProduct ? 'Edit Data Smartphone' : 'Tambah Smartphone Baru ke Katalog'}
          </h4>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-slate-700">Nama Smartphone *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700">Brand / Merek *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700">Kategori Smartphone *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Flagship">Flagship</option>
                <option value="Mid-Range">Mid-Range</option>
                <option value="Entry-Level">Entry-Level</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700">Stok Unit Tersedia *</label>
              <input
                type="number"
                required
                min={0}
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700">Harga Jual (Rp) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700">Harga Coret / Asli (Rp)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700">URL Gambar Produk</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700">Deskripsi Lengkap</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 resize-none"
            />
          </div>

          {/* Technical Specs */}
          <div className="pt-2 border-t border-slate-200">
            <h5 className="font-bold uppercase tracking-wider text-slate-500 mb-2">
              Spesifikasi Teknis
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">Chipset / Processor</label>
                <input
                  type="text"
                  value={chipset}
                  onChange={(e) => setChipset(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">RAM</label>
                <input
                  type="text"
                  value={ram}
                  onChange={(e) => setRam(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Penyimpanan (Storage)</label>
                <input
                  type="text"
                  value={storage}
                  onChange={(e) => setStorage(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Layar (Screen)</label>
                <input
                  type="text"
                  value={screen}
                  onChange={(e) => setScreen(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Kamera</label>
                <input
                  type="text"
                  value={camera}
                  onChange={(e) => setCamera(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Baterai & Pengisian</label>
                <input
                  type="text"
                  value={battery}
                  onChange={(e) => setBattery(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Data Smartphone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
