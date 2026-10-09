import React, { useState } from 'react';
import { X, Search, PackageCheck, AlertCircle, Upload, CheckCircle2, Truck, Clock, ShieldAlert, Sparkles } from 'lucide-react';
import { Order } from '../types/store';
import { formatRupiah, formatDate, getOrderStatusMeta } from '../utils/format';
import { uploadPaymentProof } from '../services/storeService';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const filteredOrders = searchTerm.trim()
    ? orders.filter(
        (o) =>
          o.id.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
          o.customerEmail.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
          o.customerPhone.includes(searchTerm.trim())
      )
    : orders.slice(0, 5); // show recent 5 by default

  const currentOrder = selectedOrder || (filteredOrders.length > 0 ? filteredOrders[0] : null);

  const handleUseDemoReceipt = () => {
    if (!currentOrder) return;
    const svgReceipt = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" fill="#ffffff">
      <rect width="600" height="800" fill="#f8fafc" stroke="#e2e8f0" stroke-width="4"/>
      <rect x="30" y="30" width="540" height="740" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
      <circle cx="300" cy="90" r="30" fill="#10b981"/>
      <path d="M288 90 l8 8 l16 -16" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>
      <text x="300" y="150" font-family="sans-serif" font-size="22" font-weight="bold" fill="#0f172a" text-anchor="middle">BUKTI TRANSFER BERHASIL</text>
      <text x="300" y="180" font-family="sans-serif" font-size="14" fill="#64748b" text-anchor="middle">GADGETVERSE NUSANTARA</text>
      <line x1="60" y1="210" x2="540" y2="210" stroke="#e2e8f0" stroke-dasharray="6,6"/>
      <text x="70" y="250" font-family="sans-serif" font-size="14" fill="#64748b">No. Pesanan:</text>
      <text x="530" y="250" font-family="monospace" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="end">${currentOrder.id}</text>
      <text x="70" y="290" font-family="sans-serif" font-size="14" fill="#64748b">Waktu:</text>
      <text x="530" y="290" font-family="sans-serif" font-size="14" fill="#0f172a" text-anchor="end">${new Date().toLocaleString('id-ID')}</text>
      <text x="70" y="330" font-family="sans-serif" font-size="14" fill="#64748b">Total Nominal:</text>
      <text x="530" y="330" font-family="sans-serif" font-size="20" font-weight="900" fill="#2563eb" text-anchor="end">${formatRupiah(currentOrder.totalAmount)}</text>
      <rect x="70" y="520" width="460" height="80" rx="12" fill="#f0fdf4" stroke="#86efac"/>
      <text x="300" y="565" font-family="sans-serif" font-size="14" font-weight="bold" fill="#166534" text-anchor="middle">STATUS: TRANSAKSI SUKSES DIVERIFIKASI</text>
    </svg>`;
    const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgReceipt)}`;
    setUploadUrl(dataUri);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploadUrl(reader.result as string);
      setErrorMessage('');
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!currentOrder || !uploadUrl) return;
    try {
      setIsUploading(true);
      await uploadPaymentProof(currentOrder.id, uploadUrl);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage('Gagal upload: ' + (err.message || 'Error'));
    } finally {
      setIsUploading(false);
    }
  };

  const getStepProgress = (status: Order['status']) => {
    switch (status) {
      case 'menunggu_pembayaran':
        return 1;
      case 'menunggu_approval':
        return 2;
      case 'diproses':
        return 3;
      case 'dikirim':
        return 4;
      case 'selesai':
        return 5;
      case 'ditolak':
        return 0;
      default:
        return 1;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Lacak Status Pesanan</h3>
              <p className="text-xs text-slate-500">
                Cari berdasarkan No. Pesanan (misal: ORD-123456) atau Email
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
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Search box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Ketik Nomor Pesanan (ORD-...) atau Email Anda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 shadow-2xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          {/* Quick Order Tabs */}
          {filteredOrders.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {filteredOrders.map((o) => {
                const isSelected = currentOrder?.id === o.id;
                const meta = getOrderStatusMeta(o.status);
                return (
                  <button
                    key={o.id}
                    onClick={() => {
                      setSelectedOrder(o);
                      setUploadUrl(null);
                      setUploadSuccess(false);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="font-mono">{o.id}</div>
                    <div className="text-[10px] opacity-80">{meta.label}</div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Detailed Order View */}
          {currentOrder ? (
            <div className="space-y-6">
              {/* Order Status Timeline */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <span className="text-xs text-slate-500">Nomor Pesanan:</span>
                    <h3 className="text-lg font-mono font-black text-slate-900">{currentOrder.id}</h3>
                    <div className="text-xs text-slate-500">Waktu: {formatDate(currentOrder.createdAt)}</div>
                  </div>
                  <div className="sm:text-right">
                    <span
                      className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-bold border ${getOrderStatusMeta(
                        currentOrder.status
                      ).badgeClass}`}
                    >
                      {getOrderStatusMeta(currentOrder.status).label}
                    </span>
                  </div>
                </div>

                {/* Tracking Timeline Steps */}
                {currentOrder.status === 'ditolak' ? (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm mb-1">Pesanan Ditolak oleh Admin</div>
                      <p>
                        Alasan penolakan:{' '}
                        <strong>
                          {currentOrder.rejectionReason || 'Bukti transfer tidak terbaca atau nominal tidak sesuai.'}
                        </strong>
                      </p>
                      <p className="mt-1 text-[11px] text-rose-700">
                        Silakan unggah ulang bukti pembayaran yang benar di bawah ini.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div
                        className={`p-3 rounded-xl border ${
                          getStepProgress(currentOrder.status) >= 1
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        <Clock className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-xs font-bold">1. Pesanan Dibuat</div>
                        <div className="text-[10px]">Menunggu Bayar</div>
                      </div>

                      <div
                        className={`p-3 rounded-xl border ${
                          getStepProgress(currentOrder.status) >= 2
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        <CheckCircle2 className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-xs font-bold">2. Verifikasi Bayar</div>
                        <div className="text-[10px]">Approval Admin</div>
                      </div>

                      <div
                        className={`p-3 rounded-xl border ${
                          getStepProgress(currentOrder.status) >= 3
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        <PackageCheck className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-xs font-bold">3. Diproses</div>
                        <div className="text-[10px]">Packing & QC</div>
                      </div>

                      <div
                        className={`p-3 rounded-xl border ${
                          getStepProgress(currentOrder.status) >= 4
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        <Truck className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-xs font-bold">4. Dikirim / Selesai</div>
                        <div className="text-[10px]">Dalam Ekspedisi</div>
                      </div>
                    </div>

                    {/* Resi Tracking */}
                    {currentOrder.trackingNumber && (
                      <div className="mt-4 p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-purple-700 block">Nomor Resi Pengiriman:</span>
                          <span className="font-mono font-black text-sm">{currentOrder.trackingNumber}</span>
                        </div>
                        <span className="text-[10px] bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-bold">
                          J&T Cargo Express
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Upload Proof if still waiting or rejected */}
              {(currentOrder.status === 'menunggu_pembayaran' || currentOrder.status === 'ditolak') && (
                <div className="p-4 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-indigo-600" />
                      Unggah / Perbarui Bukti Pembayaran
                    </h4>
                    <button
                      onClick={handleUseDemoReceipt}
                      className="text-[11px] font-bold text-indigo-600 bg-white px-2 py-1 rounded-lg border border-indigo-200 hover:bg-indigo-50 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" /> Contoh Struk (Demo)
                    </button>
                  </div>

                  {uploadUrl ? (
                    <div className="space-y-3">
                      <div className="max-h-36 overflow-hidden rounded-xl bg-white border border-slate-200 flex items-center justify-center p-2">
                        <img src={uploadUrl} alt="Preview" className="max-h-32 object-contain" />
                      </div>
                      {uploadSuccess ? (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
                          Bukti pembayaran berhasil diperbarui di database!
                        </div>
                      ) : (
                        <button
                          onClick={handleUpload}
                          disabled={isUploading}
                          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isUploading ? 'Menyimpan...' : 'Kirim Bukti ke Admin'}
                        </button>
                      )}
                    </div>
                  ) : (
                    <label className="flex items-center justify-center p-4 border border-indigo-200 rounded-xl bg-white hover:bg-slate-50 cursor-pointer">
                      <span className="text-xs font-semibold text-indigo-600">
                        Klik untuk upload foto struk pembayaran
                      </span>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  )}
                </div>
              )}

              {/* Detail Items */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Rincian Barang yang Dipesan:
                </h4>
                <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden bg-white">
                  {currentOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.imageUrl} alt={item.productName} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                        <div>
                          <div className="font-bold text-slate-800">{item.productName}</div>
                          <div className="text-slate-400 text-[11px]">{item.quantity} unit x {formatRupiah(item.price)}</div>
                        </div>
                      </div>
                      <div className="font-black text-slate-900">
                        {formatRupiah(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-slate-50 flex justify-between items-center text-xs font-bold">
                    <span>Total Pembayaran:</span>
                    <span className="text-sm font-black text-indigo-600">{formatRupiah(currentOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">
              <PackageCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-xs">Tidak ditemukan pesanan dengan kata kunci tersebut.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
