export type ProductCategory = 'Flagship' | 'Mid-Range' | 'Entry-Level';

export interface PhoneSpecs {
  chipset: string;
  ram: string;
  storage: string;
  screen: string;
  camera: string;
  battery: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  stock: number;
  description: string;
  specs: PhoneSpecs;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'menunggu_pembayaran'
  | 'menunggu_approval'
  | 'diproses'
  | 'dikirim'
  | 'selesai'
  | 'ditolak';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentProofUrl?: string;
  paymentProofUploadedAt?: string;
  rejectionReason?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt: string;
  createdAt: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  role: 'superadmin' | 'admin';
  displayName?: string;
}
