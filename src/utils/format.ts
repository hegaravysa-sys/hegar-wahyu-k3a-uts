import { OrderStatus } from '../types/store';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(isoString?: string): string {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return isoString;
  }
}

export interface StatusMeta {
  label: string;
  badgeClass: string;
  bgLight: string;
  iconName: string;
}

export function getOrderStatusMeta(status: OrderStatus): StatusMeta {
  switch (status) {
    case 'menunggu_pembayaran':
      return {
        label: 'Menunggu Pembayaran',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        bgLight: 'bg-amber-50',
        iconName: 'Clock',
      };
    case 'menunggu_approval':
      return {
        label: 'Verifikasi Pembayaran',
        badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300 font-semibold animate-pulse',
        bgLight: 'bg-indigo-50',
        iconName: 'FileCheck',
      };
    case 'diproses':
      return {
        label: 'Sedang Diproses',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
        bgLight: 'bg-blue-50',
        iconName: 'Package',
      };
    case 'dikirim':
      return {
        label: 'Dalam Pengiriman',
        badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
        bgLight: 'bg-purple-50',
        iconName: 'Truck',
      };
    case 'selesai':
      return {
        label: 'Pesanan Selesai',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        bgLight: 'bg-emerald-50',
        iconName: 'CheckCircle2',
      };
    case 'ditolak':
      return {
        label: 'Ditolak / Batal',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
        bgLight: 'bg-rose-50',
        iconName: 'XCircle',
      };
    default:
      return {
        label: status,
        badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
        bgLight: 'bg-slate-50',
        iconName: 'HelpCircle',
      };
  }
}
