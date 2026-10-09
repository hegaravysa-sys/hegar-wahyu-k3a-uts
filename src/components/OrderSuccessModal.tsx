import React, { useState } from 'react';
import { X, CheckCircle2, Copy, Check, Upload, Image as ImageIcon, Sparkles, AlertCircle, Clock } from 'lucide-react';
import { Order } from '../types/store';
import { formatRupiah, formatDate, getOrderStatusMeta } from '../utils/format';
import { uploadPaymentProof } from '../services/storeService';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onProofUploaded: (updatedOrder: Order) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onProofUploaded,
}) => {
  const [copied, setCopied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(order?.paymentProofUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!order) return null;

  const statusMeta = getOrderStatusMeta(order.status);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Harap unggah file foto bukti transfer (JPG, PNG).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Ukuran file maksimal 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
      setErrorMessage('');
    };
    reader.readAsDataURL(file);
  };

  const handleUseSampleReceipt = () => {
    // Generate SVG receipt as high-fidelity data URL
    const svgReceipt = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" fill="#ffffff">
      <rect width="600" height="800" fill="#f8fafc" stroke="#e2e8f0" stroke-width="4"/>
      <rect x="30" y="30" width="540" height="740" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
      <circle cx="300" cy="90" r="30" fill="#10b981"/>
      <path d="M288 90 l8 8 l16 -16" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>
      <text x="300" y="150" font-family="sans-serif" font-size="22" font-weight="bold" fill="#0f172a" text-anchor="middle">BUKTI TRANSFER BERHASIL</text>
      <text x="300" y="180" font-family="sans-serif" font-size="14" fill="#64748b" text-anchor="middle">GADGETVERSE NUSANTARA</text>
      <line x1="60" y1="210" x2="540" y2="210" stroke="#e2e8f0" stroke-dasharray="6,6"/>
      <text x="70" y="250" font-family="sans-serif" font-size="14" fill="#64748b">No. Referensi Order:</text>
      <text x="530" y="250" font-family="monospace" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="end">${order.id}</text>
      <text x="70" y="290" font-family="sans-serif" font-size="14" fill="#64748b">Waktu Transaksi:</text>
      <text x="530" y="290" font-family="sans-serif" font-size="14" fill="#0f172a" text-anchor="end">${new Date().toLocaleString('id-ID')}</text>
      <text x="70" y="330" font-family="sans-serif" font-size="14" fill="#64748b">Metode Pembayaran:</text>
      <text x="530" y="330" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="end">${order.paymentMethod}</text>
      <text x="70" y="370" font-family="sans-serif" font-size="14" fill="#64748b">Pengirim:</text>
      <text x="530" y="370" font-family="sans-serif" font-size="14" fill="#0f172a" text-anchor="end">${order.customerName}</text>
      <line x1="60" y1="410" x2="540" y2="410" stroke="#e2e8f0"/>
      <text x="70" y="460" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">Total Nominal Transfer:</text>
      <text x="530" y="460" font-family="sans-serif" font-size="22" font-weight="900" fill="#2563eb" text-anchor="end">${formatRupiah(order.totalAmount)}</text>
      <line x1="60" y1="500" x2="540" y2="500" stroke="#e2e8f0" stroke-dasharray="6,6"/>
      <rect x="70" y="530" width="460" height="90" rx="12" fill="#f0fdf4" stroke="#86efac"/>
      <text x="300" y="565" font-family="sans-serif" font-size="14" font-weight="bold" fill="#166534" text-anchor="middle">STATUS: TRANSAKSI BERHASIL DIKIRIM</text>
      <text x="300" y="595" font-family="sans-serif" font-size="12" fill="#15803d" text-anchor="middle">Harap simpan struk ini sebagai bukti pembayaran sah.</text>
      <text x="300" y="730" font-family="monospace" font-size="11" fill="#94a3b8" text-anchor="middle">GADGETVERSE-DIGITAL-RECEIPT-AUTH-OK</text>
    </svg>`;
    const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgReceipt)}`;
    setPreviewUrl(dataUri);
    setErrorMessage('');
  };

  const handleUploadProof = async () => {
    if (!previewUrl) {
      setErrorMessage('Pilih file gambar atau gunakan tombol Contoh Struk terlebih dahulu.');
      return;
    }

    try {
      setIsUploading(true);
      await uploadPaymentProof(order.id, previewUrl);
      setUploadSuccess(true);
      onProofUploaded({
        ...order,
        status: 'menunggu_approval',
        paymentProofUrl: previewUrl,
        paymentProofUploadedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('Error uploading proof:', err);
      setErrorMessage('Gagal mengunggah bukti: ' + (err.message || 'Unknown'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Pesanan Berhasil Dibuat!</h3>
              <p className="text-xs text-slate-500">Tersimpan di Real Database Firestore</p>
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
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Order ID & Status Badge Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block mb-1">
                Nomor Pesanan Anda:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-mono font-black text-indigo-600">{order.id}</span>
                <button
                  onClick={handleCopyOrderId}
                  className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Salin No. Pesanan"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                {copied && <span className="text-[11px] text-emerald-600 font-bold">Disalin!</span>}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Dibuat: {formatDate(order.createdAt)}</div>
            </div>

            <div className="sm:text-right">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block mb-1">
                Status Saat Ini:
              </span>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusMeta.badgeClass}`}
              >
                {order.status === 'menunggu_approval' || uploadSuccess
                  ? 'Verifikasi Pembayaran'
                  : statusMeta.label}
              </span>
            </div>
          </div>

          {/* Payment Instructions Box */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-2">
              Petunjuk Pembayaran ({order.paymentMethod})
            </h4>
            <div className="space-y-1.5 text-xs text-indigo-950">
              <div className="flex justify-between items-center py-1 border-b border-indigo-200/60">
                <span>Total yang Harus Ditransfer:</span>
                <span className="text-base font-black text-indigo-700">
                  {formatRupiah(order.totalAmount)}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 pt-1">
                Silakan lakukan transfer sesuai nominal di atas. Setelah transfer, unggah foto bukti transfer di bawah ini agar pesanan dapat segera <strong>diverifikasi & dikirim oleh Admin</strong>.
              </p>
            </div>
          </div>

          {/* Upload Bukti Pembayaran Section */}
          <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-white transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Unggah Bukti Transfer / Pembayaran
                </h4>
              </div>
              <button
                type="button"
                onClick={handleUseSampleReceipt}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-indigo-500" /> Gunakan Contoh Struk (Demo)
              </button>
            </div>

            {errorMessage && (
              <div className="p-2.5 mb-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {previewUrl ? (
              <div className="space-y-3">
                <div className="relative max-h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Preview Bukti Pembayaran"
                    className="max-h-48 object-contain"
                  />
                  <button
                    onClick={() => setPreviewUrl(null)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white cursor-pointer"
                    title="Ganti foto"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {uploadSuccess ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Bukti pembayaran telah berhasil dikirim ke Admin! Anda dapat memantau status pesanan melalui menu <strong>Lacak Pesanan</strong>.
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleUploadProof}
                    disabled={isUploading}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isUploading ? (
                      <span>Mengunggah Bukti ke Database...</span>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Kirim Bukti Pembayaran untuk Verifikasi Admin</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div>
                <label className="flex flex-col items-center justify-center p-6 border-2 border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                  <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-700">
                    Klik untuk memilih file struk / transfer bank
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">
                    Format JPG, PNG (Maks 2MB) atau klik 'Gunakan Contoh Struk'
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Items Summary preview */}
          <div className="text-xs text-slate-500 pt-2 border-t border-slate-200">
            <div className="font-semibold text-slate-700 mb-1">Penerima & Alamat:</div>
            <div>{order.customerName} ({order.customerPhone})</div>
            <div className="text-slate-400">{order.customerAddress}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Selesai & Lanjut Belanja
          </button>
        </div>
      </div>
    </div>
  );
};
